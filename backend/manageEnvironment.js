const Store = require("electron-store");
const Identicon = require("identicon.js");
const util = require("util");

function id(length) {
  length = length || 15;
  let string = "";
  while (string.length < length) {
    string += (Math.random() + 1).toString(36).substring(3);
  }
  return string.substring(0, length);
}

function icon(id) {
  var options = {
    foreground: [0, 0, 0, 255],
    background: [255, 255, 255, 255],
    margin: 0.1,
    size: 80,
    format: "svg",
  };
  var data = new Identicon(id, options).toString();

  return "data:image/svg+xml;base64," + data;
}

class EnvironmentManager {
  environments;
  constructor() {
    this.store = new Store({
      clearInvalidConfig: true,
    });
  }

  getEnvironments() {
    return this.environments ?? (this.environments = this.getFromStore());
  }

  getFromStore() {
    const envs = this.store.get("environments", []);
    const result = [];
    envs.forEach((config) => {
      result.push(new Environment(config));
    });

    return result;
  }

  getEnvironment(id) {
    return this.getEnvironments().find((env) => env.id === id);
  }

  getApplication(envId, appId) {
    const env = this.getEnvironment(envId);

    return env ? env.getApplication(appId) : undefined;
  }
  addApplication(envId, config) {
    config.envId = envId;
    const env = this.getEnvironment(envId);
    if (env) {
      const app = env.addApplication(config);
      console.log("test", app);
      this.save();

      return app;
    }
    return undefined;
  }

  addNewEnvironment(name) {
    const newEnv = new Environment(
      {
        id: id(),
        name,
      },
      this,
    );
    this.environments.push(newEnv);
    this.save();

    return newEnv;
  }

  removeEnvironment(id) {
    this.environments = this.environments.filter((e) => e.id !== id);

    this.save();

    return this.environments;
  }

  removeApplication(envId, id) {
    const environment = this.getEnvironments().find((env) => env.id === envId);
    environment.applications = [
      ...environment?.applications.filter((app) => app.id !== id),
    ];

    this.save();
  }

  save() {
    const envs = JSON.stringify(this.environments, (key, value) => {
      if (key === "view") {
        return;
      }
      return value;
    });
    this.store.set("environments", JSON.parse(envs));
  }
}

class Environment {
  id;
  name;
  icon;
  applications;
  constructor(config) {
    this.id = config.id || id();
    this.name = config.name || "EMPTY";
    this.icon = config.icon || icon(this.id);
    this.applications = this.parseApplicationsFromConfig(
      this.id,
      Array.isArray(config.applications) ? config.applications : [],
    );
  }

  parseApplicationsFromConfig(envId, applications) {
    const result = [];
    applications = applications || [];
    applications.forEach((app) => {
      app.envId = envId;
      result.push(new Application(app));
    });

    return result;
  }

  addApplication(config) {
    const app = new Application(config);
    this.applications.push(app);

    return app;
  }
  getApplication(id) {
    return this.applications.find((app) => app.id === id);
  }
}

class Application {
  id;
  envId;
  name;
  url;
  icon;
  constructor(config) {
    if (!config.envId) {
      throw new Error("Application has to have env id");
    }
    this.id = config.id || id();
    this.envId = config.envId;
    this.name = config.name || "EMPTY";
    this.icon = config.icon || icon(this.id);
    this.url = config.url;
    if (typeof this.url === "undefined") {
      throw new Exception(
        "something wrong with the data, url is undefined for application",
      );
    }
  }
}

class ApplicationTemplate {
  name;
  url;
  icon;
  constructor(config) {
    this.name = config.name;
    this.url = config.url;
    this.icon = config.icon;
  }
}

module.exports = {
  EnvironmentManager,
};
