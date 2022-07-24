import { container } from '../di/core';
import { IMenu } from './types';
import { CMenu } from './index';

container.registerSingleton<IMenu, CMenu>();