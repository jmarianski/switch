import logo from "./logo.svg";
import "./App.css";
import Sidebar from "./components/Sidebar";
import { useEffect, useState } from "react";
import { getEnvironments, removeApplication, removeEnvironment } from "./util";
import { MainScreen } from "./components/MainScreen";

function App() {
  const [environments, setEnvironments] = useState([]);
  const [addingEnvironment, setAddingEnvironment] = useState(false);
  const [addingApplication, setAddingApplication] = useState(false);
  const [showingApplication, setShowingApplication] = useState(false);
  const [environment, setEnvironment] = useState(null);
  const [application, setApplication] = useState(null);

  const selectedEnvironment = environments.find(
    (e) => e?.id === environment?.id,
  );

  useEffect(() => {
    if (addingApplication) {
      setShowingApplication(false);
      setAddingEnvironment(false);
    }
  }, [addingApplication]);

  useEffect(() => {
    if (addingEnvironment) {
      setShowingApplication(false);
      setAddingApplication(false);
    }
  }, [addingEnvironment]);

  useEffect(() => {
    if (showingApplication) {
      setAddingApplication(false);
      setAddingEnvironment(false);
    }
  }, [showingApplication]);

  console.log(environment, application);

  const onSelectApplication = (app) => {
    setApplication(app);
    setShowingApplication(true);
  };

  const onAddedEnvironment = (item) => {
    setAddingEnvironment(false);
    setEnvironments((list) => [...list, item]);
  };

  const onAddedApplication = (item) => {
    console.log(item);
    setAddingApplication(false);
    setEnvironments(
      environments.map((el) =>
        el.id === item.envId
          ? { ...el, applications: [...el.applications, item] }
          : el,
      ),
    );
    onSelectApplication(item);
  };

  const onRemoveEnvironment = (env) => {
    removeEnvironment({ id: env.id });
    // TODO: kill windows
    if (selectedEnvironment.id === env.id) {
      setEnvironment(null);
    }
    setEnvironments(
      environments.filter((environment) => environment.id !== env.id),
    );
  };
  const onRemoveApplication = (app) => {
    removeApplication(app);
    // TODO: kill window
    setEnvironments(
      environments.map((env) =>
        env.id !== app.envId
          ? env
          : {
              ...env,
              applications: env.applications.filter((a) => a.id !== app.id),
            },
      ),
    );
  };

  useEffect(() => {
    (async () => {
      const envs = await getEnvironments();
      setEnvironments(envs);
    })();
  }, []);

  return (
    <div className="App">
      <Sidebar
        environments={environments}
        selectedEnvironment={selectedEnvironment}
        onAddEnvironment={() => setAddingEnvironment(true)}
        onAddApplication={() => setAddingApplication(true)}
        onRemoveEnvironment={onRemoveEnvironment}
        onRemoveApplication={onRemoveApplication}
        onSelectEnvironment={setEnvironment}
        onSelectApplication={onSelectApplication}
      />
      <MainScreen
        addingEnvironment={addingEnvironment}
        addingApplication={addingApplication}
        onAddedEnvironment={onAddedEnvironment}
        onAddedApplication={onAddedApplication}
        application={application}
        selectedEnvironment={selectedEnvironment}
        showingApplication={showingApplication}
      />
    </div>
  );
}

export default App;
