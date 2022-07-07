import { SourceInterface } from 'just-engine/src/source/types';
import { SourceClass } from 'just-engine/src/source/index';

import { container } from '../core';

container.registerSingleton<SourceInterface, SourceClass>();