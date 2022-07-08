import { TGameSettings } from 'settings/types';

/** Structure of the field of the selected level of difficulty */
export type TMapStructure = {
    pixelsCountInCell: number,
    bombCount: number,
    bombLeft: number,
    usedCells: number,
    cells: any, // TODO: fix type
    bombPositions: TBombPositions,
    fieldSize: number,
};

/** Responsible for creating levels */
export interface IBuilder {
    /**
     * Build level
     *
     * @param settings - basic game settings
     */
    build(settings: TGameSettings): TMapStructure;
}
