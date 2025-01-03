import express from "express";
import session from "express-session";

import helperMethods from "./helpers.js";
import configRoutes from "./routes/index.js";
import * as middleware from "./middleware.js";

helperMethods.configureDotEnv();

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
	// If the user posts to the server with a property called _method, rewrite the request's method
	// To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
	// rewritten in this middleware to a PUT route
	if (req.body && req.body._method) {
		req.method = req.body._method;
		delete req.body._method;
	}

	// let the next middleware run:
	next();
};

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

app.use(middleware.authenticateRoutes, middleware.hasJwtToken);
app.use(middleware.forwardToPatchRoute, middleware.forwardToPatchAction);

configRoutes(app);

const { PORT } = process.env;
app.listen(PORT, () => {
	console.log(`Your routes are available at http://localhost:${PORT}`);
});
