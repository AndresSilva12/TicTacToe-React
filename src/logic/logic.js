import { winnersCombos } from "../constants"

export const checkWinner = (newTablero) => {
    for (const combo of winnersCombos){
      const [a,b,c] = combo
      if (newTablero[a] && newTablero[a] === newTablero[b] && newTablero[a] === newTablero[c]){
        return newTablero[a]
      }
    }
    return null
  }