import { goto } from '$app/navigation';
import {
  CreateRoomError,
  CreateRoomResponse,
  JoinError,
  JoinRequest,
  JoinResponse,
  PreJoinResponse,
  RoomInfoError,
  RoomInfoResponse
} from '$lib/generated/protocol/communication';
import backend from '$lib/stores/backend';
import { currentPopUp as PopupStore, PopUpType } from '$lib/stores/popup';
import { room as RoomStore } from '$lib/stores/room';

import { user as UserStore } from '$lib/stores/user';
import { get } from 'svelte/store';
import { MessageType, type NewMessage } from './data.service';

export const handle = (message: NewMessage) => {
  switch (message.messageType) {
    case MessageType.PreJoinResponse:
      handlePreJoinResponse(message.data as PreJoinResponse);
      break;
    case MessageType.JoinResponse:
      handleJoinResponse(message.data as JoinResponse);
      break;
    case MessageType.CreateRoomResponse:
      handleCreateRoomResponse(message.data as CreateRoomResponse);
      break;
    case MessageType.RoomInfoResponse:
      handleRoomInfoResponse(message.data as RoomInfoResponse);
      break;
  }
};

const handlePreJoinResponse = (response: PreJoinResponse) => {
  switch (response.error) {
    case JoinError.NOT_FOUND:
      goto('/');
      alert('The room was not found');
      break;
    case JoinError.REQUIRES_PASSWORD:
    case JoinError.WRONG_PASSWORD:
    case JoinError.UNALLOWED_USERNAME:
      PopupStore.set(PopUpType.JOIN);
      break;
    case JoinError.ROOM_FULL:
      alert('The room is full');
      break;

    case JoinError.FINE: {
      const user = get(UserStore);
      backend.request(JoinRequest, 'JoinRequest', {
        room: response.code,
        username: user.name
      } as JoinRequest);
      break;
    }

    default:
      break;
  }
};

function handleJoinResponse(response: JoinResponse) {
  switch (response.error) {
    case JoinError.FINE:
      UserStore.update((u) => ({
        ...u,
        isAuthenticated: true
      }));
      RoomStore.update((r) => ({
        ...r,
        users: response.user.map((u) => ({
          name: u.name,
          imageUrl: u.imageUrl,
          isAuthenticated: true
        }))
      }));
      break;
  }
}

function handleCreateRoomResponse(response: CreateRoomResponse) {
  if (response.error == CreateRoomError.DONE) {
    goto(`/game/${response.code}`);
  }
}

const handleRoomInfoResponse = (response: RoomInfoResponse) => {
  if (response.error === RoomInfoError.OK) {
    RoomStore.update((r) => ({
      ...r,
      code: response.code,
      playerLimit: response.players,
      playerCount: response.playerCount,
      rounds: response.rounds,
      keywords: response.keywords
    }));
  }
};
