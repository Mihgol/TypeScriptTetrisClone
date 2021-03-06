namespace Tetris {
    export class Board {
        [Symbol.iterator] = () => {
            let index = 0;
            return {
                next: () => {
                    const { rows, columns } = GAME_OPTIONS;
                    const y = Math.floor(index / columns);
                    const x = index % columns;
                    if (x < columns && y < rows) {
                        index++;
                        return {
                            value: { x, y, color: this.body[y][x] },
                            done: false,
                        }
                    }
                    return { done: true }
                }
            }
        }
        body: number[][];
        constructor() {
            this.body = [];
            this.init();
        }

        public init(): void {
            this.body = Array.apply(null, Array(GAME_OPTIONS.rows))
                .map(x => Array.apply(null, Array(GAME_OPTIONS.columns))
                    .map(x => 0));
        }

        private collision(x: number, y: number, shape: IShape, rotation: number): boolean {
            return shape.data[rotation].some(
                (block, blockIndex) => {
                    if (block === 0) {
                        return false;
                    };

                    const inBlockX = Math.floor(blockIndex / shape.size);
                    const inBlockY = blockIndex % shape.size;

                    const onBoardX = x + inBlockX;
                    const onBoardY = y + inBlockY;

                    if (onBoardX >= GAME_OPTIONS.columns || onBoardY >= GAME_OPTIONS.rows) {
                        return true;
                    }

                    if (this.body[onBoardY][onBoardX] !== 0 && block !== 0) {
                        return true;
                    }
                }
            );
        }

        public calcGhostPosition(tetromino: Tetromino, y: number = tetromino.currentY): number {
            if (this.collision(tetromino.currentX, y + 1, tetromino.shape, tetromino.rotation)) {
                return y - tetromino.currentY;
            } else {
                return this.calcGhostPosition(tetromino, ++y);
            }
        }

        public permittedMove(tetromino: Tetromino, direction: DIR): boolean {
            switch (direction) {
                case DIR.LEFT:
                    return !this.collision(
                        tetromino.currentX - 1,
                        tetromino.currentY,
                        tetromino.shape,
                        tetromino.rotation
                    );
                case DIR.RIGHT:
                    return !this.collision(
                        tetromino.currentX + 1,
                        tetromino.currentY,
                        tetromino.shape,
                        tetromino.rotation
                    );
                case DIR.DOWN:
                    return !this.collision(
                        tetromino.currentX,
                        tetromino.currentY + 1,
                        tetromino.shape,
                        tetromino.rotation
                    );
                case DIR.IDLE:
                    return !this.collision(
                        tetromino.currentX,
                        tetromino.currentY,
                        tetromino.shape,
                        tetromino.rotation
                    );
            }
        }

        public permittedRotation(tetromino: Tetromino, direction: DIR): boolean {
            switch (direction) {
                case DIR.LEFT:
                    return !this.collision(
                        tetromino.currentX,
                        tetromino.currentY,
                        tetromino.shape,
                        tetromino.calcRotation(+1)
                    );
                case DIR.RIGHT:
                    return !this.collision(
                        tetromino.currentX,
                        tetromino.currentY,
                        tetromino.shape,
                        tetromino.calcRotation(1)
                    );
            }
            return false;
        }

        public lockTetromino(tetromino: Tetromino): void {
            const { shape, rotation, currentX, currentY } = tetromino;

            tetromino.shape.data[rotation].forEach(
                (block, blockIndex) => {
                    if (block !== 0) {
                        const inBlockX = Math.floor(blockIndex / shape.size);
                        const inBlockY = blockIndex % shape.size;

                        this.body[inBlockY + currentY][inBlockX + currentX] = block;
                    };
                }
            );
        }

        public getFullRows() {
            return this.body.map(
                (row, rowIndex) => row.every(block => block !== 0) ? rowIndex : null
            ).filter(block => block !== null);
        }

        public removeRow(rowIndex: number): void {
            this.body.splice(rowIndex, 1);
            this.body.unshift(Array(GAME_OPTIONS.columns).fill(0));
        }
    }
}