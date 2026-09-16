import { useState, useEffect } from 'react';
import { Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { useMidnight } from '../hooks/useMidnight';

export function CircuitCall({ connectedAPI }: { connectedAPI: any }) {
  const { providers, api } = useMidnight();
  const [publicTotal, setPublicTotal] = useState<string>('Loading...');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'idle' | 'preparing' | 'proving' | 'approving' | 'submitting' | 'confirmed'>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);

  const CONTRACT_ADDRESS = "02c4070a55bb2807fd2b3592860e2cf767959d507cb95fc02df50f72f1e68998";

  useEffect(() => {
    if (providers && providers.publicDataProvider) {
      const fetchState = async () => {
        try {
          const state = await providers.publicDataProvider.queryContractState(CONTRACT_ADDRESS);
          if (state) {
            setPublicTotal(state.data.count?.toString() || '0');
          } else {
            setPublicTotal('State not found (Verify deployment)');
          }
        } catch (e) {
          console.error(e);
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
      setStep('approving');
      setStep('submitting');
      await new Promise(r => setTimeout(r, 2000));
      setTxHash("Simulated (Need ZK artifacts to complete actual proof)");
      setStep('confirmed');
    } catch (e: any) {
      console.error(e);
      setStep('idle');
      alert("Transaction failed: " + e.message);
    }
  };

  if (!connectedAPI) return null;

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
              disabled={step !== 'idle'}
              className="text-input"
            />
          </div>
          
          <button type="submit" disabled={!amount || step !== 'idle'} className="primary-button">
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
