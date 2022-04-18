import { goto } from '$app/navigation';
import { JoinError, type PreJoinResponse } from '$lib/generated/protocol/communication';
import { MessageType, type NewMessage } from './data.service';

export const handle = (message: NewMessage) => {
  switch (message.messageType) {
    case MessageType.PreJoinResponse:
      handlePreJoinResponse(message.data as PreJoinResponse)
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
      alert('Please ender password');
    break;
    case JoinError.UNALLOWED_USERNAME:
      alert('Please ender username');
    break;
    case JoinError.ROOM_FULL:
      alert('The room is full');
    break;

    case JoinError.FINE:
      goto('/game');
    break;

    default:
      break;
  }
}
