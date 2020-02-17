namespace Tetris {
    export interface Input {
        [key: string]: () => void;
    }

    export class Game {
        activeTetromino!: Tetromino;
        nextTetromino!: Tetromino;
        heldTetromino: Tetromino | null = null;
        display: Display;
        board: Board;
        speed: { current: number, total: number };
        score: number = 0;
        swapAwailable: boolean = true;
        paused: boolean = false;
        constructor(private parentElement: HTMLElement) {
            this.parentElement = parentElement;
            this.board = new Board();
            this.display = new Display(this.parentElement);
            this.speed = { current: 0, total: 40 };
            this.addInput();
            this.start();
        }

        private speedCounter(): void {
            if (this.speed.current === this.speed.total) {
                if (this.board.permittedMove(this.activeTetromino, DIR.DOWN)) {
                    this.activeTetromino.move(DIR.DOWN);
                } else {
                    this.activeTetromino.locked = true;
                }
                this.speed.current = 0;
            }
            this.speed.current += 1;
        }

        private start(): void {
            this.activeTetromino = new Tetromino();
            this.nextTetromino = new Tetromino();
            this.board.init();
            this.display.drawSidePanel(this.score, this.nextTetromino);
            this.loop();
        }

        private holdTetromino(): void {
            if (this.swapAwailable && this.heldTetromino === null) {
                this.heldTetromino = this.activeTetromino;
                this.heldTetromino.resetPosition();
                this.activeTetromino = new Tetromino();
            } else if (this.swapAwailable && this.heldTetromino !== null) {
                [this.activeTetromino, this.heldTetromino] = [this.heldTetromino, this.activeTetromino];
                this.heldTetromino.resetPosition();
            }
            this.swapAwailable = false;
        }

        private gameOver(): boolean {
            return !this.board.permittedMove(
                this.nextTetromino, DIR.IDLE
            )
        }

        private loop(): void {

            this.speedCounter();

            // Lock Tetromino
            if (this.activeTetromino.locked) {

                this.board.lockTetromino(this.activeTetromino);

                const fullRows = this.board.getFullRows();

                const processScore = (numberOfFullRows: number) => {
                    const actions = [
                        () => this.score += 1,
                        () => this.score += 25,
                        () => this.score += 100,
                        () => this.score += 400,
                        () => this.score += 800,
                    ]
                    actions[numberOfFullRows]();
                }

                processScore(fullRows.length);

                fullRows.forEach(row => {
                    if (row !== null) this.board.removeRow(row)
                });

                // Check if game over
                if (this.gameOver() && !this.paused) {
                    this.display.drawGameOver(this.score);
                    this.display.gameCanvas.addEventListener(
                        'click',
                        () => { this.start() },
                        { once: true }
                    );

                    this.display.drawSidePanel(0, this.nextTetromino, this.heldTetromino);
                    this.score = 0;

                    return;

                } else {
                    this.swapAwailable = true;
                    this.activeTetromino = this.nextTetromino;
                    this.nextTetromino = new Tetromino();
                    this.display.drawSidePanel(this.score, this.nextTetromino, this.heldTetromino);
                }

            }

            if (this.paused) {
                this.display.drawPaused();
                return;
            }

            // Draw
            this.display.clearGameCanvas();
            this.display.drawBoard(this.board);
            this.display.drawTetromino(
                this.activeTetromino,
                this.display.gameCanvasCtx,
                0,
                this.board.calcGhostPosition(this.activeTetromino),
                true
            )
            this.display.drawTetromino(this.activeTetromino);
            setTimeout(() => {
                requestAnimationFrame(() => {
                    this.loop();
                })
            }, 25);
        }

        private addInput(): void {
            window.addEventListener('keydown',
                (event) => this.inputHandler(event));
        }

        private inputHandler(event: KeyboardEvent): void {
            const pressedKey = event.key.toLowerCase();

            const mappedKeys: Input = {
                'arrowdown': () => {
                    this.board.permittedMove(this.activeTetromino, DIR.DOWN)
                        ? this.activeTetromino.move(DIR.DOWN)
                        : this.activeTetromino.locked = true;
                },
                'arrowleft': () => {
                    this.board.permittedMove(this.activeTetromino, DIR.LEFT)
                        ? this.activeTetromino.move(DIR.LEFT)
                        : null;
                },
                'arrowright': () => {
                    this.board.permittedMove(this.activeTetromino, DIR.RIGHT)
                        ? this.activeTetromino.move(DIR.RIGHT)
                        : null;
                },
                'arrowup': () => {
                    this.board.permittedRotation(this.activeTetromino, DIR.RIGHT)
                        ? this.activeTetromino.rotate(DIR.RIGHT)
                        : null;
                },
                'x': () => {
                    this.board.permittedRotation(this.activeTetromino, DIR.RIGHT)
                        ? this.activeTetromino.rotate(DIR.RIGHT)
                        : null;
                },
                'z': () => {
                    this.board.permittedRotation(this.activeTetromino, DIR.LEFT)
                        ? this.activeTetromino.rotate(DIR.LEFT)
                        : null;
                },
                'c': () => {
                    this.holdTetromino();
                    this.display.drawSidePanel(this.score, this.nextTetromino, this.heldTetromino);
                },
                ' ': () => {
                    while (this.board.permittedMove(this.activeTetromino, DIR.DOWN))
                        this.activeTetromino.move(DIR.DOWN);
                    this.activeTetromino.locked = true;
                },
                'pause': () => {
                    this.display.clearGameCanvas();
                    this.paused = !this.paused;
                    this.loop();
                }
            }

            if (pressedKey in mappedKeys) {
                event.preventDefault();
                mappedKeys[pressedKey]();
            };

        }
    }
}
