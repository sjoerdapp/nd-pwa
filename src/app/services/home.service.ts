import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  data = require('C://Users/hp/Desktop/DB JSON/products.json');
  downloadURL: string;

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  /*public uploadImages() {
    const listRef = this.storage.storage.ref().child('products/');

    this.data[2].data.forEach(element => {
      const productID = element.model.replace(/\s/g, '-').replace(/["'()]/g, '').replace(/\//g, '-').toLowerCase();
      const productRef: AngularFirestoreDocument<any> = this.afs.doc(`products/${productID}`);
      const filename = element.assetURL.slice(6);

      listRef.child(`${filename}`).getDownloadURL().then(downloadURL => {
        this.downloadURL = downloadURL;

        const data = {
          assetURL: downloadURL
        };

        productRef.set(data, { merge: true })
          .then(() => {
            console.log(`assetURL added to ${productID}`);
          });
      }).catch(error => {
        console.log(error);
      });
    });
  }

  /*public uploadAllData() {
    this.data[2].data.forEach(element => {
      const productID = element.model.replace(/\s/g, '-').replace(/["'()]/g, '').replace(/\//g, '-').toLowerCase();
      const productRef: AngularFirestoreDocument<Product> = this.afs.doc(`products/${productID}`);

      const data: Product = {
        productID,
        brand: element.brand,
        line: element.line,
        model: element.model,
        colorway: element.colorway,
        yearMade: element.yearMade,
        type: element.type
      };

      console.log(productID);

      productRef.set(data)
        .then(() => {
          console.log('product added');
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }*/
}
