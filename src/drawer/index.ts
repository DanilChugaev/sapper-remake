import { UIInterface, CustomProperties } from 'just-engine/src/ui/types';
import { CanvasContext, ContextInterface } from 'just-engine/src/context/types';
import { SourceInterface } from 'just-engine/src/source/types';

import { TGameSettings } from 'settings/types';

import { IDrawer } from './types';
import { ERROR_CONTEXT_ACCESS_MESSAGE, ERROR_COLORS_ACCESS_MESSAGE } from './constants';

/** Class implements painting on canvas */
export class CDrawer implements IDrawer {
  /** Canvas 2d context */
  private _context: CanvasContext;

  /** Bomb image */
  private _bomb: CanvasImageSource;

  /** Flag image */
  private _flag: CanvasImageSource;

  /** Color variables from custom properties */
  private _colors: CustomProperties;

  /**
   * @param contextInstance - provides the context of the canvas
   * @param sourceInstance - to interact with the file system
   * @param uiInstance - to control the UI in the game
   * @param settings - basic game settings
   */
  constructor(
    private contextInstance: ContextInterface,
    private sourceInstance: SourceInterface,
    private uiInstance: UIInterface,
    private settings: TGameSettings,
  ) {
    this.contextInstance.init(this.settings.canvasSize, this.settings.devicePixelRatio);
    this._context = this.contextInstance.getInstance();

    if (!this._context) {
      throw new Error(ERROR_CONTEXT_ACCESS_MESSAGE);
    }

    this._bomb = this.sourceInstance.getImage('bomb');
    this._flag = this.sourceInstance.getImage('flag');
    this._colors = this.uiInstance.getColors;
  }

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
  public drawSquare({ x, y }: TCell, size: TPixelsAmount, color: string, hasBorders = true): void {
    if (!this._context) {
      throw new Error(ERROR_CONTEXT_ACCESS_MESSAGE);
    }

    this._context.fillStyle = color;
    this._context.fillRect(x, y, size, size);

    if (hasBorders) {
      this._drawBorders({ x, y }, size);
    }
  }

  /**
   * Draws square with number
   *
   * @param cell - game board cell
   * @param cell.x - cell x coordinate
   * @param cell.y - cell y coordinate
   * @param size - square size in pixels
   * @param value - number to draw
   */
  public drawNumber({ x, y }: TCell, size: TPixelsAmount, value: number): void {
    if (!this._context) {
      throw new Error(ERROR_CONTEXT_ACCESS_MESSAGE);
    }

    if (!this._colors) {
      throw new Error(ERROR_COLORS_ACCESS_MESSAGE);
    }

    this.drawSquare({ x, y }, size, this._colors.MAIN_BG_COLOR);

    /** font size should be less than the size of the square */
    this._context.font = `${size / 2}px ${this.uiInstance.getFont}`;
    this._context.fillStyle = this._colors.TEXT_COLOR;

    /** since the number is stretched upwards, for centering, we divide the width by a larger number than the height */
    this._context.fillText(value.toString(), x + (size / 2.5), y + (size / 1.5));
  }

  /**
   * Draws square with bomb
   *
   * @param cell - game board cell
   * @param cell.x - cell x coordinate
   * @param cell.y - cell y coordinate
   * @param size - square size in pixels
   */
  public drawBomb({ x, y }: TCell, size: TPixelsAmount): void {
    if (!this._context) {
      throw new Error(ERROR_CONTEXT_ACCESS_MESSAGE);
    }

    if (!this._colors) {
      throw new Error(ERROR_COLORS_ACCESS_MESSAGE);
    }

    this.drawSquare({ x, y }, size, this._colors.FIELD_BG_COLOR, false);

    const imageSize: number = this._getImageSize(size);

    this._context.drawImage(this._bomb, this._getImageCoord(x, size), this._getImageCoord(y, size), imageSize, imageSize);
  }

  /**
   * Draws square with flag
   *
   * @param cell - game board cell
   * @param cell.x - cell x coordinate
   * @param cell.y - cell y coordinate
   * @param size - square size in pixels
   */
  public drawFlag({ x, y }: TCell, size: TPixelsAmount): void {
    if (!this._context) {
      throw new Error(ERROR_CONTEXT_ACCESS_MESSAGE);
    }

    if (!this._colors) {
      throw new Error(ERROR_COLORS_ACCESS_MESSAGE);
    }

    this.drawSquare({ x, y }, size, this._colors.FLAG_BG_COLOR, false);

    const imageSize: number = this._getImageSize(size);

    this._context.drawImage(this._flag, this._getImageCoord(x, size), this._getImageCoord(y, size), imageSize, imageSize);
  }

  /**
   * Calculates the size of the image squared
   *
   * @param size - square size in pixels
   */
  private _getImageSize(size: number): number {
    return size / 2;
  }

  /**
   * Returns coordinate of image in the cell
   *
   * @param cellCoord - x or y coordinate of cell
   * @param size - square size in pixels
   */
  private _getImageCoord(cellCoord: number, size: number): number {
    return cellCoord + (size / 4);
  }

  /**
   * Draws borders for square
   *
   * @param cell - game board cell
   * @param cell.x - cell x coordinate
   * @param cell.y - cell y coordinate
   * @param size - square size in pixels
   */
  private _drawBorders({ x, y }: TCell, size: TPixelsAmount): void {
    if (!this._context) {
      throw new Error(ERROR_CONTEXT_ACCESS_MESSAGE);
    }

    if (!this._colors) {
      throw new Error(ERROR_COLORS_ACCESS_MESSAGE);
    }

    this._context.strokeStyle = this._colors.BORDER_COLOR;
    this._context.strokeRect(x, y, size, size);
  }
}
