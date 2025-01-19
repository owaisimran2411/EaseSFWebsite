import { Router } from "express";
import helperMethods from "./../helpers.js";
import { productData, ordersData } from "./../data/index.js";

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
    .post(async (req, res) => {
        let searchFilter = {}
        if (req.body.productNameFilter !== '') {
            searchFilter = { $regex: req.body.productNameFilter, $options: 'i' }
        } else {
            searchFilter = { $regex: '', $options: 'i' }
        }
        const products = await productData.searchProduct(
            {
                $or: [
                    {name: searchFilter},
                    {description: searchFilter},
                    {hashtags: searchFilter}
                ]
                // hashtags: searchFilter
            }
        )

        if (products.length !== 0) {
            console.log(products)
            return res.render('user/product', {
                docTitle: 'Products',
                products: products
            })
        } else {
            return res.redirect('/user')
        }
        
    })

router.route('/product/:id')
    .get(async (req, res) => {
        const product = await productData.searchProduct({ _id: req.params.id })
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
        console.log(req.body)
        // processing cart object first
        const cartItems = JSON.parse(req.body.cart)
        const cartObject = []
        for (let i = 0; i < Object.keys(cartItems).length; i++) {
            // console.log(Object.keys(cartItems)[i])
            try {
                const prod = await productData.searchProduct({ _id: Object.keys(cartItems)[i] })
                cartObject.push({
                    productID: prod[0]._id,
                    productName: prod[0].name,
                    quantity: cartItems[Object.keys(cartItems)[i]],
                    price: Number(prod[0].price)
                })
            } catch (err) {
                return res.status(404).json({ error: err })
            }
        }
        try {
            const firstName = req.body.firstName
            const lastName = req.body.lastName
            const phoneNumber = req.body.phoneNumber
            const emailAddress = req.body.emailAddress
            const addressLine1 = req.body.addressLine1
            const addressLine2 = req.body.addressLine2
            const addressCity = req.body.city
            const addressState = req.body.state
            const addressZipCode = req.body.zipCode
            const userId = req.body.userID
            const order = await ordersData.createOrder(
                firstName, lastName, phoneNumber, emailAddress,
                addressLine1, addressLine2, addressCity, addressState, addressZipCode, cartObject, userId
            )
            console.log(order)
            return res.redirect('/user')
        } catch (err) {
            return res.status(404).json({ error: err })
        }
        return
    })
export default router;
