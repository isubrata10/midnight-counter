import fs from 'fs';

function updateFile(path: string) {
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(
    /import { Contract } from '.*';/,
    `$&
import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { pipe } from 'effect';`
  );
  
  if (path.includes('CircuitCall.tsx')) {
    content = content.replace(
      /compiledContract: Contract as any/,
      `compiledContract: pipe(CompiledContract.make('counter', Contract as any), CompiledContract.withWitnesses({})) as any`
    );
  } else if (path.includes('deploy.ts')) {
    content = content.replace(
      /compiledContract: Contract as any,/,
      `compiledContract: pipe(CompiledContract.make('counter', Contract as any), CompiledContract.withWitnesses({})) as any,`
    );
  }
  
  fs.writeFileSync(path, content);
}

updateFile('src/components/CircuitCall.tsx');
updateFile('src/deploy.ts');
