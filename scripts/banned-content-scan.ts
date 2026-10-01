import fs from 'fs';
import path from 'path';

const BANNED_TERMS = [
  'lorem',
  'ipsum',
  'urban nest',
  'example.com',
  'dummy',
  'todo',
  'content to be provided',
  'fake',
  'test@test.com',
];

const SCAN_DIRS = ['app', 'components', 'lib', 'models', 'scripts', 'public'];
const SCAN_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.json', '.html', '.md'];

let violationCount = 0;

function scanFile(filePath: string) {
  // Exclude scanner itself and PRD docs from failing on their own scan definitions
  if (
    filePath.includes('banned-content-scan.ts') ||
    filePath.includes('PRD_MASTER.md') ||
    filePath.includes('prd')
  ) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lowerLine = line.toLowerCase();
    for (const term of BANNED_TERMS) {
      if (lowerLine.includes(term.toLowerCase())) {
        console.error(
          `❌ [BANNED CONTENT DETECTED] in ${filePath}:${index + 1}\n` +
          `   Term: "${term}"\n` +
          `   Content: ${line.trim()}\n`
        );
        violationCount++;
      }
    }
  });
}

function traverseDirectory(dir: string) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next' && entry.name !== '.git') {
        traverseDirectory(fullPath);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (SCAN_EXTENSIONS.includes(ext)) {
        scanFile(fullPath);
      }
    }
  }
}

console.log('🔍 Initiating ARS EXIM Pre-Launch Banned Content Scan...');

for (const dir of SCAN_DIRS) {
  traverseDirectory(path.join(process.cwd(), dir));
}

if (violationCount > 0) {
  console.error(`\n🚨 SCAN FAILED: Detected ${violationCount} banned placeholder/template violation(s).`);
  console.error('Compliance Rule 18 & 19: All placeholder, template, and fake content must be removed before production.');
  process.exit(1);
} else {
  console.log('\n✅ SCAN PASSED: 0 banned content occurrences detected across all scanned code and seed files.');
  process.exit(0);
}
