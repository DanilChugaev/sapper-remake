import { IDom } from 'just-engine/src/dom/types';
import { CDom } from 'just-engine/src/dom/index';

import { container } from '../core';

container.registerSingleton<IDom, CDom>();