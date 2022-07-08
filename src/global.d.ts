/** If true, the app is running in development mode */
declare module 'consts:IS_DEV_MODE' {
  const isDev: true | false;

  export default isDev;
}

/** Number of cells of the playing field */
type TCellAmount = number;
/** Number of pixels */
type TPixelsAmount = number;

/** Coordinate on the playing field */
type TFieldCoordinate = number;
type TPixelCoordinate = number;

/** Neighboring cells relative to the center cell */
type TAreaStructure = {
  [key: number]: TCell;
};

/** Game board cell */
type TCell = {
  x: TFieldCoordinate;
  y: TFieldCoordinate;
  area?: TAreaStructure;
  hasBomb?: boolean;
  hasFlag?: boolean;
  isOpen?: boolean;
  value?: number;
};

/** Positions of bombs on the field */
type TBombPositions = number[];

/** Any */
type THexadecimalColor = string;
type TColor = THexadecimalColor;
type Nullable<T> = T | null;
