/** For painting on canvas */
export interface IDrawer {
    /**
     * Draws an empty square
     *
     * @param cell - game board cell
     * @param cell.x - cell x coordinate
     * @param cell.y - cell y coordinate
     * @param size - square size in pixels
     * @param color - square color
     * @param hasBorders - whether to draw borders at a square
     */
    drawSquare(cell: TCell, size: TPixelsAmount, color: string, hasBorders?: boolean): void;

    /**
     * Draws square with number
     *
     * @param cell - game board cell
     * @param cell.x - cell x coordinate
     * @param cell.y - cell y coordinate
     * @param size - square size in pixels
     * @param value - number to draw
     */
    drawNumber(cell: TCell, size: TPixelsAmount, value: number): void;

    /**
     * Draws square with bomb
     *
     * @param cell - game board cell
     * @param cell.x - cell x coordinate
     * @param cell.y - cell y coordinate
     * @param size - square size in pixels
     */
    drawBomb(cell: TCell, size: TPixelsAmount): void;

    /**
     * Draws square with flag
     *
     * @param cell - game board cell
     * @param cell.x - cell x coordinate
     * @param cell.y - cell y coordinate
     * @param size - square size in pixels
     */
    drawFlag(cell: TCell, size: TPixelsAmount): void;
}
