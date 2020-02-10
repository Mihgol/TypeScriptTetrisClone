namespace Tetris {
    export class Display {
        canvas: HTMLCanvasElement;
        ctx: CanvasRenderingContext2D;

        constructor(private parent: HTMLElement) {
            this.parent = parent;
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d')!;
            this.init();
        }

        private init():void {
            const { blockSize, gapSize } = DISPLAY_OPTIONS;
            const { rows, columns } = GAME_OPTIONS;

            this.parent.appendChild(this.canvas);

            this.canvas.width = gapSize + (blockSize + gapSize) * columns;
            this.canvas.height = gapSize + (blockSize + gapSize) * rows;

        }

        public clear():void {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        public drawBlock(x: number, y: number, color: COLORS):void {

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
    }
}