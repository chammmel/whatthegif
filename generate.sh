#!/bin/bash

protoc --plugin=frontend/node_modules/.bin/protoc-gen-ts_proto  \
       --ts_proto_out=frontend/src/lib/generated/ \
       --rust_out=rust_backend/src/generated/ \
       protocol/communication.proto
