import React from "react";
import './App.css';
export default class App extends React.Component{
  state = { //set the default values of the game
    rows: 6, 
    columns: 7,
    moves:[],
    playerTurn: "red",
  };

  resetBoard= () => { //reset board once game is done
    this.setState({ moves: [], winner: null});
  }

  getPiece=(x,y) => { //get the pieces to set later on which player they belong to
    const list = this.state.moves.filter((item) => {
      return (item.x === x && item.y === y);
    })
    return list[0];
  }

  getWinningMovesForVelocity = (xPos, yPos, xVelocity, yVelocity) => { //function allows for checking of diagnal, horizontal and vertical win using vectors
    const winningMoves = [{x: xPos, y: yPos}];
    const player = this.getPiece(xPos, yPos).player;



    for (let delta = 1; delta<=3; delta+=1){//checking for anything positive (+ve x piece, +ve y piece or +ve x and y (diagonal))
      const checkX = xPos+xVelocity*delta;
      const checkY = yPos+yVelocity*delta;

      const checkPiece =this.getPiece(checkX,checkY);
      if (checkPiece && checkPiece.player === player) { //piece to winngMoves for that player to later check if there's 4 together
        winningMoves.push({x: checkX,y: checkY});
      }else{
        break;
      }
    }

    for (let delta = -1; delta>=-3; delta-=1){//checking for anything positive (-ve x piece, -ve y piece or -ve x and y (diagonal))
      const checkX = xPos+xVelocity*delta;
      const checkY = yPos+yVelocity*delta;

      const checkPiece =this.getPiece(checkX,checkY);
      if (checkPiece && checkPiece.player === player) {
        winningMoves.push({x: checkX,y: checkY});
      }else{
        break;
      }
    }

    return winningMoves;

  }

  checkForWin = (x,y) => {//function for checxking every time a piece is dropped to see if there's a winner
    const velocities=[{x:1,y:0}, {x:0,y:1}, {x:-1,y:1}, {x:1,y:1}];
    for (let i = 0; i < velocities.length; i++) {
      const element = velocities[i];
      const winningMoves = this.getWinningMovesForVelocity(x,y,element.x,element.y);
      if(winningMoves.length>3){
        this.setState({winner: this.getPiece(x,y).player, winningMoves});//set winner either red or yellow
      }else if(this.state.moves.length>=42){//if no one wins, set winner to no one
        this.setState({winner: "No One"});
      }
      
    }


  }

  addMove = (x) => {//function for switching player turn every round and adding buttons to the board
    const {playerTurn} = this.state;
    const nextPlayerTurn = playerTurn === 'red' ? 'yellow' : 'red';
    let availableYPosition = null;
    for (let position = this.state.rows-1; position >=0; position--) {
      if(!this.getPiece(x,position)){
        availableYPosition=position;
        break;
      }
    }
    if(availableYPosition!=null){
      this.setState({ moves: this.state.moves.concat({x, y: availableYPosition, player: playerTurn}), playerTurn: nextPlayerTurn}, () => this.checkForWin(x,availableYPosition,playerTurn));
    }
  }

  renderBoard() {//render the connect4 board
    const {winner}= this.state;
    const rowViews =[];
    for (let row =0; row< this.state.rows; row += 1) {
      const columnViews = [];
      for (let column =0; column< this.state.columns; column += 1){
        const piece = this.getPiece(column, row);
        columnViews.push(//everytime pointer is clicked in a certain column, add button the the bootom most position
          <div onClick={() => {this.addMove(column, row)}} style={{ width: "7vw", height: "7vw", backgroundColor: 'lightblue', display: "flex", padding: 5, cursor: "pointer"}}>
            <div style={{ borderRadius: "50%", backgroundColor: 'white', flex: 1, padding: 3, display: "flex"}}>
              {piece ? <div style={{backgroundColor: piece.player, flex: 1, borderRadius: '50%', border: "1px solid #000"}} /> : undefined}
            </div>
          </div>
        );
      }
      rowViews.push(
        <div style={{ display: 'flex', flexDirection: 'row'}}>{columnViews}</div>
      );
    }
      return(//after winner is set, reset board
        <div style={{backgroundColor: 'red', display: 'flex', flexDirection: 'column'}}>
          {winner && <div onClick={this.resetBoard} style = {{position: "absolute", left: 0, right: 0, top: 0, bottom: 0, zIndex: 3 ,backgroundColor: `${winner}`, display: "flex", justifyContent: "center", alignItems: "center", fontSize: "5vw"}}> {`${winner} wins!! Click anywhere to reset the board.`}</div>}
          {rowViews}
        </div>
      );
    
  }

  render() {
    const {style} = this.props;

    return (
      <div style = {style? Object.assign({}, styles.container, style) : styles.container}>
        <div>
          {this.renderBoard()}
        </div>
      </div>
    );

  }

}

const styles = {
  container: {
    height: "100%",
    pading: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

  }
}