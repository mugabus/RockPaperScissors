// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";



const RockPaperScissorsModule = buildModule("RockPaperScissorsModule", (m) => {
 

  const rockPaperScissors = m.contract("RockPaperScissors", [], {
    
  });

  return { rockPaperScissors };
});

export default RockPaperScissorsModule;
