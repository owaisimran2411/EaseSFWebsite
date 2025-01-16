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

router.route('/product/:id')
    .get(async (req, res) => {
        const product = await productData.searchProduct({_id: req.params.id})
        return res.json(product[0])
    })

router.route('/cart')
    .get(async (req, res) => {
        return res.render('user/cart', {
            docTitle: 'Cart'
        })
    })

router.route('/checkout')
    .get(async (req, res) => {
        return res.render('user/cart', {
            docTitle: 'Checkout',
            checkout: true
        })
    })
    .post(async (req, res) => {
        return
    })
export default router;
