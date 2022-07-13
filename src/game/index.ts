
import { IUI, TCustomProperties } from 'just-engine/src/ui/types';
import { IStorage } from 'just-engine/src/storage/types';
import { IContext } from 'just-engine/src/context/types';
import { IDom } from 'just-engine/src/dom/types';
import { IMath } from 'just-engine/src/math/types';
import { ITimer } from 'just-engine/src/timer/types';

import { IDrawer } from 'drawer/types';
import { TGameSettings } from 'settings/types';
import { IMapStructure, IBuilder } from 'builder/types';
import { ERROR_COLORS_ACCESS_MESSAGE } from 'drawer/constants';

import { IGame } from './types';
import { ERROR_SYSTEM_ACCESS_MESSAGE, DEFAULT_GAME_LEVEL } from './constants';

/** The main class of the game */
export class CSapper implements IGame {
    /** HTML select for choice of difficulty level */
    private _select: HTMLSelectElement;

    /** HTML button for start game */
    private _startGameButton: HTMLButtonElement;

    /** Container for best level time */
    private _levelTime: HTMLElement;

    /** To display best level time before the game */
    private _bestLevelTime: HTMLElement;

    /** Element on which the game will be drawn */
    private _canvas: HTMLCanvasElement;

    /** Container for fields and other containers */
    private _gameContainer: HTMLElement;

    /** To display the results of the game */
    private _resultContainer: HTMLElement;

    /** Container for current time and best time of the game */
    private _winContainer: HTMLElement;

    /** To display the remaining number of bombs */
    private _leftBombContainer: HTMLElement;

    /** to display the time since the start of the game */
    private _timerContainer: HTMLElement;

    /** Container for current time of the game in win container */
    private _currentTimeContainer: HTMLElement;

    /** Container for best time of the game in win container */
    private _bestTimeContainer: HTMLElement;

    /** Structure of the field of the selected level of difficulty */
    private _system: Nullable<IMapStructure> = null;

    /** Cell size in pixels */
    private _cellPixelsSize: TPixelsAmount = 0;

    /** Number of correctly allocated bombs */
    private _countCorrectlySelectedBombs = 0;

    /** Color variables from custom properties */
    private _colors: TCustomProperties;

    /**
     * @param settings - basic game settings
     * @param contextInstance - provides the context of the canvas
     * @param drawerInstance - for painting on canvas
     * @param domInstance - allows interact with the DOM tree
     * @param builderInstance - responsible for creating levels
     * @param mathInstance - math number generator
     * @param storageInstance - long-term storage of game data
     * @param uiInstance - to control the UI in the game
     * @param timerInstance - to control the UI in the game
     */
    constructor(
        private settings: TGameSettings,
        private contextInstance: IContext,
        private drawerInstance: IDrawer,
        private domInstance: IDom,
        private builderInstance: IBuilder,
        private mathInstance: IMath,
        private storageInstance: IStorage,
        private uiInstance: IUI,
        private timerInstance: ITimer,
    ) {
      this._select = <HTMLSelectElement> domInstance.getElement('select-level');
      this._startGameButton = <HTMLButtonElement> domInstance.getElement('start-game');
      this._levelTime = <HTMLElement> domInstance.getElement('level-time');
      this._bestLevelTime = <HTMLElement> domInstance.getElement('best-level-time');
      this._canvas = <HTMLCanvasElement> domInstance.getElement('canvas');
      this._gameContainer = <HTMLElement> domInstance.getElement('game-container');
      this._resultContainer = <HTMLElement> domInstance.getElement('result-container');
      this._winContainer = <HTMLElement> domInstance.getElement('win-container');
      this._leftBombContainer = <HTMLElement> domInstance.getElement('left-bomb');
      this._timerContainer = <HTMLElement> domInstance.getElement('timer');
      this._currentTimeContainer = <HTMLElement> domInstance.getElement('current-time-container');
      this._bestTimeContainer = <HTMLElement> domInstance.getElement('best-time-container');
      this._colors = this.uiInstance.getColors;

      this.contextInstance.init(this.settings.canvasSize, this.settings.devicePixelRatio);
      this.timerInstance.init({ interval: 1000 });
    }

    /** Initializes game engine after the DOM has loaded */
    public init(): void {
      this.domInstance.afterLoad(() => {
        const selectedLevel = this.storageInstance.get('level') || DEFAULT_GAME_LEVEL;

        /** if we have previously selected the level, then set it again */
        this._changeLevelInSettings(selectedLevel);

        for (const key in this.settings.levels) {
          const option = <HTMLOptionElement> this.domInstance.createElement('option', {
            textContent: key,
            value: key,
            selected: this.settings.levels[key].selected,
          });

          /** substitute the selection options into the select from the settings */
          this._select.appendChild(option);
        }

        this._select.addEventListener('change', this._changeLevel.bind(this), false);

        this._startGameButton.addEventListener('click', this._start.bind(this), false);
      });
    }

    /** Generate level and start the game */
    private _start(): void {
      this._system = this.builderInstance.build(this.settings);
      this._cellPixelsSize = this._system.pixelsCountInCell;

      // display bombs left and timer above the field
      this.domInstance.setText(this._leftBombContainer, String(this._system.bombLeft));
      this.domInstance.setText(this._timerContainer, '0');

      this._changeVisibilityElements();
      this._makeInitialFill();
      this._startTimer();

      this.contextInstance.listenCanvasClick(this._checkClick.bind(this));
      this.contextInstance.listenCanvasContextMenu(this._checkRightButtonClick.bind(this));
    }

    /** Start timer for counting the level time (in seconds) */
    private _startTimer(): void {
      this.timerInstance.start(
        (iteration) => {
          this.domInstance.setText(this._timerContainer, String(iteration));
        },
      );
    }

    /**
     * Stop timer and save the level time count
     *
     * @param isWin - true, if the game ends with a win
     */
    private _stopTimer(isWin: boolean): void {
      const currentTime = String(this.timerInstance.stop());

      if (isWin) {
        const currentLevel = this.storageInstance.get('level');
        const bestTimeStorageName = `best-time-${currentLevel}`;
        const bestTime = this.storageInstance.get(bestTimeStorageName);
        let time = '';

        // display current time on the finish screen
        this.domInstance.setText(this._currentTimeContainer, currentTime);

        if (bestTime && Number(bestTime) < Number(currentTime)) {
          time = bestTime;
        } else {
          time = currentTime;
        }

        this.storageInstance.save({
          name: bestTimeStorageName,
          value: time,
        });

        // display best time on the finish screen
        this.domInstance.setText(this._bestTimeContainer, time);
      }
    }

    /**
     * Changes the level after changing the value in the select
     *
     *  @param event - DOM event
     */
    private _changeLevel(event: Event): void {
      this._changeLevelInSettings((event.target as HTMLSelectElement).value);

      this.storageInstance.save({
        name: 'level',
        value: (event.target as HTMLSelectElement).value,
      });
    }

    /**
     * Changes the level of the game in the settings
     *
     * @param selectedLevel - nama of selected level
     */
    private _changeLevelInSettings(selectedLevel: string): void {
      const bestTime = this.storageInstance.get(`best-time-${selectedLevel}`);

      // if the level was passed earlier, then display its best time on the start screen
      if (bestTime) {
        this._levelTime.style.display = 'block';

        this.domInstance.setText(this._bestLevelTime, bestTime);
      } else {
        this._levelTime.style.display = 'none';
      }

      for (const key in this.settings.levels) {
        this.settings.levels[key].selected = false;
      }

      this.settings.levels[selectedLevel].selected = true;
    }

    /** Changes visibility of game elements on the page after start of the game */
    private _changeVisibilityElements(): void {
      this._startGameButton.style.display = 'none';
      this._select.style.display = 'none';
      this._levelTime.style.display = 'none';
      this._gameContainer.style.display = 'flex';
      this._canvas.style.display = 'block';
    }

    /** Fills the entire canvas by default with the default color */
    private _makeInitialFill(): void {
      if (!this._colors) {
        throw new Error(ERROR_COLORS_ACCESS_MESSAGE);
      }

      const size: TPixelsAmount = this.settings.canvasSize;

      this.drawerInstance.drawSquare({
        x: 0,
        y: 0,
      }, size, this._colors.FIELD_BG_COLOR);
    }

    /**
     * Track the click on the canvas
     *
     * @param mouseEvent - events that occur due to the user interacting with a mouse
     * @param mouseEvent.offsetX - offset of the mouse cursor along the X axis from the edge of the canvas
     * @param mouseEvent.offsetY - offset of the mouse cursor along the Y axis from the edge of the canvas
     */
    private _checkClick({ offsetX, offsetY }: MouseEvent): void {
      const cell = this._getCell(offsetX, offsetY);

      // to click on the cell with the flag - first you need to remove it
      if (!cell.hasFlag) {
        if (cell.hasBomb) {
          this._openBombCell(cell); // draw a bomb in the specified cell
          this._openAllBombs(); // draw all the other bombs
          this._stopGame(); // stop the game
        } else if (cell.value !== 0) {
          this._openNumberSquare(cell); // draw a cell with a number
        } else {
          this._openEmptySquare(cell); // draw an empty cell
          this._recursiveOpenArea(cell); // go through the neighbors and draw the cells until the number appears in the cell
        }

        this._checkIfGameShouldStopped();
      }
    }

    /**
     * Track the right mouse button click on the canvas
     *
     * @param mouseEvent - events that occur due to the user interacting with a mouse
     */
    private _checkRightButtonClick(mouseEvent: MouseEvent): void {
      // prevent the context menu from opening
      mouseEvent.preventDefault();

      const cell = this._getCell(mouseEvent.offsetX, mouseEvent.offsetY);

      if (!cell.isOpen) {
        if (!cell.hasFlag) {
          this._setFlag(cell);
        } else {
          this._removeFlag(cell);
        }
      }
    }

    /**
     * Returns the cell of the generated level
     *
     * @param offsetX - offset of the mouse cursor along the X axis from the edge of the canvas
     * @param offsetY - offset of the mouse cursor along the Y axis from the edge of the canvas
     */
    private _getCell(offsetX: number, offsetY: number): TCell {
      const x = this.mathInstance.getFloorNumber(offsetX / (this._system as IMapStructure).pixelsCountInCell);
      const y = this.mathInstance.getFloorNumber(offsetY / (this._system as IMapStructure).pixelsCountInCell);

      return this._system?.cells[y][x];
    }

    /**
     * Open area of cells around a given cell
     *
     * @param cell - game board cell
     */
    private _recursiveOpenArea(cell: TCell): void {
      for (const index in cell.area) {
        const systemCell = this._system?.cells[cell.area[Number(index)].y][cell.area[Number(index)].x];

        /**
         * skip from processing:
         *  - open cell
         *  - flag cell
         *  - bomb cell
         */
        if (!systemCell.isOpen && !systemCell.hasFlag && !systemCell.hasBomb) {
          if (systemCell.value === 0) {
            this._openEmptySquare(systemCell);

            this._recursiveOpenArea(systemCell);
          } else {
            this._openNumberSquare(systemCell);

            continue;
          }
        } else {
          continue;
        }
      }
    }

    /**
     * Open empty cell
     *
     * @param cell - game board cell
     */
    private _openEmptySquare(cell: TCell): void {
      if (!this._colors) {
        throw new Error(ERROR_COLORS_ACCESS_MESSAGE);
      }

      this.drawerInstance.drawSquare({
        x: this._calcPixelCoord(cell.x),
        y: this._calcPixelCoord(cell.y),
      }, this._cellPixelsSize, this._colors.MAIN_BG_COLOR);

      cell.isOpen = true;
      this._increaseUsedCells();
    }

    /**
     * Open cell with number
     *
     * @param cell - game board cell
     */
    private _openNumberSquare(cell: TCell): void {
      this.drawerInstance.drawNumber({
        x: this._calcPixelCoord(cell.x),
        y: this._calcPixelCoord(cell.y),
      }, this._cellPixelsSize, (cell.value as number));

      cell.isOpen = true;
      this._increaseUsedCells();
    }

    /**
     * Open cell with bomb
     *
     * @param cell - game board cell
     */
    private _openBombCell(cell: TCell): void {
      this.drawerInstance.drawBomb({
        x: this._calcPixelCoord(cell.x),
        y: this._calcPixelCoord(cell.y),
      }, this._cellPixelsSize);

      cell.isOpen = true;
      this._increaseUsedCells();
    }

    /** Open all bombs on the field */
    private _openAllBombs(): void {
      const { bombPositions, cells, fieldSize } = (this._system as IMapStructure);

      for (let y = 0; y < Object.keys(cells).length; y++) {
        for (let x = 0; x < Object.keys(cells[y]).length; x++) {
          if (bombPositions.includes(x + y * fieldSize)) {
            this._openBombCell(cells[y][x]);
          }
        }
      }
    }

    /**
     * Set a flag in a cell and count the correctly selected bombs
     *
     * @param cell - game board cell
     */
    private _setFlag(cell: TCell): void {
      if (!this._system) {
        throw new Error(ERROR_SYSTEM_ACCESS_MESSAGE);
      }

      this.drawerInstance.drawFlag({
        x: this._calcPixelCoord(cell.x),
        y: this._calcPixelCoord(cell.y),
      }, this._cellPixelsSize);

      cell.hasFlag = true;
      this._increaseUsedCells();

      this._system.bombLeft = this._system.bombLeft - 1;
      // displaying the number of remaining bombs over the field
      this.domInstance.setText(this._leftBombContainer, String(this._system.bombLeft));

      if (cell.hasBomb) {
        this._countCorrectlySelectedBombs++;
      }

      this._checkIfGameShouldStopped();
    }

    /**
     * Remove flag from cell
     *
     * @param cell - game board cell
     */
    private _removeFlag(cell: TCell): void {
      if (!this._system) {
        throw new Error(ERROR_SYSTEM_ACCESS_MESSAGE);
      }

      if (!this._colors) {
        throw new Error(ERROR_COLORS_ACCESS_MESSAGE);
      }

      this.drawerInstance.drawSquare({
        x: this._calcPixelCoord(cell.x),
        y: this._calcPixelCoord(cell.y),
      }, this._cellPixelsSize, this._colors.FIELD_BG_COLOR, false);

      cell.hasFlag = false;
      this._decreaseUsedCells();

      this._system.bombLeft = this._system.bombLeft + 1;
      // displaying the number of remaining bombs over the field
      this.domInstance.setText(this._leftBombContainer, String(this._system.bombLeft));

      if (cell.hasBomb) {
        this._countCorrectlySelectedBombs--;
      }
    }

    /**
     * Calculate the initial coordinates of the cell in pixels
     *
     * @param coord - coordinate on the playing field
     */
    private _calcPixelCoord(coord: TFieldCoordinate): TPixelsAmount {
      return Number(coord) * this._cellPixelsSize;
    }

    /**
     * Stop game
     *
     * @param isWin - true, if the game ends with a win
     */
    private _stopGame(isWin = false): void {
      this._stopTimer(isWin);

      // show the restart button
      this._resultContainer.style.display = 'flex';

      if (isWin) {
        // if you won, show congratulations
        this._winContainer.style.display = 'flex';
      }

      // this is to animate the background appearance
      setTimeout(() => {
        this._resultContainer.classList.add('result-container--is-visible');
      }, 50);
    }

    /**
     * Check the conditions for stopping the game
     */
    private _checkIfGameShouldStopped(): void {
      if (!this._system) {
        throw new Error(ERROR_SYSTEM_ACCESS_MESSAGE);
      }

      // has zero bomb
      if (!(this._system.bombLeft === 0)) {
        return;
      }

      // all bombs are correctly selected
      if (!(this._system.bombCount === this._countCorrectlySelectedBombs)) {
        return;
      }

      // all cells are opened
      if (!(this._system.usedCells === (this._system.fieldSize * this._system.fieldSize))) {
        return;
      }

      // stop the game with a win if all the bombs have run out and are marked with flags correctly
      this._stopGame(true);
    }

    /**
     * Increase count of used cells in map structure
     */
    private _increaseUsedCells(): void {
      this._system.usedCells++;
    }

    /**
     * Decrease count of used cells in map structure
     */
    private _decreaseUsedCells(): void {
      this._system.usedCells--;
    }
}
