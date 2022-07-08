import { IContext } from 'just-engine/src/context/types';
import { CContext } from 'just-engine/src/context/index';

import { container } from '../core';

container.registerSingleton<IContext, CContext>();