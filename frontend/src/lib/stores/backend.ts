import { DataService, type NewMessage } from '$lib/service/data.service';
import { handle } from '$lib/service/event-handler.service';

import { writable } from 'svelte/store';

export const messages = writable<Array<NewMessage>>([]);

export const latestMessage = writable<NewMessage>();

const addMessage = (newMessage: NewMessage) => {
  messages.update((mgs) => [...mgs, newMessage]);
  latestMessage.set(newMessage);
};

const dataService = new DataService();

export default {
  subscribe: messages.subscribe,
  listen: () => {
    latestMessage.subscribe((m) => {
      if (m) {
        handle(m);
      }
    });
  },
  connect: () => {
    dataService.connectToServer(addMessage);
  },
  preJoinRequest: dataService.preJoinRequest,
  createRoomRequest: dataService.createRoomRequest
};
