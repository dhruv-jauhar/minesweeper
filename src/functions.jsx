export const openSurrounding = (col, row, props) => {
    let moves = [-1, 0, 1]
    let count=0
    for (var a = 0; a < 3; a++) {
        for (var b = 0; b < 3; b++) {
            if (col + moves[a] >= 0 && col + moves[a] < props.board.length && row + moves[b] >= 0 && row + moves[b] < props.board[0].length && props.boardState[col+moves[a]][row+moves[b]]===1)
                count++;
        }
    }
    if (count===props.board[col][row])
    for (a = 0; a < 3; a++) {
        for (b = 0; b < 3; b++) {
            if (col + moves[a] >= 0 && col + moves[a] < props.board.length && row + moves[b] >= 0 && row + moves[b] < props.board[0].length && props.boardState[col+moves[a]][row+moves[b]]===0)
                openBox(col+moves[a], row+moves[b], props)
        }
    }
}

export const gameOver = (props) => {
    props.setMessage("You lose!")
    props.setRunTime(false)
    let temp=props.boardState;
    for (var i=0; i<props.board.length; i++) 
        for (var j=0; j<props.board[0].length; j++)
            if (props.board[i][j]==='X')
                temp[i][j]=2
    props.setBoardState(temp)     
}

export const openBox = (col, row, props) => {
    let temp=props.boardState;
    temp[col][row]=2
    if (props.board[col][row]===0) {
        openSurrounding(col,row,props)
    }
    let temp1=props.hintState
    temp1[col][row]=0
    props.setHintState(temp1)
    if (props.board[col][row]==='X')
        gameOver(props);
    props.setBoardState(temp)
    let count=0
    for (var i=0; i<props.board.length; i++) 
        for (var j=0; j<props.board[0].length; j++)
            if (temp[i][j]===2)
                count++;
    if (count===(props.board.length*props.board[0].length-props.mines)) {
        props.setMessage(`You won!\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0Grid: ${props.board.length}x${props.board.length}\xa0\xa0\xa0\xa0\xa0\xa0Mines: ${props.mines}\xa0\xa0\xa0\xa0\xa0\xa0Time: ${props.time.toFixed(1)}s\xa0\xa0\xa0\xa0\xa0\xa0Hints: 0`);
        props.setRunTime(false)
    }
}

export const flag = (col, row, props) => {
    let temp=props.boardState;
    if (temp[col][row]===0) {
        if (props.flagCount===props.mines)
            return;
        temp[col][row]=1;
        props.setFlagCount(props.flagCount+1)
    }
    else {
        temp[col][row]=0;
        props.setFlagCount(props.flagCount-1)
    }
    let temp1=props.hintState
    temp1[col][row]=0
    props.setHintState(temp1)
    props.setBoardState(temp)
}

export const handleClick = (click, col, row, props) => {
    if (props.boardState[col][row]===0 && click==='l' && props.runTime===false && props.time===0){
        addMines(col,row,props)
        return
    }
    if (props.message.length)
        return
    switch (props.boardState[col][row]) {
        case 0: click==='l'?openBox(col,row, props):flag(col,row, props);
                break;
        case 1: flag(col,row, props);
                break;
        case 2: openSurrounding(col,row, props);
                break;
        default: return;
    }
}

export const addMines  = (col, row, props) => {
    let mines=props.mines
    let rows=props.board[0].length
    let columns=props.board.length
    let board
    do {
        board=zeros([columns, rows])
        for (var i = 0; i < Math.min(mines, rows*columns); i++) {
            let bomb = Math.floor(Math.random() * columns * rows)
            while (board[bomb % columns][Math.floor(bomb / columns)] === "X" || (Math.abs((bomb % columns)-col)<2 && Math.abs((Math.floor(bomb / columns))-row)<2) )
                bomb = Math.floor(Math.random() * columns * rows)
            board[bomb % columns][Math.floor(bomb / columns)] = "X"
        }
        for (i = 0; i < columns; i++) {
            for (var j = 0; j < rows; j++) {
                if (board[i][j] === "X")
                    continue;
                let moves = [-1, 0, 1]
                for (var a = 0; a < 3; a++) {
                    for (var b = 0; b < 3; b++) {
                        if (i + moves[a] >= 0 && i + moves[a] < columns && j + moves[b] >= 0 && j + moves[b] < rows &&
                            board[i + moves[a]][j + moves[b]] === "X")
                            board[i][j]++
                    }
                }
            }
        }
    } while(!isSolvable(col, row, props, board))
    let boardState=props.boardState
    tempOpen(boardState, col, row, board)
    props.setBoardState(boardState)
    props.setBoard(board)
    props.setRunTime(true)
}

export function tempOpen(boardState, col, row, board) {
    boardState[col][row]=2;
    if (board[col][row]===0) {
        let moves = [-1, 0, 1]
        for (var a = 0; a < 3; a++) {
            for (var b = 0; b < 3; b++) {
                if (col + moves[a] >= 0 && col + moves[a] < board.length && row + moves[b] >= 0 && row + moves[b] < board[0].length && boardState[col+moves[a]][row+moves[b]]===0)
                    tempOpen(boardState, col+moves[a], row+moves[b], board)
            }
        }
    }
}

export function isSolvable(col, row, props, board) {
    let boardState=zeros([props.board.length, props.board[0].length])
    tempOpen(boardState, col, row, board)
    while(1) {
        let flag=0;
        for (var col=0; col<props.board.length; col++) {
            for (var row=0; row<props.board[0].length; row++) {
                if (boardState[col][row]===2) {
                    let moves = [-1, 0, 1]
                    let flagged=0
                    let closed=0;
                    for (var a = 0; a < 3; a++) {
                        for (var b = 0; b < 3; b++) {
                            if (col + moves[a] >= 0 && col + moves[a] < props.board.length && row + moves[b] >= 0 && row + moves[b] < props.board[0].length) {
                                if (boardState[col+moves[a]][row+moves[b]]===1) flagged++;
                                if (boardState[col+moves[a]][row+moves[b]]===0) closed++;
                            }                            
                        }
                    }
                    if (flagged===board[col][row]){
                    for (a = 0; a < 3; a++) {
                        for (b = 0; b < 3; b++) {
                            if (col + moves[a] >= 0 && col + moves[a] < props.board.length && row + moves[b] >= 0 && row + moves[b] < props.board[0].length && boardState[col+moves[a]][row+moves[b]]===0)
                                {boardState[col+moves[a]][row+moves[b]]=2;flag=1}
                        }
                    }
                    }
                    if (closed===board[col][row]-flagged && closed>0){
                    for (a = 0; a < 3; a++) {
                        for (b = 0; b < 3; b++) {
                            if (col + moves[a] >= 0 && col + moves[a] < props.board.length && row + moves[b] >= 0 && row + moves[b] < props.board[0].length && boardState[col+moves[a]][row+moves[b]]===0)
                                {boardState[col+moves[a]][row+moves[b]]=1;flag=1}
                        }
                    }
                    }
                }
            }
        }
        let count=0;
        for (var col=0; col<props.board.length; col++) {
            for (var row=0; row<props.board[0].length; row++) {
                if (boardState[col][row]===1)
                    count++;
            }
        }
        if (count===props.mines && props.message.length===0) {
            for (var col=0; col<props.board.length; col++) {
                for (var row=0; row<props.board[0].length; row++) {
                    if (boardState[col][row]===0)
                        {boardState[col][row]=2;flag=1}
                }
            }
        }
        if (flag===0)
            break;
    }
    let count=0
    for (var i=0; i<props.board.length; i++) 
        for (var j=0; j<props.board[0].length; j++)
            if (boardState[i][j]===2)
                count++;
    if (count===(props.board.length*props.board[0].length-props.mines))
        return true;
    else
        return false;
}

export function zeros(dimensions) {
    var array = [];
    for (var i = 0; i < dimensions[0]; ++i)
        array.push(dimensions.length ===1 ? 0 : zeros(dimensions.slice(1)));
    return array;
}

export function initialize (rows, cols, props) {
    rows=rows|| props.rows || 10
    cols=cols|| props.cols || 10
    props.setBoard(zeros([cols, rows]))
    props.setBoardState(zeros([cols, rows]))
    props.setHintState(zeros([cols, rows]))
    props.setMessage("")
    props.setFlagCount(0)
    props.setRunTime(false)
    setTimeout(()=> props.setTime(0), 150)
}

export function hint (props) {
    if (props.time===0)
        return;
    let flag=0;
    let temp=props.hintState;
    for (var i=0; i<props.board.length; i++) {
        for (var j=0; j<props.board[0].length; j++) {
            if (props.boardState[i][j]===1 && props.board[i][j]!='X') {
                temp[i][j]=2;
                flag=1;
            }
        }
    }
    if (flag)
        return;
    for (var col=0; col<props.board.length; col++) {
        for (var row=0; row<props.board[0].length; row++) {
            if (props.boardState[col][row]===2) {
                let moves = [-1, 0, 1]
                let flagged=0
                let closed=0;
                for (var a = 0; a < 3; a++) {
                    for (var b = 0; b < 3; b++) {
                        if (col + moves[a] >= 0 && col + moves[a] < props.board.length && row + moves[b] >= 0 && row + moves[b] < props.board[0].length) {
                            if (props.boardState[col+moves[a]][row+moves[b]]===1) flagged++;
                            if (props.boardState[col+moves[a]][row+moves[b]]===0) closed++;
                        }                            
                    }
                }
                if (flagged===props.board[col][row])
                for (a = 0; a < 3; a++) {
                    for (b = 0; b < 3; b++) {
                        if (col + moves[a] >= 0 && col + moves[a] < props.board.length && row + moves[b] >= 0 && row + moves[b] < props.board[0].length && props.boardState[col+moves[a]][row+moves[b]]===0)
                            temp[col+moves[a]][row+moves[b]]=1;
                    }
                }
                if (closed===props.board[col][row]-flagged && closed>0)
                for (a = 0; a < 3; a++) {
                    for (b = 0; b < 3; b++) {
                        if (col + moves[a] >= 0 && col + moves[a] < props.board.length && row + moves[b] >= 0 && row + moves[b] < props.board[0].length && props.boardState[col+moves[a]][row+moves[b]]===0)
                            temp[col+moves[a]][row+moves[b]]=2;
                    }
                }
            }
        }
    }
    let count=0;
    for (var col=0; col<props.board.length; col++) {
        for (var row=0; row<props.board[0].length; row++) {
            if (props.boardState[col][row]===1)
                count++;
        }
    }
    if (count===props.mines && props.message.length===0) {
        for (var col=0; col<props.board.length; col++) {
            for (var row=0; row<props.board[0].length; row++) {
                if (props.boardState[col][row]===0)
                    temp[col][row]=1;
            }
        }
    }
    //if temp=hintState, run AI. separate function
    props.setHintState(temp)
}

export function solve (props) {
    hint (props)
    setTimeout(()=>{
        let chk=0;
        for (var col=0; col<props.board.length; col++) {
            for (var row=0; row<props.board[0].length; row++) {
                if (props.hintState[col][row]!==0)
                    chk=1;
                if (props.hintState[col][row]===1)
                    openBox(col, row, props)
                if (props.hintState[col][row]===2)
                    flag(col, row, props)
            }
        }
        if (chk===1)
            setTimeout(()=>
            solve(props)
            , 1000)
    }, 1000)
}