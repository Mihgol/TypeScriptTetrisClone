namespace Tetris {
    export class Tetromino {
        public shape: IShape;
        public currentX: number;
        public currentY: number;
        public rotation: number;
        constructor() {
            this.shape = SHAPES[this.randomShapeIndex()];
            this.currentX = GAME_OPTIONS.columns / 2 - this.shape.size / 2;
            this.currentY = 0;
            this.rotation = 0;
        }
        
        private randomShapeIndex(): number {
            return Math.floor(Math.random() * SHAPES.length);
        }
    }
}