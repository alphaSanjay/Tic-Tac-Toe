
function Gameboard(){
    const rows = 3
    const columns = 3
    const board = []

    for(let i = 0; i < rows; i++){
        board[i] = []
        for(let j = 0; j < columns; j++){
            board[i].push(Cell())
        }
    }

    const getBoard = () => board
    const  dropToken = (row, column, player) =>{
        const availableCell = board[row][column]

        if(availableCell.getValue() === 'X' || availableCell.getValue() === 'O'){
            throw new Error('Spot already taken')
        }else availableCell.addToken(player)
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => 
            cell.getValue()))
        console.log(boardWithCellValues)
    }

    return{ getBoard, dropToken, printBoard}
}

function Cell(){
    let value = 0

    const addToken = (player) => {
        value = player
    }

    const getValue = () => value

    return{
        addToken,getValue
    }
}

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
){
    const board = Gameboard()

    const players = [
        {
            name: playerOneName,
            token: 1
        },
        {
            name: playerTwoName,
            token: 2
        }
    ]

    let activePlayer = players[0]

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0]
    }
    const getActivePlayer = () => activePlayer

    const printNewRound = () => {
        board.printBoard()
        console.log(`${getActivePlayer().name}'s turn.`)
    }

    const playRound = (row, column) =>{
        console.log(`Droppind ${getActivePlayer().name}'s token into 
        row ${row} column ${column}...`)
        board.dropToken(row,column,getActivePlayer().token)

        switchPlayerTurn()
        printNewRound()
    
    }
    printNewRound()

    return(
        playRound,getActivePlayer
    )
}

const game = GameController()
game.switchPlayerTurn
game.printBoard
