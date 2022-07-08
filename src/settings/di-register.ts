import { container } from '../di/core';
import { TGameSettings } from './types';
import settings from './index';

container.registerSingleton<TGameSettings>(() => settings);
