import './index.css';
import React from "react"
import { initialize, handleClick, hint, solve, transposeAll } from './functions';

const NewGame = React.memo((props) => {
    const [showCustom, setShowCustom] = React.useState(true)

    const setValues = (rows,cols,mines) => {
        props.setRows(rows)
        props.setCols(cols)
        props.setMines(mines)
        initialize(rows, cols, props)
    }
    return <div className="settings">
        {!!props.board.length && <button className="red" onClick={()=> props.setShowNewGameSettings(false)}>Back</button>}
        <button onClick={()=>setShowCustom(!showCustom)}>{showCustom?"Presets":"Custom"}</button>
        {showCustom?
        <React.Fragment>
            <input type="text" autoFocus id="rowno" placeholder="Enter rows" autoComplete="off"/>
            <input type="text" id="colno" placeholder="Enter columns" autoComplete="off"/>
            <input type="text" id="bombno" placeholder="Enter mines" autoComplete="off"/> 
            <button className="green" onClick={() => {
            let row=document.getElementById("rowno").value
            let mines=document.getElementById("bombno").value
            let cols=document.getElementById("colno").value
            if (row>32 || cols>32) {
                window.alert("Please limit rows and columns to 32")
                return;
            }
            if (2.5*mines>row*cols) {
                window.alert("Please limit mines to 40% of the board")
                return;
            }
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
        </React.Fragment>
        : <React.Fragment>
            <button onClick={()=> {
                setShowCustom(true);
                props.setShowNewGameSettings(false)
                setValues(8,8,10)
            }}>Easy - 8x8, 10</button>
            <button onClick={()=> {
                setShowCustom(!showCustom);
                props.setShowNewGameSettings(false)
                setValues(16,16,40)
            }}>Medium - 16x16, 40</button>
            <button onClick={()=> {
                setShowCustom(!showCustom);
                props.setShowNewGameSettings(false)
                setValues(30,16,99)
            }}>Hard - 30x16, 99</button>
            <button onClick={()=> {
                setShowCustom(!showCustom);
                props.setShowNewGameSettings(false)
                setValues(30,24,200)
            }}>Expert - 30x24, 200</button>
        </React.Fragment>
        }  
    </div>
})

const Menu = React.memo((props) => {
    return <div className="settings">
        <button className="red" onClick={()=> initialize(props.rows, props.cols, props)}>
            {`Reset - ${props.rows}x${props.cols}`}
        </button>
        {props.message.length?
        <div className="result">{props.message}</div>
        : <React.Fragment>
            <button onClick={()=> props.setDoesClickOpen(!props.doesClickOpen)}>
            <div className={`${props.doesClickOpen}`}>
                &#128128;
            </div>
            <div className={`${!props.doesClickOpen}`}>
                &#128681;
            </div>
            </button>
            <div className="count">{<>&#128681;&#8199;&#8199;{props.flagCount}&#8199;/&#8199;{props.mines}</>}</div>
            <div className="count">&#9201;&#8199;&#8199;&#8199;&#8199;&#8199;{props.time.toFixed(1)}</div>
            <button onClick={()=> hint(props)}>Hint</button>
            {/* <button onClick={()=> solve(props)}>Solve</button> */}
        </React.Fragment>}
        <button className="green" onClick={()=> props.setShowNewGameSettings(true)}>New Game</button>
    </div>
})


const Gameboard = React.memo((props) => {
    React.useEffect(() =>
    [...document.querySelectorAll(".tile")].forEach(
        el => el.addEventListener('contextmenu', e => {
            e.preventDefault();
            return false
        }, false)
    ))
    return <div className="gameboard">
        {props.board.map((row, colNo) => {
            return <div className="row" key={colNo}>
                {row.map((tile, rowNo) => {
                    return <div key={rowNo}
                        className={
                            props.boardState[colNo][rowNo]===2
                            ? `a${props.board[colNo][rowNo]}`
                            : (props.hintState[colNo][rowNo]===0)
                                ? "tile"
                                : `b${props.hintState[colNo][rowNo]}`
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
})

const Main = () => {
    const [time, setTime] = React.useState(0)
    const [rows, setRows] = React.useState(0)
    const [cols, setCols] = React.useState(0)
    const [mines, setMines] = React.useState(0)
    const [board, setBoard] = React.useState([])
    const [runTime, setRunTime] = React.useState(false)
    const [message, setMessage] = React.useState("")
    const [flagCount, setFlagCount] = React.useState(0)
    const [hintState, setHintState] = React.useState([])
    const [hintCount, setHintCount] = React.useState(0)
    const [boardState, setBoardState] = React.useState([])
    const [isHovering, setIsHovering] = React.useState(false)
    const [doesClickOpen, setDoesClickOpen] = React.useState(true)
    const [showNewGameSettings, setShowNewGameSettings] = React.useState(true)

    document.addEventListener('visibilitychange', function() {
        if(document.hidden) {
            setRunTime(false)
        }
        else {
            setRunTime(!!(time>0 && message.length===0))
        }
    });

    React.useEffect(() => { 
        let interval = null;
        if (runTime) {
            interval = setInterval(() => {
                setTime((time) => time + 0.1);
            }, 100);
        }
        else {clearInterval(interval)}
        return () => {clearInterval(interval)};
      }, [runTime]);

      React.useEffect(()=>{
        if (message.length)
            setShowNewGameSettings(false)
      }, [message])

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
            hintCount={hintCount}
            setBoard={setBoard}
            setRunTime={setRunTime}
            setMessage={setMessage}
            setFlagCount={setFlagCount}
            setHintCount={setHintCount}
            setHintState={setHintState}
            setBoardState={setBoardState}
            setShowNewGameSettings={setShowNewGameSettings}
            />

        :   <Menu       
            rows={rows}
            cols={cols}
            time={time}
            mines={mines}
            board={board}
            setTime={setTime}
            message={message}
            setBoard={setBoard}
            flagCount={flagCount}
            hintState={hintState}
            boardState={boardState}
            setRunTime={setRunTime}
            hintCount={hintCount}
            setMessage={setMessage}
            setFlagCount={setFlagCount}
            doesClickOpen={doesClickOpen}
            setHintCount={setHintCount}
            setHintState={setHintState}
            setBoardState={setBoardState}
            setDoesClickOpen={setDoesClickOpen}
            setShowNewGameSettings={setShowNewGameSettings}
            />
        }
        <Gameboard
            time={time}
            mines={mines}
            board={board}
            runTime={runTime}
            message={message}
            hintCount={hintCount}
            setBoard={setBoard}
            flagCount={flagCount}
            hintState={hintState}
            setRunTime={setRunTime}
            boardState={boardState}
            setMessage={setMessage}
            setHintCount={setHintCount}
            setFlagCount={setFlagCount}
            setHintState={setHintState}
            setBoardState={setBoardState}
            doesClickOpen={doesClickOpen}
        />
        {isHovering && <div className="moreinfo">
            Using Artificial Intelligence, this game creates a random board that is guaranteed to be solvable.
            Never lose a game because of a 50-50 guess!<br/><br/>
            You can customize the game dimensions to your liking or use the international standard presets.
            The default is 10x10 with 15 mines. Remember: if you add too many mines, the AI might not find a solvable board.<br/><br/>
            Left click to open a box or right click to flag it. You may toggle this by clicking on the button on top.<br/><br/>
            Clicking on an open box will open all surrounding boxes if all the mines of the original box have been flagged.<br/><br/>
            The hint button will let you know if you've wrongly flagged any box, and if there's any unopened box that can be deduced to be either safe or have a mine.
            <br/><br/> On the bottom right, you can change the board from vertical to horizontal based on your orientation.

        </div>}
        <button className="info" onMouseOver={()=>setIsHovering(true)} onMouseLeave={()=>setIsHovering(false)}>&#9432;</button>
        <button className="transpose" onClick={()=>board.length && transposeAll(board, setBoard, boardState, setBoardState, rows, setRows, cols, setCols, hintState, setHintState)}>&#8634;</button>
    </div>
}

export default React.memo(Main)
