namespace Tetris {
    export class Display {
        canvas: HTMLCanvasElement;
        ctx: CanvasRenderingContext2D;
        panel: HTMLCanvasElement;
        pCtx: CanvasRenderingContext2D
        constructor(private parent: HTMLElement) {
            this.parent = parent;
            this.panel = document.createElement('canvas');
            this.pCtx = this.panel.getContext('2d')!;
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d')!;
            this.init();
        }

        public gameOver(score: number): void {

            this.ctx.lineWidth = 2;
            this.ctx.fillStyle = "#2D2D2D";
            this.ctx.strokeStyle = "#FFFFFF";

            const textStroke = (text: string, fontSize: number, y: number) => {
                this.ctx.font = `bold ${fontSize}px Arial`;
                const center = (this.canvas.width / 2) - (this.ctx.measureText(text).width / 2)
                this.ctx.strokeText(text, center, y);
                this.ctx.fillText(text, center, y);
            }

            const displayText: [string, number, number][] = [
                ["GAME OVER", 40, 50],
                ["Your score: ", 20, 100],
                [score.toString(), 20, 140],
                ["Click to play again", 20, this.canvas.height / 2],
            ]

            displayText.forEach(line => {
                textStroke(...line);
            })

        }

        public drawPanel(score: number, nextTetromino: Tetromino): void {

            this.pCtx.clearRect(0, 0, this.panel.width, this.panel.height);

            this.pCtx.font = "30px Arial";
            this.pCtx.fillStyle = "#B4B4B4";
            this.pCtx.fillText("Score:", 20, 40);
            this.pCtx.fillText(
                score.toString(),
                this.panel.width / 2 - (this.pCtx.measureText(score.toString()).width / 2)
                , 95);
            this.pCtx.fillText("Next:", 20, 160);
            this.pCtx.fillText("Controls:", 20, 380);
            this.pCtx.font = "20px Arial";

            const controls = 435;

            this.pCtx.fillText("Move", 40, controls);
            this.pCtx.fillText(": arrows", 160, controls);

            this.pCtx.fillText("Rotate right", 40, controls + 35);
            this.pCtx.fillText(": x", 160, controls + 35);

            this.pCtx.fillText("Rotate left", 40, controls + 70);
            this.pCtx.fillText(": z", 160, controls + 70);

            this.pCtx.fillText("Drop", 40, controls + 105);
            this.pCtx.fillText(": space", 160, controls + 105);

            this.drawTetromino(nextTetromino, this.pCtx, nextTetromino.currentX, 7);


        }

        private init(): void {
            const { blockSize, gapSize } = DISPLAY_OPTIONS;
            const { rows, columns } = GAME_OPTIONS;


            this.parent.appendChild(this.canvas);
            this.parent.appendChild(this.panel);

            this.canvas.width = gapSize + (blockSize + gapSize) * columns;
            this.canvas.height = gapSize + (blockSize + gapSize) * rows;

            this.panel.width = this.canvas.width;
            this.panel.height = this.canvas.height;

        }

        public clear(): void {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        public drawBlock(ctx: CanvasRenderingContext2D, x: number, y: number, color: COLORS): void {

            const { blockSize, gapSize } = DISPLAY_OPTIONS;

            ctx.fillStyle = COLORS[color];
            ctx.fillRect(
                gapSize + (blockSize + gapSize) * x,
                gapSize + (blockSize + gapSize) * y,
                blockSize,
                blockSize
            )

        }

        public drawTetromino(
            tetromino: Tetromino,
            ctx: CanvasRenderingContext2D = this.ctx,
            xOffset: number = 0,
            yOffset: number = 0
        ) {
            let { shape, rotation, currentX, currentY } = tetromino;

            if (ctx !== this.ctx) {
                currentX = 0;
                currentY = 0;
            }

            tetromino.shape.data[rotation].forEach(
                (block, blockIndex) => {
                    if (block === 0) {
                        return;
                    }
                    const inBlockX = Math.floor(blockIndex / shape.size);
                    const inBlockY = blockIndex % shape.size;
                    this.drawBlock(ctx, inBlockX + currentX + xOffset, inBlockY + yOffset + currentY, block);
                }
            );
        }

        public drawBoard(board: Board): void {
            for (let block of board) {
                const { x, y, color } = block as { x: number, y: number, color: COLORS };
                if (color !== 0) {
                    this.drawBlock(this.ctx, x, y, color);
                }
            }
        }
    }
}