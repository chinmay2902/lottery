const HDWalletProvider=require("truffle-hdwallet-provider");
const {interface,bytecode}=require("./compile")
const Web3=require("web3");

const provider=new HDWalletProvider(
    "play arm produce wolf thank unit scatter snap random oval sail breeze",
    "https://goerli.infura.io/v3/0923d9bdc8c1414eb8b2e75e626e7d4c"
)
const web3=new Web3(provider)

deploy=async ()=>{
    const acc=await web3.eth.getAccounts();
    console.log("Deployed by account ",acc[0]);

    const result=await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data:bytecode})
    .send({from:acc[0],gas:"1000000"})

    console.log("Interface:")
    console.log(interface)
    console.log("Address of Contract Deployed is ",result.options.address)
}
deploy()