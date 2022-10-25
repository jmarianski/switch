import { useForm } from "react-hook-form";
import { addApplication, addEnvironment, backgroundThrottle } from "../comm";
import { useEffect, useState, useRef } from "react";
import { registerHandlers } from "../eventHandlers";

export const MainScreen = ({
  environments,
  application,
  addingEnvironment,
  addingApplication,
  onAddedEnvironment,
  onAddedApplication,
  updateApplication,
  updateAllApplications,
  selectedEnvironment,
  showingApplication,
  onSelectApplication,
}) => {
  const recentlyAddedRef = useRef();
  const [webviews, setWebviews] = useState([]);
  const [webviewRefs, setWebviewRefs] = useState([]);
  const [recentlyAdded, setRecentlyAdded] = useState(null);
  const [currentWebview, setCurrentWebview] = useState(null);
  let Comp;
  switch (true) {
    case addingApplication:
      Comp = () => (
        <AddingApplication
          selectedEnvironment={selectedEnvironment}
          onAddedApplication={onAddedApplication}
        />
      );
      break;
    case addingEnvironment:
      Comp = () => (
        <AddingEnvironment onAddedEnvironment={onAddedEnvironment} />
      );
      break;
    default:
      Comp = () => <Default />;
  }

  const existsWebview = (application) => {
    return !!webviews.find((wv) => idMatch(application, wv));
  };

  const getWebviewRef = (app) => {
    return webviewRefs.find((wv) => idMatch(app, wv))?.webview;
  };

  const idMatch = (application1, application2) => {
    return (
      application1?.id === application2?.id &&
      application1?.envId === application2?.envId
    );
  };

  const showApplication = (application) => {
    if (!existsWebview(application)) {
      setWebviews([...webviews, application]);
      setRecentlyAdded(application);
    }
    webviewRefs.forEach((webview) => {
      if (idMatch(webview, application)) {
        console.log("try not throttle", webview.ref.getWebContentsId());
        backgroundThrottle(webview.ref.getWebContentsId(), false);
      } else {
        console.log("try throttle", webview.ref.getWebContentsId());
        backgroundThrottle(webview.ref.getWebContentsId(), true);
      }
    });
    updateAllApplications((app) => {
      app.focused = false;
      const { ref } = getWebviewRef(app) || {};
      if (ref) {
      }
      return app;
    });
    updateApplication(application.envId, application.id, (app) => {
      app.focused = true;
      app.notification = false;
      return app;
    });
    setCurrentWebview(application);
  };

  useEffect(() => {
    if (recentlyAddedRef && recentlyAddedRef.current) {
      setWebviewRefs([
        ...webviewRefs,
        {
          id: recentlyAdded.id,
          envId: recentlyAdded.envId,
          ref: recentlyAddedRef.current,
        },
      ]);
      registerHandlers(
        recentlyAddedRef.current,
        recentlyAdded,
        updateApplication,
        updateAllApplications,
        onSelectApplication,
      );
    }
  }, [recentlyAdded]);

  useEffect(() => {
    if (!showingApplication || addingEnvironment || addingApplication) {
      setCurrentWebview(null);
      return;
    }

    showApplication(application);
  }, [showingApplication, application]);

  return (
    <div
      className={
        "main-screen" + (showingApplication ? " showing-application" : "")
      }
    >
      {webviews.map((wv, i) => {
        return (
          <webview
            className={idMatch(wv, currentWebview) ? "visible" : "hidden"}
            key={i}
            ref={idMatch(wv, recentlyAdded) ? recentlyAddedRef : null}
            allowpopups="true"
            preload={
              "file://" + window.electron.dirname + "/preload-webview.js"
            }
            disablewebsecurity="true"
            webpreferences={"nativeWindowOpen=true"}
            nodeintegration="true"
            useragent={
              wv.url.indexOf("teams") !== -1
                ? "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36"
                : null
            }
            src={wv.url}
            partition={"persist:" + wv.envId}
            id={wv.id}
          />
        );
      })}
      {!showingApplication && <Comp />}
    </div>
  );
};

const Default = () => {
  return (
    <p>
      This is the main screen. You will see browser window one you add or load
      an application from one of your environments.
    </p>
  );
};

const AddingApplication = ({ selectedEnvironment, onAddedApplication }) => {
  const { register, handleSubmit } = useForm();
  const onSubmit = async (data) => {
    data.envId = selectedEnvironment.id;
    const app = await addApplication(data);
    console.log(app);
    onAddedApplication(app);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} placeholder="name" />
      <input {...register("url")} placeholder="url" />
      <button type="submit">Submit</button>
    </form>
  );
};

const AddingEnvironment = ({ onAddedEnvironment }) => {
  const { register, handleSubmit } = useForm();
  const onSubmit = async (data) => {
    const env = await addEnvironment(data);
    console.log(env);
    onAddedEnvironment(env);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} />
      <button type="submit">Submit</button>
    </form>
  );
};
