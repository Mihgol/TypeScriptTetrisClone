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

        private init():void {
            this.body = Array.apply(null, Array(GAME_OPTIONS.rows))
                .map(x => Array.apply(null, Array(GAME_OPTIONS.columns))
                    .map(x => 0));
        }
        
    }
}