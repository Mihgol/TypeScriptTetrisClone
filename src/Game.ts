namespace Tetris {
    export class Game {
        activeTetromino: Tetromino;
        display: Display;
        constructor() {
            this.activeTetromino = new Tetromino();
            this.display = new Display(document.body);
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