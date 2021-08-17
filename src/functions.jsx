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
        let moves = [-1, 0, 1]
        for (var a = 0; a < 3; a++) {
            for (var b = 0; b < 3; b++) {
                if (!moves[a] && !moves[b])
                    continue
                if (col + moves[a] >= 0 && col + moves[a] < props.board.length && row + moves[b] >= 0 && row + moves[b] < props.board[0].length && props.boardState[col+moves[a]][row+moves[b]]!==2)
                    openBox(col+moves[a], row+moves[b], props)
            }
        }
    }
    if (props.board[col][row]==='X')
        gameOver(props);
    props.setBoardState(temp)
    props.setA(props.a+1)
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
    props.setBoardState(temp)
    return;
}

export const handleClick = (click, col, row, props) => {
    if (props.boardState[col][row]===0 && click==='l' && props.a===0){
        addMines(col,row,props)
        props.setA(props.a+1)
    }
    switch (props.boardState[col][row]) {
        case 0: click==='l'?openBox(col,row, props):flag(col,row, props);
                break;
        case 1: flag(col,row, props);
                break;
        case 2: openSurrounding(col,row, props);
                break;
        default: return;
    }
    if (!props.boardState[col][row]===0 || !click==='l')
        return;
    let count=0
    for (var i=0; i<props.board.length; i++) 
        for (var j=0; j<props.board[0].length; j++)
            if (props.boardState[i][j]===2)
                count++;
    if (count===(props.board.length*props.board[0].length-props.mines))
        props.setMessage("You won!")
}

export const addMines  = (col, row, props) => {
    let mines=props.mines
    let rows=props.board[0].length
    let columns=props.board.length
    let board=props.board
    console.log(rows, columns, mines)
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
    props.setBoard(board)
}

export function zeros(dimensions) {
    var array = [];
    for (var i = 0; i < dimensions[0]; ++i)
        array.push(dimensions.length ===1 ? 0 : zeros(dimensions.slice(1)));
    return array;
}

export function initialize (rows, cols, setBoard, setBoardState, setMessage,
    setFlagCount, setA, curRows, curCols) {
    rows=rows|| curRows || 10
    cols=cols|| curCols || 10
    setBoard(zeros([cols, rows]))
    setBoardState(zeros([cols, rows]))
    setMessage("")
    setFlagCount(0)
    setA(0)
}
