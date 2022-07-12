import { ITimer } from 'just-engine/src/timer/types';
import { CTimer } from 'just-engine/src/timer/index';

import { container } from '../core';

container.registerSingleton<ITimer, CTimer>();