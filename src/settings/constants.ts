import { IComplexityList } from './types';

/** List of game difficulty levels */
export const LEVELS: IComplexityList = {
  beginner: {
    bombCount: 10,
    fieldSize: 20,
    selected: false,
  },
  easy: {
    bombCount: 15,
    fieldSize: 10,
    selected: true,
  },
  medium: {
    bombCount: 40,
    fieldSize: 20,
    selected: false,
  },
  hard: {
    bombCount: 100,
    fieldSize: 20,
    selected: false,
  },
  huge: {
    bombCount: 220,
    fieldSize: 32,
    selected: false,
  },
  extreme: {
    bombCount: 150,
    fieldSize: 20,
    selected: false,
  },
};
