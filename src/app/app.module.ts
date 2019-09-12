/** Modules */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';

/** Components */
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LoginComponent } from './components/login/login.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { TrendingComponent } from './components/trending/trending.component';
import { NewReleasesComponent } from './components/new-releases/new-releases.component';
import { DiscoveryComponent } from './components/discovery/discovery.component';
import { ProductComponent } from './components/product/product.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SettingsProfileComponent } from './components/settings-profile/settings-profile.component';
import { SettingsPasswordComponent } from './components/settings-password/settings-password.component';
import { SettingsBuyingComponent } from './components/settings-buying/settings-buying.component';
import { SettingsSellingComponent } from './components/settings-selling/settings-selling.component';
import { SettingsShippingComponent } from './components/settings-shipping/settings-shipping.component';
import { SettingsPayoutComponent } from './components/settings-payout/settings-payout.component';
import { TransactionReviewComponent } from './components/transaction-review/transaction-review.component';
import { SellComponent } from './components/sell/sell.component';
import { SearchComponent } from './components/search/search.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { EditListingComponent } from './components/edit-listing/edit-listing.component';
import { RequestComponent } from './components/request/request.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { ActivateAccountComponent } from './components/activate-account/activate-account.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { LoggedOutComponent } from './components/logged-out/logged-out.component';
import { SignupInformationComponent } from './components/signup-information/signup-information.component';
import { MakeAnOfferComponent } from './components/make-an-offer/make-an-offer.component';
import { EditOfferComponent } from './components/edit-offer/edit-offer.component';

/** Font Awesome */
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

/** Icons imports */
// tslint:disable-next-line: max-line-length
import { faBell, faTimes, faShoppingCart, faUserCircle, faBars, faSearch, faDollarSign, faCheckCircle, faQuestionCircle, faTag, faBox, faMoneyBillWave, faSpinner, faHandHoldingUsd } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram, faGoogle, faPaypal } from '@fortawesome/free-brands-svg-icons';

// Firebase Setup
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireStorageModule } from '@angular/fire/storage';

// Reactive Forms
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Algolia
import { NgAisModule } from 'angular-instantsearch';

// Mask Module
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

export let options: Partial<IConfig> | (() => Partial<IConfig>);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    SignUpComponent,
    LoginComponent,
    CarouselComponent,
    TrendingComponent,
    NewReleasesComponent,
    DiscoveryComponent,
    ProductComponent,
    CartComponent,
    CheckoutComponent,
    ProfileComponent,
    SettingsComponent,
    SettingsProfileComponent,
    SettingsPasswordComponent,
    SettingsBuyingComponent,
    SettingsSellingComponent,
    SettingsShippingComponent,
    SettingsPayoutComponent,
    TransactionReviewComponent,
    SellComponent,
    SearchComponent,
    DashboardComponent,
    NotificationsComponent,
    SideMenuComponent,
    EditListingComponent,
    RequestComponent,
    ForgetPasswordComponent,
    ActivateAccountComponent,
    ContactUsComponent,
    LoggedOutComponent,
    SignupInformationComponent,
    MakeAnOfferComponent,
    EditOfferComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireStorageModule,
    ReactiveFormsModule,
    FormsModule,
    NgAisModule,
    NgxMaskModule.forRoot(options),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    // add icon to library to be used in components
// tslint:disable-next-line: max-line-length
    library.add(faBell, faBars, faShoppingCart, faUserCircle, faFacebook, faInstagram, faTwitter, faTimes, faGoogle, faSearch, faPaypal, faDollarSign, faCheckCircle, faQuestionCircle, faTag, faBox, faMoneyBillWave, faSpinner, faHandHoldingUsd);
  }
}
