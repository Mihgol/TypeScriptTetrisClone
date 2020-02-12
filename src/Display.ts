namespace Tetris {
    export class Display {
        canvas: HTMLCanvasElement;
        ctx: CanvasRenderingContext2D;
        points: HTMLSpanElement;
        constructor(private parent: HTMLElement) {
            this.parent = parent;
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d')!;
            this.points = document.createElement('span');
            this.init();
        }

        public score(score: number): void {
            this.points.innerHTML = "Score: " + score.toString();
        }

        public gameOver(score: number): void {
            this.ctx.lineWidth = 2;
            this.ctx.fillStyle = "#2D2D2D";
            this.ctx.strokeStyle = "#FFFFFF";
            this.ctx.font = "bold 40px Arial";

            const textStroke = (text: string, x: number, y: number) => {
                this.ctx.strokeText(text, x, y);
                this.ctx.fillText(text, x, y);
            }

            textStroke(
                "GAME OVER",
                (this.canvas.width / 2)
                - (this.ctx.measureText("GAME OVER").width / 2),
                50
            );

            this.ctx.font = "bold 30px Arial";

            textStroke(
                "Your score:",
                (this.canvas.width / 2)
                - (this.ctx.measureText("Your score:").width / 2),
                100
            );

            textStroke(
                score.toString(),
                (this.canvas.width / 2)
                - (this.ctx.measureText(score.toString()).width / 2),
                140
            )

            textStroke(
                "Click to play again",
                (this.canvas.width / 2)
                - (this.ctx.measureText("Click to play again").width / 2),
                this.canvas.height / 2
            );

        }

        private init(): void {
            const { blockSize, gapSize } = DISPLAY_OPTIONS;
            const { rows, columns } = GAME_OPTIONS;

            this.parent.appendChild(this.points);
            this.parent.appendChild(this.canvas);

            this.canvas.width = gapSize + (blockSize + gapSize) * columns;
            this.canvas.height = gapSize + (blockSize + gapSize) * rows;

        }

        public clear(): void {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        public drawBlock(x: number, y: number, color: COLORS): void {

            const { blockSize, gapSize } = DISPLAY_OPTIONS;

            this.ctx.fillStyle = COLORS[color];
            this.ctx.fillRect(
                gapSize + (blockSize + gapSize) * x,
                gapSize + (blockSize + gapSize) * y,
                blockSize,
                blockSize
            )

        }

        public drawTetromino(tetromino: Tetromino) {
            const { shape, rotation, currentX, currentY } = tetromino;

            tetromino.shape.data[rotation].forEach(
                (block, blockIndex) => {
                    if (block === 0) {
                        return;
                    }
                    const inBlockX = Math.floor(blockIndex / shape.size);
                    const inBlockY = blockIndex % shape.size;
                    this.drawBlock(inBlockX + currentX, inBlockY + currentY, block);
                }
            );
        }

        public drawBoard(board: Board): void {
            for (let block of board) {
                const { x, y, color } = block as { x: number, y: number, color: COLORS };
                if (color !== 0) {
                    this.drawBlock(x, y, color);
                }
            }
        }
    }
}