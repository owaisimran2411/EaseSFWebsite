import { reviews } from "../config/mongoCollections.js";
import helperMethods from "./../helpers.js";


const createReview = async (reviewMessage, userID, orderID) => {
    try {
        const reviewCollection = await reviews()
        const reviewID = await helperMethods.generateObjectID();
        const today = new Date();
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        const formattedDate = today.toLocaleDateString('en-US', options);
        const newReview = {
            _id: reviewID.toString(),
            reviewMessage: reviewMessage,
            orderId: orderID,
            userId: userID,
            reviewDate: formattedDate

        }
        // check for duplicate review, if no duplicate then insert otherwise return as it is
        const duplicateCheck = await reviewCollection.find({
            orderId: orderID
        }).toArray()
        if (duplicateCheck.length > 0) {
            return
        }

        const newInsertInformation = await reviewCollection.insertOne(newReview)
        return newReview;
    } catch (error) {
        throw new Error(error)
    }
}

const methods = {
    createReview
};

export default methods;
