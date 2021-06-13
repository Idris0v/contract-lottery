import './App.css';
import { Component } from 'react';
import lottery from './lottery';
import web3 from './web3';

class App extends Component {

  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  }

  async componentDidMount() {
    const manager = await lottery.methods.manager().call()
    const players = await lottery.methods.getPlayers().call()
    const balance = await web3.eth.getBalance(lottery.options.address)

    this.setState({ manager, players, balance })
  }

  onSubmit = async (event) => {
    event.preventDefault()

    const accounts = await web3.eth.getAccounts()

    this.setState({ message: 'waiting for the transaction to be completed...' })

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    })
    // const players = await lottery.methods.getPlayers().call()
    // const balance = await web3.eth.getBalance(lottery.options.address)

    // this.setState({ players, balance })
    this.setState({ message: 'You have successfully entered!' })
  }

  pickWinner = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting for the transaction to be completed...' })

    await lottery.methods.pickWinner().send({ from: accounts[0] })

    this.setState({ message: 'You have successfully picked a winner!' })
  }

  render() {
    return (
      <div className="App">
        <h2>Lottery contract</h2>
        <p>manager is {this.state.manager}</p>
        <p> There are currently {this.state.players.length} people entered, competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!</p>
        
        <form onSubmit={this.onSubmit}>
          <h4>Want to try youur luck?</h4>
          <div>
            <label>
              Amount of ether to enter <br />
              <input
                value={this.state.value}
                onChange={event => this.setState({ value: event.target.value })}
              />
            </label>
          </div>
          <button type="submit">Enter</button>
        </form>

        <hr />

        <h4>Ready to pick a winner?</h4>
        <button onClick={this.pickWinner}>Pick a winner!</button>

        <h4>{this.state.message}</h4>
      </div>
    )
  }
}

export default App;
