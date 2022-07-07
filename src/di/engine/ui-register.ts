import { UIInterface } from 'just-engine/src/ui/types';
import { UIClass } from 'just-engine/src/ui/index';

import { container } from '../core';

container.registerSingleton<UIInterface, UIClass>();