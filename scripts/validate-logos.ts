#!/usr/bin/env tsx
/**
 * Script to validate client logo URLs in database
 * Usage: npx tsx scripts/validate-logos.ts
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local
const envLocalPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      const value = valueParts.join('=');
      if (key && value) {
        process.env[key] = value;
      }
    }
  });
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  console.error('Please ensure .env.local contains NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface LogoFile {
  filename: string;
  clientName: string;
  fullPath: string;
}

interface CaseStudy {
  id: string;
  title: string;
  client_name: string;
  client_logo_url: string | null;
}

/**
 * Get all available logo files from /public/client
 */
function getAvailableLogoFiles(): LogoFile[] {
  const clientDir = path.join(process.cwd(), 'public/client');

  if (!fs.existsSync(clientDir)) {
    console.error('Client directory not found:', clientDir);
    return [];
  }

  const files = fs.readdirSync(clientDir);

  return files
    .filter(file => file.endsWith('.png'))
    .map(file => ({
      filename: file,
      clientName: file.replace(/^\d+_/, '').replace(/\.png$/, ''),
      fullPath: `/client/${file}`,
    }))
    .sort((a, b) => a.clientName.localeCompare(b.clientName));
}

/**
 * Calculate string similarity (Levenshtein distance based)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Find best matching logo file for a client name
 */
function findBestLogoMatch(
  clientName: string,
  logoFiles: LogoFile[]
): { file: LogoFile; similarity: number } | null {
  let bestMatch: { file: LogoFile; similarity: number } | null = null;

  for (const logoFile of logoFiles) {
    const similarity = calculateSimilarity(
      clientName.toLowerCase(),
      logoFile.clientName.toLowerCase()
    );

    if (similarity > 0.4 && (!bestMatch || similarity > bestMatch.similarity)) {
      bestMatch = { file: logoFile, similarity };
    }
  }

  return bestMatch;
}

/**
 * Main validation function
 */
async function validateLogos() {
  console.log('🔍 Validating client logo URLs...\n');

  // Get available logo files
  const logoFiles = getAvailableLogoFiles();
  console.log(`📁 Found ${logoFiles.length} logo files in /public/client\n`);

  // Get all case studies
  const { data: caseStudies, error } = await supabase
    .from('case_studies')
    .select('id, title, client_name, client_logo_url')
    .eq('is_published', true);

  if (error) {
    console.error('❌ Error fetching case studies:', error);
    process.exit(1);
  }

  console.log(`📊 Found ${caseStudies?.length || 0} published case studies\n`);

  const issues: Array<{
    caseStudy: CaseStudy;
    issue: string;
    suggestedUrl?: string;
    confidence?: number;
  }> = [];

  // Validate each case study
  for (const cs of caseStudies || []) {
    if (!cs.client_logo_url) {
      const match = findBestLogoMatch(cs.client_name, logoFiles);
      issues.push({
        caseStudy: cs,
        issue: 'MISSING',
        suggestedUrl: match?.file.fullPath,
        confidence: match?.similarity,
      });
    } else if (!cs.client_logo_url.startsWith('/client/')) {
      issues.push({
        caseStudy: cs,
        issue: 'INVALID_PATH',
      });
    } else if (!cs.client_logo_url.endsWith('.png')) {
      issues.push({
        caseStudy: cs,
        issue: 'INVALID_EXTENSION',
      });
    } else {
      // Check if file actually exists
      const filename = cs.client_logo_url.replace('/client/', '');
      const exists = logoFiles.some(f => f.filename === filename);

      if (!exists) {
        const match = findBestLogoMatch(cs.client_name, logoFiles);
        issues.push({
          caseStudy: cs,
          issue: 'FILE_NOT_FOUND',
          suggestedUrl: match?.file.fullPath,
          confidence: match?.similarity,
        });
      }
    }
  }

  // Print report
  console.log('📋 VALIDATION REPORT\n');
  console.log('='.repeat(80));

  if (issues.length === 0) {
    console.log('✅ All client logo URLs are valid!');
  } else {
    console.log(`⚠️  Found ${issues.length} issue(s):\n`);

    for (const issue of issues) {
      console.log(`🔸 ${issue.caseStudy.client_name}`);
      console.log(`   Title: ${issue.caseStudy.title}`);
      console.log(`   Issue: ${issue.issue}`);
      console.log(`   Current URL: ${issue.caseStudy.client_logo_url || '(none)'}`);

      if (issue.suggestedUrl) {
        console.log(`   💡 Suggested: ${issue.suggestedUrl}`);
        console.log(`   📊 Confidence: ${(issue.confidence! * 100).toFixed(1)}%`);
      }

      console.log();
    }

    // Generate SQL fix statements
    console.log('📝 SQL FIX STATEMENTS\n');
    console.log('-- Review and execute these statements manually:\n');

    for (const issue of issues) {
      if (issue.suggestedUrl && issue.confidence && issue.confidence > 0.6) {
        console.log(`-- ${issue.caseStudy.client_name} (confidence: ${(issue.confidence * 100).toFixed(1)}%)`);
        console.log(
          `UPDATE case_studies SET client_logo_url = '${issue.suggestedUrl}' WHERE id = '${issue.caseStudy.id}';`
        );
        console.log();
      }
    }
  }

  console.log('='.repeat(80));
  console.log(`\n✨ Validation complete!\n`);
}

// Run validation
validateLogos().catch(console.error);
