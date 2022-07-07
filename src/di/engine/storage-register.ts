import { StorageInterface } from 'just-engine/src/storage/types';
import { StorageClass } from 'just-engine/src/storage/index';

import { container } from '../core';

container.registerSingleton<StorageInterface, StorageClass>();