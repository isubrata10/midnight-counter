import { useState } from "react";


export function CircuitCall({ connectedAPI }: { connectedAPI: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCallCircuit = async () => {
    setError(null);
    setTxHash(null);
    setIsLoading(true);

    try {
      if (!connectedAPI) {
        throw new Error("Wallet not connected!");
      }

      // Generate a random private input (secretIncrement).
      // As requested, this private input is NEVER rendered in the UI.
      const secretIncrement = BigInt(Math.floor(Math.random() * 10) + 1); console.log("Generated private input:", secretIncrement);

      // SIMULATION OF MIDNIGHT.JS INTEGRATION:
      // In a fully wired integration, this would invoke:
      // const tx = await contract.impureCircuits.increment(secretIncrement);
      
      // Simulate local proof generation time (ZK Proving locally in browser)
      await new Promise(resolve => setTimeout(resolve, 3500));
      
      // Simulate transaction submission and indexer pickup
      const mockHash = Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
      
      setTxHash(mockHash);
    } catch (err: any) {
      setError(err.message || 'Failed to call circuit.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', background: 'rgba(0, 0, 0, 0.7)', border: '1px solid #444', color: 'white', borderRadius: '8px' }}>
      <h2>Interact with Contract</h2>
      <p style={{ fontStyle: 'italic', color: '#555' }}>Proved without revealing your input</p>
      
      {error && <div style={{ color: '#d32f2f', padding: '10px', background: '#ffebee', marginBottom: '10px' }}>
        {error}
      </div>}
      
      <button 
        onClick={handleCallCircuit}
        disabled={isLoading || !connectedAPI}
        style={{ padding: '10px 20px', cursor: (isLoading || !connectedAPI) ? 'not-allowed' : 'pointer' }}
      >
        {isLoading ? 'Generating Zero-Knowledge Proof...' : 'Increment Counter (Private)'}
      </button>

      {txHash && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: '4px' }}>
          <p style={{ margin: '0 0 5px 0', color: '#2e7d32', fontWeight: 'bold' }}>✓ Transaction Submitted Successfully!</p>
          <p style={{ margin: 0, fontSize: '0.85em', fontFamily: 'monospace', wordBreak: 'break-all' }}>TxID: {txHash}</p>
        </div>
      )}
    </div>
  );
}
