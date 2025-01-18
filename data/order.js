import { orders } from "../config/mongoCollections.js";
import helperMethods from "./../helpers.js";

const searchOrders = async (searchParams) => {
    let queryParams = undefined;
    try {
        helperMethods.argumentProvidedValidation(searchParams, "searchParams");
        queryParams = searchParams;

        queryParams = helperMethods.primitiveTypeValidation(queryParams, "queryParams", "object");

    } catch (error) {
        queryParams = {};
    }
    const orderCollection = await orders();
    const order = await orderCollection.find(queryParams).toArray();
    return order;
};

const createOrder = async (firstName, lastName, phoneNumber, email, addressLine1, addressLine2, addressCity, addressState, addressZIP, cart, userID) => {
    try {
        const orderCollection = await orders()
        const orderID = await helperMethods.generateObjectID();
        const today = new Date();
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        const formattedDate = today.toLocaleDateString('en-US', options); 
        const newOrder = {
            _id: orderID.toString(),
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            email: email,
            address: `${addressLine1}, ${addressLine2 + ', ' || ''}${addressCity}, ${addressState}, ${addressZIP}`,
            cartItems: cart,
            userID: userID,
            orderDate: formattedDate

        }
        const newInsertInformation = await orderCollection.insertOne(newOrder)
        return newOrder;
    } catch (error) {
        throw new Error(error)
    }
}

const methods = {
    searchOrders,
    createOrder
};

export default methods;
