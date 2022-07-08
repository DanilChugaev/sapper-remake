import { ISource } from 'just-engine/src/source/types';
import { CSource } from 'just-engine/src/source/index';

import { container } from '../core';

container.registerSingleton<ISource, CSource>();