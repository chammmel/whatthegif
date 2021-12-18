package com.github.chammmel.backend.api;


import com.github.chammmel.backend.generated.Message;
import com.github.chammmel.backend.generated.PreJoinResponse;
import com.google.protobuf.Any;

import javax.enterprise.context.ApplicationScoped;
import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.nio.ByteBuffer;

@ServerEndpoint("/websocket/{name}")
@ApplicationScoped
public class StartWebSocket {

  @OnOpen
  public void onOpen(Session session, @PathParam("name") String name) {
    System.out.println("onOpen> " + name);
  }

  @OnClose
  public void onClose(Session session, @PathParam("name") String name) {
    System.out.println("onClose> " + name);
  }

  @OnError
  public void onError(Session session, @PathParam("name") String name, Throwable throwable) {
    System.out.println("onError> " + name + ": " + throwable);
  }

  @OnMessage
  public void onMessage(String message, @PathParam("name") String name) {
    System.out.println("onMessage> " + name + ": " + message);
    PreJoinResponse asd = PreJoinResponse.newBuilder().build();
    Message genericMessage = Message.newBuilder()
      .setPayload(Any.newBuilder()
        .setTypeUrl(asd.getClass().getSimpleName())
        .setValue(asd.toByteString()).build()).build();

    session.getAsyncRemote().sendBinary(ByteBuffer.wrap(message.toByteArray()));
  }
}
