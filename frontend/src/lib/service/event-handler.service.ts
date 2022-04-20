import { goto } from '$app/navigation';
import {
  CreateRoomError,
  CreateRoomResponse,
  JoinError,
  PreJoinResponse
} from '$lib/generated/protocol/communication';
import popup, { PopUpType } from '$lib/stores/popup';
import { MessageType, type NewMessage } from './data.service';

export const handle = (message: NewMessage) => {
  switch (message.messageType) {
    case MessageType.PreJoinResponse:
      handlePreJoinResponse(message.data as PreJoinResponse);
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
      goto(`/game/${preJoinResponse.code}`);
      popup.currentPopUp.set(PopUpType.JOIN);
      break;
    case JoinError.ROOM_FULL:
      alert('The room is full');
      break;

    case JoinError.FINE:
      goto(`/game/${preJoinResponse.code}`);
      break;

    default:
      break;
  }
};

function handleCreateRoomResponse(createRoomResponse: CreateRoomResponse) {
  if (createRoomResponse.error == CreateRoomError.DONE) {
    goto(`/game/${createRoomResponse.code}`);
  }
}
