import fs from 'fs';
let content = fs.readFileSync('src/components/CircuitCall.tsx', 'utf8');
content = content.replace(
  /step === 'submitting' \? <><Loader2 className="spinner" \/> Broadcasting to Network...><\/> :\n\s*<><CheckCircle2 \/> Contribution Confirmed><\/>\}/,
  `step === 'submitting' ? <><Loader2 className="spinner" /> Broadcasting to Network...</> :
             step === 'submitted' ? <><Loader2 className="spinner" /> Transaction Submitted...</> :
             step === 'waiting for indexer' ? <><Loader2 className="spinner" /> Waiting for Indexer...</> :
             <><CheckCircle2 /> Contribution Confirmed</>}`
);
fs.writeFileSync('src/components/CircuitCall.tsx', content);
