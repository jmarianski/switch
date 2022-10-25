export const registerHandlers = (
  element,
  application,
  updateApplication,
  updateAllApplications,
  setApplication,
) => {
  console.log(Object.keys(element));
  element.addEventListener("ipc-message", (event) => {
    if (event.channel === "notification_clicked") {
      setApplication(application);
    }
    if (event.channel === "notification_opened") {
      updateApplication(application.envId, application.id, (app) => {
        if (!app?.focused) {
          app.notification = true;
        }
        return app;
      });
    }
  });

  setTimeout(() => {
    element.openDevTools();
  }, 1000);
};
