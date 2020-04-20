const { WsProvider, ApiPromise } = require('@polkadot/api');
const pdKeyring = require('@polkadot/keyring');
const types = require('@subsocial/types').types;

const tokenDecimals = process.env.TOKEN_DECIMALS;
const substrateUrl = process.env.SUBSTRATE_URL;

class Actions {
  async create(mnemonic, url = substrateUrl) {
    const provider = new WsProvider(url);
    this.api = await ApiPromise.create({ provider, types });
    const keyring = new pdKeyring.Keyring({ type: 'sr25519' });
    this.account = keyring.addFromMnemonic(mnemonic);
  }

  async sendTokens(address, amount) {
    amount = amount * 10**tokenDecimals;

    const transfer = this.api.tx.balances.transfer(address, amount);
    const hash = await transfer.signAndSend(this.account);

    return hash.toHex();
  }

  async checkBalance() {
    return this.api.query.balances.freeBalance(this.account.address);
  }
}

module.exports = Actions;
