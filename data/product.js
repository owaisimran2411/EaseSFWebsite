import { product } from "../config/mongoCollections.js";
import helperMethods from "./../helpers.js";

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

