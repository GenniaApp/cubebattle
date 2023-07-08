import { TileType, MapDataProp, Player } from '@/lib/types';

export const mapData: MapDataProp = [
  [
    [TileType.Fog, 0, 0],
    [TileType.Fog, 1, 5],
    [TileType.King, 1, 3],
    [TileType.City, 0, 48],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Obstacle, null, 0],
    [TileType.Fog, 0, 0],
    [TileType.Obstacle, 0, 0],
  ],
  [
    [TileType.Obstacle, null, 0],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Obstacle, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
  ],
  [
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
  ],
  [
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Obstacle, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.City, 0, 48],
    [TileType.King, 2, 3],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
  ],
  [
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Swamp, 0, 0],
    [TileType.Swamp, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
  ],
  [
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Obstacle, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
  ],
  [
    [TileType.Fog, 0, 0],
    [TileType.Obstacle, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Obstacle, 0, 0],
    [TileType.Fog, 0, 0],
  ],
  [
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Obstacle, 0, 0],
    [TileType.Obstacle, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
  ],
  [
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Fog, 0, 0],
    [TileType.Obstacle, 0, 0],
    [TileType.Obstacle, 0, 0],
    [TileType.Obstacle, 0, 0],
  ],
];

// playersState Object<[id, name, color]>
export const players = [
  new Player('id1', 'socket_id1', 'name1', 0),
  new Player('id2', 'socket_id2', 'name2', 0),
];

export const leaderBoardData = [
  { color: 0, username: 'dh', armyCount: 1736, landsCount: 43 },
  { color: 1, username: 'IDK', armyCount: 1233, landsCount: 32 },
];
