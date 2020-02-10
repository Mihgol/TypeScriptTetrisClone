namespace Tetris {
    export class Game {
        activeTetromino: Tetromino;
        display: Display;
        board: Board;
        constructor() {
            this.activeTetromino = new Tetromino();
            this.display = new Display(document.body);
            this.board = new Board();
            this.start();
        }

        private start():void {
            window.addEventListener('keydown', (e) => this.inputHandler(e));
            this.loop();
        }

        private loop():void {

            this.display.clear();
            this.display.drawBoard(this.board);
            this.display.drawTetromino(this.activeTetromino);

            setTimeout(() => {
                requestAnimationFrame(()=>{
                    this.loop();
                })
            }, 50);
        }

        private inputHandler(e: any): void {

            const { currentX, currentY, rotation, shape } = this.activeTetromino;
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    if (!this.board.collision(currentX, currentY + 1, shape, rotation)) {
                        this.activeTetromino.move(DIR.DOWN);
                    } 
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    if (!this.board.collision(currentX - 1, currentY, shape, rotation)) {
                        this.activeTetromino.move(DIR.LEFT);
                    }
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    if (!this.board.collision(currentX + 1, currentY, shape, rotation)) {
                        this.activeTetromino.move(DIR.RIGHT);
                    }
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    if (!this.board.collision(currentX, currentY, shape, this.activeTetromino.calcRotation(1))) {
                        this.activeTetromino.rotate(DIR.RIGHT);
                    }
                    break;
                case 'z':
                    e.preventDefault();
                    if(!this.board.collision(currentX, currentY, shape, this.activeTetromino.calcRotation(-1))) {
                        this.activeTetromino.rotate(DIR.LEFT);
                    }
            }
        }
    }
}