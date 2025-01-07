import { Router } from "express";
import helperMethods from "./../helpers.js";
import { products, categories } from "./../data/testing.js";
import { productData } from "./../data/index.js";

import multer from "multer";
import path from "path";

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
 * - Product management (viewing, adding, deleting products)
 * - Basic admin authentication 
 * - Single-step product creation process
 * 
 * Routes:
 * - GET /                    - Admin login page
 * - POST /                   - Process admin login (currently just redirects)
 * - GET /home               - Admin dashboard
 * - GET /products           - Product listing page showing all products
 * - GET /products/add-product - Add new product form
 * - POST /products/add-product - Process new product data
 * - GET /products/delete/:id - Delete a product by ID
 * 
 * Dependencies:
 * - express Router for routing
 * - multer for handling file/image uploads
 * - helper methods for validation and ID generation
 * - MongoDB collections accessed through data layer
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

router.route("/products")
    .get(async (req, res) => {
        const products = await productData.searchProduct();
        return res.render("admin/products", {
            docTitle: "Admin - Products",
            products: products
        });
    });

router.route("/products/delete/:id").get(async (req, res) => {
    const id = req.params.id;   

    try {
        console.log('I am here');
        const product = await productData.deleteProduct(id)       
        return res.redirect("/admin/products");
    } catch (error) {
        return res.status(500).send("Error deleting product");
    }


});

router.route("/products/edit/:id")
    .get(async (req, res) => {
        try {
            const id = req.params.id;
            const product = await productData.searchProduct({_id: id});
            return res.render('admin/editProduct', {
                docTitle: "Admin - Edit Product",
                productInfo: product[0]
            });
        } catch (error) {
            return res.status(500).send("Error retrieving product");
        }
    });



router.route("/products/add-product")
    .get((req, res) => {
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
    }).post(upload.single('coverImage'), (req, res) => {
        let coverImage = "";
        if(req.file){
            coverImage = `/public/uploads/${req.file.filename}`;
            res.setHeader('x-filename', coverImage);
        }
        return res.send(`
            <script>
                console.log(req.headers.get('x-filename'));
            </script>
        `);
    });

router.route("/products/add-product/step4")
    .get((req, res) => {
        return res.render("admin/addNewProduct_S4", {
            docTitle: "Admin - Add Product - Step 4"
        });
    }).post(upload.array('productImages', 10), async (req, res) => {
        let productImages = [];
        if (req.files) {
            productImages = req.files.map(file => `/public/uploads/${file.filename}`);
        }
        
        const productName = req.body.name;
        const productPrice = req.body.price;
        const productCategory = req.body.category;
        const productQuantity = req.body.quantity;
        const productDescription = req.body.description;
        const productHashtags = req.body.hashtags;
        const productCoverImage = req.body.coverImage;

        const newProduct = await productData.createProduct(productName, productPrice, productCategory, productQuantity, productDescription, productHashtags, productCoverImage, productImages);
        return res.status(200).send(`
            <script>
                sessionStorage.removeItem('productData')
                window.location.href = '/admin/products';
            </script>
        `);
    });

export default router;
