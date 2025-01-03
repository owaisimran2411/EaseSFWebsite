import helperMethods from "./../helpers.js";

helperMethods.configureDotEnv();

const { DB_NAME } = process.env;
const { IS_LOCAL } = process.env;
const { LOCAL_URL } = process.env;
const { CLOUD_URL } = process.env;

const serverURL = IS_LOCAL ? LOCAL_URL : CLOUD_URL;

export const mongoConfig = {
	serverUrl: serverURL,
	database: DB_NAME,
};
