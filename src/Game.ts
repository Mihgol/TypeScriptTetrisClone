namespace Tetris {
    export class Game {
        activeTetromino: Tetromino;
        display: Display;
        board: Board;
        constructor() {
            this.activeTetromino = new Tetromino();
            this.display = new Display(document.body);
            this.board = new Board();
            this.loop();
        }

        private loop() {

            this.display.clear();
            this.display.drawTetromino(this.activeTetromino);

            setTimeout(() => {
                requestAnimationFrame(()=>{
                    this.loop();
                })
            }, 50)
        }
    }
}