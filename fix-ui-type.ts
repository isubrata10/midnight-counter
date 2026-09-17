import fs from 'fs';
let content = fs.readFileSync('src/components/CircuitCall.tsx', 'utf8');

// Fix typing
content = content.replace(
  /const \[step, setStep\] = useState<'idle' \| 'preparing' \| 'proving' \| 'approving' \| 'submitting' \| 'confirmed'>\('idle'\);/,
  "const [step, setStep] = useState<'idle' | 'preparing' | 'proving' | 'approving' | 'submitting' | 'submitted' | 'waiting for indexer' | 'confirmed'>('idle');"
);

// Fix UI button
content = content.replace(
  /step === 'submitting' \? <><Loader2 className="spinner" \/> Broadcasting to Network...><\/> :/g,
  `step === 'submitting' ? <><Loader2 className="spinner" /> Broadcasting to Network...</> :
             step === 'submitted' ? <><Loader2 className="spinner" /> Transaction Submitted...</> :
             step === 'waiting for indexer' ? <><Loader2 className="spinner" /> Waiting for Indexer...</> :`
);

fs.writeFileSync('src/components/CircuitCall.tsx', content);
