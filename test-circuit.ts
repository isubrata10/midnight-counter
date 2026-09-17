import { Contract, ledger } from './managed/counter/contract/index.js';
import { createConstructorContext, createCircuitContext } from '@midnight-ntwrk/compact-runtime';

async function run() {
    const dummyCoinPublicKey = new Uint8Array(32);
    const contract = new Contract({});
    
    // 1. Initialize State
    const constructorCtx = createConstructorContext(undefined, dummyCoinPublicKey);
    const initialResult = await contract.initialState(constructorCtx);
    
    let currentState = initialResult.currentContractState;
    let currentZswapState = initialResult.currentZswapLocalState;
    
    console.log("Initial count:", ledger(currentState.data).count);
    
    // 2. Increment by 5
    const dummyAddress = '02' + Buffer.alloc(31).toString('hex');
    const circuitCtx = createCircuitContext(
        'increment',
        dummyAddress,
        currentZswapState,
        currentState,
        undefined
    );
    
    const result = await contract.circuits.increment(circuitCtx, 5n);
    console.log("Keys in result:", Object.keys(result));
    const finalState = result.context.queryContexts[dummyAddress].state;
    console.log("Final count:", ledger(finalState).count);
}
run();
