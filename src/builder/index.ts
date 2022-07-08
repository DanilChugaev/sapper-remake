import { IMath } from 'just-engine/src/math/types';

import { TComplexity, TComplexityList, TGameSettings } from 'settings/types';
import { TMapStructure, IBuilder } from './types';
import { AREA_STRUCTURE, COUNT_OF_CELLS_AROUND_CENTRAL } from './constants';

/** Class responsible for creating levels based on levels settings */
export class CBuilder implements IBuilder {
    /** Size of the field in cells */
    private _fieldSize: TCellAmount = 0;

    /** Size of the field in pixels */
    private _canvasSize: TPixelsAmount = 0;

    /** Number of level bombs */
    private _bombCount = 0;

    /**
     * @param mathInstance - math number generator
     */
    constructor(
        private mathInstance: IMath,
    ) {}

    /**
     * Build level
     *
     * @param settings - basic game settings
     */
    public build(settings: TGameSettings): TMapStructure {
      const { fieldSize, bombCount } = this._getSelectedLevel(settings.levels);

      this._fieldSize = fieldSize;
      this._bombCount = bombCount;
      this._canvasSize = settings.canvasSize;

      const map = this._generateMapStructure();

      return map;
    }

    /**
     * Returns the selected difficulty level from the list of levels from the settings
     *
     * @param levels - list of possible levels of difficulty of the game
     */
    private _getSelectedLevel(levels: TComplexityList): TComplexity {
      let selectedLevel: TComplexity = {
        bombCount: 0,
        selected: false,
        fieldSize: 0,
      };

      for (const key in levels) {
        if (levels[key].selected) {
          selectedLevel = levels[key];
        }
      }

      return selectedLevel;
    }

    /** Generates the field structure for the selected difficulty level */
    private _generateMapStructure(): TMapStructure {
      const mapStructure: TMapStructure = {
        pixelsCountInCell: this._canvasSize / this._fieldSize,
        bombCount: this._bombCount,
        bombLeft: this._bombCount,
        usedCells: 0,
        cells: {},
        bombPositions: [],
        fieldSize: this._fieldSize,
      };

      mapStructure.bombPositions = this._generateRandomBombPositions(this._fieldSize * this._fieldSize);

      // traversal of arrays goes from left to right and from top to bottom
      for (let y = 0; y < this._fieldSize; y++) {
        for (let x = 0; x < this._fieldSize; x++) {
          const row: number = y;
          const cell: number = x;

          if (!mapStructure.cells[row]) {
            mapStructure.cells[row] = {};
          }

          const hasBomb: boolean = mapStructure.bombPositions.includes(x + y * this._fieldSize);
          const area: TAreaStructure = this._generateCellArea({ x, y });

          const cellStructure: TCell = {
            y: row,
            x: cell,
            area,
          };

          if (hasBomb) {
            cellStructure.hasBomb = hasBomb;
          } else {
            cellStructure.value = this._calcBombsAroundCells(area, mapStructure.bombPositions);
          }

          mapStructure.cells[row][cell] = cellStructure;
        }
      }

      return mapStructure;
    }

    /**
     * Generates a region of cells with their coordinates around the selected cell based on its coordinates
     *
     * @param cell - game board cell
     * @param cell.x - the x coordinate on the playing field
     * @param cell.y - the y coordinate on the playing field
     */
    private _generateCellArea({ x, y }: TCell): TAreaStructure {
      const area: TAreaStructure = {};

      for (let index = 0; index < COUNT_OF_CELLS_AROUND_CENTRAL; index++) {
        /** Checking if the cell goes beyond the left and top borders of the field */
        if (x + AREA_STRUCTURE[index].x < 0 || y + AREA_STRUCTURE[index].y < 0) {
          continue;
        }

        /** Checking if the cell goes beyond the right and bottom borders of the field */
        if (x + AREA_STRUCTURE[index].x >= this._fieldSize || y + AREA_STRUCTURE[index].y >= this._fieldSize) {
          continue;
        }

        area[index] = {
          x: x + AREA_STRUCTURE[index].x,
          y: y + AREA_STRUCTURE[index].y,
        };
      }

      return area;
    }

    /**
     * Generates random positions for placing bombs on the field
     *
     * @param cellsCount - number of cells of the playing field
     */
    private _generateRandomBombPositions(cellsCount: TCellAmount): number[] {
      const bombPositions: TBombPositions = [];

      for (let index = 0; index < this._bombCount; index++) {
        let randomPosition: number = this.mathInstance.getRandomArbitrary(1, cellsCount);

        // if the generated position is already in the list, we generate it again
        while (bombPositions.includes(randomPosition)) {
          randomPosition = this.mathInstance.getRandomArbitrary(1, cellsCount);
        }

        bombPositions.push(randomPosition);
      }

      return bombPositions.sort((a, b) => a - b);
    }

    /**
     * Counts the number of bombs around the cell
     *
     * @param area - neighboring cells relative to the center cell
     * @param bombPositions - positions of bombs on the field
     */
    private _calcBombsAroundCells(area: TAreaStructure, bombPositions: TBombPositions): number {
      let result = 0;

      for (const key in area) {
        const cell = area[key];

        if (bombPositions.includes(cell.x + cell.y * this._fieldSize)) {
          result += 1;
        }
      }

      return result;
    }
}
