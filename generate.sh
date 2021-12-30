#!/bin/bash

mkdir backend/src/generated
protoc --plugin=frontend/node_modules/.bin/protoc-gen-ts_proto  \
       --ts_proto_out=frontend/src/lib/generated/ \
       --rust_out=backend/src/generated/ \
       protocol/communication.proto
