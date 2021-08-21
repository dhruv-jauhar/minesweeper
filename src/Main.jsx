import './index.css';
import React from "react"
import { initialize, handleClick } from './functions';

const NewGame = (props) => {
    return <div className="settings">
        {!!props.board.length && <button onClick={()=> props.setShowNewGameSettings(false)}>Back</button>}
        <input type="text" autoFocus id="rowno" placeholder="Enter rows" autoComplete="off"/>
        <input type="text" id="colno" placeholder="Enter columns" autoComplete="off"/>
        <input type="text" id="bombno" placeholder="Enter mines" autoComplete="off"/>
        <button onClick={() => {
            let row=document.getElementById("rowno").value
            let mines=document.getElementById("bombno").value
            let cols=document.getElementById("colno").value
            row.length? row=parseInt(row): row=0
            cols.length? cols=parseInt(cols): cols=0
            mines.length? mines=parseInt(mines): mines=0
            props.setRows(row || props.rows || 10)
            props.setMines(mines || props.mines || 15)
            props.setCols(cols || props.cols || 10)
            initialize(row, cols, props)
            props.setShowNewGameSettings(false)
        }}>
            Start
        </button>
    </div>
}

// on top: hint, timer, grid size, flag count (on win change to "You won! Grid size, mines, time, hints used.")
// bottom: reset, toggle, new game, About

const Menu = (props) => {
    return <div className="settings">
        <button onClick={()=> initialize(props.rows, props.cols, props)}>
            Reset
        </button>
        <button onClick={()=> props.setDoesClickOpen(!props.doesClickOpen)}>
            <div className={`${props.doesClickOpen}`}>
                &#128128;
            </div>
            <div className={`${!props.doesClickOpen}`}>
                &#128681;
            </div>
        </button>
        <div className="count">{props.message.length? props.message: <>&#128681;&#8199;&#8199;{props.flagCount}&#8199;/&#8199;{props.mines}</>} </div>
        <button>Hint</button>
        <button onClick={()=> props.setShowNewGameSettings(true)}>New Game</button>
    </div>
}


const Gameboard = (props) => {
    React.useEffect(() =>
    [...document.querySelectorAll(".tile")].forEach(
        el => el.addEventListener('contextmenu', e => {
            e.preventDefault();
            return false
        }, false)
    ))
    return <div className="gameboard">
        {props.board.map((row, colNo) => {
            return <div className="row">
                {row.map((tile, rowNo) => {
                    return <div 
                        className={
                            props.boardState[colNo][rowNo]===2
                            ? `a${props.board[colNo][rowNo]}`
                            : "tile"
                        }
                        onClick={()=>handleClick(props.doesClickOpen?'l':'r', colNo, rowNo, props)}
                        onContextMenu={()=>{
                            handleClick(props.doesClickOpen?'r':'l', colNo, rowNo, props);
                            return false;
                        }}
                        >
                        {
                            props.boardState[colNo][rowNo]===2
                            ? (tile==="X"? <>&#128128;</>: tile)
                            : (props.boardState[colNo][rowNo]===1 && <>&#128681;</>)
                        }
                    </div>
                })}
            </div>
        })}
    </div>
}

const Main = () => {
    const [time, setTime] = React.useState(0)
    const [rows, setRows] = React.useState(0)
    const [cols, setCols] = React.useState(0)
    const [mines, setMines] = React.useState(0)
    const [board, setBoard] = React.useState([])
    const [runTime, setRunTime] = React.useState(false)
    const [message, setMessage] = React.useState("")
    const [flagCount, setFlagCount] = React.useState(0)
    const [boardState, setBoardState] = React.useState([])
    const [doesClickOpen, setDoesClickOpen] = React.useState(true)
    const [showNewGameSettings, setShowNewGameSettings] = React.useState(true)

    document.addEventListener('visibilitychange', function() {
        if(document.hidden) {
            setRunTime(false)
        }
        else {
            setRunTime(true)
        }
    });

    React.useEffect(() => { 
        let interval = null;
        if (runTime) {
            interval = setInterval(() => {
                setTime((time) => time + 0.1);
        }, 100);
        }
        else {
            clearInterval(interval);
          }
          return () => {
            clearInterval(interval);
          };
      }, [runTime]);

    return <div className="screen">
        {showNewGameSettings
        ?   <NewGame
            rows={rows}
            cols={cols}
            mines={mines}    
            board={board}
            setRows={setRows}
            setCols={setCols}
            setTime={setTime}
            setMines={setMines}
            setBoard={setBoard}
            setRunTime={setRunTime}
            setMessage={setMessage}
            setFlagCount={setFlagCount}
            setBoardState={setBoardState}
            setShowNewGameSettings={setShowNewGameSettings}
            />

        :   <Menu       
            rows={rows}
            cols={cols}
            mines={mines}
            board={board}
            setTime={setTime}
            message={message}
            setBoard={setBoard}
            flagCount={flagCount}
            setRunTime={setRunTime}
            setMessage={setMessage}
            setFlagCount={setFlagCount}
            doesClickOpen={doesClickOpen}
            setBoardState={setBoardState}
            setDoesClickOpen={setDoesClickOpen}
            setShowNewGameSettings={setShowNewGameSettings}
            />
        }
        <Gameboard
            mines={mines}
            board={board}
            runTime={runTime}
            message={message}
            setBoard={setBoard}
            flagCount={flagCount}
            setRunTime={setRunTime}
            boardState={boardState}
            setMessage={setMessage}
            setFlagCount={setFlagCount}
            setBoardState={setBoardState}
            doesClickOpen={doesClickOpen}
        />
        <div className="count">&#9201;&#8199;&#8199;&#8199;&#8199;&#8199;{time.toFixed(1)}</div>
    </div>
}

export default Main
