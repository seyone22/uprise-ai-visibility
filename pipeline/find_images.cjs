const fs = require('fs');
const content = fs.readFileSync('C:/Users/SGSey/.gemini/antigravity/brain/d83eb694-d721-43bb-8202-074d1068d234/.system_generated/steps/2321/content.md', 'utf8');
const regex = /https:\/\/[^ "'<>]+\.(?:png|svg|webp|jpg|jpeg)/gi;
const matches = content.match(regex) || [];
const unique = [...new Set(matches)];
console.log('Total images found:', unique.length);
console.log(unique.filter(u => !u.includes('elementor') || u.includes('logo') || u.includes('rev')).join('\n'));
