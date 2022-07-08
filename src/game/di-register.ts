import { container } from '../di/core';
import { IGame } from './types';
import { CSapper } from './index';

container.registerSingleton<IGame, CSapper>();