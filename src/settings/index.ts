import { TGameSettings } from './types';
import { LEVELS } from './constants';

/** Basic game settings */
const settings: TGameSettings = {
  /** Size of the field in pixels */
  canvasSize: 800,

  /** The ratio of the display resolution of the current device in physical pixels to the resolution in logical (CSS) pixels */
  devicePixelRatio: 1,

  /** List of game difficulty levels */
  levels: LEVELS,
};

/** Small hardcode for 13 inch display */
if (window.innerHeight < 850) {
  settings.canvasSize = 600;
}

export default settings;