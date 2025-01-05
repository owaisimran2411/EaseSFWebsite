fileName=$(fileName)
collectionName=$(collectionName)
routeName=$(routeName)
commitMessage=$(commitMessage)

create-data-file:
	touch ./data/$(fileName)
	cat ./templateFiles/dataTemplate.js > ./data/$(fileName)
	sed -i "s/COLLECTION_NAME/$(collectionName)/g" ./data/$(fileName)
	
append-in-collection: create-data-file
	echo "export const $(collectionName) = getCollectionFn(\"$(collectionName)\");" >> ./config/mongoCollections.js

append-in-dataindexjs: append-in-collection
	sed -i "s|// import_line|import $(collectionName)DataFunctions from \"./$(fileName)\";\n// import_line|g" ./data/index.js
	sed -i "s|// export_line|export const $(collectionName)Data = $(collectionName)DataFunctions;\n// export_line|g"  ./data/index.js

data-file: append-in-dataindexjs
	echo "Creating a Data File"
	git add ./data/$(filename)
	git add ./data/index.js
	git add ./config/mongoCollections.js
	git status
	git commit -m "Create Data File of $(collectionName) using Make"
	git push origin main

create-route-file:
	touch ./routes/$(fileName)
	cat ./templateFiles/routerTemplate.js > ./routes/$(fileName)

append-in-routesindexjs: create-route-file
	sed -i "s|// import_line|import $(routeName)Route from \"./$(fileName)\";\n// import_line|g" ./routes/index.js
	sed -i "s|// router_line|app.use(\"/$(routeName)\", $(routeName)Route);\n	// router_line|g" ./routes/index.js
	
route-file: append-in-routesindexjs
	echo "Creating a Route File"
	git add ./routes/index.js
	git add ./routes/$(fileName)
	git status
	git commit -m "Create Route File of $(fileName) using Make"
	git push origin main

commit:
	git add .
	git commit -m "$(commitMessage)"
	git push origin main