import fs from 'fs';
let content = fs.readFileSync('src/deploy.ts', 'utf8');

content = content.replace(
  /catch \(err\) \{\n\s*console\.error\("Deployment failed:", err\);\n\s*\}/,
  `catch (err) {
    console.error("Deployment failed:", err);
    await wallet.close();
    process.exit(1);
  }`
);

fs.writeFileSync('src/deploy.ts', content);
