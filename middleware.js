import jsonwebtoken from "jsonwebtoken";
import helperMethods from "./helpers.js";

const authenticateRoutes = ["/users", "/songs"];

const hasJwtToken = (req, res, next) => {
	const token = req.header("Authorization");
	if (!token) {
		return res.status(401).json({
			error: "Unauthorized",
		});
	}
	try {
		helperMethods.configureDotEnv();
		const authToken = token.split("Bearer ")[1];
		const decodedID = jsonwebtoken.verify(authToken, process.env.JWT_TOKEN);
		req.userId = decodedID;
		next();
	} catch (e) {
		return res.status(401).json({
			error: e,
		});
	}
};

const forwardToPatchRoute = ["/users/update/:id"];
const forwardToPatchAction = (req, res, next) => {
	if (req.method === "POST") {
		req.method = "PATCH";
	}
	next();
};

export {
	authenticateRoutes,
	hasJwtToken,
	forwardToPatchRoute,
	forwardToPatchAction,
};
