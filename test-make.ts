import { Contract } from './managed/counter/contract/index.js';
import { ContractExecutable } from '@midnight-ntwrk/midnight-js-protocol/compact-js';
const exec = ContractExecutable.make(Contract as any);
console.log(exec.getProvableCircuitIds());
