import IS_DEV_MODE from 'consts:IS_DEV_MODE';

import { container } from './di/register';
import { IGame } from './game/types';

import './index.styl';

if (IS_DEV_MODE) {
  console.log('is dev');
}

const sapper = container.get<IGame>();

sapper.init();