import fs from 'fs';
import path from 'path';

export interface ClientLogo {
  client_name: string;
  client_logo_url: string;
}

export function getClientLogosFromFolder(): ClientLogo[] {
  try {
    const clientDir = path.join(process.cwd(), 'public/client');

    // Check if directory exists
    if (!fs.existsSync(clientDir)) {
      console.warn('Client directory not found:', clientDir);
      return [];
    }

    const files = fs.readdirSync(clientDir);

    // Filter PNG files and map to client logos
    const logos = files
      .filter(file => file.endsWith('.png'))
      .map(file => ({
        client_name: file.replace(/^\d+_/, '').replace(/\.png$/, ''),
        client_logo_url: `/client/${file}`,
      }))
      .sort((a, b) => a.client_name.localeCompare(b.client_name));

    return logos;
  } catch (error) {
    console.error('Error reading client logos:', error);
    return [];
  }
}
