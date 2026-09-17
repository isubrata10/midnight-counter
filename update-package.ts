import fs from 'fs';
const data = JSON.parse(fs.readFileSync('package.json', 'utf8'));
data.scripts['test:integration'] = "npx tsx --test tests/integration.test.ts";
fs.writeFileSync('package.json', JSON.stringify(data, null, 2));
