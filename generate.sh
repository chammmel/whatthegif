#!/bin/bash

protoc --plugin=frontend/node_modules/.bin/protoc-gen-ts_proto  \
       --java_out=backend/src/main/java/ \
       --ts_proto_out=frontend/src/lib/generated/ \
       protocol/communication.proto
