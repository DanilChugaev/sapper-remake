import { container } from '../di/core';
import { IBuilder } from './types';
import { CBuilder } from './index';

container.registerSingleton<IBuilder, CBuilder>();