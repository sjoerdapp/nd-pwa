// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  /*firebase: {
    apiKey: 'AIzaSyDADaJvBOsSuyZz0ytTKiwh8c1mFYQJKYE',
    authDomain: 'nxtdrop-app.firebaseapp.com',
    databaseURL: 'https://nxtdrop-app.firebaseio.com',
    projectId: 'nxtdrop-app',
    storageBucket: 'nxtdrop-app.appspot.com',
    messagingSenderId: '155742053339',
    appId: '1:155742053339:web:50f644112ac6b92b'
  },*/
  firebase: {
    apiKey: "AIzaSyC-n8cAU2HrJky2Yh8qWytAme9REsyxV48",
    authDomain: "nxtdrop.firebaseapp.com",
    databaseURL: "https://nxtdrop.firebaseio.com",
    projectId: "nxtdrop",
    storageBucket: "nxtdrop.appspot.com",
    messagingSenderId: "509381991959",
    appId: "1:509381991959:web:73110b34aa09248e2a4652"
  },
  algolia: {
    appId: 'UYSPT0956N',
    apiKey: '093ee2e4c80544d65228982af60e459f'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
