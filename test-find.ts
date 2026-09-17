import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { Contract } from './managed/counter/contract/index.js';
import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { pipe } from 'effect';

async function test() {
  try {
    const compiledContract = pipe(
      CompiledContract.make('counter', Contract as any),
      CompiledContract.withWitnesses({})
    );
    await findDeployedContract({
      privateStateProvider: { setContractAddress: () => {} },
      publicDataProvider: {
        watchForDeployTxData: async () => ({}),
        queryDeployContractState: async () => ({}),
        queryContractState: async () => ({})
      },
      zkConfigProvider: { getVerifierKeys: async () => ({}) }
    } as any, { compiledContract, contractAddress: '02c4070a55bb2807fd2b3592860e2cf767959d507cb95fc02df50f72f1e68998' });
    console.log("Success!");
  } catch (err) {
    console.error(err);
  }
}
test();
