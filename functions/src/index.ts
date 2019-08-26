import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
const env = functions.config();

// tslint:disable-next-line: prefer-const
let arr: any[] = [];

import * as algoliasearch from 'algoliasearch';

// Initialize the Algolia Client
const client = algoliasearch(env.algolia.appid, env.algolia.apikey);
const index = client.initIndex('test_PRODUCTS');

exports.indexProducts = functions.firestore
    .document('products/{productID}')
    .onCreate((snap, context) => {
        const data = snap.data();
        const objectID = snap.id;

        // Add data to the Algolia index
        return index.addObject({
            objectID,
            ...data
        });
    });

exports.unindexProduct = functions.firestore
    .document('products/{productID}')
    .onDelete((snap, context) => {
        const objectID = snap.id;

        // Delete an ID from the index
        return index.deleteObject(objectID);
    });

exports.addFirestoreDataToAlgolia = functions.https.onRequest((req, res) => {

    // tslint:disable-next-line: no-floating-promises
    admin.firestore().collection('products').get().then((docs) => {

        docs.forEach(doc => {
            const user = doc.data();
            user.objectID = doc.id;

            arr.push(user);
        });

        index.saveObjects(arr, (err, content) => {
            res.status(200).send(content);
        });

    });
});