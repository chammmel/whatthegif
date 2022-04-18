mkdir frontend\src\lib\generated\

protoc.exe --plugin=protoc-gen-ts_proto=.\node_modules\.bin\protoc-gen-ts_proto.cmd --rust_out=backend\src\generated\ protocol\communication.proto
