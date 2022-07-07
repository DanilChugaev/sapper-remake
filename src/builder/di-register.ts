import { container } from '../di/core';
import { BuilderInterface } from './types';
import { BuilderClass } from './index';

container.registerSingleton<BuilderInterface, BuilderClass>();