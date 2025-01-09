import { Router } from "express";
import helperMethods from "./../helpers.js";
import { productData } from "./../data/index.js";

const router = Router();

// Route goes here
router.route('/')
    .get(async (req, res) => {
        const products = await productData.searchProduct()
        return res.render('user/product', {
            docTitle: 'Products',
            products: products
        })
    })

export default router;
