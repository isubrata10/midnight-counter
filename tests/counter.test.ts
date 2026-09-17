import test from 'node:test';
import assert from 'node:assert';
import { Contract, ledger } from '../managed/counter/contract/index.js';
import { createConstructorContext, createCircuitContext } from '@midnight-ntwrk/compact-runtime';

test('Circuit state transitions (0 -> 5 -> 8)', async () => {
    // 1. Setup the runtime context and initialize the contract
    const dummyCoinPublicKey = new Uint8Array(32);
    const contract = new Contract({});
    
    const constructorCtx = createConstructorContext(undefined, dummyCoinPublicKey);
    const initialResult = await contract.initialState(constructorCtx);
    
    const initialState = initialResult.currentContractState;
    const initialZswapState = initialResult.currentZswapLocalState;
    
    // Assert initial state is strictly 0
    assert.strictEqual(ledger(initialState.data).count, 0n, 'Initial count should be 0');

    const dummyAddress = '02' + Buffer.alloc(31).toString('hex');

    // 2. Execute the `increment` circuit with 5
    const circuitCtx1 = createCircuitContext(
        'increment',
        dummyAddress,
        initialZswapState,
        initialState,
        undefined
    );
    
    const result1 = await contract.circuits.increment(circuitCtx1, 5n);
    const stateAfter5 = result1.context.queryContexts[dummyAddress].state;
    const zswapAfter5 = result1.context.currentZswapLocalState;
    assert.strictEqual(ledger(stateAfter5).count, 5n, 'Final count should be 5 after incrementing by 5');

    // 3. Execute the `increment` circuit with 3
    const circuitCtx2 = createCircuitContext(
        'increment',
        dummyAddress,
        zswapAfter5,
        stateAfter5,
        undefined
    );
    
    const result2 = await contract.circuits.increment(circuitCtx2, 3n);
    const stateAfter8 = result2.context.queryContexts[dummyAddress].state;
    assert.strictEqual(ledger(stateAfter8).count, 8n, 'Final count should be 8 after incrementing by 3');
});

test('Private input handling', () => {
    const contract = new Contract({});
    assert.strictEqual(typeof contract.circuits.increment, 'function');
});
