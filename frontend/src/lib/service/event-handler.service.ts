import { goto } from '$app/navigation';
import {
  CreateRoomError,
  CreateRoomResponse,
  JoinError,
  JoinRequest,
  JoinResponse,
  PreJoinResponse
} from '$lib/generated/protocol/communication';
import backend from '$lib/stores/backend';
import popup, { PopUpType } from '$lib/stores/popup';
import UserStore from '$lib/stores/user';
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
  }
};

const handlePreJoinResponse = (preJoinResponse: PreJoinResponse) => {
  switch (preJoinResponse.error) {
    case JoinError.NOT_FOUND:
      alert('The room was not found');
      break;
    case JoinError.REQUIRES_PASSWORD:
    case JoinError.WRONG_PASSWORD:
    case JoinError.UNALLOWED_USERNAME:
      popup.currentPopUp.set(PopUpType.JOIN);
      break;
    case JoinError.ROOM_FULL:
      alert('The room is full');
      break;

    case JoinError.FINE: {
      const user = get(UserStore.user);
      backend.request(JoinRequest, 'JoinRequest', {
        room: preJoinResponse.code,
        username: user.name
      } as JoinRequest);
      break;
    }

    default:
      break;
  }
};

function handleJoinResponse(joinResponse: JoinResponse) {
  switch (joinResponse.error) {
    case JoinError.FINE:
      UserStore.user.update((u) => ({
        ...u,
        isAuthenticated: true
      }));
      break;
  }
}

function handleCreateRoomResponse(createRoomResponse: CreateRoomResponse) {
  if (createRoomResponse.error == CreateRoomError.DONE) {
    goto(`/game/${createRoomResponse.code}`);
  }
}
