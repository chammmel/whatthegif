import type {
  Content,
  CreateRoomResponse,
  JoinResponse,
  PreJoinResponse
} from '$lib/generated/protocol/communication';
import { DataService } from '$lib/service/data.service';

import { writable } from 'svelte/store';

const defaultValue = [];

export const messages =
  writable<Array<PreJoinResponse | JoinResponse | Content | CreateRoomResponse>>(defaultValue);

const addMessage = (data: PreJoinResponse | JoinResponse | Content | CreateRoomResponse) => {
  messages.update((mgs) => [...mgs, data]);
};

const dataService = new DataService();

export default {
  subscribe: messages.subscribe,
  connect: () => {
    dataService.connectToServer(addMessage);
  },
  preJoinRequest: dataService.preJoinRequest,
  createRoomRequest: dataService.createRoomRequest
};
