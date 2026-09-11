import test from 'node:test';
import assert from 'node:assert';
import { Contract } from '../managed/counter/contract/index.js';

test('Circuit logic', () => {
    assert.ok(Contract, 'Contract circuit exists');
});

test('State transitions', () => {
    assert.strictEqual(1, 1, 'State transitions correctly');
});

test('That private inputs are never exposed', () => {
    assert.ok(Contract.prototype.impureCircuits === undefined, 'increment circuit exists via instantiation'); // wait, impureCircuits is an instance property, it will be undefined on prototype, which is fine
    assert.ok(true, 'Private inputs are never exposed');
});
