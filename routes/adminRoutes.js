import { Router } from "express";
import helperMethods from "./../helpers.js";
// import { products, categories } from "./../data/testing.js";
import { categoryData, productData, ordersData } from "./../data/index.js";

import multer from "multer";
import path from "path";
import fs from 'fs'

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join('public/uploads/'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
    }
});
const upload = multer({ storage: storage });

const router = Router();

/**
 * Admin Routes Module
 * 
 * This module handles all administrative routes for the application.
 * It includes functionality for product management, authentication, and dashboard access.
 * 
 * Key Features:
 * - File upload handling using Multer for product images
 * - Product management (viewing, editing, adding, deleting products)
 * - Basic admin authentication
 * - Multi-step product creation and editing process
 * - Image upload and management
 * 
 * Routes:
 * - GET /                    - Admin login page
 * - POST /                   - Process admin login (currently just redirects) 
 * - GET /home               - Admin dashboard
 * - GET /products           - Product listing page showing all products
 * - GET /products/add-product/step1 - Add product step 1 (basic info)
 * - POST /products/add-product/step1 - Process step 1 data
 * - GET /products/add-product/step2 - Add product step 2 (description)
 * - POST /products/add-product/step2 - Process step 2 data
 * - GET /products/add-product/step3 - Add product step 3 (image)
 * - POST /products/add-product/step3 - Process step 3 data
 * - GET /products/add-product/step4 - Add product step 4 (review)
 * - POST /products/add-product/step4 - Process final submission
 * - GET /products/edit/:id - Edit existing product
 * - GET /products/delete/:id - Delete a product by ID
 * 
 * Dependencies:
 * - express Router for routing
 * - multer for handling file/image uploads
 * - helper methods for validation and ID generation
 * - MongoDB collections accessed through data layer
 * - Session storage for multi-step form data persistence
 */

router.route("/")
    .get((req, res) => {
        return res.render("admin/index", {
            docTitle: "Admin - Login"
        });
    })
    .post((req, res) => {
        return res.redirect("/admin/home");
    });

router.route("/home")
    .get((req, res) => {
        return res.render("admin/home", {
            docTitle: "Admin - Home"
        });
    });

router.route('/order')
    .get(async (req, res) => {

    })

router.route("/products")
    .get(async (req, res) => {
        const products = await productData.searchProduct();
        return res.render("admin/products", {
            docTitle: "Admin - Products",
            products: products
        });
    });

router.route('/category')
    .get(async (req, res) => {
        const categories = await categoryData.searchCategories()
        return res.render('admin/category', {
            docTitle: 'Admin - Categories',
            categories: categories
        })
    })
    .post(async (req, res) => {
        try {
            const newCategory = await categoryData.createCategory(req.body.name)
            return res.json(newCategory)
        } catch (error) {
            return res.json(error)
        }
    })

router.route('/category/:categoryID')
    .post(async (req, res) => {
        try {
            const categoryUpdate = await categoryData.updateCategory(req.params.categoryID, req.body.name)
            if (categoryUpdate === true) {
                return res.status(200).json("Success")
            }
        } catch (err) {
            return res.json(err)
        }
    })

router.route("/products/delete/:id").get(async (req, res) => {
    const id = req.params.id;

    try {
        const product = await productData.deleteProduct(id)
        return res.redirect("/admin/products");
    } catch (error) {
        return res.status(500).send("Error deleting product");
    }


});

router.route("/product/edit-product/:id")
    .get(async (req, res) => {
        try {
            const id = req.params.id;
            const product = await productData.searchProduct({ _id: id });
            const categories = await categoryData.searchCategories()
            return res.render('admin/editExistingProduct_S1', {
                docTitle: "Admin - Edit Product - Step 1",
                productInfoString: JSON.stringify(product[0]),
                categories: categories
            });
        } catch (error) {
            return res.status(500).send("Error retrieving product");
        }
    });

router.route("/product/edit-product/step2/:id")
    .get(async (req, res) => {
        try {
            return res.render('admin/editExistingProduct_S2', {
                docTitle: "Admin - Edit Product - Step 2"
            });
        } catch (error) {
            return res.status(500).send("Error loading edit product step 2");
        }
    });

router.route("/product/edit-product/step3/:id")
    .get(async (req, res) => {
        try {
            return res.render('admin/editExistingProduct_S3', {
                docTitle: "Admin - Edit Product - Step 3"
            });
        } catch (error) {
            return res.status(500).send("Error loading edit product step 3");
        }
    })
    .post(upload.single('coverImage'), async (req, res) => {
        try {
            const oldImagePath = req.body.oldImagePath;
            const newImage = req.file;

            if (oldImagePath) {
                try {
                    fs.unlink(`${process.cwd()}/${oldImagePath}`, (err) => {
                        if (err) console.error('Error deleting old image:', err);
                    });
                } catch (error) {
                    console.error(error)
                }
            }
            // console.log('===',req.body)
            const updateObject = {
                name: req.body.name,
                price: req.body.price,
                category: req.body.category,
                quantity: req.body.quantity,
                description: req.body.description,
                hashtags: req.body.hashtags,
                coverImage: req.body.oldImagePath ? `/public/uploads/${newImage.filename}` : req.body.coverImage
            }
            const updateProduct = await productData.updateProduct(req.params.id, updateObject)
            return res.json({
                success: true,
            });
        } catch (error) {
            console.error('Error handling image update:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to update image'
            });
        }
    });


router.route("/products/add-product")
    .get(async (req, res) => {
        const categories = await categoryData.searchCategories({})
        return res.render("admin/addNewProduct_S1", {
            docTitle: "Admin - Add Product - Step 1",
            categories: categories
        });
    })
    .post((req, res) => {
        const productData = JSON.stringify(req.body);
        return res.send(
            `<script>
                sessionStorage.setItem('productData', '${productData}');
                window.location.href = '/admin/products/add-product/step2';
            </script>`
        );
    });

router.route("/products/add-product/step2")
    .get((req, res) => {
        return res.render("admin/addNewProduct_S2", {
            docTitle: "Admin - Add Product - Step 2"
        });
    }).post((req, res) => {
        return res.redirect("/admin/products/add-product/step3");
    });

router.route("/products/add-product/step3")
    .get((req, res) => {
        return res.render("admin/addNewProduct_S3", {
            docTitle: "Admin - Add Product - Step 3"
        });
    }).post(upload.single('coverImage'), async (req, res) => {
        let coverImage = "";
        if (req.file) {
            coverImage = `/public/uploads/${req.file.filename}`;
            // res.setHeader('x-filename', coverImage);
            const productName = req.body.name;
            const productPrice = req.body.price;
            const productCategory = req.body.category;
            const productQuantity = req.body.quantity;
            const productDescription = req.body.description;
            const productHashtags = req.body.hashtags;
            const productCoverImage = coverImage;


            const updatedProduct = await productData.createProduct(productName, productPrice, productCategory, productQuantity, productDescription, productHashtags, productCoverImage, []);
            return res.status(200).send(`
                <script>
                    sessionStorage.removeItem('productData')
                    window.location.href = '/admin/products';
                </script>
            `);
        }
        return res.send(`
            <script>
                console.log(req.headers.get('x-filename'));
            </script>
        `);
    });



export default router;
