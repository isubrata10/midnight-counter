import { useState, useEffect } from 'react';
import { Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { useMidnight } from '../hooks/useMidnight';
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { Contract } from '../../managed/counter/contract/index.js';
import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { pipe } from 'effect';

export function CircuitCall({ connectedAPI }: { connectedAPI: any }) {
  const { providers, api } = useMidnight();
  const [publicTotal, setPublicTotal] = useState<string>('Loading...');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'idle' | 'preparing' | 'proving' | 'approving' | 'submitting' | 'confirmed'>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);

  const CONTRACT_ADDRESS = import.meta.env.VITE_COUNTER_CONTRACT_ADDRESS;

  useEffect(() => {
    if (providers && providers.publicDataProvider) {
      const fetchState = async () => {
        try {
          const state = await providers.publicDataProvider.queryContractState(CONTRACT_ADDRESS);
          if (state && state.data && state.data.count) {
            setPublicTotal(state.data.count.toString());
          } else {
            setPublicTotal('State not found (Verify deployment)');
          }
        } catch (e) {
          console.error("Indexer query failed:", e);
          setPublicTotal('Error connecting to indexer');
        }
      };
      fetchState();
      const interval = setInterval(fetchState, 15000);
      return () => clearInterval(interval);
    }
  }, [providers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!api || !providers) return;
    
    setStep('preparing');
    try {
      setStep('proving');
      
      const contract = await findDeployedContract(providers, {
        contractAddress: CONTRACT_ADDRESS,
        compiledContract: pipe(CompiledContract.make('counter', Contract as any), CompiledContract.withVacantWitnesses) as any
      });
      
      setStep('approving');
      const result = await contract.callTx.increment(BigInt(amount));
      
      setStep('submitting');
      setTxHash(result.public.txHash);
      setStep('confirmed');
      
      const state = await providers.publicDataProvider.queryContractState(CONTRACT_ADDRESS);
      if (state && state.data && state.data.count) {
         setPublicTotal(state.data.count.toString());
      }
      
    } catch (e: any) {
      console.error(e);
      setStep('idle');
      alert("Transaction failed: " + e.message);
    }
  };

  if (!connectedAPI) return null;

  if (!CONTRACT_ADDRESS) {
    return (
      <div className="layout-grid">
        <div className="panel">
          <p>Counter contract is not configured for Preprod.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="layout-grid">
      <div className="panel">
        <h3 className="panel-title">Public Total</h3>
        <p className="panel-value">{publicTotal}</p>
        <p className="panel-subtitle">Verified on Midnight Network</p>
      </div>
      
      <div className="panel">
        <h3 className="panel-title">Private Contribution</h3>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input 
              type="number" 
              placeholder="Amount to add" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={step !== 'idle' && step !== 'confirmed'}
              className="text-input"
            />
          </div>
          
          <button type="submit" disabled={!amount || (step !== 'idle' && step !== 'confirmed')} className="primary-button">
            {step === 'idle' ? 'Submit ZK Proof' : 
             step === 'preparing' ? <><Loader2 className="spinner" /> Preparing Circuit...</> :
             step === 'proving' ? <><Loader2 className="spinner" /> Generating ZK Proof...</> :
             step === 'approving' ? <><Loader2 className="spinner" /> Awaiting Wallet Signature...</> :
             step === 'submitting' ? <><Loader2 className="spinner" /> Broadcasting to Network...</> :
             <><CheckCircle2 /> Contribution Confirmed</>}
          </button>
        </form>
        {txHash && (
           <div className="tx-hash">
              <strong>Transaction Hash:</strong><br/>
              {txHash}
           </div>
        )}
      </div>
    </div>
  );
}
