import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { Contract } from './managed/counter/contract/index.js';
async function test() {
  try {
    await deployContract({} as any, { compiledContract: Contract as any });
  } catch (err) {
    console.error(err);
  }
}
test();
