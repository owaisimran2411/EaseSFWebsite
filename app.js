import express from "express";
import exphbs from "express-handlebars";
import session from "express-session";
import multer from "multer";
import path from "path";

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
const staticDir = express.static("public");

const handlebarsInstance = exphbs.create({
	defaultLayout: "main",
	// Specify helpers which are only registered on this instance.
	helpers: {
		asJSON: (obj, spacing) => {
			if (typeof spacing === "string")
				return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

			return new Handlebars.SafeString(JSON.stringify(obj));
		},
		ifCond: function (v1, operator, v2, options) {
			switch (operator) {
				case "===":
					return v1 === v2 ? options.fn(this) : options.inverse(this);
				default:
					return options.inverse(this);
			}
		},
		eq: function(a, b) {
			return a === b;
		},
		partialsDir: ["views/partials/"],
	},
});



app.engine("handlebars", handlebarsInstance.engine);
app.set("view engine", "handlebars");
app.use('/public', staticDir);
app.use('/tinymce', express.static(path.join('node_modules/tinymce')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

// app.use(middleware.authenticateRoutes, middleware.hasJwtToken);
// app.use(middleware.forwardToPatchRoute, middleware.forwardToPatchAction);

configRoutes(app);

const { PORT } = process.env;
app.listen(PORT, () => {
	console.log(`Your routes are available at http://localhost:${PORT}`);
});
