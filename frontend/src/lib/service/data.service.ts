import {
  Content,
  CreateRoomResponse,
  JoinResponse,
  Message,
  PreJoinResponse,
  RoomInfoResponse
} from '$lib/generated/protocol/communication';

import * as communication from '$lib/generated/protocol/communication';

export class DataService {
  private socket: WebSocket = undefined;
  private messageQueue: Array<{ b: Uint8Array }> = [];
  private clientId: number;

  public disconnectFromServer = () => {
    if (this.socket) {
      this.socket.close();
    }
  };

  private getUrl = async (): Promise<string> => {
    const resp = await fetch('http://localhost/api/register', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_id: this.clientId })
    });
    const body = await resp.json();
    return body.url;
  };

  public connectToServer = (gotNewMessge: GotNewMessge) => {
    if (!this.clientId) {
      this.clientId = this.getClientId();
      console.log(this.clientId);

      this.getUrl().then((url) => {
        this.socket = new WebSocket(url);

        if (this.socket !== undefined) {
          this.socket.addEventListener('open', (event) => {
            console.log('Connected to websocket');

            for (let i = 0; i < this.messageQueue.length; i++) {
              const element = this.messageQueue.pop();

              this.socket.send(element.b);
            }
          });
          this.socket.addEventListener('message', async (event) => {
            const buffer = await this.toUint8Array(event.data);

            const message = Message.decode(buffer);
            let messageType = message.payload.typeUrl as MessageType;
            const content = await this.dataParser(message);

            gotNewMessge({ data: content, messageType });

            console.log('Got message', message, content);
          });
        } else {
          console.log('Unable to connect to websocket');
        }
      });
    }
    return this;
  };

  public request = (requestObject, name: string, request: any) => {
    const data = requestObject
      .encode(
        requestObject.fromJSON({
          ...request
        })
      )
      .finish();

    this.sendMessage(name, data);
  };

  private getClientId(): number {
    const key = 'client_id';
    const existing_clinet_id = localStorage.getItem(key);

    if (existing_clinet_id === null) {
      localStorage.setItem(key, Date.now().toString());
    }

    return parseInt(localStorage.getItem(key));
  }

  private toUint8Array = async (data: Blob): Promise<Uint8Array> =>
    new Promise((resolve) => {
      const reader = new FileReader();

      reader.addEventListener('loadend', function () {
        const view = new Uint8Array(reader.result as ArrayBuffer);

        resolve(view);
      });

      reader.readAsArrayBuffer(data);
    });

  private dataParser = (
    message: Message
  ): Promise<PreJoinResponse | JoinResponse | Content | CreateRoomResponse | RoomInfoResponse> =>
    new Promise((resolve, reject) => {
      const buffer = message.payload.value;
      const typeUrl = message.payload.typeUrl;
      resolve(communication[typeUrl].decode(buffer));
    });

  private sendMessage = (typeUrl: string, value: Uint8Array) => {
    const bits = Message.encode(
      Message.fromPartial({
        origin: 'client',
        payload: {
          typeUrl,
          value
        }
      })
    ).finish();

    if (this.socket === undefined) {
      this.messageQueue.push({ b: bits });
    } else {
      if (this.socket.readyState <= 1) {
        this.socket.send(bits);
      }
    }
  };
}

export enum MessageType {
  PreJoinResponse = 'PreJoinResponse',
  JoinResponse = 'JoinResponse',
  Content = 'Content',
  CreateRoomResponse = 'CreateRoomResponse',
  RoomInfoResponse = 'RoomInfoResponse'
}

export interface NewMessage {
  data: PreJoinResponse | JoinResponse | Content | CreateRoomResponse | RoomInfoResponse;
  messageType: MessageType;
}

export interface GotNewMessge {
  (message: NewMessage): void;
}
