import { mnemonicToEntropy } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english.js';

function encode() {
  const mnemonic = process.argv[2];
  if (!mnemonic || mnemonic.split(' ').length !== 24) {
    console.error("Please provide a 24-word seed phrase wrapped in quotes.");
    console.error("Usage: npm run encode-seed \"word1 word2 ... word24\"");
    process.exit(1);
  }

  try {
    const entropy = mnemonicToEntropy(mnemonic, wordlist);
    const hexSeed = Buffer.from(entropy).toString('hex');
    console.log("\nSuccess! Here is your hex-encoded SEED for the deployment script:");
    console.log("==================================================================");
    console.log(hexSeed);
    console.log("==================================================================");
    console.log("\nRun this command to use it:");
    console.log(`export SEED="${hexSeed}"`);
  } catch (e) {
    console.error("Invalid mnemonic phrase. Please ensure you copied it exactly from Lace.");
  }
}

encode();
