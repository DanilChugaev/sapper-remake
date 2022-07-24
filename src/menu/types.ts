import { IComplexityList } from 'settings/types';

export interface IMenu {
  initListForSelectComplexity(levels: IComplexityList): void
  start(): void
}