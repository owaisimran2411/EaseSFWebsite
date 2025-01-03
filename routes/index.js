// import_line

const constructorMethod = (app) => {	
	// router_line
	app.use("*", (req, res) => {
		res.status(404).json({
			error: "Page Not Found",
		});
	});
};

export default constructorMethod;
