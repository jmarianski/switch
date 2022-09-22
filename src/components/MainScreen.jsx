import { useForm } from "react-hook-form";
import {
  addApplication,
  addEnvironment,
  hideCurrentWebView,
  showApplication,
} from "../util";
import { useEffect } from "react";

export const MainScreen = ({
  addingEnvironment,
  addingApplication,
  onAddedEnvironment,
  onAddedApplication,
  application,
  selectedEnvironment,
  showingApplication,
}) => {
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

  useEffect(() => {
    console.log(showingApplication, application);
    if (!showingApplication || addingEnvironment || addingApplication) {
      hideCurrentWebView();
      return;
    }
    showApplication(application);
  }, [showingApplication, application]);

  return (
    <div className="main-screen">
      <Comp />
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
