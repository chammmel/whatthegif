package com.github.chammmel;

import com.github.chammmel.generated.Communication;
import com.google.protobuf.InvalidProtocolBufferException;
import io.quarkus.runtime.ShutdownEvent;
import io.quarkus.runtime.StartupEvent;
import org.jboss.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;

@ApplicationScoped
public class AppLifecycleHandler {

    private static final Logger log = Logger.getLogger(AppLifecycleHandler.class);

    void onStart(@Observes StartupEvent event) {
        Communication.SearchRequest asd = Communication.SearchRequest.newBuilder()
		.setPageNumber(1).setQuery("asd").setResultPerPage(123).build();
        byte[] out = asd.toByteArray();

        log.info(out);

        try {
            Communication.SearchRequest obj = Communication.SearchRequest.parseFrom(out);

            log.info(obj.toString());
        } catch (InvalidProtocolBufferException e) {
            e.printStackTrace();
        }


    }

    void onStop(@Observes ShutdownEvent event) {

    }


}
