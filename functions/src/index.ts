// Imports
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as algoliasearch from 'algoliasearch';
import * as cryptoString from 'crypto-random-string';

// initalizations
admin.initializeApp();
const env = functions.config();

// tslint:disable-next-line: prefer-const
let arr: any[] = [];

// Initialize the Algolia Client
const client = algoliasearch(env.algolia.appid, env.algolia.apikey);
const index = client.initIndex('prod_PRODUCTS');

// Sendgrid Setup
const cors = require('cors')({ origin: true });
//const SENDGRID_API_TESTKEY = env.sendgrid.key_test;
const SENDGRID_API_KEY = env.sendgrid.key;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);


// Email when password is changed
exports.changedPassword = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'POST') {
            return res.status(403).send('Forbidden!');
        }

        console.log(`To: ${req.body.toEmail}, Name: ${req.body.name}`);

        const msg = {
            to: req.body.toEmail,
            from: 'notifications@nxtdrop.com',
            templateId: 'd-0911ed5ff8ee46e3982bd3d8074ce831',
            dynamic_template_data: {
                name: req.body.toName,
                subject: 'Did you change your password?',
            },
        };

        return sgMail.send(msg).then((content: any) => {
            return res.status(200).send(content);
        }).catch((err: any) => {
            return res.send(err);
        });
    });
});


// Email to activate account
exports.accountCreated = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'POST') {
            return res.status(403).send('Forbidden!');
        }

        console.log(`To: ${req.body.toEmail}, Name: ${req.body.toName}`);

        const msg = {
            to: req.body.toEmail,
            from: 'notifications@nxtdrop.com',
            templateId: 'd-35761f77395f4395bf843c0d9d2352d8',
            dynamic_template_data: {
                name: req.body.toName,
                uid: req.body.toUid
            }
        };

        return sgMail.send(msg).then((content: any) => {
            console.log(content);
            return res.status(200).send(true);
        }).catch((err: any) => {
            console.error(err);
            return res.send(false);
        });
    });
});

// Email to reset account
exports.resetPassword = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'POST') {
            return res.status(403).send('Forbidden!');
        }

        console.log(`To: ${req.body.toEmail}, Name: ${req.body.toUsername}`);
        const code = cryptoString({ length: 24, type: 'url-safe' });

        return admin.firestore().collection(`users`).doc(`${req.body.toUid}`).set({
            resetCode: code
        }, { merge: true }).then(() => {
            const msg = {
                to: req.body.toEmail,
                from: 'notifications@nxtdrop.com',
                templateId: 'd-1630d61513f54005944c4abb4cb268ed',
                dynamic_template_data: {
                    username: req.body.toUsername,
                    uid: req.body.toUid,
                    email: req.body.toEmail,
                    code: code
                }
            };

            return sgMail.send(msg).then((content: any) => {
                console.log(content);
                return res.send(true);
            }).catch((err: any) => {
                console.error(err);
                return res.send(false);
            });
        }).catch(err => {
            console.error(err);
            return res.send(false);
        })
    });
});

// Change Password using Admin SDK
exports.newPassword = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'PUT') {
            return res.status(403).send(false);
        }

        return admin.firestore().collection(`users`).doc(`${req.body.uid}`).get().then(response => {
            const data = response.data();
            if (data) {
                if (data.resetCode === req.body.code) {
                    return admin.auth().updateUser(req.body.uid, {
                        password: req.body.newPass
                    }).then(r => {
                        console.log(`Password Changed`);
                        admin.firestore().collection(`users`).doc(`${req.body.uid}`).update({
                            resetCode: admin.firestore.FieldValue.delete()
                        }).then(() => {
                            console.log(`resetCode deleted`);
                        }).catch(err => {
                            console.error(`resetCode could not be deleted: ${err}`);
                        });
                        return res.send(true);
                    }).catch(err => {
                        console.error(err);
                        res.send(false);
                    });
                } else {
                    console.error(`resetCode: ${data.resetCode}, bodyCode: ${req.body.code}`);
                    return res.send(false);
                }
            } else {
                console.error(`Users does not exist`);
                return res.send(false);
            }
        });
    });
});

// Algolia Update
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

        index.saveObjects(arr, (err: any, content: any) => {
            res.status(200).send(content);
        });

    });
});