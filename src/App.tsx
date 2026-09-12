import { useState } from 'react';
import { WalletConnect } from './components/WalletConnect';
import { CircuitCall } from './components/CircuitCall';
import { Lock, Cpu, Globe, ArrowRight } from 'lucide-react';

function App() {
  const [connectedAPI, setConnectedAPI] = useState<any | null>(null);

  return (
    <div className="app-container">
      <WalletConnect onConnect={setConnectedAPI} />
      
      {/* HERO SECTION */}
      <div style={{ marginBottom: '60px' }}>
        <h1 className="hero-title">Public totals.<br/>Private contributions.</h1>
        <p className="hero-subtitle">
          Update the public total without revealing your individual contribution. Built on Midnight.
        </p>
      </div>

      {/* VISUAL FLOW */}
      <div className="visual-flow">
        <div className="flow-step">
          <Lock size={32} />
          <span>Private Input</span>
        </div>
        <ArrowRight className="flow-arrow" />
        <div className="flow-step">
          <Cpu size={32} />
          <span>Zero-Knowledge Proof</span>
        </div>
        <ArrowRight className="flow-arrow" />
        <div className="flow-step">
          <Globe size={32} />
          <span>Public Total</span>
        </div>
      </div>

      {/* MAIN INTERACTION */}
      <CircuitCall connectedAPI={connectedAPI} />

      {/* PRIVACY EXPLANATION */}
      <div className="info-section">
        <h3 className="info-title">How Privacy Works</h3>
        <div className="info-grid">
          <div className="info-card">
            <h4>Data Model</h4>
            <ul>
              <li><strong>Public:</strong> Current cumulative total</li>
              <li><strong>Private:</strong> Your individual contribution amount</li>
              <li><strong>Proven:</strong> The correctness of the state update</li>
            </ul>
          </div>
          <div className="info-card">
            <h4>Process</h4>
            <ul>
              <li><strong>01</strong> — Enter a private contribution</li>
              <li><strong>02</strong> — Generate a privacy-preserving proof</li>
              <li><strong>03</strong> — Update the public total</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
