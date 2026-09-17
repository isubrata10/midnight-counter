import fs from 'fs';
let content = fs.readFileSync('tests/integration.test.ts', 'utf8');

content = content.replace(
  /if \(process\.env\.MIDNIGHT_NETWORK !== 'preprod' \|\| \!process\.env\.MIDNIGHT_WALLET_SEED \|\| \!process\.env\.VITE_COUNTER_CONTRACT_ADDRESS\) \{\n\s*if \(process\.env\.npm_lifecycle_event === 'test:integration'\) \{\n\s*console\.error\("Integration test requires MIDNIGHT_NETWORK=preprod, MIDNIGHT_WALLET_SEED, and VITE_COUNTER_CONTRACT_ADDRESS"\);\n\s*process\.exit\(1\);\n\s*\}\n\s*console\.log\("Skipping integration test in normal suite\. Missing credentials\."\);\n\s*return;\n\s*\}/,
  `if (process.env.MIDNIGHT_NETWORK !== 'preprod' || !process.env.MIDNIGHT_WALLET_SEED || !process.env.VITE_COUNTER_CONTRACT_ADDRESS) {
      console.error("Integration test requires MIDNIGHT_NETWORK=preprod, MIDNIGHT_WALLET_SEED, and VITE_COUNTER_CONTRACT_ADDRESS");
      process.exit(1);
  }`
);

fs.writeFileSync('tests/integration.test.ts', content);
