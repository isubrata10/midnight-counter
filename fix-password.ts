import fs from 'fs';
let deployContent = fs.readFileSync('src/deploy.ts', 'utf8');
deployContent = deployContent.replace(
  /privateStoragePasswordProvider: async \(\) => 'super_secret_strong_password_1234'/g,
  "privateStoragePasswordProvider: async () => process.env.MIDNIGHT_WALLET_PASSWORD || 'deploy_password'"
);
fs.writeFileSync('src/deploy.ts', deployContent);

let intContent = fs.readFileSync('tests/integration.test.ts', 'utf8');
intContent = intContent.replace(
  /privateStoragePasswordProvider: async \(\) => 'integration_password'/g,
  "privateStoragePasswordProvider: async () => process.env.MIDNIGHT_WALLET_PASSWORD || 'integration_password'"
);
fs.writeFileSync('tests/integration.test.ts', intContent);
