import { Router } from "express";
import helperMethods from "./../helpers.js";
import { products } from "./../data/testing.js";

const router = Router();

// Route goes here
router.route("/").get((req, res) => {
	return res.render("admin/index",{
        docTitle: "Admin - Login"
    });
}).post((req, res) => {
    return res.redirect("/admin/home");
});

router.route("/home").get((req, res) => {
    return res.render("admin/home",{
        docTitle: "Admin - Home"
    });
});

router.route("/products").get((req, res) => {
    return res.render("admin/products",{
        docTitle: "Admin - Products",
        products: products
    });
});

export default router;
