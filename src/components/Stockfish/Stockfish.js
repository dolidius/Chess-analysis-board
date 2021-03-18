//refactoring::not working yet need to change some things

class Stockfish {

    constructor(stockfish) {
        this.stockfish = stockfish;
    }

    startNewGame = () => {
        this.stockfish.postMessage("uci");
        this.stockfish.postMessage("ucinewgame");
        this.stockfish.postMessage("setoption name MultiPV value 3"); 
    }
    
    getBestLines = (fen, depth) => {
        this.stockfish.postMessage("position fen " + fen);
        this.stockfish.postMessage(`go depth ${depth}`);
        // console.log("!NEW MESSAGE!")
        stockfish.onmessage = function(event) {
            // console.log(event.data ? event.data: event);
            if (event.data.startsWith(`info depth ${depth}`)) {
                let message = event.data.split(' ');

                let index = 0;
                let movesIndex = 0;

                let moves = [];

                for (let i = 0; i < message.length; i ++) {
                    if (message[i] === 'multipv') {
                        index = parseInt(message[i + 1]) - 1;
                    }

                    if (message[i] === 'pv') {
                        movesIndex = i + 1;
                        break;
                    }

                }

                for (let i = movesIndex; i < message.length; i ++) {
                    if (message[i] === 'bmc') break;
                    moves.push(message[i]);
                }

                const bestLinesCopy = bestLines;
                bestLinesCopy[index] = moves;
                // console.log(moves)
                setBestLines(bestLinesCopy);

            }

            if (event.data.startsWith("bestmove")) {
                let message = event.data.split(' ');
                setBestMove(message[1]);
            }
        };
    } 

}

export default Stockfish;