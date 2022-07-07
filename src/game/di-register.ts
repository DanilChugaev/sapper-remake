import { container } from '../di/core';
import { GameInterface } from './types';
import { Sapper } from './index';

container.registerSingleton<GameInterface, Sapper>();