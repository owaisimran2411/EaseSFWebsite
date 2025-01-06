import { Router } from "express";
import helperMethods from "./../helpers.js";
import { products, categories } from "./../data/testing.js";

import multer from "multer";
import path from "path";

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public/uploads/'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const router = Router();

// Route goes here
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
    .get((req, res) => {
        return res.render("admin/products", {
            docTitle: "Admin - Products",
            products: products
        });
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
        return res.redirect("/admin/products/add-product/step4");
    });

router.route("/products/add-product/step4")
    .get((req, res) => {
        return res.render("admin/addNewProduct_S4", {
            docTitle: "Admin - Add Product - Step 4"
        });
    }).post(upload.array('productImages', 10), (req, res) => {
        let productImages = [];
        if (req.files) {
            productImages = req.files.map(file => `/uploads/${file.filename}`);
        }
       const newProduct = {
           ...req.body,
            id: products.length + 1,
           productImages: productImages
        }
        products.push(newProduct);
        return res.send(`
            <script>
                sessionStorage.removeItem('productData')
               window.location.href = '/admin/products';
            </script>
        `);
    });

export default router;
