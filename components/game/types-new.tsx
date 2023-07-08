export interface MapPosition {
  rowIndex: number;
  columnIndex: number;
}

enum TileType {
  Base = 0,
  Spawner = 1,
  Fog = 2,
  Army = 3,
  Blank = 4,
}

// TileType
// isRevealed {boolean}
// playerId {number}
// unitiesCount {number}
export type TileProp = [TileType, boolean, number, number];

export type TilesProp = TileProp[];

export type MapProp = TilesProp[];

// todo remove these type
// id, name, color
export type PlayerProp = [number, string, number];

export type PlayersProp = Record<number, PlayerProp>;
