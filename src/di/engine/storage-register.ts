import { IStorage } from 'just-engine/src/storage/types';
import { CStorage } from 'just-engine/src/storage/index';

import { container } from '../core';

container.registerSingleton<IStorage, CStorage>();