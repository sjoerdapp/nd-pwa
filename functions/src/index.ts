// Imports
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as algoliasearch from 'algoliasearch';
import * as braintree from 'braintree';

// initalizations
admin.initializeApp();
const env = functions.config();

// tslint:disable-next-line: prefer-const
let arr: any[] = [];

// Initialize the Algolia Client
const client = algoliasearch(env.algolia.appid, env.algolia.apikey);
const index = client.initIndex('test_PRODUCTS');

// Sendgrid Setup
const cors = require('cors')({ origin: true });
const SENDGRID_API_TESTKEY = env.sendgrid.key_test;
// const SENDGRID_API_KEY = env.sendgrid.key;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_TESTKEY);


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
            return res.status(200).send(content);
        }).catch((err: any) => {
            return res.send(err);
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

        index.saveObjects(arr, (err, content) => {
            res.status(200).send(content);
        });

    });
});

// Braintree
const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: 'wfc3644dk4yscffb',
    publicKey: 'xq24yt5nw9wx3hbq',
    privateKey: '9ef65f89ffe81a68e322708f2cbf3040'
});

exports.client_token = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        return gateway.clientToken.generate({}).then((token) => {
            return res.status(200).send(token);
        }).catch((err) => {
            console.error(err);
            return res.send('Braintree Error');
        });
    });
});

exports.requestPaymentMethod = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        return admin.firestore().collection(`users`).doc(`${req.body.billing.uid}`).get().then(data => {
            const doc = data.data();
            if (doc) {
                const token = doc.cc_token;
                const email = doc.email;
                
                if (!token) {
                    console.log(`uid: ${req.body.billing.uid}`);
                    return gateway.customer.create({
                        firstName: req.body.billing.firstName,
                        lastName: req.body.billing.lastName,
                        email: email,
                        phone: req.body.billing.phoneNumber,
                        paymentMethodNonce: req.body.paymentMethodNonce,
                        id: req.body.billing.uid,
                        creditCard: {
                            billingAddress: {
                                streetAddress: req.body.billing.street,
                                firstName: req.body.billing.firstName,
                                lastName: req.body.billing.lastName,
                                countryName: req.body.billing.country,
                                locality: req.body.billing.city,
                                region: req.body.billing.province,
                                extendedAddress: req.body.billing.line,
                                postalCode: req.body.billing.postalCode
                            },
                            options: {
                                failOnDuplicatePaymentMethod: true,
                                makeDefault: true
                            }
                        }
                    }).then((result: braintree.ValidatedResponse<braintree.Customer>) => {
                        if (result.customer.paymentMethods) {
                            return admin.firestore().collection(`users`).doc(`${req.body.billing.uid}`).set({
                                cc_token: result.customer.paymentMethods[0].token
                            }, { merge: true }).then(() => {
                                return res.status(200).send('true');
                            }).catch(err => {
                                console.error(err);
                                return res.send('false');
                            });
                        } else {
                            return res.send('false');
                        }
                    }).catch(err => {
                        console.error(err);
                        return res.send('false');
                    });
                } else {
                    return gateway.paymentMethod.update(token, {
                        paymentMethodNonce: req.body.paymentMethodNonce,
                        billingAddress: {
                            streetAddress: req.body.billing.street,
                            firstName: req.body.billing.firstName,
                            lastName: req.body.billing.lastName,
                            countryName: req.body.billing.country,
                            locality: req.body.billing.city,
                            region: req.body.billing.province,
                            extendedAddress: req.body.billing.line,
                            postalCode: req.body.billing.postalCode,
                            options: {
                                updateExisting: true
                            }
                        }
                    }).then(result => {
                        return res.status(200).send('true');
                    }).catch(err => {
                        console.error(err);
                        return res.send('false');
                    });
                }
            } else {
                return res.send('false');
            }
        });
    });
});