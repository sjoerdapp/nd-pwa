import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {

  //data = require('./products2.json');

  constructor(
    private afs: AngularFirestore
  ) { }

  ngOnInit() {
    //this.uploadAllData();
    //this.count();
    //this.up();
  }

  count() {
    this.afs.collection('products').get().subscribe(data => {
      let haveAsset = 0;
      let haveNoAsset = 0;
      data.forEach(ele => {
        if (ele.exists) {
          if (ele.data().assetURL) {
            haveAsset += 1;
          } else {
            haveNoAsset += 1;
          }
        }
      });

      console.log(`withAsset: ${haveAsset} and without: ${haveNoAsset}`);
    });
  }

  /*public uploadImages(filename) {
    const listRef = firebase.storage().ref().child('products/');
    return listRef.child(`${filename}`).getDownloadURL().then(downloadURL => {
      return downloadURL;
    }).catch(error => {
      console.log(error);
    });
  }

  public uploadAllData() {
    this.data.forEach(element => {
      const productID = element.Model.replace(/\s/g, '-').replace(/["'()]/g, '').replace(/\//g, '-').toLowerCase();
      const productRef = this.afs.doc(`products/${productID}`);
      const filename = element.assetURL.slice(6);
      this.uploadImages(filename).then(assetURL => {
        const data = {
          productID,
          brand: element.Brand,
          line: element.Line,
          model: element.Model,
          colorway: element.colorway,
          yearMade: element.yearMade,
          type: element.type,
          assetURL
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
    });
  }

  public up() {
    this.data.forEach(element => {
      const productID = element.Model.replace(/\s/g, '-').replace(/["'()]/g, '').replace(/\//g, '-').toLowerCase();
      const productRef = this.afs.doc(`products/${productID}`);
      const filename = element.assetURL.slice(6);

      productRef.get().subscribe(res => {
        if (!res.exists) {
          this.uploadImages(`${filename}.webp`).then(assetURL => {
            const data = {
              productID,
              brand: element.Brand,
              line: element.Line,
              model: element.Model,
              colorway: element.colorway,
              yearMade: element.yearMade,
              type: element.type,
              assetURL
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
        }
      })
    });
  }*/

}
