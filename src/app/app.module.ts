/** Modules */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

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
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AuthComponent } from './components/auth/auth.component';
import { PhoneVerificationComponent } from './components/phone-verification/phone-verification.component';
import { SoldComponent } from './components/sold/sold.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ModalComponent } from './components/modal/modal.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { TermsComponent } from './components/terms/terms.component';
import { SpecialDropHomeComponent } from './components/special-drop/home/home.component';
import { BlogHomeComponent } from './components/blog/blog-home/blog-home.component';
import { BlogPostComponent } from './components/blog/blog-post/blog-post.component';
import { DropComponent } from './components/special-drop/drop/drop.component';
import { SnkrsComponent } from './components/snkrs/snkrs.component';
import { Dec182019Component } from './components/landing-pages/dec182019//dec182019.component';
import { HowItWorksComponent } from './components/how-it-works/how-it-works.component';
import { ReferralComponent } from './components/referral/referral.component';
import { FaqHomeComponent } from './components/faq/faq-home/faq-home.component';
import { FaqCategoryComponent } from './components/faq/faq-category/faq-category.component';
import { FaqPostComponent } from './components/faq/faq-post/faq-post.component';

/** Font Awesome */
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

/** Icons imports */
// tslint:disable-next-line: max-line-length
import { faBell, faTimes, faShoppingCart, faUserCircle, faBars, faSearch, faDollarSign, faCheckCircle, faQuestionCircle, faTag, faBox, faMoneyBillWave, faSpinner, faHandHoldingUsd, faExclamationCircle, faPhone, faHome, faCreditCard, faCog, faEnvelope, faLink, faMedal, faAsterisk, faShippingFast, faShieldAlt, faStoreAlt } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faFacebook, faTwitter, faInstagram, faGoogle, faPaypal, faCcVisa, faCcMastercard, faCcAmex, faFacebookF, faCanadianMapleLeaf, faYoutube } from '@fortawesome/free-brands-svg-icons';

// Firebase Setup
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireStorageModule } from '@angular/fire/storage';

// Reactive Forms
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Mask Module
import { NgxMaskModule } from 'ngx-mask';
// export let options: Partial<IConfig> | (() => Partial<IConfig>);

import { NgxPayPalModule } from 'ngx-paypal';
import { SafeHtmlPipe } from './pipes/safeHtml.pipes';

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
    ResetPasswordComponent,
    AuthComponent,
    PhoneVerificationComponent,
    SoldComponent,
    PageNotFoundComponent,
    ModalComponent,
    PrivacyComponent,
    TermsComponent,
    SpecialDropHomeComponent,
    DropComponent,
    BlogHomeComponent,
    BlogPostComponent,
    SnkrsComponent,
    SafeHtmlPipe,
    Dec182019Component,
    HowItWorksComponent,
    ReferralComponent,
    FaqHomeComponent,
    FaqPostComponent,
    FaqCategoryComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    FontAwesomeModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireStorageModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMaskModule.forRoot(),
    HttpClientModule,
    NgxPayPalModule
  ],
  providers: [
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    // add icon to library to be used in components
    // tslint:disable-next-line: max-line-length
    library.add(faBell, faBars, faShoppingCart, faUserCircle, faFacebook, faInstagram, faTwitter, faTimes, faGoogle, faSearch, faPaypal, faDollarSign, faCheckCircle, faQuestionCircle, faTag, faBox, faMoneyBillWave, faSpinner, faHandHoldingUsd, faExclamationCircle, faPhone, faHome, faCreditCard, faCcVisa, faCcMastercard, faCcAmex, faCog, faClock, faFacebookF, faEnvelope, faLink, faMedal, faAsterisk, faShippingFast, faShieldAlt, faStoreAlt, faCanadianMapleLeaf, faYoutube);
  }
}
