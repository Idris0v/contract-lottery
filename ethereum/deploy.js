const HDWalletProvider = require('truffle-hdwallet-provider')
const Web3 = require('web3')
const { interface, bytecode } = require('./compiler')

const provider = new HDWalletProvider(
    'across catch biology very vivid fee blush company regret welcome surface agent',
    'https://rinkeby.infura.io/v3/b3357c11ce3743e2a0b85e9365745e9c'
)
const web3 = new Web3(provider)

const deploy = async () => {
    const account = await web3.eth.getAccounts().then((accs) => accs[0])
    console.log('attempting to deploy from acc', account);

    const contract = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({ from: account, gas: '1000000' })

    console.log('interface', interface);
    console.log('deployed to address', contract.options.address);
}

deploy()