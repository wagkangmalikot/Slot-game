module Main {
    export const SYMBOL_LIST: Array<number[]> = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        ,

        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        ,

        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    ]

    export function random() {
        return Math.floor(Math.random() * (10 - 1 + 1)) + 1;
    }

    export function generateResult() {
        return [random(), random(), random()]
    }

}
