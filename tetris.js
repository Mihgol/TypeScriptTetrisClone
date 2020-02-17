"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var Tetris;
(function (Tetris) {
    var Board = /** @class */ (function () {
        function Board() {
            var _this = this;
            this[Symbol.iterator] = function () {
                var index = 0;
                return {
                    next: function () {
                        var rows = Tetris.GAME_OPTIONS.rows, columns = Tetris.GAME_OPTIONS.columns;
                        var y = Math.floor(index / columns);
                        var x = index % columns;
                        if (x < columns && y < rows) {
                            index++;
                            return {
                                value: { x: x, y: y, color: _this.body[y][x] },
                                done: false,
                            };
                        }
                        return { done: true };
                    }
                };
            };
            this.body = [];
            this.init();
        }
        Board.prototype.init = function () {
            this.body = Array.apply(null, Array(Tetris.GAME_OPTIONS.rows))
                .map(function (x) { return Array.apply(null, Array(Tetris.GAME_OPTIONS.columns))
                .map(function (x) { return 0; }); });
        };
        Board.prototype.collision = function (x, y, shape, rotation) {
            var _this = this;
            return shape.data[rotation].some(function (block, blockIndex) {
                if (block === 0) {
                    return false;
                }
                ;
                var inBlockX = Math.floor(blockIndex / shape.size);
                var inBlockY = blockIndex % shape.size;
                var onBoardX = x + inBlockX;
                var onBoardY = y + inBlockY;
                if (onBoardX >= Tetris.GAME_OPTIONS.columns || onBoardY >= Tetris.GAME_OPTIONS.rows) {
                    return true;
                }
                if (_this.body[onBoardY][onBoardX] !== 0 && block !== 0) {
                    return true;
                }
            });
        };
        Board.prototype.calcGhostPosition = function (tetromino, y) {
            if (y === void 0) { y = tetromino.currentY; }
            if (this.collision(tetromino.currentX, y + 1, tetromino.shape, tetromino.rotation)) {
                return y - tetromino.currentY;
            }
            else {
                return this.calcGhostPosition(tetromino, ++y);
            }
        };
        Board.prototype.permittedMove = function (tetromino, direction) {
            switch (direction) {
                case Tetris.DIR.LEFT:
                    return !this.collision(tetromino.currentX - 1, tetromino.currentY, tetromino.shape, tetromino.rotation);
                case Tetris.DIR.RIGHT:
                    return !this.collision(tetromino.currentX + 1, tetromino.currentY, tetromino.shape, tetromino.rotation);
                case Tetris.DIR.DOWN:
                    return !this.collision(tetromino.currentX, tetromino.currentY + 1, tetromino.shape, tetromino.rotation);
                case Tetris.DIR.IDLE:
                    return !this.collision(tetromino.currentX, tetromino.currentY, tetromino.shape, tetromino.rotation);
            }
        };
        Board.prototype.permittedRotation = function (tetromino, direction) {
            switch (direction) {
                case Tetris.DIR.LEFT:
                    return !this.collision(tetromino.currentX, tetromino.currentY, tetromino.shape, tetromino.calcRotation(+1));
                case Tetris.DIR.RIGHT:
                    return !this.collision(tetromino.currentX, tetromino.currentY, tetromino.shape, tetromino.calcRotation(1));
            }
            return false;
        };
        Board.prototype.lockTetromino = function (tetromino) {
            var _this = this;
            var shape = tetromino.shape, rotation = tetromino.rotation, currentX = tetromino.currentX, currentY = tetromino.currentY;
            tetromino.shape.data[rotation].forEach(function (block, blockIndex) {
                if (block !== 0) {
                    var inBlockX = Math.floor(blockIndex / shape.size);
                    var inBlockY = blockIndex % shape.size;
                    _this.body[inBlockY + currentY][inBlockX + currentX] = block;
                }
                ;
            });
        };
        Board.prototype.getFullRows = function () {
            return this.body.map(function (row, rowIndex) { return row.every(function (block) { return block !== 0; }) ? rowIndex : null; }).filter(function (block) { return block !== null; });
        };
        Board.prototype.removeRow = function (rowIndex) {
            this.body.splice(rowIndex, 1);
            this.body.unshift(Array(Tetris.GAME_OPTIONS.columns).fill(0));
        };
        return Board;
    }());
    Tetris.Board = Board;
})(Tetris || (Tetris = {}));
var Tetris;
(function (Tetris) {
    var Display = /** @class */ (function () {
        function Display(parent) {
            this.parent = parent;
            this.parent = parent;
            this.panelCanvas = document.createElement('canvas');
            this.panelCanvasCtx = this.panelCanvas.getContext('2d');
            this.gameCanvas = document.createElement('canvas');
            this.gameCanvasCtx = this.gameCanvas.getContext('2d');
            this.init();
        }
        Display.prototype.init = function () {
            var blockSize = Tetris.DISPLAY_OPTIONS.blockSize, gapSize = Tetris.DISPLAY_OPTIONS.gapSize;
            var rows = Tetris.GAME_OPTIONS.rows, columns = Tetris.GAME_OPTIONS.columns;
            this.parent.appendChild(this.gameCanvas);
            this.parent.appendChild(this.panelCanvas);
            this.gameCanvas.width = gapSize + (blockSize + gapSize) * columns;
            this.gameCanvas.height = gapSize + (blockSize + gapSize) * rows;
            this.panelCanvas.width = this.gameCanvas.width;
            this.panelCanvas.height = this.gameCanvas.height;
        };
        Display.prototype.drawGameOver = function (score) {
            var _this = this;
            this.gameCanvasCtx.lineWidth = 2;
            this.gameCanvasCtx.fillStyle = "#2D2D2D";
            this.gameCanvasCtx.strokeStyle = "#B4B4B4";
            var textStroke = function (text, fontSize, y) {
                _this.gameCanvasCtx.font = "bold " + fontSize + "px Arial";
                var center = (_this.gameCanvas.width / 2) - (_this.gameCanvasCtx.measureText(text).width / 2);
                _this.gameCanvasCtx.strokeText(text, center, y);
                _this.gameCanvasCtx.fillText(text, center, y);
            };
            var displayText = [
                ["GAME OVER", 40, 50],
                ["Your score: ", 30, 100],
                [score.toString(), 30, 140],
                ["Click to play again", 30, this.gameCanvas.height / 2],
            ];
            displayText.forEach(function (line) {
                textStroke.apply(void 0, __spread(line));
            });
        };
        Display.prototype.drawSidePanel = function (score, nextTetromino, heldTetromino) {
            if (heldTetromino === void 0) { heldTetromino = null; }
            this.panelCanvasCtx.clearRect(0, 0, this.panelCanvas.width, this.panelCanvas.height);
            this.panelCanvasCtx.font = "30px Arial";
            this.panelCanvasCtx.fillStyle = "#B4B4B4";
            this.panelCanvasCtx.fillText("Score:", 20, 30);
            this.panelCanvasCtx.fillText(score.toString(), this.panelCanvas.width / 2 - (this.panelCanvasCtx.measureText(score.toString()).width / 2), 95);
            this.panelCanvasCtx.fillText("Next:", 20, 160);
            this.panelCanvasCtx.fillText("Hold:", 20, 380);
            this.panelCanvasCtx.font = "15px Arial";
            this.panelCanvasCtx.fillText("Move: Arrows; Rotate: Z, X; Hold: C", 20, 550);
            this.drawTetromino(nextTetromino, this.panelCanvasCtx, nextTetromino.currentX, 7);
            if (heldTetromino !== null) {
                this.drawTetromino(heldTetromino, this.panelCanvasCtx, nextTetromino.currentX, 15);
            }
        };
        Display.prototype.clearGameCanvas = function () {
            this.gameCanvasCtx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
        };
        Display.prototype.drawBlock = function (ctx, x, y, color) {
            var blockSize = Tetris.DISPLAY_OPTIONS.blockSize, gapSize = Tetris.DISPLAY_OPTIONS.gapSize;
            ctx.fillStyle = Tetris.COLORS[color];
            ctx.fillRect(gapSize + (blockSize + gapSize) * x, gapSize + (blockSize + gapSize) * y, blockSize, blockSize);
        };
        Display.prototype.drawTetromino = function (tetromino, ctx, xblockOffset, yblockOffset, ghost) {
            var _this = this;
            if (ctx === void 0) { ctx = this.gameCanvasCtx; }
            if (xblockOffset === void 0) { xblockOffset = 0; }
            if (yblockOffset === void 0) { yblockOffset = 0; }
            if (ghost === void 0) { ghost = false; }
            var shape = tetromino.shape, rotation = tetromino.rotation, currentX = tetromino.currentX, currentY = tetromino.currentY;
            if (ctx !== this.gameCanvasCtx) {
                currentX = 0;
                currentY = 0;
            }
            tetromino.shape.data[rotation].forEach(function (block, blockIndex) {
                if (block === 0) {
                    return;
                }
                var inBlockX = Math.floor(blockIndex / shape.size);
                var inBlockY = blockIndex % shape.size;
                _this.drawBlock(ctx, inBlockX + currentX + xblockOffset, inBlockY + yblockOffset + currentY, ghost ? 0 : block);
            });
        };
        Display.prototype.drawBoard = function (board) {
            var e_1, _a;
            try {
                for (var board_1 = __values(board), board_1_1 = board_1.next(); !board_1_1.done; board_1_1 = board_1.next()) {
                    var block = board_1_1.value;
                    var _b = block, x = _b.x, y = _b.y, color = _b.color;
                    if (color !== 0) {
                        this.drawBlock(this.gameCanvasCtx, x, y, color);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (board_1_1 && !board_1_1.done && (_a = board_1.return)) _a.call(board_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        Display.prototype.drawPaused = function () {
            var _this = this;
            this.gameCanvasCtx.lineWidth = 2;
            this.gameCanvasCtx.fillStyle = "#2D2D2D";
            this.gameCanvasCtx.strokeStyle = "#B4B4B4";
            this.gameCanvasCtx.translate(0.5, 0.5);
            var textStroke = function (text, fontSize, y) {
                _this.gameCanvasCtx.font = "bold " + fontSize + "px Arial";
                var center = (_this.gameCanvas.width / 2) - (_this.gameCanvasCtx.measureText(text).width / 2);
                _this.gameCanvasCtx.strokeText(text, center, y);
                _this.gameCanvasCtx.fillText(text, center, y);
            };
            var displayText = [
                ["PAUSED", 40, 50],
                ["To continue", 30, this.gameCanvas.height / 2],
                ["press pause", 30, this.gameCanvas.height / 2 + 23],
            ];
            displayText.forEach(function (line) {
                textStroke.apply(void 0, __spread(line));
            });
        };
        return Display;
    }());
    Tetris.Display = Display;
})(Tetris || (Tetris = {}));
var Tetris;
(function (Tetris) {
    var Game = /** @class */ (function () {
        function Game(parentElement) {
            this.parentElement = parentElement;
            this.heldTetromino = null;
            this.score = 0;
            this.swapAwailable = true;
            this.paused = false;
            this.parentElement = parentElement;
            this.board = new Tetris.Board();
            this.display = new Tetris.Display(this.parentElement);
            this.speed = { current: 0, total: 40 };
            this.addInput();
            this.start();
        }
        Game.prototype.speedCounter = function () {
            if (this.speed.current === this.speed.total) {
                if (this.board.permittedMove(this.activeTetromino, Tetris.DIR.DOWN)) {
                    this.activeTetromino.move(Tetris.DIR.DOWN);
                }
                else {
                    this.activeTetromino.locked = true;
                }
                this.speed.current = 0;
            }
            this.speed.current += 1;
        };
        Game.prototype.start = function () {
            this.activeTetromino = new Tetris.Tetromino();
            this.nextTetromino = new Tetris.Tetromino();
            this.board.init();
            this.display.drawSidePanel(this.score, this.nextTetromino);
            this.loop();
        };
        Game.prototype.holdTetromino = function () {
            var _a;
            if (this.swapAwailable && this.heldTetromino === null) {
                this.heldTetromino = this.activeTetromino;
                this.heldTetromino.resetPosition();
                this.activeTetromino = new Tetris.Tetromino();
            }
            else if (this.swapAwailable && this.heldTetromino !== null) {
                _a = __read([this.heldTetromino, this.activeTetromino], 2), this.activeTetromino = _a[0], this.heldTetromino = _a[1];
                this.heldTetromino.resetPosition();
            }
            this.swapAwailable = false;
        };
        Game.prototype.gameOver = function () {
            return !this.board.permittedMove(this.nextTetromino, Tetris.DIR.IDLE);
        };
        Game.prototype.loop = function () {
            var _this = this;
            this.speedCounter();
            // Lock Tetromino
            if (this.activeTetromino.locked) {
                this.board.lockTetromino(this.activeTetromino);
                var fullRows = this.board.getFullRows();
                var processScore = function (numberOfFullRows) {
                    var actions = [
                        function () { return _this.score += 1; },
                        function () { return _this.score += 25; },
                        function () { return _this.score += 100; },
                        function () { return _this.score += 400; },
                        function () { return _this.score += 800; },
                    ];
                    actions[numberOfFullRows]();
                };
                processScore(fullRows.length);
                fullRows.forEach(function (row) {
                    if (row !== null)
                        _this.board.removeRow(row);
                });
                // Check if game over
                if (this.gameOver() && !this.paused) {
                    this.display.drawGameOver(this.score);
                    this.display.gameCanvas.addEventListener('click', function () { _this.start(); }, { once: true });
                    this.display.drawSidePanel(0, this.nextTetromino, this.heldTetromino);
                    this.score = 0;
                    return;
                }
                else {
                    this.swapAwailable = true;
                    this.activeTetromino = this.nextTetromino;
                    this.nextTetromino = new Tetris.Tetromino();
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
            this.display.drawTetromino(this.activeTetromino, this.display.gameCanvasCtx, 0, this.board.calcGhostPosition(this.activeTetromino), true);
            this.display.drawTetromino(this.activeTetromino);
            setTimeout(function () {
                requestAnimationFrame(function () {
                    _this.loop();
                });
            }, 25);
        };
        Game.prototype.addInput = function () {
            var _this = this;
            window.addEventListener('keydown', function (event) { return _this.inputHandler(event); });
        };
        Game.prototype.inputHandler = function (event) {
            var _this = this;
            var pressedKey = event.key.toLowerCase();
            var mappedKeys = {
                'arrowdown': function () {
                    _this.board.permittedMove(_this.activeTetromino, Tetris.DIR.DOWN)
                        ? _this.activeTetromino.move(Tetris.DIR.DOWN)
                        : _this.activeTetromino.locked = true;
                },
                'arrowleft': function () {
                    _this.board.permittedMove(_this.activeTetromino, Tetris.DIR.LEFT)
                        ? _this.activeTetromino.move(Tetris.DIR.LEFT)
                        : null;
                },
                'arrowright': function () {
                    _this.board.permittedMove(_this.activeTetromino, Tetris.DIR.RIGHT)
                        ? _this.activeTetromino.move(Tetris.DIR.RIGHT)
                        : null;
                },
                'arrowup': function () {
                    _this.board.permittedRotation(_this.activeTetromino, Tetris.DIR.RIGHT)
                        ? _this.activeTetromino.rotate(Tetris.DIR.RIGHT)
                        : null;
                },
                'x': function () {
                    _this.board.permittedRotation(_this.activeTetromino, Tetris.DIR.RIGHT)
                        ? _this.activeTetromino.rotate(Tetris.DIR.RIGHT)
                        : null;
                },
                'z': function () {
                    _this.board.permittedRotation(_this.activeTetromino, Tetris.DIR.LEFT)
                        ? _this.activeTetromino.rotate(Tetris.DIR.LEFT)
                        : null;
                },
                'c': function () {
                    _this.holdTetromino();
                    _this.display.drawSidePanel(_this.score, _this.nextTetromino, _this.heldTetromino);
                },
                ' ': function () {
                    while (_this.board.permittedMove(_this.activeTetromino, Tetris.DIR.DOWN))
                        _this.activeTetromino.move(Tetris.DIR.DOWN);
                    _this.activeTetromino.locked = true;
                },
                'pause': function () {
                    _this.display.clearGameCanvas();
                    _this.paused = !_this.paused;
                    _this.loop();
                }
            };
            if (pressedKey in mappedKeys) {
                event.preventDefault();
                mappedKeys[pressedKey]();
            }
            ;
        };
        return Game;
    }());
    Tetris.Game = Game;
})(Tetris || (Tetris = {}));
var Tetris;
(function (Tetris) {
    Tetris.GAME_OPTIONS = {
        rows: 20,
        columns: 10,
    };
    Tetris.DISPLAY_OPTIONS = {
        blockSize: 25,
        gapSize: 3,
    };
    var COLORS;
    (function (COLORS) {
        COLORS[COLORS["#B4B4B4"] = 0] = "#B4B4B4";
        COLORS[COLORS["crimson"] = 1] = "crimson";
        COLORS[COLORS["darkcyan"] = 2] = "darkcyan";
        COLORS[COLORS["darkslategrey"] = 3] = "darkslategrey";
        COLORS[COLORS["darkseagreen"] = 4] = "darkseagreen";
        COLORS[COLORS["yellowgreen"] = 5] = "yellowgreen";
        COLORS[COLORS["mediumslateblue"] = 6] = "mediumslateblue";
        COLORS[COLORS["steelblue"] = 7] = "steelblue";
    })(COLORS = Tetris.COLORS || (Tetris.COLORS = {}));
    var DIR;
    (function (DIR) {
        DIR[DIR["LEFT"] = 0] = "LEFT";
        DIR[DIR["RIGHT"] = 1] = "RIGHT";
        DIR[DIR["DOWN"] = 2] = "DOWN";
        DIR[DIR["IDLE"] = 3] = "IDLE";
    })(DIR = Tetris.DIR || (Tetris.DIR = {}));
})(Tetris || (Tetris = {}));
var Tetris;
(function (Tetris) {
    ;
    Tetris.SHAPES = [
        {
            size: 4,
            data: [
                [
                    0, 0, 0, 0,
                    1, 1, 1, 1,
                    0, 0, 0, 0,
                    0, 0, 0, 0,
                ],
                [
                    0, 0, 1, 0,
                    0, 0, 1, 0,
                    0, 0, 1, 0,
                    0, 0, 1, 0,
                ],
                [
                    0, 0, 0, 0,
                    0, 0, 0, 0,
                    1, 1, 1, 1,
                    0, 0, 0, 0,
                ],
                [
                    0, 1, 0, 0,
                    0, 1, 0, 0,
                    0, 1, 0, 0,
                    0, 1, 0, 0,
                ],
            ]
        },
        {
            size: 3,
            data: [
                [
                    2, 0, 0,
                    2, 2, 2,
                    0, 0, 0,
                ],
                [
                    0, 2, 2,
                    0, 2, 0,
                    0, 2, 0,
                ],
                [
                    0, 0, 0,
                    2, 2, 2,
                    0, 0, 2,
                ],
                [
                    0, 2, 0,
                    0, 2, 0,
                    2, 2, 0,
                ],
            ]
        },
        {
            size: 3,
            data: [
                [
                    0, 0, 3,
                    3, 3, 3,
                    0, 0, 0,
                ],
                [
                    0, 3, 0,
                    0, 3, 0,
                    0, 3, 3,
                ],
                [
                    0, 0, 0,
                    3, 3, 3,
                    3, 0, 0,
                ],
                [
                    3, 3, 0,
                    0, 3, 0,
                    0, 3, 0,
                ],
            ]
        },
        {
            size: 2,
            data: [
                [
                    4, 4,
                    4, 4,
                ],
                [
                    4, 4,
                    4, 4,
                ],
                [
                    4, 4,
                    4, 4,
                ],
                [
                    4, 4,
                    4, 4,
                ],
            ]
        },
        {
            size: 3,
            data: [
                [
                    0, 5, 5,
                    5, 5, 0,
                    0, 0, 0,
                ],
                [
                    0, 5, 0,
                    0, 5, 5,
                    0, 0, 5,
                ],
                [
                    0, 0, 0,
                    0, 5, 5,
                    5, 5, 0,
                ],
                [
                    5, 0, 0,
                    5, 5, 0,
                    0, 5, 0,
                ],
            ]
        },
        {
            size: 3,
            data: [
                [
                    0, 6, 0,
                    6, 6, 6,
                    0, 0, 0,
                ],
                [
                    0, 6, 0,
                    0, 6, 6,
                    0, 6, 0,
                ],
                [
                    0, 0, 0,
                    6, 6, 6,
                    0, 6, 0,
                ],
                [
                    0, 6, 0,
                    6, 6, 0,
                    0, 6, 0,
                ],
            ]
        },
        {
            size: 3,
            data: [
                [
                    7, 7, 0,
                    0, 7, 7,
                    0, 0, 0,
                ],
                [
                    0, 0, 7,
                    0, 7, 7,
                    0, 7, 0,
                ],
                [
                    0, 0, 0,
                    7, 7, 0,
                    0, 7, 7,
                ],
                [
                    0, 7, 0,
                    7, 7, 0,
                    7, 0, 0,
                ],
            ]
        },
    ];
})(Tetris || (Tetris = {}));
var Tetris;
(function (Tetris) {
    var Tetromino = /** @class */ (function () {
        function Tetromino() {
            this.locked = false;
            this.shape = Tetris.SHAPES[this.randomShapeIndex()];
            this.currentX = Math.floor(Tetris.GAME_OPTIONS.columns / 2)
                - Math.floor(this.shape.size / 2);
            this.currentY = 0;
            this.rotation = 0;
        }
        Tetromino.prototype.resetPosition = function () {
            this.currentX = Math.floor(Tetris.GAME_OPTIONS.columns / 2)
                - Math.floor(this.shape.size / 2);
            this.currentY = 0;
            this.rotation = 0;
        };
        Tetromino.prototype.randomShapeIndex = function () {
            return Math.floor(Math.random() * Tetris.SHAPES.length);
        };
        Tetromino.prototype.move = function (direction) {
            switch (direction) {
                case Tetris.DIR.LEFT:
                    this.currentX -= 1;
                    break;
                case Tetris.DIR.RIGHT:
                    this.currentX += 1;
                    break;
                case Tetris.DIR.DOWN:
                    this.currentY += 1;
                    break;
            }
        };
        Tetromino.prototype.calcRotation = function (change) {
            if (this.rotation + change < 0)
                return 3;
            if (this.rotation + change > 3)
                return 0;
            return this.rotation + change;
        };
        Tetromino.prototype.rotate = function (direction) {
            switch (direction) {
                case Tetris.DIR.LEFT:
                    this.rotation = this.calcRotation(-1);
                    break;
                case Tetris.DIR.RIGHT:
                    this.rotation = this.calcRotation(1);
                    break;
            }
        };
        return Tetromino;
    }());
    Tetris.Tetromino = Tetromino;
})(Tetris || (Tetris = {}));
//# sourceMappingURL=tetris.js.map
