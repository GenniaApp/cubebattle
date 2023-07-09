import { Room, RoomPool } from './types';

export const roomPool: RoomPool = {};

const MAX_ROOM_COUNT = 15;
var roomCount = 0;

createRoom('Test Room 1');

export async function createRoom(roomName: string = 'Untitled') {
  try {
    if (roomCount > MAX_ROOM_COUNT) throw new Error('Room count exceeded');
    ++roomCount;
    let roomId = String(roomCount);
    roomPool[roomId] = new Room(roomId, roomName);
    return {
      success: true,
      roomId: roomId,
    };
  } catch (err: any) {
    console.log(err);
    return {
      success: false,
      message: err.message,
    };
  }
}
