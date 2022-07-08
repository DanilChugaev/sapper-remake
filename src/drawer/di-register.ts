import { container } from '../di/core';
import { IDrawer } from './types';
import { CDrawer } from './index';

container.registerSingleton<IDrawer, CDrawer>();