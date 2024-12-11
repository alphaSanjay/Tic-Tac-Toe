function Cell(){
    let value = ''

    const addToken = (player) => {
        value = player
    }

    const getValue = () => value

    return{
        addToken,getValue
    }
}

const Gameboard = (function(){

    const createBoard = () =>{
        const rows = 3
        const columns = 3
        const board = []

        for(let i = 0; i < rows; i++){
            board[i] = []
            for(let j = 0; j < columns; j++){
                board[i].push(Cell())
            }
        }
        return board
    }

    let gameBoard = createBoard()

    const getBoard = () => gameBoard

    const setBoard = (Gameboard) => gameBoard = Gameboard

    const  dropToken = (row, column, player) =>{
        const availableCell = gameBoard[row][column]

        if(availableCell.getValue() === 'X' || availableCell.getValue() === 'O'){
            throw new Error('Spot already taken')
        }else availableCell.addToken(player)
    }

    const printBoard = () => {
        const boardWithCellValues = gameBoard.map((row) => row.map((cell) => 
            cell.getValue()))
        console.log(boardWithCellValues)
    }

    return{ 
        getBoard,
        setBoard,
        dropToken, 
        printBoard, 
        createBoard
    }
})()


const game = (
    function(
        playerOneName = "Player One",
        playerTwoName = "Player Two"
    ){
    
        const players = [
            {
                name: playerOneName,
                token: 'X'
            },
            {
                name: playerTwoName,
                token: 'O'
            }
        ]
    
        let activePlayer = players[0]
        let endGame = false
        let won = false
        let tied = false
    
        const switchPlayerTurn = () => {
            activePlayer = activePlayer === players[0] ? players[1] : players[0]
        }

        const getActivePlayer = () => activePlayer

        const getWinStatus = () => won

        const getTieStatus = () => tied

        const getPlayers = () => players
    
        const printNewRound = () => {
            Gameboard.printBoard()
            console.log(`${getActivePlayer().name}'s turn.`)
        }

        printNewRound()

        const playRound = (row, column) =>{
            console.log(`Dropping ${getActivePlayer().name}'s token into row ${row} column ${column}...`)
            
            Gameboard.dropToken(row, column, activePlayer.token)
    
            checkWinner()

            if (!endGame) {
                switchPlayerTurn()
                printNewRound()
            }else if (endGame){
                Gameboard.printBoard()
            }
        }
        
        const checkWinner = () =>{
            const boardCheck = Gameboard.getBoard()

            for (let i = 0; i < 3; i++) {  
                const cell1 = boardCheck[0][i].getValue()
                const cell2 = boardCheck[1][i].getValue()
                const cell3 = boardCheck[2][i].getValue()
    
                if (cell1 !== '' && cell1 === cell2 && cell1 === cell3){
                    console.log(`${activePlayer.name} won! Congratulations`)
                    endGame = true
                    won = true
                }
            }
            
    
            for (let i = 0; i < 3; i++) { 
                const cell1 = boardCheck[i][0].getValue()
                const cell2 = boardCheck[i][1].getValue()
                const cell3 = boardCheck[i][2].getValue()
    
                if (cell1 !== '' && cell1 === cell2 && cell1 === cell3){
                   console.log(`${activePlayer.name} won! Congratulations`)
                   endGame = true
                   won = true
                } 
            }

            if ((boardCheck[0][0].getValue() !== '') && (boardCheck[0][0].getValue() === boardCheck[1][1].getValue()) && (boardCheck[0][0].getValue() === boardCheck[2][2].getValue())) {
                console.log(`${activePlayer.name} won! Congratulations`)
                endGame = true
                won = true
            }
    
            if (boardCheck[0][2].getValue() !== '' && boardCheck[0][2].getValue() === boardCheck[1][1].getValue() && boardCheck[0][2].getValue() === boardCheck[2][0].getValue()) {
                console.log(`${activePlayer.name} won! Congratulations`)
                endGame = true
                won = true
            }
            
            let numCells = 0
            const totalCells = 9 

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    const cellValue = boardCheck[i][j].getValue()
                    if (cellValue === 'X' || cellValue === 'O') {
                        numCells++
                    }
                }
            }

            if (numCells === totalCells && !won) {
                console.log(`It's a tie!`)
                endGame = true
                tied = true
            }
        }

        const restart = () => {
            const newBoard = Gameboard.createBoard()

            Gameboard.setBoard(newBoard)
    
            if (endGame){
                endGame = false
                if (won) {
                    won = false
                } else tied = false
            }
            activePlayer = players[0]
        }

        return {
            printNewRound,
            playRound,
            getActivePlayer,
            restart,
            getPlayers,
            getWinStatus,
            getTieStatus
    }
})()

function screenController(){
    const boardDiv = document.querySelector('.board')
    const turnDiv = document.querySelector('.turn')
    const restartBtn = document.querySelector('.restart')
    const form = document.querySelector('#form')
    const inputs = document.querySelectorAll('input')

    let namesObj ={}
    let submittednames = false

    const updateScreen =() => {
        boardDiv.textContent = ''

        const gameBoard = Gameboard.getBoard()
        const activePlayer = game.getActivePlayer()

        let won = game.getWinStatus()
        let tied = game.getTieStatus()
        
        if (won){
            console.log(won);
            turnDiv.textContent = `${activePlayer.name} won! Congratulations`
        } else if (tied){
            turnDiv.textContent = `It's a tie!`
        } else if (!won && !tied){
            turnDiv.textContent = `It is ${activePlayer.name}'s turn`
        }

        gameBoard.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellBtn = document.createElement('button')

                cellBtn.classList.add('cell')
                cellBtn.textContent = cell.getValue()
                cellBtn.dataset.row = rowIndex
                cellBtn.dataset.column = colIndex


                boardDiv.appendChild(cellBtn)
            }) 
        });
    }

    updateScreen()

    const clickHandler = (e) => {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;

        if (!selectedColumn && !selectedRow){
            return;
        } else {
            game.playRound(parseInt(selectedRow), parseInt(selectedColumn));
            updateScreen();
        }
        
    };

    form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    namesObj = Object.fromEntries(formData);

    // Change Player names

    const players = game.getPlayers();

    console.log(players);

    players[0].name = namesObj.player1;
    players[1].name = namesObj.player2;
    
    game.restart();
    updateScreen();
    game.printNewRound();


    for (let input of inputs) {
        input.value = '';   
    };
    console.table(namesObj);
    });

    boardDiv.addEventListener('click', clickHandler);
    restartBtn.addEventListener('click', () => {
        game.restart();
        updateScreen();
        game.printNewRound();
    });
}

screenController()
