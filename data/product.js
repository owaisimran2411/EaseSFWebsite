import { product } from "../config/mongoCollections.js";
import helperMethods from "./../helpers.js";

/**
 * Creates a new product in the database
 * @param {string} productName - The name of the product
 * @param {number} productPrice - The price of the product
 * @param {string} productCategory - The category of the product
 * @param {number} productQuantity - The quantity of product in stock
 * @param {string} productDescription - Detailed description of the product
 * @param {string[]} productHashtags - Array of hashtags associated with the product
 * @param {string} productCoverImage - Filename of the product's cover image
 * @param {string[]} productImages - Array of filenames for additional product images
 * @returns {Promise<string>} Returns the inserted document's ID if successful
 * @throws {Error} Throws an error if product creation fails
 */

const createProduct = async (productName, productPrice, productCategory, productQuantity, productDescription, productHashtags, productCoverImage, productImages) => {

    
    try {
        const productCollection = await product();
        const productID = await helperMethods.generateObjectID();
        const newProduct = {
            _id: productID.toString(),
            name: productName,
            price: productPrice,
            category: productCategory,
            quantity: productQuantity,
            description: productDescription,
            hashtags: productHashtags,
            coverImage: productCoverImage,
            productImages: productImages
        };
        const newInsertInformation = await productCollection.insertOne(newProduct);
        return newInsertInformation.insertedId;
    } catch (error) {
        throw new Error("Error creating product");
    }
};

/**
 * Searches for products in the database based on the provided search parameters
 * @param {object} searchParams - The search parameters to filter the products
 * @returns {Promise<Array>} Returns an array of products that match the search parameters
 * @throws {Error} Throws an error if the search parameters are invalid
 */
const searchProduct = async (searchParams) => {
    let queryParams = undefined;
    try {
        helperMethods.argumentProvidedValidation(searchParams, "searchParams");
        queryParams = searchParams;
        
        queryParams = helperMethods.primitiveTypeValidation(queryParams, "queryParams", "object");
        
    } catch (error) {
        queryParams = {};
    }
    const productCollection = await product();
    const products = await productCollection.find(queryParams).toArray();
    return products;
};
const methods = {
    createProduct,
    searchProduct
};

export default methods;

