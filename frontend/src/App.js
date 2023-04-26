import './App.css';
import React, { useState,useEffect } from 'react'
import web3 from "./web3.js";
import lottery from "./lottery"
import LoadingBar from 'react-top-loading-bar'

function App() {
  // 

  const [manager,setManager] = useState("");
  const [players,setPlayers] = useState([]);
  const [balance,setBalance]=useState("");
  const [ether,setEther]= useState('');
  const [progress,setProgress]= useState(0);
  const [message,setMessage]= useState("");



  const getManager=async()=>{
    setManager(await lottery.methods.manager().call());
  }
  const getPlayer=async()=>{
    setPlayers(await lottery.methods.getPlayers().call());
  }
  const getBalance=async()=>{
    setBalance(await web3.eth.getBalance(lottery.options.address));
  }
  useEffect(() => {
    getManager();
    getPlayer();
    getBalance();
  },[])

  const enterLottery= async(event)=>{
    event.preventDefault();
    setProgress(20)
    const acc=await web3.eth.getAccounts();

    setProgress(50)
    setMessage("Wait")

    await lottery.methods.enter()
    .send({from:acc[0],value:web3.utils.toWei(ether,"ether")});

    setMessage("Done ")
    setProgress(100)
    
    getPlayer()
    getBalance()

  }

  const pickWinner= async(event)=>{
    event.preventDefault();
    setProgress(20)
    const acc=await web3.eth.getAccounts();

    setProgress(60)
    setMessage("Wait ")

    await lottery.methods.pickWinner()
    .send({from:acc[0]});
    setMessage("Done ")

    setProgress(100)
    getPlayer()
    getBalance()
    setMessage("Done Done")
  }

  return (
    <div className="App mt-5">
       <LoadingBar
            color='#f11946'
            progress={progress}
            onLoaderFinished={() => setProgress(0)}
        />
      
      <h1>Welcome Blockchain Lottery</h1>
      <h6 className='m-2'>The Manger of Lottery is <span style={{color:"lightblue"}}>{manager}</span></h6>

      <h5 className='mt-5'>Total number of People in lottery {players.length} and current amount of lottery Prize {web3.utils.fromWei(balance,"ether")}ether</h5>

<h6>{message}</h6>

      <div className="container my-5 p-5 w-50">
        <h4>Try Your Luck </h4>
        <small>Minimum amount to enter lottery is <i>0.01 ether</i> </small>

        <form className="form-floating my-3" onSubmit={enterLottery}>
          <input value={ether} className="form-control" id="floatingInputValue" placeholder="No. of Ether" onChange={e=>setEther(e.target.value)} />
          <label htmlFor="floatingInputValue">No. of Ether</label>

          <button className="btn btn-primary mt-5">Enter the Lottery</button>
        </form>

      </div>

      <div className="container my-5 w-50">
        <button className='btn btn-primary mt-5' onClick={pickWinner} >Pick Winner</button>
      </div>

    </div>
  );
}

export default App;
