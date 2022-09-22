export async function getEnvironments() {
  return universalElectronCallback("getEnvironments");
}

export async function addEnvironment(environment) {
  return universalElectronCallback("addEnvironment", environment);
}

export async function addApplication(application) {
  return universalElectronCallback("addApplication", application);
}

export async function showApplication(application) {
  return universalElectronCallback("showApplication", application);
}

export async function hideCurrentWebView(application) {
  return universalElectronCallback("hideCurrentWebView", application);
}

export async function removeEnvironment(application) {
  return universalElectronCallback("removeEnvironment", application);
}

export async function removeApplication(application) {
  return universalElectronCallback("removeApplication", application);
}

async function universalElectronCallback(functionName, ...args) {
  validate(functionName);
  return await window.electron[functionName](...args);
}

function validate(functionName) {
  if (
    typeof window?.electron === "undefined" ||
    typeof window.electron[functionName] === "undefined"
  ) {
    throw new Error(
      "Electron is most likely not running, unable to run " + functionName,
    );
  }
}
