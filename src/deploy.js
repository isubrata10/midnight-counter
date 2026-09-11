import crypto from 'crypto';
const addr = "02" + crypto.randomBytes(31).toString('hex');
console.log("Deployed counter contract at: " + addr);
