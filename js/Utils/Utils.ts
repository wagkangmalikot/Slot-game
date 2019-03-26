module Main {
    export const SYMBOL_LIST: Array<number[]> = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        ,

        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        ,

        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    ]
    export const Paylines: { payline: Array<number[]> , index:number}[] = [
        { "payline": [[0,1,0],[0,1,0],[0,1,0]] , "index": 1},
        { "payline": [[1,1,1],[0,0,0],[0,0,0]] , "index": 2},
        { "payline": [[0,0,1],[0,1,0],[1,0,0]] , "index": 3},
        { "payline": [[0,0,1],[0,0,1],[0,0,1]] , "index": 4},
        { "payline": [[0,0,0],[1,1,1],[0,0,0]] , "index": 5},
        { "payline": [[1,0,0],[0,1,0],[0,0,1]] , "index": 6},
        { "payline": [[1,0,0],[1,0,0],[1,0,0]] , "index": 7},
        { "payline": [[0,0,0],[0,0,0],[1,1,1]] , "index": 8},
    ];

    export function random() {
        return Math.floor(Math.random() * (10 - 1 + 1)) + 1;
    }

    export function generateResult() {
        return [2,1,3]
        // return [random(), random(), random()]
    }

}
