import { container } from '../di/core';
import { DrawerInterface } from './types';
import { DrawerClass } from './index';

container.registerSingleton<DrawerInterface, DrawerClass>();