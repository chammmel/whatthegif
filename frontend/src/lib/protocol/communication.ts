/* eslint-disable */
import { util, configure, Writer, Reader } from "protobufjs/minimal";
import * as Long from "long";

export const protobufPackage = "";

export interface SearchRequest {
  query: string;
  pageNumber: number;
  resultPerPage: number;
}

const baseSearchRequest: object = {
  query: "",
  pageNumber: 0,
  resultPerPage: 0,
};

export const SearchRequest = {
  encode(message: SearchRequest, writer: Writer = Writer.create()): Writer {
    if (message.query !== "") {
      writer.uint32(10).string(message.query);
    }
    if (message.pageNumber !== 0) {
      writer.uint32(16).int32(message.pageNumber);
    }
    if (message.resultPerPage !== 0) {
      writer.uint32(24).int32(message.resultPerPage);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): SearchRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseSearchRequest } as SearchRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.query = reader.string();
          break;
        case 2:
          message.pageNumber = reader.int32();
          break;
        case 3:
          message.resultPerPage = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SearchRequest {
    const message = { ...baseSearchRequest } as SearchRequest;
    message.query =
      object.query !== undefined && object.query !== null
        ? String(object.query)
        : "";
    message.pageNumber =
      object.pageNumber !== undefined && object.pageNumber !== null
        ? Number(object.pageNumber)
        : 0;
    message.resultPerPage =
      object.resultPerPage !== undefined && object.resultPerPage !== null
        ? Number(object.resultPerPage)
        : 0;
    return message;
  },

  toJSON(message: SearchRequest): unknown {
    const obj: any = {};
    message.query !== undefined && (obj.query = message.query);
    message.pageNumber !== undefined &&
      (obj.pageNumber = Math.round(message.pageNumber));
    message.resultPerPage !== undefined &&
      (obj.resultPerPage = Math.round(message.resultPerPage));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SearchRequest>, I>>(
    object: I
  ): SearchRequest {
    const message = { ...baseSearchRequest } as SearchRequest;
    message.query = object.query ?? "";
    message.pageNumber = object.pageNumber ?? 0;
    message.resultPerPage = object.resultPerPage ?? 0;
    return message;
  },
};

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

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
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & Record<
        Exclude<keyof I, KeysOfUnion<P>>,
        never
      >;

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
