import { useForm } from "react-hook-form";
import { addApplication, addEnvironment } from "../util";
import { useEffect, useState } from "react";

export const MainScreen = ({
  addingEnvironment,
  addingApplication,
  onAddedEnvironment,
  onAddedApplication,
  application,
  selectedEnvironment,
  showingApplication,
}) => {
  const [webviews, setWebviews] = useState([]);
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

  const idMatch = (application1, application2) => {
    return (
      application1?.id === application2?.id &&
      application1?.envId === application2?.envId
    );
  };

  console.log(webviews);

  const showApplication = (application) => {
    if (!existsWebview(application)) {
      setWebviews([...webviews, application]);
    }
    setCurrentWebview(application);
  };

  useEffect(() => {
    console.log(showingApplication, application);
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
