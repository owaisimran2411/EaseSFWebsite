import { Router } from "express";
import helperMethods from "./../helpers.js";

const router = Router();

// Route goes here
router.route("/")
.get(async (req, res) => {
    return res.render("user/homePage", {
        docTitle: 'Welcome to EaseSF'
    })
})

export default router;
