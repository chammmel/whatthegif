package com.github.chammmel.backend;

import io.quarkus.runtime.ShutdownEvent;
import io.quarkus.runtime.StartupEvent;
import org.jboss.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;

@ApplicationScoped
public class AppLifecycleHandler {

  private static final Logger log = Logger.getLogger(AppLifecycleHandler.class);

  void onStart(@Observes StartupEvent event) {
  }

  void onStop(@Observes ShutdownEvent event) {

  }


}
