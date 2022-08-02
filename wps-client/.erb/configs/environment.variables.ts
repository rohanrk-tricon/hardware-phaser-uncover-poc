// eslint-disable-next-line import/prefer-default-export
export const devEnvironmentVariables = {
  NODE_ENV: 'development',
  API_URL: 'http://dev-wps.hatch.com',
  DEBUG_PROD: false,
  START_MINIMIZED: false,
  SCRIPT: '',
};

export const qaEnvironmentVariables = {
  NODE_ENV: 'qa',
  API_URL: 'http://qa-wps.hatch.com',
  DEBUG_PROD: false,
  START_MINIMIZED: false,
  SCRIPT: '',
};

export const cloudEnvironmentVariables = {
  NODE_ENV: 'cloud',
  API_URL: 'https://cloud-wps.hatch.com',
  DEBUG_PROD: false,
  START_MINIMIZED: false,
  SCRIPT: '',
};

export const prodEnvironmentVariables = {
  NODE_ENV: 'production',
  API_URL: 'http://prod-wps.hatch.com',
  DEBUG_PROD: true,
  START_MINIMIZED: false,
  SCRIPT: '',
};
