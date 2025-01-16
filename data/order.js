import { orders } from "../config/mongoCollections.js";
import helperMethods from "./../helpers.js";


const createOrder = async (firstName, lastName, phoneNumber, email, addressLine1, addressLine2, addressCity, addressState, addressZIP, cart, userID) => {
    try {
        const orderCollection = await orders()
        const orderID = await helperMethods.generateObjectID();
        const newOrder = {
            _id: orderID.toString(),
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            email: email,
            address: `${addressLine1}, ${addressLine2 + ', ' || ''} ${addressCity}, ${addressState}, ${addressZIP}`,
            cartItems: cart,
            userID: userID
            
        }
        const newInsertInformation = await orderCollection.insertOne(newOrder)
        return newOrder;
    } catch (error) {
        throw new Error(error)
    }
}

const methods = {};

export default methods;
