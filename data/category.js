import { category } from "../config/mongoCollections.js";
import helperMethods from "./../helpers.js";

import { productData } from "./index.js";

/**
 * Searches for categories in the database based on the provided search parameters
 * @param {object} searchParams - The search parameters to filter the products
 * @returns {Promise<Array>} Returns an array of products that match the search parameters
 * @throws {Error} Throws an error if the search parameters are invalid
 */
const searchCategories = async (searchParams) => {
    let queryParams = undefined;
    try {
        helperMethods.argumentProvidedValidation(searchParams, "searchParams");
        queryParams = searchParams;
        
        queryParams = helperMethods.primitiveTypeValidation(queryParams, "queryParams", "object");
        
    } catch (error) {
        queryParams = {};
    }
    const categoryCollection = await category();
    const categories = await categoryCollection.find(queryParams).toArray();
    return categories;
};

const createCategory = async (categoryName) => {
    try {
        const categoryCollection = await category();
        const categoryID = await helperMethods.generateObjectID();
        const newCategory = {
            _id: categoryID.toString(),
            name: categoryName,
            
        };
        const newInsertInformation = await categoryCollection.insertOne(newCategory);
        return newCategory;
    } catch (error) {
        throw new Error("Error creating Category");
    }
}

const updateCategory = async(categoryID, categoryName) => {
    try {
        const categoryCollection = await category();

        try {
            let oldCategoryName = await searchCategories({_id: categoryID})
            oldCategoryName = oldCategoryName[0].name 
            const result = await categoryCollection.updateOne(
                {_id: categoryID}, {
                    $set: {
                        name: categoryName
                    }
                })

            if(result.modifiedCount === 0) {
                throw new Error ('Unable to update Category')
            }
            const productIDs = await productData.searchProduct({category: oldCategoryName})
            productIDs.forEach((element) => {
                const updateProductInfo = productData.updateProduct(element._id, {category: categoryName})
            })
            return true
        } catch (error) {
            throw new Error(error)
        }

    } catch (err) {
        throw new Error(err)
    }
}
const methods = {
    searchCategories,
    createCategory,
    updateCategory
};

export default methods;
