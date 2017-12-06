

// let isAuth = (AuthService) => new Promise ((resolve, reject) => {
//   if(AuthService.isAuthenticated()){
//     resolve();
//   } else {
//     reject();
//   }
// });

app.run(function($location, $rootScope, FIREBASE_CONFIG, MAP_CONFIG, AuthService){
  firebase.initializeApp(FIREBASE_CONFIG);
  GoogleMapsLoader.KEY = MAP_CONFIG;
  GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];
  GoogleMapsLoader.load(function(google) { });
  //watch method that fires on change of a route.  3 inputs.
  //event is a change event
  //currRoute is information about your current route
  //prevRoute is information about the route you came from
//   $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute) {
//     // checks to see if there is a current user
//     var logged = AuthService.isAuthenticated();
//
//     var appTo;
//
//     // to keep error from being thrown on page refresh
//     if (currRoute.originalPath) {
//       // check if the user is going to the auth page = currRoute.originalPath
//       // if user is on auth page then appTo is true
//       // if it finds something other than /auth it return a -1 and -1!==-1 so resolves to false
//       appTo = currRoute.originalPath.indexOf('/meetProfile') !== -1;
//     }
//
//     //if not on /auth page AND not logged in redirect to /auth
//     if (!appTo && !logged) {
//       event.preventDefault();
//       $location.path('/meetProfile');
//     }
//   });
 });

app.config(function( $locationProvider, $routeProvider ){

  $routeProvider
    .when("/", {
      templateUrl: 'partials/newMeet.html',
      controller: 'NewMeetCtrl'

    } )
    .when("/MeetNow", {
      templateUrl: 'partials/meetNow.html',
      controller: 'MeetNowCtrl'

    } )
    .when("/MeetLater", {
      templateUrl: 'partials/meetLater.html',
      controller: 'MeetLaterCtrl'

    } )
    .when("/MeetHere/:id", {
      templateUrl: 'partials/meetHere.html',
      controller: 'MeetHereCtrl'

    } )
    .when("/Profile", {
      templateUrl: 'partials/meetProfile.html',
      controller: 'MeetProfileCtrl',
      // resolve: { isAuth }
    } )
    .otherwise('/');
});
