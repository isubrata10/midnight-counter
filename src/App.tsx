import { useState } from "react";

import { WalletConnect } from './components/WalletConnect';
import { CircuitCall } from './components/CircuitCall';

function App() {
  const [connectedAPI, setConnectedAPI] = useState<any | null>(null);

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#1a1a1a' }}>Midnight Counter dApp</h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
        Level 2 Frontend Implementation
      </p>

      <WalletConnect onConnect={setConnectedAPI} />
      
      <div style={{ marginTop: '20px' }}>
        <CircuitCall connectedAPI={connectedAPI} />
      </div>
    </div>
  );
}

export default App;
