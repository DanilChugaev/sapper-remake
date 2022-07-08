import { IUI } from 'just-engine/src/ui/types';
import { CUI } from 'just-engine/src/ui/index';

import { container } from '../core';

container.registerSingleton<IUI, CUI>();