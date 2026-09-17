import { Contract } from './managed/counter/contract/index.js';
import { CompiledContract, ContractExecutable } from '@midnight-ntwrk/compact-js';
import { pipe } from 'effect';

const compiledContract = pipe(CompiledContract.make('counter', Contract as any), CompiledContract.withVacantWitnesses) as any;
const exec = ContractExecutable.make(compiledContract);
console.log(exec.circuit.toString());
