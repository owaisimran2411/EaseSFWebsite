import adminRoute from "./adminRoutes.js";
import userRoute from "./userRoutes.js";
// import_line

const constructorMethod = (app) => {	
	app.use("/admin", adminRoute);
	app.use("/user", userRoute);
	// router_line
	app.use("*", (req, res) => {
		res.status(404).json({
			error: "Page Not Found",
		});
	});
};

export default constructorMethod;
