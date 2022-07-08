import { IMath } from 'just-engine/src/math/types';
import { CMath } from 'just-engine/src/math/index';

import { container } from '../core';

container.registerSingleton<IMath, CMath>();