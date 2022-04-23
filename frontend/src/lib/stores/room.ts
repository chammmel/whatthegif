import { RoomInfoRequest, GameState } from '$lib/generated/protocol/communication';
import { writable } from 'svelte/store';
import backend from './backend';
import type { User } from './user';

export interface Room {
  code: string;
  playerLimit: number;
  playerCount: number;
  rounds: number;
  keywords: Array<string>;
  users: Array<User>;
  gameState: GameState;
}

export const room = writable<Room>({
  code: '',
  playerCount: 0,
  playerLimit: 0,
  rounds: 0,
  keywords: [],
  users: []
});

export const loadRoomInfo = (id: string) => {
  backend.request(RoomInfoRequest, 'RoomInfoRequest', { code: id } as RoomInfoRequest);
};
