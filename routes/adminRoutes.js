import { Router } from "express";
import helperMethods from "./../helpers.js";

const router = Router();

// Route goes here
router.route("/").get((req, res) => {
	res.render("admin/index",{
        docTitle: "Admin - Login"
    });
});

export default router;
