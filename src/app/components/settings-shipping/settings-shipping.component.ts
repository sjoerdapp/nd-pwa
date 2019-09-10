import { Component, OnInit } from '@angular/core';
import { SettingsShippingService } from 'src/app/services/settings-shipping.service';

@Component({
  selector: 'app-settings-shipping',
  templateUrl: './settings-shipping.component.html',
  styleUrls: ['./settings-shipping.component.scss']
})
export class SettingsShippingComponent implements OnInit {

  shippingInfo;

  street = '';
  line = '';
  city = '';
  province = '';
  postalCode = '';

  streetChanged = false;
  lineChanged = false;
  cityChanged = false;
  provinceChanged = false;
  postalCodeChanged = false;

  loading = false;
  error = false;
  updated = false;

  constructor(
    private shippingService: SettingsShippingService
  ) { }

  ngOnInit() {

    this.shippingService.getShippingInfo().then(res => {
      res.subscribe(data => {
        this.shippingInfo = data;

        console.log(this.shippingInfo);

        if (this.shippingInfo.shippingAddress) {
          this.street = this.shippingInfo.shippingAddress.street;
          this.line = this.shippingInfo.shippingAddress.line;
          this.city = this.shippingInfo.shippingAddress.city;
          this.province = this.shippingInfo.shippingAddress.province;
          this.postalCode = this.shippingInfo.shippingAddress.postalCode;

          (document.getElementById('ship-state') as HTMLInputElement).value = this.province;
        }
      });
    });
  }

  updateShipping() {
    if (this.streetChanged || this.lineChanged || this.cityChanged || this.provinceChanged || this.postalCodeChanged) {
      const street = (document.getElementById('ship-street') as HTMLInputElement).value;
      const line = (document.getElementById('ship-street2') as HTMLInputElement).value;
      const city = (document.getElementById('ship-city') as HTMLInputElement).value;
      const province = (document.getElementById('ship-state') as HTMLInputElement).value;
      const postalCode = (document.getElementById('ship-zip') as HTMLInputElement).value;

      this.loading = true;

      this.shippingService.updateShippingInfo(this.shippingInfo.uid, street, line, city, province, postalCode).then(res => {
        if (res) {
          this.loading = false;
          this.updated = true;
        } else {
          this.loading = false;
          this.error = true;
        }

        setTimeout(() => {
          this.error = false;
          this.updated = false;
          this.streetChanged = false;
          this.lineChanged = false;
          this.cityChanged = false;
          this.provinceChanged = false;
          this.postalCodeChanged = false;
        }, 2000);
      })
    }
  }


  streetAddChanges() {
    const street = (document.getElementById('ship-street') as HTMLInputElement).value;

    if (street.toLowerCase() != this.street.toLowerCase()) {
      this.streetChanged = true;
    } else {
      this.streetChanged = false;
    }
  }

  addLineChanges() {
    const line = (document.getElementById('ship-street2') as HTMLInputElement).value;

    if (line.toLowerCase() != this.line.toLowerCase()) {
      this.lineChanged = true;
    } else {
      this.lineChanged = false;
    }
  }

  cityChanges() {
    const city = (document.getElementById('ship-city') as HTMLInputElement).value;

    if (city.toLowerCase() != this.city.toLowerCase()) {
      this.cityChanged = true;
    } else {
      this.cityChanged = false;
    }
  }

  provinceChanges() {
    const province = (document.getElementById('ship-state') as HTMLInputElement).value;

    if (province.toLowerCase() != this.province.toLowerCase()) {
      this.provinceChanged = true;
    } else {
      this.provinceChanged = false;
    }
  }

  zipChanges() {
    const postalCode = (document.getElementById('ship-zip') as HTMLInputElement).value;

    if (postalCode.toLowerCase() != this.postalCode.toLowerCase()) {
      this.postalCodeChanged = true;
    } else {
      this.postalCodeChanged = false;
    }
  }

  isEmptyOrBlank(str) {
    return (str.length === 0 || !str.trim());
  };

}
