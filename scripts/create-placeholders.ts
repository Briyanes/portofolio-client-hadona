const fs = require('fs');
const path = require('path');

const placeholderDir = path.join(__dirname, '../public/placeholders');

// Ensure directory exists
if (!fs.existsSync(placeholderDir)) {
  fs.mkdirSync(placeholderDir, { recursive: true });
}

// Function to create SVG placeholder
function createSVGPlaceholder(
  width: number,
  height: number,
  bgColor: string,
  textColor: string,
  text: string,
  filename: string
): void {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.min(width, height) / 10}" font-weight="bold" fill="${textColor}" text-anchor="middle" dy=".3em">${text}</text>
    </svg>
  `;

  fs.writeFileSync(path.join(placeholderDir, filename), svg.trim());
  console.log(`Created ${filename}`);
}

// Create all needed placeholders
console.log('Creating placeholder images...');

// Case Study 1 - Digital Advertising (FSI)
createSVGPlaceholder(500, 500, '#2B46BB', '#FFFFFF', 'FSI', 'client-logo-fsi.svg');
createSVGPlaceholder(1200, 630, '#2B46BB', '#FFFFFF', 'Case Study 1', 'thumbnail-cs1.svg');
createSVGPlaceholder(1920, 1080, '#2B46BB', '#FFFFFF', 'Hero Fashion', 'hero-cs1.svg');
createSVGPlaceholder(1920, 1080, '#1E3190', '#FFFFFF', 'Gallery 1', 'gallery1-cs1.svg');
createSVGPlaceholder(1920, 1080, '#4A6AE8', '#FFFFFF', 'Gallery 2', 'gallery2-cs1.svg');
createSVGPlaceholder(1920, 1080, '#EDD947', '#333333', 'Gallery 3', 'gallery3-cs1.svg');

// Case Study 2 - Corporate Training (BNI)
createSVGPlaceholder(500, 500, '#EDD947', '#333333', 'BNI', 'client-logo-bni.svg');
createSVGPlaceholder(1200, 630, '#EDD947', '#333333', 'Case Study 2', 'thumbnail-cs2.svg');
createSVGPlaceholder(1920, 1080, '#EDD947', '#333333', 'Hero Bank', 'hero-cs2.svg');
createSVGPlaceholder(1920, 1080, '#E5D03D', '#333333', 'Training 1', 'gallery1-cs2.svg');
createSVGPlaceholder(1920, 1080, '#2B46BB', '#FFFFFF', 'Training 2', 'gallery2-cs2.svg');

// Case Study 3 - Growth Hack (PQ)
createSVGPlaceholder(500, 500, '#4A6AE8', '#FFFFFF', 'PQ', 'client-logo-pq.svg');
createSVGPlaceholder(1200, 630, '#4A6AE8', '#FFFFFF', 'Case Study 3', 'thumbnail-cs3.svg');
createSVGPlaceholder(1920, 1080, '#4A6AE8', '#FFFFFF', 'Hero Fintech', 'hero-cs3.svg');
createSVGPlaceholder(1920, 1080, '#1E3190', '#FFFFFF', 'Growth 1', 'gallery1-cs3.svg');
createSVGPlaceholder(1920, 1080, '#EDD947', '#333333', 'Growth 2', 'gallery2-cs3.svg');
createSVGPlaceholder(1920, 1080, '#2B46BB', '#FFFFFF', 'Growth 3', 'gallery3-cs3.svg');

console.log('All placeholders created successfully!');
