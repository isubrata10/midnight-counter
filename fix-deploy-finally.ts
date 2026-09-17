import fs from 'fs';
let content = fs.readFileSync('src/deploy.ts', 'utf8');

content = content.replace(
  /try \{\n\s*const contract = await deployContract\([\s\S]*?\} catch \(err\) \{\n\s*console\.error\("Deployment failed:", err\);\n\s*await wallet\.close\(\);\n\s*process\.exit\(1\);\n\s*\}\n\s*await wallet\.close\(\);\n\s*process\.exit\(0\);/,
  `let exitCode = 0;
  try {
    const contract = await deployContract(providers as any, {
      compiledContract: pipe(CompiledContract.make('counter', Contract as any), CompiledContract.withVacantWitnesses) as any,
      initialPrivateState: undefined,
    } as any);

    console.log("Contract deployed!");
    console.log("Address:", contract.deployTxData.public.contractAddress);
  } catch (err) {
    console.error("Deployment failed:", err);
    exitCode = 1;
  } finally {
    await wallet.close();
    process.exit(exitCode);
  }`
);

fs.writeFileSync('src/deploy.ts', content);
