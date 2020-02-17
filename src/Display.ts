namespace Tetris {
    export class Display {
        gameCanvas: HTMLCanvasElement;
        gameCanvasCtx: CanvasRenderingContext2D;
        panelCanvas: HTMLCanvasElement;
        panelCanvasCtx: CanvasRenderingContext2D
        constructor(private parent: HTMLElement) {
            this.parent = parent;
            this.panelCanvas = document.createElement('canvas');
            this.panelCanvasCtx = this.panelCanvas.getContext('2d')!;
            this.gameCanvas = document.createElement('canvas');
            this.gameCanvasCtx = this.gameCanvas.getContext('2d')!;
            this.init();
        }

        private init(): void {
            const { blockSize, gapSize } = DISPLAY_OPTIONS;
            const { rows, columns } = GAME_OPTIONS;


            this.parent.appendChild(this.gameCanvas);
            this.parent.appendChild(this.panelCanvas);

            this.gameCanvas.width = gapSize + (blockSize + gapSize) * columns;
            this.gameCanvas.height = gapSize + (blockSize + gapSize) * rows;

            this.panelCanvas.width = this.gameCanvas.width;
            this.panelCanvas.height = this.gameCanvas.height;

        }

        public drawGameOver(score: number): void {

            this.gameCanvasCtx.lineWidth = 2;
            this.gameCanvasCtx.fillStyle = "#2D2D2D";
            this.gameCanvasCtx.strokeStyle = "#B4B4B4";

            const textStroke = (text: string, fontSize: number, y: number) => {
                this.gameCanvasCtx.font = `bold ${fontSize}px Arial`;
                const center = (this.gameCanvas.width / 2) - (this.gameCanvasCtx.measureText(text).width / 2);
                this.gameCanvasCtx.strokeText(text, center, y);
                this.gameCanvasCtx.fillText(text, center, y);
            }

            const displayText: [string, number, number][] = [
                ["GAME OVER", 40, 50],
                ["Your score: ", 30, 100],
                [score.toString(), 30, 140],
                ["Click to play again", 30, this.gameCanvas.height / 2],
            ];

            displayText.forEach(line => {
                textStroke(...line);
            });

        }

        public drawSidePanel(score: number, nextTetromino: Tetromino, heldTetromino: Tetromino | null = null): void {

            this.panelCanvasCtx.clearRect(0, 0, this.panelCanvas.width, this.panelCanvas.height);

            this.panelCanvasCtx.font = "30px Arial";
            this.panelCanvasCtx.fillStyle = "#B4B4B4";
            this.panelCanvasCtx.fillText("Score:", 20, 30);
            this.panelCanvasCtx.fillText(
                score.toString(),
                this.panelCanvas.width / 2 - (this.panelCanvasCtx.measureText(score.toString()).width / 2)
                , 95);
            this.panelCanvasCtx.fillText("Next:", 20, 160);
            this.panelCanvasCtx.fillText("Hold:", 20, 380);
            this.panelCanvasCtx.font = "15px Arial"
            this.panelCanvasCtx.fillText("Move: Arrows; Rotate: Z, X; Hold: C", 20, 550);

            this.drawTetromino(nextTetromino, this.panelCanvasCtx, nextTetromino.currentX, 7);
            if (heldTetromino !== null) {
                this.drawTetromino(heldTetromino, this.panelCanvasCtx, nextTetromino.currentX, 15);
            }

        }

        public clearGameCanvas(): void {
            this.gameCanvasCtx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
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
            ctx: CanvasRenderingContext2D = this.gameCanvasCtx,
            xblockOffset: number = 0,
            yblockOffset: number = 0,
            ghost: boolean = false,
        ) {
            let { shape, rotation, currentX, currentY } = tetromino;

            if (ctx !== this.gameCanvasCtx) {
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
                    this.drawBlock(
                        ctx,
                        inBlockX + currentX + xblockOffset,
                        inBlockY + yblockOffset + currentY,
                        ghost ? 0 : block);
                }
            );
        }

        public drawBoard(board: Board): void {
            for (let block of board) {
                const { x, y, color } = block as { x: number, y: number, color: COLORS };
                if (color !== 0) {
                    this.drawBlock(this.gameCanvasCtx, x, y, color);
                }
            }
        }

        public drawPaused(): void {
            this.gameCanvasCtx.lineWidth = 2;
            this.gameCanvasCtx.fillStyle = "#2D2D2D";
            this.gameCanvasCtx.strokeStyle = "#B4B4B4";
            this.gameCanvasCtx.translate(0.5, 0.5);

            const textStroke = (text: string, fontSize: number, y: number) => {
                this.gameCanvasCtx.font = `bold ${fontSize}px Arial`;
                const center = (this.gameCanvas.width / 2) - (this.gameCanvasCtx.measureText(text).width / 2);
                this.gameCanvasCtx.strokeText(text, center, y);
                this.gameCanvasCtx.fillText(text, center, y);
            }

            const displayText: [string, number, number][] = [
                ["PAUSED", 40, 50],
                ["To continue", 30, this.gameCanvas.height / 2],
                ["press pause", 30, this.gameCanvas.height / 2 + 23],
            ];

            displayText.forEach(line => {
                textStroke(...line);
            });
        }
    }
}