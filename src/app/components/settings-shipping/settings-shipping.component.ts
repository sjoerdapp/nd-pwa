import { Component, OnInit } from '@angular/core';
import { SettingsShippingService } from 'src/app/services/settings-shipping.service';
import { ActivatedRoute, Router } from '@angular/router';
import { isUndefined } from 'util';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-settings-shipping',
  templateUrl: './settings-shipping.component.html',
  styleUrls: ['./settings-shipping.component.scss']
})
export class SettingsShippingComponent implements OnInit {

  shippingInfo;

  firstName = '';
  lastName = '';
  street = '';
  line = '';
  city = '';
  province = '';
  postalCode = '';

  firstNameChanged = false;
  lastNameChanged = false;
  streetChanged = false;
  lineChanged = false;
  cityChanged = false;
  provinceChanged = false;
  postalCodeChanged = false;

  loading = false;
  error = false;
  updated = false;

  redirectURI: string;

  UID: string;

  constructor(
    private shippingService: SettingsShippingService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.redirectURI = this.route.snapshot.queryParams.redirectURI;

    this.auth.isConnected().then(res => {
      if (!res) {
        this.router.navigate(['/login'], {
          queryParams: { redirectURI: 'settings/shipping' }
        })
      } else {
        this.UID = res.uid;
        this.getShippingInfo();
      }
    });
  }

  getShippingInfo() {
    this.shippingService.getShippingInfo(this.UID).subscribe(res => {
      this.shippingInfo = res;

      //console.log(this.shippingInfo);

      if (this.shippingInfo.shippingAddress.selling) {
        this.firstName = this.shippingInfo.shippingAddress.selling.firstName;
        this.lastName = this.shippingInfo.shippingAddress.selling.lastName;
        this.street = this.shippingInfo.shippingAddress.selling.street;
        this.line = this.shippingInfo.shippingAddress.selling.line2;
        this.city = this.shippingInfo.shippingAddress.selling.city;
        this.province = this.shippingInfo.shippingAddress.selling.province;
        this.postalCode = this.shippingInfo.shippingAddress.selling.postalCode;

        (document.getElementById('ship-state') as HTMLInputElement).value = this.province;
      } else {
        this.firstName = this.shippingInfo.firstName;
        this.lastName = this.shippingInfo.lastName;
      }
    });
  }

  updateShipping() {
    if (this.streetChanged || this.lineChanged || this.cityChanged || this.provinceChanged || this.postalCodeChanged || this.firstNameChanged || this.lastNameChanged) {
      const firstName = (document.getElementById('ship-firstName') as HTMLInputElement).value;
      const lastName = (document.getElementById('ship-lastName') as HTMLInputElement).value;
      const street = (document.getElementById('ship-street') as HTMLInputElement).value;
      const line = (document.getElementById('ship-street2') as HTMLInputElement).value;
      const city = (document.getElementById('ship-city') as HTMLInputElement).value;
      const province = (document.getElementById('ship-state') as HTMLInputElement).value;
      const postalCode = (document.getElementById('ship-zip') as HTMLInputElement).value;
      const country = (document.getElementById('ship-country') as HTMLInputElement).value;

      //console.log(this.isEmptyOrBlank(firstName));

      if (!this.isEmptyOrBlank(firstName) && !this.isEmptyOrBlank(lastName) && !this.isEmptyOrBlank(street) && !this.isEmptyOrBlank(city) && !this.isEmptyOrBlank(province) && !this.isEmptyOrBlank(postalCode)) {
        this.loading = true;

        this.shippingService.updateShippingInfo(this.shippingInfo.uid, firstName, lastName, street, line, city, province, postalCode, country).then(res => {
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
            this.firstNameChanged = false;
            this.lastNameChanged = false;
            this.streetChanged = false;
            this.lineChanged = false;
            this.cityChanged = false;
            this.provinceChanged = false;
            this.postalCodeChanged = false;

            if (!isUndefined(this.redirectURI)) {
              this.backBtn();
            }
          }, 2000);
        });
      } else {
        this.error = true;

        setTimeout(() => {
          this.error = false;
        }, 1500);
      }
    }
  }

  firstNameChanges() {
    const firstName = (document.getElementById('ship-firstName') as HTMLInputElement).value;

    if (isUndefined(this.firstName) || (firstName.toLowerCase() != this.firstName.toLowerCase())) {
      this.firstNameChanged = true;
    } else {
      this.firstNameChanged = false;
    }
  }

  lastNameChanges() {
    const lastName = (document.getElementById('ship-lastName') as HTMLInputElement).value;

    if (isUndefined(this.lastName) || (lastName.toLowerCase() != this.lastName.toLowerCase())) {
      this.lastNameChanged = true;
    } else {
      this.lastNameChanged = false;
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
  }

  backBtn() {
    if (isUndefined(this.redirectURI)) {
      this.router.navigate(['/settings']);
    } else {
      this.router.navigateByUrl(this.redirectURI);
    }
  }

}
