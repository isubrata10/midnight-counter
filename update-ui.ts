import fs from 'fs';
let content = fs.readFileSync('src/components/CircuitCall.tsx', 'utf8');

content = content.replace(
  /const CONTRACT_ADDRESS = "02c4070a55bb2807fd2b3592860e2cf767959d507cb95fc02df50f72f1e68998";.*$/m,
  "const CONTRACT_ADDRESS = import.meta.env.VITE_COUNTER_CONTRACT_ADDRESS;"
);

// Add the warning if not configured
content = content.replace(
  /if \(\!connectedAPI\) return null;/,
  `if (!connectedAPI) return null;

  if (!CONTRACT_ADDRESS) {
    return (
      <div className="layout-grid">
        <div className="panel">
          <p>Counter contract is not configured for Preprod.</p>
        </div>
      </div>
    );
  }`
);

fs.writeFileSync('src/components/CircuitCall.tsx', content);
