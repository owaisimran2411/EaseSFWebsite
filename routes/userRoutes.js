import { Router } from "express";
import helperMethods from "./../helpers.js";
import { productData, ordersData, usersData } from "./../data/index.js";

const router = Router();

// Route goes here
router.route('/')
    .get(async (req, res) => {
        console.log(req.session)
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
                    { name: searchFilter },
                    { description: searchFilter },
                    { hashtags: searchFilter }
                ]
                // hashtags: searchFilter
            }
        )

        if (products.length !== 0) {
            // console.log(products)
            return res.render('user/product', {
                docTitle: 'Products',
                products: products
            })
        } else {
            return res.redirect('/user')
        }

    })

router.route('/login')
    .get(async (req, res) => {
        return res.render('user/login', {
            docTitle: 'Login'
        })
    })
    .post(async (req, res) => {
        try {
            const {emailAddress, password} = req.body
            const userLoginRequest = await usersData.searchUser(emailAddress, password)
            try {
                // console.log(userLoginRequest)
                // helperMethods.primitiveTypeValidation(userLoginRequest, 'object')
                req.session.user = userLoginRequest
                // console.log(userLoginRequest)
                if('role' in userLoginRequest) {
                    return res.redirect('/admin')
                } else {
                    return res.redirect('/user')
                }
            } catch (err) {
                console.log('incorrect username/password')
            }
        } catch (err) {
            return res.json({error: err})
        }
    })

router.route('/signup')
    .get(async (req, res) => {
        return res.render('user/signup', {
            docTitle: 'User Registration'
        })
    })
    .post(async (req, res) => {
        try {
            const { firstName, lastName, emailAddress, phoneNumber, password } = req.body
            // console.log(firstName)
            const insert = await usersData.createUser(firstName, lastName, emailAddress, phoneNumber, password)
            return res.status(200).json(insert)
        } catch (err) {
            return res.status(400).json({ error: err })
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
        if(req.session.user) {
            console.log("I am here")
            try {
                const userData = await usersData.preFillUserData(req.session.user.userID)
                console.log(userData)
                return res.render('user/cart', {
                    docTitle: 'Checkout',
                    checkout: true,
                    userProfile: userData
                })
            } catch (err) {
                console.error(err)
                return
            }
        } else {
            return res.render('user/cart', {
                docTitle: 'Checkout',
                checkout: true
            })
        }
        
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
            const userId = req.body.userID || 'null'
            const order = await ordersData.createOrder(
                firstName, lastName, phoneNumber, emailAddress,
                addressLine1, addressLine2, addressCity, addressState, addressZipCode, cartObject, userId
            )
            console.log(order)
            return res.redirect('/user')
        } catch (err) {
            return res.status(404).json({ error: err })
        }
    })
export default router;
