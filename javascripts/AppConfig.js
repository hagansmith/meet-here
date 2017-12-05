"use strict";

let isAuth = (AuthService) => new Promise ((resolve, reject) => {
  if(AuthService.isAuthenticated()){
    resolve();
  } else {
    reject();
  }
});

app.run(function($location, $rootScope, FIREBASE_CONFIG, AuthService){
  firebase.initializeApp(FIREBASE_CONFIG);

  //watch method that fires on change of a route.  3 inputs.
  //event is a change event
  //currRoute is information about your current route
  //prevRoute is information about the route you came from
  $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute) {
    // checks to see if there is a current user
      let logged = AuthService.isAuthenticated();
     	let appTo;

    // to keep error from being thrown on page refresh
    if (currRoute.originalPath) {
      // check if the user is going to the auth page = currRoute.originalPath
      // if user is on auth page then appTo is true
      // if it finds something other than /auth it return a -1 and -1!==-1 so resolves to false
      appTo = currRoute.originalPath.indexOf('/meetProfile') !== -1;
    }

    //if not on /auth page AND not logged in redirect to /auth
    if (!appTo && !logged) {
      //if not on /auth page AND not logged in redirect to /auth
      event.preventDefault();
       $rootScope.navbar = false;
       $location.path('/newMeet');
    } else if (appTo && !logged){
     //if on /auth page AND not logged in, no redirect only authentiate in navbar
       $rootScope.navbar = false;
    } else if (appTo && logged){
     //if on /auth page AND logged in, redirect to search page
         $rootScope.navbar = true;
         $location.path('/newMeet');
     } else if (!appTo && logged){
             //if not on /auth page AND logged in see other navbar
             $rootScope.navbar = true;
    }
  });
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
    .when("/MeetHere", {
      templateUrl: 'partials/meetHere.html',
      controller: 'MeetHereCtrl'

    } )
    .when("/Profile", {
      templateUrl: 'partials/meetProfile.html',
      controller: 'MeetProfileCtrl',
      resolve: { isAuth }
    } )
    .otherwise('/');
});
