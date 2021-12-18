package com.github.chammmel;


import com.github.chammmel.generated.JoinError;
import com.github.chammmel.generated.JoinResponse;
import com.github.chammmel.generated.Message;
import com.github.chammmel.generated.PreJoinRequest;
import com.google.protobuf.Any;

import javax.enterprise.context.ApplicationScoped;
import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.nio.ByteBuffer;

@ServerEndpoint("/start-websocket/{name}")
@ApplicationScoped
public class StartWebSocket {

  @OnOpen
  public void onOpen(Session session, @PathParam("name") String name) {
    System.out.println("onOpen> " + name);
    JoinResponse asd = JoinResponse.newBuilder().setError(JoinError.ROOM_FULL).build();
    Message message = Message.newBuilder().setPayload(Any.newBuilder().setTypeUrl("JoinResponse").setValue(asd.toByteString()).build()).build();

    session.getAsyncRemote().sendBinary(ByteBuffer.wrap(message.toByteArray()));
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
  }
}
