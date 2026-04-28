// Cross-platform script to copy env.json to dist/
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'env.json');
const destDir = path.join(__dirname, '..', 'dist');
const dest = path.join(destDir, 'env.json');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(src, dest);
console.log('env.json copied to dist/');
