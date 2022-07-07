import { container } from '../di/core';
import { GameSettings } from './types';
import settings from './index';

container.registerSingleton<GameSettings>(() => settings);
