app.run(function($location, $rootScope, FIREBASE_CONFIG, MAP_CONFIG, AuthService){

  firebase.initializeApp(FIREBASE_CONFIG);
  GoogleMapsLoader.KEY = MAP_CONFIG;
  GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];
  GoogleMapsLoader.REGION = 'US';
  GoogleMapsLoader.load(function(google) { });

  //watch method that fires on change of a route.  3 inputs.
  //event is a change event
  //currRoute is information about your current route
  //prevRoute is information about the route you came from
  $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute) {
    // checks to see if there is a cookie with a uid for this app in local storage
      let logged = AuthService.isAuthenticated();
      if (!logged) {
        $rootScope.navbar = false;
      } else if (logged){
        $rootScope.navbar = true;
    }
});

 });

app.config(function( $locationProvider, $routeProvider ){

  $routeProvider
    .when("/NewMeet", {
      templateUrl: 'partials/newMeet.html',

    } )
    .when("/MeetNow", {
      templateUrl: 'partials/meetNow.html',
      controller: 'MeetNowCtrl'

    } )
    .when("/MeetNow/:id", {
      templateUrl: 'partials/meetNow.html',
      controller: 'MeetNowCtrl'

    } )
    .when("/MeetLater", {
      templateUrl: 'partials/meetLater.html',
      controller: 'MeetLaterCtrl'

    } )
    .when("/MeetLater/:id", {
      templateUrl: 'partials/meetLater.html',
      controller: 'MeetLaterCtrl'

    } )
    .when("/MeetHere/:id", {
      templateUrl: 'partials/meetHere.html',
      controller: 'MeetHereCtrl'

    } )
    .when("/Profile", {
      templateUrl: 'partials/meetProfile.html',
      controller: 'MeetProfileCtrl'

    } )

    .otherwise('NewMeet');
});
