import { GameSettings } from '../settings/types';

/** Structure of the field of the selected level of difficulty */
export type MapStructure = {
    pixelsCountInCell: number,
    bombCount: number,
    bombLeft: number,
    usedCells: number,
    cells: any, // TODO: fix type
    bombPositions: BombPositions,
    fieldSize: number,
};

/** Responsible for creating levels */
export interface BuilderInterface {
    /**
     * Build level
     *
     * @param settings - basic game settings
     */
    build(settings: GameSettings): MapStructure;
}
