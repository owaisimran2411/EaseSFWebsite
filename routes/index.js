import adminRoute from "./adminRoutes.js";
import userRoute from "./userRoutes.js";
import homeRoute from "./homeRoutes.js";
// import_line

const constructorMethod = (app) => {	
	app.use("/admin", adminRoute);
	app.use("/user", userRoute);
	app.use("/home", homeRoute);
	// router_line
	app.use("*", (req, res) => {
		res.status(404).json({
			error: "Page Not Found",
		});
	});
};

export default constructorMethod;
