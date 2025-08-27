export interface ServiceConfig {
  name: string;
  url: string;
  healthPath: string;
  timeout: number;
  retries: number;
}

export interface ServicesConfig {
  [key: string]: ServiceConfig;
}

export const servicesConfig: ServicesConfig = {
  auth: {
    name: "Auth Service",
    url: process.env.AUTH_SERVICE_URL || "http://localhost:3001",
    healthPath: "/health",
    timeout: 5000,
    retries: 3,
  },
  users: {
    name: "Users Service",
    url: process.env.USERS_SERVICE_URL || "http://localhost:3002",
    healthPath: "/health",
    timeout: 5000,
    retries: 3,
  },
};

export const getServiceConfig = (
  serviceName: string
): ServiceConfig | undefined => {
  return servicesConfig[serviceName];
};

export const getAllServices = (): ServiceConfig[] => {
  return Object.values(servicesConfig);
};

export const getActiveServices = (): ServiceConfig[] => {
  return [servicesConfig.auth, servicesConfig.user];
};
