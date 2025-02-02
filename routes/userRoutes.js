import { Router } from "express";
import helperMethods from "./../helpers.js";
import { productData, ordersData, usersData, categoryData } from "./../data/index.js";
import { category } from "../config/mongoCollections.js";

const router = Router();

// Route goes here
router.route('/')
    .get(async (req, res) => {
        // console.log(req.session)
        const products = await productData.searchProduct()
        const categories = await categoryData.searchCategories()
        const loginStatus = await helperMethods.checkLoginStatus(req)
        const role = await helperMethods.checkUserRole(req)
        // console.log(loginStatus)
        return res.render('user/product', {
            docTitle: 'Products',
            products: products,
            isLoggedIn: loginStatus,
            role: role,
            category: categories
        })
    })
    .post(async (req, res) => {
        let searchFilter = {}
        if ('productNameFilter' in req.body && req.body.productNameFilter !== '') {
            searchFilter = { $regex: req.body.productNameFilter, $options: 'i' }
        }
        else {
            searchFilter = { $regex: '', $options: 'i' }
        }
        const products = await productData.searchProduct(
            {
                $or: [
                    { name: searchFilter },
                    { description: searchFilter },
                    { hashtags: searchFilter },
                ]
            }
        )
        const categories = await categoryData.searchCategories()
        const loginStatus = await helperMethods.checkLoginStatus(req)
        const role = await helperMethods.checkUserRole(req)
        if (products.length !== 0) {
            // console.log(products)
            return res.render('user/product', {
                docTitle: 'Products',
                products: products,
                category: categories,
                isLoggedIn: loginStatus,
                role: role,

            })
        } else {
            return res.redirect('/user')
        }

    })

router.route('/advance-filters').post(async (req, res) => {
    let searchFilter = {}
    let query = {}
    if ('searchBox' in req.body && req.body.searchBox !== '') {
        searchFilter = { $regex: req.body.searchBox, $options: 'i' }
        query = {
            $or: [
                { name: searchFilter },
                { description: searchFilter },
                { hashtags: searchFilter },
            ]
        }
    }


    let products = await productData.searchProduct(
        query
    )
    if (req.body.category != '*') {
        const productsFilteredByCategory = products.filter(product => product.category == req.body.category)
        products = productsFilteredByCategory;
    }

    return res.json(products)
    const categories = await categoryData.searchCategories()
    const loginStatus = await helperMethods.checkLoginStatus(req)
    const role = await helperMethods.checkUserRole(req)
    if (products.length !== 0) {
        // console.log(products)
        return res.render('user/product', {
            docTitle: 'Products',
            products: products,
            category: categories,
            isLoggedIn: loginStatus,
            role: role,

        })
    } else {
        return res.redirect('/user')
    }
})

router.route('/login')
    .get(async (req, res) => {
        const loginStatus = await helperMethods.checkLoginStatus(req)
        const role = await helperMethods.checkUserRole(req)
        return res.render('user/login', {
            docTitle: 'Login',
            isLoggedIn: loginStatus,
            role: role
        })
    })
    .post(async (req, res) => {
        try {
            const { emailAddress, password } = req.body
            const userLoginRequest = await usersData.searchUser(emailAddress, password)
            try {
                // console.log(userLoginRequest)
                // helperMethods.primitiveTypeValidation(userLoginRequest, 'object')
                req.session.user = userLoginRequest
                // console.log(userLoginRequest)
                if ('role' in userLoginRequest) {
                    return res.redirect('/admin')
                } else {
                    return res.redirect('/user')
                }
            } catch (err) {
                console.log('incorrect username/password')
            }
        } catch (err) {
            return res.json({ error: err })
        }
    })

router.route('/signup')
    .get(async (req, res) => {
        const loginStatus = await helperMethods.checkLoginStatus(req)
        const role = await helperMethods.checkUserRole(req)
        console.log(loginStatus)
        return res.render('user/signup', {
            docTitle: 'User Registration',
            isLoggedIn: loginStatus,
            role: role
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
        const loginStatus = await helperMethods.checkLoginStatus(req)
        const role = await helperMethods.checkUserRole(req)
        return res.render('user/cart', {
            docTitle: 'Cart',
            isLoggedIn: loginStatus,
            role: role
        })
    })

router.route('/checkout')
    .get(async (req, res) => {
        if (req.session.user) {
            console.log("I am here")
            try {
                const userData = await usersData.preFillUserData(req.session.user.userID)
                const loginStatus = await helperMethods.checkLoginStatus(req)
                const role = await helperMethods.checkUserRole(req)
                return res.render('user/cart', {
                    docTitle: 'Checkout',
                    checkout: true,
                    userProfile: userData,
                    isLoggedIn: loginStatus,
                    role: role
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
            return res.redirect('/user')
        } catch (err) {
            return res.status(404).json({ error: err })
        }
    })
export default router;
