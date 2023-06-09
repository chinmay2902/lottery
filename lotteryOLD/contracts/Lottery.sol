pragma solidity ^0.4.17;

contract Lottery {
  address public manager;
  address[] public players;

  function Lottery() public  {
    manager=msg.sender;
  }

  function enter() public payable {
      require(msg.value>=0.01 ether);
      players.push(msg.sender);
  }

  function random() private  view returns(uint){
      return uint(keccak256(block.difficulty,now,players));
  }

  modifier adminOnly(){
      require(msg.sender==manager);
      _;
  }

  function pickWinner() public adminOnly {
      require(msg.sender==manager);
      uint winnerIndex = random() % players.length;
      players[winnerIndex].transfer(this.balance);
      players=new address[](0);
  }

  function getPlayers() public view  returns(address[]){
      return players;
  }
}
