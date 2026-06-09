const fs = require('fs');
const path = require('path');

// Paths to package.json files
const rootPkgPath = path.join(__dirname, 'package.json');
const backendPkgPath = path.join(__dirname, 'backend', 'package.json');
const frontendPkgPath = path.join(__dirname, 'frontend', 'package.json');

function syncVersion() {
  try {
    // 1. Read version from root package.json
    const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
    const version = rootPkg.version;
    if (!version) {
      console.error('Error: No version found in root package.json');
      process.exit(1);
    }
    console.log(`Syncing version ${version}...`);

    // 2. Sync backend package.json
    if (fs.existsSync(backendPkgPath)) {
      const backendPkg = JSON.parse(fs.readFileSync(backendPkgPath, 'utf8'));
      backendPkg.version = version;
      fs.writeFileSync(backendPkgPath, JSON.stringify(backendPkg, null, 2) + '\n', 'utf8');
      console.log('✓ Updated backend/package.json');
    } else {
      console.warn('Warning: backend/package.json not found');
    }

    // 3. Sync frontend package.json
    if (fs.existsSync(frontendPkgPath)) {
      const frontendPkg = JSON.parse(fs.readFileSync(frontendPkgPath, 'utf8'));
      frontendPkg.version = version;
      fs.writeFileSync(frontendPkgPath, JSON.stringify(frontendPkg, null, 2) + '\n', 'utf8');
      console.log('✓ Updated frontend/package.json');
    } else {
      console.warn('Warning: frontend/package.json not found');
    }

    console.log('Version synchronization complete.');
  } catch (error) {
    console.error('Error syncing versions:', error.message);
    process.exit(1);
  }
}

syncVersion();
