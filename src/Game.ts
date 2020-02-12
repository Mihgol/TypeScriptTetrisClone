namespace Tetris {
    export class Game {
        activeTetromino: Tetromino;
        display: Display;
        board: Board;
        speed: { current: number, total: number } = { current: 0, total: 40 };
        score: number = 0;
        nextTetromino: Tetromino;
        constructor() {
            this.activeTetromino = new Tetromino();
            this.nextTetromino = new Tetromino();
            this.board = new Board();
            this.display = new Display(document.body);
            window.addEventListener('keydown', (e) => this.inputHandler(e));
            this.start();
        }

        private start(): void {
            this.activeTetromino = new Tetromino();
            this.nextTetromino = new Tetromino();
            this.board.init();
            this.display.drawPanel(this.score, this.nextTetromino);
            this.loop();
        }

        private isGameOver(): boolean {
            return this.board.collision(
                this.nextTetromino.currentX,
                this.nextTetromino.currentY,
                this.nextTetromino.shape,
                this.nextTetromino.rotation
            )
        }

        private loop(): void {

            // Force down
            if (this.speed.current === this.speed.total) {
                if (!this.board.collision(
                    this.activeTetromino.currentX,
                    this.activeTetromino.currentY + 1,
                    this.activeTetromino.shape,
                    this.activeTetromino.rotation)) {
                    this.activeTetromino.move(DIR.DOWN);
                } else {
                    this.activeTetromino.locked = true;
                }
                this.speed.current = 0;
            }

            // Lock Tetromino
            if (this.activeTetromino.locked) {

                this.score += 1;

                this.board.lockTetromino(this.activeTetromino);
                const fullRows = this.board.getFullRows();

                if (fullRows.length === 4) {
                    this.score += 800;
                } else if (fullRows.length === 3) {
                    this.score += 400;
                } else if (fullRows.length === 2) {
                    this.score += 100;
                } else if (fullRows.length === 1) {
                    this.score += 25;
                }

                if (fullRows.length > 0) {
                    fullRows.forEach(row => {
                        if (row !== null) this.board.removeRow(row)
                    });
                };

                // Check if game over
                if (this.isGameOver()) {
                    this.display.gameOver(this.score);

                    this.display.canvas.addEventListener(
                        'click',
                        () => { this.start() },
                        { once: true }
                    );

                    this.display.drawPanel(0, this.nextTetromino);
                    this.score = 0;

                    return;

                } else {
                    this.activeTetromino = this.nextTetromino;
                    this.nextTetromino = new Tetromino();
                    this.display.drawPanel(this.score, this.nextTetromino);
                }

            }

            // Draw
            // this.display.drawScore(this.score);
            this.display.clear();
            this.display.drawBoard(this.board);
            this.display.drawTetromino(this.activeTetromino);

            setTimeout(() => {
                requestAnimationFrame(() => {
                    this.speed.current += 1;
                    this.loop();
                })
            }, 25);
        }

        private inputHandler(e: any): void {

            const { currentX, currentY, rotation, shape } = this.activeTetromino;
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    if (!this.board.collision(currentX, currentY + 1, shape, rotation)) {
                        this.activeTetromino.move(DIR.DOWN);
                    } else {
                        this.activeTetromino.locked = true;
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
                    if (!this.board.collision(currentX, currentY, shape, this.activeTetromino.calcRotation(-1))) {
                        this.activeTetromino.rotate(DIR.LEFT);
                    }
            }
        }
    }
}