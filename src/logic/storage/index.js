export const saveGameToStorage = ({tablero, turn}) => {
    window.localStorage.setItem('board', JSON.stringify(tablero))
    window.localStorage.setItem('turn', JSON.stringify(turn))
}