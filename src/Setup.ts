namespace Tetris {
    export const GAME_OPTIONS = {
        rows: 20,
        columns: 10,
    }

    export const DISPLAY_OPTIONS = {
        blockSize: 25,
        gapSize: 3,
    }

    export enum COLORS {
        '#B4B4B4',
        'crimson',
        'darkcyan',
        'darkslategrey',
        'darkseagreen',
        'yellowgreen',
        'mediumslateblue',
        'steelblue'
    }

    export enum DIR {
        "LEFT",
        "RIGHT",
        "DOWN",
        "IDLE"
    }
}