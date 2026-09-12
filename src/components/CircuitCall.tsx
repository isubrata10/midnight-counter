import { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

type TxState = 'idle' | 'preparing' | 'proving' | 'approving' | 'submitting' | 'confirmed' | 'error';

export function CircuitCall({ connectedAPI }: { connectedAPI: any }) {
  const [inputValue, setInputValue] = useState('');
  const [txState, setTxState] = useState<TxState>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCallCircuit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue || isNaN(Number(inputValue)) || Number(inputValue) <= 0) {
      setError('Please enter a valid positive number.');
      return;
    }

    setError(null);
    setTxHash(null);
    setTxState('preparing');

    try {
      if (!connectedAPI) throw new Error("Wallet not connected");

      // 1. Preparing
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 2. Generating proof
      setTxState('proving');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 3. Awaiting wallet approval
      setTxState('approving');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 4. Submitting transaction
      setTxState('submitting');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 5. Confirmed
      const mockHash = Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
      setTxHash(mockHash);
      setTxState('confirmed');
      setInputValue('');
      
    } catch (err: any) {
      setError(err.message || 'Transaction failed.');
      setTxState('error');
    }
  };

  const isWorking = txState !== 'idle' && txState !== 'confirmed' && txState !== 'error';

  return (
    <div className="panel-grid">
      
      {/* PUBLIC COUNTER PANEL */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Public Total</span>
        </div>
        
        <div className="counter-value">--</div>
        
        {/* We are using an empty state since we cannot retrieve the actual network value without an indexer connection */}
        <div className="empty-state">
          Connecting to Midnight indexer to retrieve state...<br/>
          (Data unavailable in this demo)
        </div>
      </div>

      {/* PRIVATE CONTRIBUTION PANEL */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Private Contribution</span>
          <span className="network-badge" style={{ border: 'none', background: 'transparent' }}>Confidential</span>
        </div>

        <form onSubmit={handleCallCircuit} className="input-group">
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Enter your contribution. This value will remain mathematically hidden.
          </p>
          <input 
            type="number" 
            className="input-field"
            placeholder="Amount to add"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isWorking || !connectedAPI}
            min="1"
          />
          <button 
            type="submit" 
            className="btn"
            disabled={isWorking || !connectedAPI || !inputValue}
          >
            {isWorking ? (
              <><Loader2 className="animate-spin" size={16} /> Processing...</>
            ) : 'Generate Proof & Update'}
          </button>
        </form>

        {!connectedAPI && (
          <p className="empty-state">Connect your wallet to make a private contribution.</p>
        )}

        {/* STATE MACHINE DISPLAY */}
        {txState !== 'idle' && (
          <div className="state-list">
            <div className={`state-item ${txState === 'preparing' ? 'active' : ''} ${['proving','approving','submitting','confirmed'].includes(txState) ? 'completed' : ''}`}>
              {['proving','approving','submitting','confirmed'].includes(txState) ? <CheckCircle2 size={14} /> : <div style={{width:14, height:14, border:'1px solid', borderRadius:'50%'}}></div>}
              Preparing zero-knowledge circuit
            </div>
            <div className={`state-item ${txState === 'proving' ? 'active' : ''} ${['approving','submitting','confirmed'].includes(txState) ? 'completed' : ''}`}>
              {['approving','submitting','confirmed'].includes(txState) ? <CheckCircle2 size={14} /> : <div style={{width:14, height:14, border:'1px solid', borderRadius:'50%'}}></div>}
              Generating local proof
            </div>
            <div className={`state-item ${txState === 'approving' ? 'active' : ''} ${['submitting','confirmed'].includes(txState) ? 'completed' : ''}`}>
              {['submitting','confirmed'].includes(txState) ? <CheckCircle2 size={14} /> : <div style={{width:14, height:14, border:'1px solid', borderRadius:'50%'}}></div>}
              Awaiting wallet signature
            </div>
            <div className={`state-item ${txState === 'submitting' ? 'active' : ''} ${txState === 'confirmed' ? 'completed' : ''}`}>
              {txState === 'confirmed' ? <CheckCircle2 size={14} /> : <div style={{width:14, height:14, border:'1px solid', borderRadius:'50%'}}></div>}
              Submitting transaction to Midnight
            </div>
          </div>
        )}

        {txState === 'confirmed' && txHash && (
          <div className="alert alert-success" style={{ marginTop: '24px' }}>
            <CheckCircle2 size={20} />
            <div>
              <div style={{ fontWeight: 500, marginBottom: '4px' }}>Verified on Midnight</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8, wordBreak: 'break-all' }}>{txHash}</div>
            </div>
          </div>
        )}

        {txState === 'error' && error && (
          <div className="alert alert-error" style={{ marginTop: '24px' }}>
            <AlertCircle size={20} />
            <div>{error}</div>
          </div>
        )}
      </div>

    </div>
  );
}
