namespace Tetris {
    export class Tetromino {
        public shape: IShape;
        public currentX: number;
        public currentY: number;
        public rotation: number;
        public locked: boolean = false;
        constructor() {
            this.shape = SHAPES[this.randomShapeIndex()];
            this.currentX = Math.floor(GAME_OPTIONS.columns / 2)
                - Math.floor(this.shape.size / 2);
            this.currentY = 0;
            this.rotation = 0;
        }

        private randomShapeIndex(): number {
            return Math.floor(Math.random() * SHAPES.length);
        }

        public move(direction: DIR): void {
            switch (direction) {
                case DIR.LEFT:
                    this.currentX -= 1;
                    break;
                case DIR.RIGHT:
                    this.currentX += 1;
                    break;
                case DIR.DOWN:
                    this.currentY += 1;
                    break;
            }
        }

        public calcRotation(change: number): number {
            if (this.rotation + change < 0) return 3;
            if (this.rotation + change > 3) return 0;
            return this.rotation + change;
        }


        public rotate(direction: number): void {
            switch (direction) {
                case DIR.LEFT:
                    this.rotation = this.calcRotation(-1);
                    break;
                case DIR.RIGHT:
                    this.rotation = this.calcRotation(1);
                    break;
            }
        }
    }
}