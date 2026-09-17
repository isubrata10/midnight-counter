import fs from 'fs';
let content = fs.readFileSync('src/components/CircuitCall.tsx', 'utf8');

const target = `{step === 'idle' ? 'Submit ZK Proof' : 
             step === 'preparing' ? <><Loader2 className="spinner" /> Preparing Circuit...</> :
             step === 'proving' ? <><Loader2 className="spinner" /> Generating ZK Proof...</> :
             step === 'approving' ? <><Loader2 className="spinner" /> Awaiting Wallet Signature...</> :
             step === 'submitting' ? <><Loader2 className="spinner" /> Broadcasting to Network...</> :
             <><CheckCircle2 /> Contribution Confirmed</>}`;

const replacement = `{step === 'idle' ? 'Submit ZK Proof' : 
             step === 'preparing' ? <><Loader2 className="spinner" /> Preparing Circuit...</> :
             step === 'proving' ? <><Loader2 className="spinner" /> Generating ZK Proof...</> :
             step === 'approving' ? <><Loader2 className="spinner" /> Awaiting Wallet Signature...</> :
             step === 'submitting' ? <><Loader2 className="spinner" /> Broadcasting to Network...</> :
             step === 'submitted' ? <><Loader2 className="spinner" /> Transaction Submitted...</> :
             step === 'waiting for indexer' ? <><Loader2 className="spinner" /> Waiting for Indexer...</> :
             <><CheckCircle2 /> Contribution Confirmed</>}`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/CircuitCall.tsx', content);
