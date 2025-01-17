import { useState, useEffect } from 'react'
import './App.css'
import { turns, maxMovimientos } from './constants'
import { checkWinner } from './logic/logic'
import confetti from 'canvas-confetti'
import Square from './Components/Mesa'
import { saveGameToStorage } from './logic/storage'

function App() {
  
  const [tablero, setTablero] = useState(() => {
    const tableroFromStorage = window.localStorage.getItem('board')
    return tableroFromStorage ? JSON.parse(tableroFromStorage) : Array(9).fill(null)
  })
  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ? JSON.parse(turnFromStorage) : turns.X
  })
  const [winner, setWinner] = useState()
  const [movimientosX, setMovimientosX] = useState(() => {
    const movimientosXFromStorage = window.localStorage.getItem('movimientosX')
    return movimientosXFromStorage ? JSON.parse(movimientosXFromStorage) : []
  })
  const [movimientosO, setMovimientosO] = useState(() => {
    const movimientosOFromStorage = window.localStorage.getItem('movimientosO')
    return movimientosOFromStorage ? JSON.parse(movimientosOFromStorage) : []
  })

  const newPartida = () => {
    setTurn(turns.X)
    setTablero(Array(9).fill(null))
    setWinner(null)
    setMovimientosO([])
    setMovimientosX([])
    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
    window.localStorage.removeItem('movimientosX')
    window.localStorage.removeItem('movimientosO')
  }
  
  const updateBoard = (position) => {
    const newTablero = [...tablero]

    if (newTablero[position] == null){
      newTablero[position] = turn
      analizarTablero(newTablero,turn,position)
      setTablero(newTablero)
      const newTurn = turn == turns.X ? turns.O : turns.X
      setTurn(newTurn)
      

      const newWinner = checkWinner(newTablero)
      if (newWinner){
        confetti()
        setWinner(newWinner.toUpperCase())
        window.localStorage.removeItem('board')
        window.localStorage.removeItem('turn')
        window.localStorage.removeItem('movimientosX')
        window.localStorage.removeItem('movimientosO')
      }
    }
  }
    
  const analizarTablero = (newTablero, turn, position) => {
    if (turn == turns.X){
      var newMovimientosX = [...movimientosX]
      if (newMovimientosX.length < maxMovimientos){
        newMovimientosX.push(position)
        setMovimientosX(newMovimientosX)
      }
      else{
        newTablero[newMovimientosX[0]] = null
        newMovimientosX[0] = newMovimientosX[1]
        newMovimientosX[1] = newMovimientosX[2]
        newMovimientosX[2] = position
        setMovimientosX(newMovimientosX)
      }
      window.localStorage.setItem('movimientosX', JSON.stringify(newMovimientosX))
    }
    else {
      var newMovimientosO = [...movimientosO]

      if (newMovimientosO.length < maxMovimientos){
        newMovimientosO.push(position)
        setMovimientosO(newMovimientosO)
      }
      else{
        newTablero[newMovimientosO[0]] = null
        newMovimientosO[0] = newMovimientosO[1]
        newMovimientosO[1] = newMovimientosO[2]
        newMovimientosO[2] = position
        setMovimientosO(newMovimientosO)
      }
      window.localStorage.setItem('movimientosO', JSON.stringify(newMovimientosO))
    }
  }

  useEffect(() => {
    saveGameToStorage({
      tablero: tablero,
      turn: turn
    })
  }, [turn, tablero])
  

  return (
    <>
    <div className='board'>

      <div className='game '>
        {tablero.map(( _, index) => (
          <Square
            key={index}
            index={index}
            updateBoard={updateBoard}
          >
            {tablero[index]}
          </Square>
        ))}
      </div>
      <div className='mt-10 flex flex-row justify-center items-center'>
        <Square isSelected={turn == turns.X} >
          {turns.X}
        </Square>
        <button className='flex flex-col items-center border-gray-400 border-2 p-2 text-gray-500 font-semibold text-xl hover:text-gray-700 hover:border-gray-700' onClick={() => {newPartida()}}>Reiniciar Partida</button>
        <Square isSelected={turn == turns.O}>
          {turns.O}
        </Square>

      </div>
      
      {winner && (
        <div className='winner'>
            <div className='text '>
              <h2 className='font-bold text-2xl'>
                Ganó: {winner} !
              </h2>
              <button className='bg-blue-500 text-white font-bold p-2 text-2xl rounded-md hover:bg-blue-700 w-48' onClick={()=> {newPartida()}}>Nueva Partida</button>
            </div>
        </div>
      )}

    </div>
    </>
  )
}

export default App