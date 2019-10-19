import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { HomeComponent } from './components/home/home.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LoginComponent } from './components/login/login.component';
import { ProductComponent } from './components/product/product.component';
//import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SettingsProfileComponent } from './components/settings-profile/settings-profile.component';
import { SettingsPasswordComponent } from './components/settings-password/settings-password.component';
/*import { SettingsBuyingComponent } from './components/settings-buying/settings-buying.component';
import { SettingsSellingComponent } from './components/settings-selling/settings-selling.component';
import { SettingsShippingComponent } from './components/settings-shipping/settings-shipping.component';
import { SettingsPayoutComponent } from './components/settings-payout/settings-payout.component';*/
import { TransactionReviewComponent } from './components/transaction-review/transaction-review.component';
import { SellComponent } from './components/sell/sell.component';
import { SearchComponent } from './components/search/search.component';
//import { DashboardComponent } from './components/dashboard/dashboard.component';
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
import { PrivacyComponent } from './components/privacy/privacy.component';
import { TermsComponent } from './components/terms/terms.component';
import { DropComponent } from './components/special-drop/drop/drop.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent},
  { path: 'signup', component: SignUpComponent },
  { path: 'login', component: LoginComponent },
  { path: 'product/:id', component: ProductComponent},
  // { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'settings/profile', component: SettingsProfileComponent },
  { path: 'settings/password', component: SettingsPasswordComponent },
  /*{ path: 'settings/buying', component: SettingsBuyingComponent },
  { path: 'settings/selling', component: SettingsSellingComponent },
  { path: 'settings/shipping', component: SettingsShippingComponent },*/
  //{ path: 'settings/payout', component: SettingsPayoutComponent },
  { path: 'transaction', component: TransactionReviewComponent },
  { path: 'sell', component: SellComponent },
  { path: 'search', component: SearchComponent },
  // { path: 'dashboard', component: DashboardComponent },
  { path: 'edit-listing/:id', component: EditListingComponent },
  { path: 'request', component: RequestComponent },
  { path: 'forgot-password', component: ForgetPasswordComponent },
  { path: 'activate-account', component: ActivateAccountComponent },
  { path: 'support', component: ContactUsComponent },
  { path: 'bye', component: LoggedOutComponent },
  { path: 'additional-information', component: SignupInformationComponent },
  { path: 'make-an-offer', component: MakeAnOfferComponent },
  { path: 'edit-offer/:id', component: EditOfferComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'phone-verification', component: PhoneVerificationComponent },
  { path: 'sold', component: SoldComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'drop/:id', component: DropComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
