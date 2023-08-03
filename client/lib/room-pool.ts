import { Room, RoomPool } from './types';

export const roomPool: RoomPool = {};

const MAX_ROOM_COUNT = 15;
var roomCount = 0;

createRoom('1', 'Bot Room');

export async function createRoom(
  roomId: string = '',
  roomName: string = 'Untitled'
) {
  try {
    if (Object.keys(roomPool).length > MAX_ROOM_COUNT)
      throw new Error('Room count exceeded');
    if (!roomId) {
      ++roomCount;
      roomId = String(roomCount);
    }
    let newRoom = new Room(roomId, roomName);
    newRoom.keepAlive = true;
    roomPool[roomId] = newRoom;
    return {
      success: true,
      roomId: roomId,
    };
  } catch (e: any) {
    console.error(JSON.stringify(e, ["message", "arguments", "type", "name"]));
    return {
      success: false,
      message: e.message,
    };
  }
}
