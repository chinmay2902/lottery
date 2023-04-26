const assert=require("assert")
const ganache=require("ganache-cli")
const {interface, bytecode}=require("../compile")
const Web3=require("web3")
const { isTypedArray } = require("util/types")

const web3=new Web3(ganache.provider())

let lottery;
let acc;

beforeEach(async()=>{
    acc= await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data:bytecode})
    .send({from:acc[0],gas:"1000000"})
})

describe("Testing of Lottery",()=>{
    it("Testing Deploy",()=>{
        assert.ok(lottery.options.address);
    });

    it("Check single entry in Enter", async ()=>{
        await lottery.methods.enter()
        .send({
            from :acc[0],
            value:web3.utils.toWei('0.02','ether')
        })
        const players=await lottery.methods.getPlayers().call({from :acc[0]})

        assert.equal(acc[0],players[0])
        assert.equal(1,players.length)
    })
    it("Check multiple entry in Enter", async ()=>{
        await lottery.methods.enter()
        .send({
            from :acc[0],
            value:web3.utils.toWei('0.02','ether')
        })
        await lottery.methods.enter()
        .send({
            from :acc[1],
            value:web3.utils.toWei('0.02','ether')
        })
        await lottery.methods.enter()
        .send({
            from :acc[2],
            value:web3.utils.toWei('0.02','ether')
        })
        const players=await lottery.methods.getPlayers().call({from :acc[0]})

        assert.equal(acc[0],players[0])
        assert.equal(acc[1],players[1])
        assert.equal(acc[2],players[2])

        assert.equal(3,players.length)
    })

    it("Check Ether",async()=>{
        try{
            await lottery.methods.enter()
            .send({from:acc[0],value:"1000"})
            assert(false)
        }catch(err){
            assert(err)
        }
        
    })

    it("Check onlyAdmin",async()=>{
        try{
            await lottery.methods.pickWinner()
            .send({from:acc[2]})
            assert(false)
        }catch(err){
            assert(err)
        }
    })

    it("Check money send to Winner",async()=>{
        await lottery.methods.enter()
        .send({from:acc[0],value:web3.utils.toWei("2","ether")})

        // await lottery.methods.enter()
        // .send({from:acc[1],value:web3.utils.toWei("0.2","ether")})

        // await lottery.methods.enter()
        // .send({from:acc[2],value:web3.utils.toWei("0.2","ether")})
        const initalBal=await web3.eth.getBalance(acc[0])

        await lottery.methods.pickWinner()
        .send({from:acc[0]})

        const  presentBal=await web3.eth.getBalance(acc[0])

        assert(presentBal-initalBal>web3.utils.toWei("1.8","ether"))

        const players=await lottery.methods.getPlayers().call({from:acc[0]})


        assert.equal(0,players.length)
    })
    
})