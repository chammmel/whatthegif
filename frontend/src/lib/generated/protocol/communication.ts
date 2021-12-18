/* eslint-disable */
import { util, configure, Writer, Reader } from 'protobufjs/minimal';
import * as Long from 'long';
import { Any } from '../google/protobuf/any';

export const protobufPackage = '';

export enum JoinError {
  REQUIRES_PASSWORD = 0,
  WRONG_PASSWORD = 1,
  UNALLOWED_USERNAME = 2,
  ROOM_FULL = 3,
  UNRECOGNIZED = -1
}

export function joinErrorFromJSON(object: any): JoinError {
  switch (object) {
    case 0:
    case 'REQUIRES_PASSWORD':
      return JoinError.REQUIRES_PASSWORD;
    case 1:
    case 'WRONG_PASSWORD':
      return JoinError.WRONG_PASSWORD;
    case 2:
    case 'UNALLOWED_USERNAME':
      return JoinError.UNALLOWED_USERNAME;
    case 3:
    case 'ROOM_FULL':
      return JoinError.ROOM_FULL;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return JoinError.UNRECOGNIZED;
  }
}

export function joinErrorToJSON(object: JoinError): string {
  switch (object) {
    case JoinError.REQUIRES_PASSWORD:
      return 'REQUIRES_PASSWORD';
    case JoinError.WRONG_PASSWORD:
      return 'WRONG_PASSWORD';
    case JoinError.UNALLOWED_USERNAME:
      return 'UNALLOWED_USERNAME';
    case JoinError.ROOM_FULL:
      return 'ROOM_FULL';
    default:
      return 'UNKNOWN';
  }
}

export interface PreJoinRequest {
  room: string;
}

export interface PreJoinResponse {
  error: JoinError;
}

export interface JoinRequest {
  room: string;
  username: string;
  password?: string | undefined;
}

export interface JoinResponse {
  error?: JoinError | undefined;
  user: User[];
  content?: Content | undefined;
}

export interface User {
  uuid: string;
  name: string;
}

export interface Content {
  uuid: string;
  url: string;
}

export interface Vote {
  contentId: string;
}

export interface Message {
  payload: Any | undefined;
}

const basePreJoinRequest: object = { room: '' };

export const PreJoinRequest = {
  encode(message: PreJoinRequest, writer: Writer = Writer.create()): Writer {
    if (message.room !== '') {
      writer.uint32(10).string(message.room);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): PreJoinRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePreJoinRequest } as PreJoinRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.room = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PreJoinRequest {
    const message = { ...basePreJoinRequest } as PreJoinRequest;
    message.room = object.room !== undefined && object.room !== null ? String(object.room) : '';
    return message;
  },

  toJSON(message: PreJoinRequest): unknown {
    const obj: any = {};
    message.room !== undefined && (obj.room = message.room);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PreJoinRequest>, I>>(object: I): PreJoinRequest {
    const message = { ...basePreJoinRequest } as PreJoinRequest;
    message.room = object.room ?? '';
    return message;
  }
};

const basePreJoinResponse: object = { error: 0 };

export const PreJoinResponse = {
  encode(message: PreJoinResponse, writer: Writer = Writer.create()): Writer {
    if (message.error !== 0) {
      writer.uint32(8).int32(message.error);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): PreJoinResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePreJoinResponse } as PreJoinResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.error = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PreJoinResponse {
    const message = { ...basePreJoinResponse } as PreJoinResponse;
    message.error =
      object.error !== undefined && object.error !== null ? joinErrorFromJSON(object.error) : 0;
    return message;
  },

  toJSON(message: PreJoinResponse): unknown {
    const obj: any = {};
    message.error !== undefined && (obj.error = joinErrorToJSON(message.error));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PreJoinResponse>, I>>(object: I): PreJoinResponse {
    const message = { ...basePreJoinResponse } as PreJoinResponse;
    message.error = object.error ?? 0;
    return message;
  }
};

const baseJoinRequest: object = { room: '', username: '' };

export const JoinRequest = {
  encode(message: JoinRequest, writer: Writer = Writer.create()): Writer {
    if (message.room !== '') {
      writer.uint32(10).string(message.room);
    }
    if (message.username !== '') {
      writer.uint32(18).string(message.username);
    }
    if (message.password !== undefined) {
      writer.uint32(26).string(message.password);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): JoinRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseJoinRequest } as JoinRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.room = reader.string();
          break;
        case 2:
          message.username = reader.string();
          break;
        case 3:
          message.password = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): JoinRequest {
    const message = { ...baseJoinRequest } as JoinRequest;
    message.room = object.room !== undefined && object.room !== null ? String(object.room) : '';
    message.username =
      object.username !== undefined && object.username !== null ? String(object.username) : '';
    message.password =
      object.password !== undefined && object.password !== null
        ? String(object.password)
        : undefined;
    return message;
  },

  toJSON(message: JoinRequest): unknown {
    const obj: any = {};
    message.room !== undefined && (obj.room = message.room);
    message.username !== undefined && (obj.username = message.username);
    message.password !== undefined && (obj.password = message.password);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<JoinRequest>, I>>(object: I): JoinRequest {
    const message = { ...baseJoinRequest } as JoinRequest;
    message.room = object.room ?? '';
    message.username = object.username ?? '';
    message.password = object.password ?? undefined;
    return message;
  }
};

const baseJoinResponse: object = {};

export const JoinResponse = {
  encode(message: JoinResponse, writer: Writer = Writer.create()): Writer {
    if (message.error !== undefined) {
      writer.uint32(8).int32(message.error);
    }
    for (const v of message.user) {
      User.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (message.content !== undefined) {
      Content.encode(message.content, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): JoinResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseJoinResponse } as JoinResponse;
    message.user = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.error = reader.int32() as any;
          break;
        case 2:
          message.user.push(User.decode(reader, reader.uint32()));
          break;
        case 3:
          message.content = Content.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): JoinResponse {
    const message = { ...baseJoinResponse } as JoinResponse;
    message.error =
      object.error !== undefined && object.error !== null
        ? joinErrorFromJSON(object.error)
        : undefined;
    message.user = (object.user ?? []).map((e: any) => User.fromJSON(e));
    message.content =
      object.content !== undefined && object.content !== null
        ? Content.fromJSON(object.content)
        : undefined;
    return message;
  },

  toJSON(message: JoinResponse): unknown {
    const obj: any = {};
    message.error !== undefined &&
      (obj.error = message.error !== undefined ? joinErrorToJSON(message.error) : undefined);
    if (message.user) {
      obj.user = message.user.map((e) => (e ? User.toJSON(e) : undefined));
    } else {
      obj.user = [];
    }
    message.content !== undefined &&
      (obj.content = message.content ? Content.toJSON(message.content) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<JoinResponse>, I>>(object: I): JoinResponse {
    const message = { ...baseJoinResponse } as JoinResponse;
    message.error = object.error ?? undefined;
    message.user = object.user?.map((e) => User.fromPartial(e)) || [];
    message.content =
      object.content !== undefined && object.content !== null
        ? Content.fromPartial(object.content)
        : undefined;
    return message;
  }
};

const baseUser: object = { uuid: '', name: '' };

export const User = {
  encode(message: User, writer: Writer = Writer.create()): Writer {
    if (message.uuid !== '') {
      writer.uint32(10).string(message.uuid);
    }
    if (message.name !== '') {
      writer.uint32(18).string(message.name);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): User {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseUser } as User;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.uuid = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): User {
    const message = { ...baseUser } as User;
    message.uuid = object.uuid !== undefined && object.uuid !== null ? String(object.uuid) : '';
    message.name = object.name !== undefined && object.name !== null ? String(object.name) : '';
    return message;
  },

  toJSON(message: User): unknown {
    const obj: any = {};
    message.uuid !== undefined && (obj.uuid = message.uuid);
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<User>, I>>(object: I): User {
    const message = { ...baseUser } as User;
    message.uuid = object.uuid ?? '';
    message.name = object.name ?? '';
    return message;
  }
};

const baseContent: object = { uuid: '', url: '' };

export const Content = {
  encode(message: Content, writer: Writer = Writer.create()): Writer {
    if (message.uuid !== '') {
      writer.uint32(10).string(message.uuid);
    }
    if (message.url !== '') {
      writer.uint32(82).string(message.url);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Content {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseContent } as Content;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.uuid = reader.string();
          break;
        case 10:
          message.url = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Content {
    const message = { ...baseContent } as Content;
    message.uuid = object.uuid !== undefined && object.uuid !== null ? String(object.uuid) : '';
    message.url = object.url !== undefined && object.url !== null ? String(object.url) : '';
    return message;
  },

  toJSON(message: Content): unknown {
    const obj: any = {};
    message.uuid !== undefined && (obj.uuid = message.uuid);
    message.url !== undefined && (obj.url = message.url);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Content>, I>>(object: I): Content {
    const message = { ...baseContent } as Content;
    message.uuid = object.uuid ?? '';
    message.url = object.url ?? '';
    return message;
  }
};

const baseVote: object = { contentId: '' };

export const Vote = {
  encode(message: Vote, writer: Writer = Writer.create()): Writer {
    if (message.contentId !== '') {
      writer.uint32(10).string(message.contentId);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Vote {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseVote } as Vote;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.contentId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Vote {
    const message = { ...baseVote } as Vote;
    message.contentId =
      object.contentId !== undefined && object.contentId !== null ? String(object.contentId) : '';
    return message;
  },

  toJSON(message: Vote): unknown {
    const obj: any = {};
    message.contentId !== undefined && (obj.contentId = message.contentId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Vote>, I>>(object: I): Vote {
    const message = { ...baseVote } as Vote;
    message.contentId = object.contentId ?? '';
    return message;
  }
};

const baseMessage: object = {};

export const Message = {
  encode(message: Message, writer: Writer = Writer.create()): Writer {
    if (message.payload !== undefined) {
      Any.encode(message.payload, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Message {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMessage } as Message;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.payload = Any.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Message {
    const message = { ...baseMessage } as Message;
    message.payload =
      object.payload !== undefined && object.payload !== null
        ? Any.fromJSON(object.payload)
        : undefined;
    return message;
  },

  toJSON(message: Message): unknown {
    const obj: any = {};
    message.payload !== undefined &&
      (obj.payload = message.payload ? Any.toJSON(message.payload) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Message>, I>>(object: I): Message {
    const message = { ...baseMessage } as Message;
    message.payload =
      object.payload !== undefined && object.payload !== null
        ? Any.fromPartial(object.payload)
        : undefined;
    return message;
  }
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & Record<Exclude<keyof I, KeysOfUnion<P>>, never>;

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
