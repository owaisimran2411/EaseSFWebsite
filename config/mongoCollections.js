import { dbConnection } from "./mongoConnection.js";

const getCollectionFn = (collection) => {
	let _col = undefined;

	return async () => {
		if (!_col) {
			const db = await dbConnection();
			_col = await db.collection(collection);
		}

		return _col;
	};
};

/* Now, you can list your collections here: */export const product = getCollectionFn("product");
export const category = getCollectionFn("category");
export const orders = getCollectionFn("orders");
export const users = getCollectionFn("users");
export const reviews = getCollectionFn("reviews");
