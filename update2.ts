import fs from 'fs';

function updateFile(path: string) {
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(
    /CompiledContract\.withWitnesses\(\{\}\)/g,
    `CompiledContract.withVacantWitnesses`
  );
  fs.writeFileSync(path, content);
}

updateFile('src/components/CircuitCall.tsx');
updateFile('src/deploy.ts');
