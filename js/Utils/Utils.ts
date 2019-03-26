module Main {
    export const SYMBOL_LIST: Array<number[]> = [//handle the symbol list on each reel column
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        ,

        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        ,

        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    ]
    export const Paylines: { payline: Array<number[]> , index:number}[] = [// winning paylines for the slots
        { "payline": [[0,1,0],[0,1,0],[0,1,0]] , "index": 1},
        { "payline": [[1,1,1],[0,0,0],[0,0,0]] , "index": 2},
        { "payline": [[0,0,1],[0,1,0],[1,0,0]] , "index": 3},
        { "payline": [[0,0,1],[0,0,1],[0,0,1]] , "index": 4},
        { "payline": [[0,0,0],[1,1,1],[0,0,0]] , "index": 5},
        { "payline": [[1,0,0],[0,1,0],[0,0,1]] , "index": 6},
        { "payline": [[1,0,0],[1,0,0],[1,0,0]] , "index": 7},
        { "payline": [[0,0,0],[0,0,0],[1,1,1]] , "index": 8},
    ];

    export function random() {// random numbers from 1 to 10. for the result symbols
        return Math.floor(Math.random() * (10 - 1 + 1)) + 1;
    }

    export function generateResult() {// the default spin result
        return [random(), random(), random()]
    }
    export function generateResultBonus() {// to win bonus game by force
        return [1,10,1]
    }
    export function generateResultWin() {// to win symbols by force
        return [1,4,7];
    }

}
