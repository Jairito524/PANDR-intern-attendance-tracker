import fs from 'fs';
import path from 'path';

// Exclude directories and specific files
const EXCLUDE_DIRS = ['node_modules', '.git', 'dist', '.gemini'];
const EXCLUDE_FILES = ['package-lock.json', 'CODEBASE_SUMMARY.md', 'build_summary.js', '.DS_Store'];

const rootDir = process.cwd();

// Function to generate the ascii tree
function buildTree(dir, prefix = '') {
  let treeStr = '';
  const items = fs.readdirSync(dir, { withFileTypes: true });

  // Filter and sort items
  const sortedItems = items
    .filter(item => {
      if (item.isDirectory()) {
        return !EXCLUDE_DIRS.includes(item.name);
      }
      return !EXCLUDE_FILES.includes(item.name);
    })
    .sort((a, b) => {
      // Directories first, then alphabetical
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

  sortedItems.forEach((item, index) => {
    const isLast = index === sortedItems.length - 1;
    const marker = isLast ? '└── ' : '├── ';
    treeStr += `${prefix}${marker}${item.name}\n`;

    if (item.isDirectory()) {
      const newPrefix = prefix + (isLast ? '    ' : '│   ');
      treeStr += buildTree(path.join(dir, item.name), newPrefix);
    }
  });

  return treeStr;
}

// Function to collect all file paths
function getFiles(dir, fileList = []) {
  const items = fs.readdirSync(dir, { withFileTypes: true });

  items.forEach(item => {
    if (item.isDirectory() && !EXCLUDE_DIRS.includes(item.name)) {
      getFiles(path.join(dir, item.name), fileList);
    } else if (item.isFile() && !EXCLUDE_FILES.includes(item.name)) {
      fileList.push(path.join(dir, item.name));
    }
  });

  return fileList;
}

const tree = `.\n${buildTree(rootDir)}`;
const files = getFiles(rootDir);

let contentStr = '';
files.forEach(file => {
  const relPath = path.relative(rootDir, file).replace(/\\/g, '/');
  // Simple check for text files or file extension
  const ext = path.extname(file).toLowerCase();
  const BINARY_EXTS = ['.png', '.jpg', '.jpeg', '.gif', '.ico'];
  if (BINARY_EXTS.includes(ext)) return;

  try {
    const content = fs.readFileSync(file, 'utf-8');
    const lang = ext.replace('.', '') || 'text';
    contentStr += `## FILE: ${relPath}\n\`\`\`${lang}\n${content}\n\`\`\`\n\n`;
  } catch(e) {
    console.error(`Skipping ${file} due to error`);
  }
});

const outMarkdown = `# Project File Tree\n\n\`\`\`\n${tree}\`\`\`\n\n# File Contents\n\n${contentStr}`;

fs.writeFileSync('CODEBASE_SUMMARY.md', outMarkdown);
console.log('CODEBASE_SUMMARY.md updated successfully.');
