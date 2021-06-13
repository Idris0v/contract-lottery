const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')

const { interface, bytecode } = require('../compiler')

const web3 = new Web3(ganache.provider())

let lottery;
let accounts;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({ from: accounts[0], gas: '1000000' })
})

describe('Lottery contract', () => {

    it('deploys a contract', () => {
        assert.ok(lottery.options.address)
    })

    it('allows one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.011', 'ether')
        });
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        assert.strictEqual(players.length, 1)
        assert.strictEqual(players[0], accounts[0])
    })

    it('allows one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.011', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.011', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.011', 'ether')
        });
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        assert.strictEqual(players.length, 3)
        
        assert.strictEqual(players[0], accounts[0])
        assert.strictEqual(players[1], accounts[1])
        assert.strictEqual(players[2], accounts[2])
    })

    it('requires a minimum ether to enter', async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: web3.utils.toWei('0.01', 'ether')
            });
            assert(false)
        } catch (error) {
            assert(error)
        }
    })

    it('only manager can call pickWinner', async () => {
        try {
            await lottery.methods.pickWinner().send({ from: accounts[1] })
            assert(false)
        } catch (error) {
            assert(error)
        }
    })

    it('sends ether to a winner', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('1', 'ether')
        });
        const initialBalance = await web3.eth.getBalance(accounts[0])
        await lottery.methods.pickWinner().send({ from: accounts[0] })
        const finalBalance = await web3.eth.getBalance(accounts[0])

        const difference = finalBalance - initialBalance
        assert(difference > web3.utils.toWei('0.9', 'ether'))
    })
})