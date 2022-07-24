import { IDom } from 'just-engine/src/dom/types';

import { IComplexityList } from 'settings/types';

import {
  GAME_IS_STARTED_CLASS,
  PAGE_ID,
  GAME_CONTAINER_ID,
  CANVAS_ID,
  SELECT_ID,
} from './constants';
import { IMenu } from './types';

/** Manages menu items */
export class CMenu implements IMenu {
  /** HTML body of page */
  private _page: HTMLBodyElement;

  /** Container for fields and other containers */
  private _gameContainer: HTMLElement;

  /** Element on which the game will be drawn */
  private _canvas: HTMLCanvasElement;

  /** HTML select for choice of difficulty level */
  private _select: HTMLSelectElement;

  /**
   * @param domInstance - allows interact with the DOM tree
   */
  constructor(
    private domInstance: IDom,
  ) {
    this._page = <HTMLBodyElement> domInstance.getElementById(PAGE_ID);
    this._gameContainer = <HTMLElement> domInstance.getElementById(GAME_CONTAINER_ID);
    this._canvas = <HTMLCanvasElement> domInstance.getElementById(CANVAS_ID);
    this._select = <HTMLSelectElement> domInstance.getElementById(SELECT_ID);
  }

  // public init(settings): void {
  //   this._initListForSelectComplexity(settings.levels);
  // }

  /**
   * @param levels
   */
  public initListForSelectComplexity(levels: IComplexityList): void {
    for (const key in levels) {
      const option = <HTMLOptionElement> this.domInstance.createElement('option', {
        textContent: key,
        value: key,
        selected: levels[key].selected,
      });

      /** substitute the selection options into the select from the settings */
      this._select.appendChild(option);
    }
  }

  /**
   *
   */
  public start(): void {
    this._changeVisibilityElements();
  }

  /** Changes visibility of game elements on the page after start of the game */
  private _changeVisibilityElements(): void {
    this._page.classList.add(GAME_IS_STARTED_CLASS);

    this._select.style.display = 'none';
    this._gameContainer.style.display = 'flex';
    this._canvas.style.display = 'block';
  }
}