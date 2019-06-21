/** Modules */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

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

/** Material Design */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';

/** Font Awesome */
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

/** Icons imports */
import { faBell, faTimes, faShoppingCart, faUserCircle, faBars, faSearch } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram, faGoogle } from '@fortawesome/free-brands-svg-icons';

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
    CheckoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    // add icon to library to be used in components
    library.add(faBell, faBars, faShoppingCart, faUserCircle, faFacebook, faInstagram, faTwitter, faTimes, faGoogle, faSearch);
  }
}