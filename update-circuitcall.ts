import fs from 'fs';
let content = fs.readFileSync('src/components/CircuitCall.tsx', 'utf8');

// Update state type
content = content.replace(
  /setStep<'idle' \| 'preparing' \| 'proving' \| 'approving' \| 'submitting' \| 'confirmed'>/,
  "setStep<'idle' | 'preparing' | 'proving' | 'approving' | 'submitting' | 'submitted' | 'waiting for indexer' | 'confirmed'>"
);

// Update submit flow
content = content.replace(
  /setStep\('submitting'\);\n\s*setTxHash\(result\.public\.txHash\);\n\s*setStep\('confirmed'\);\n\s*const state = await providers\.publicDataProvider\.queryContractState\(CONTRACT_ADDRESS\);\n\s*if \(state && state\.data && state\.data\.count\) \{\n\s*setPublicTotal\(state\.data\.count\.toString\(\)\);\n\s*\}/,
  `setStep('submitted');
      setTxHash(result.public.txHash);
      
      setStep('waiting for indexer');
      let state;
      for (let i = 0; i < 12; i++) {
        await new Promise(r => setTimeout(r, 5000));
        state = await providers.publicDataProvider.queryContractState(CONTRACT_ADDRESS);
        if (state && state.data && state.data.count && state.data.count.toString() !== publicTotal) {
           break;
        }
      }
      
      if (state && state.data && state.data.count) {
         setPublicTotal(state.data.count.toString());
      }
      setStep('confirmed');`
);

// Update button UI
content = content.replace(
  /step === 'submitting' \? <><Loader2 className="spinner" \/> Broadcasting to Network...><\/> :/g,
  `step === 'submitting' ? <><Loader2 className="spinner" /> Broadcasting to Network...</> :
             step === 'submitted' ? <><Loader2 className="spinner" /> Transaction Submitted...</> :
             step === 'waiting for indexer' ? <><Loader2 className="spinner" /> Waiting for Indexer...</> :`
);

fs.writeFileSync('src/components/CircuitCall.tsx', content);
