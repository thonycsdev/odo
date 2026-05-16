const isDevEnvironment = () => process.env.NODE_ENV === "development";

const environment = { isDevEnvironment };

export default environment;
