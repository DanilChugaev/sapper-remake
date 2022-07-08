/** Уровень сложности игры */
export type TComplexity = {
    /** Number of level bombs */
    bombCount: number,

    /** Size of the field in cells */
    fieldSize: TCellAmount,

    /** If level is selected */
    selected: boolean,
};

/**
 * List of possible levels of difficulty of the game
 *
 * @example
 *  - beginner
 *  - easy
 *  - medium
 *  - hard
 *  - huge
 *  - extreme
 */
export type TComplexityList = {
    [key: string]: TComplexity,
};

/** Basic game settings */
export type TGameSettings = {
    canvasSize: TPixelsAmount;
    devicePixelRatio: number;
    levels: TComplexityList;
};
