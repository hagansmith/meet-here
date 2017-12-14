app.run(function($location, $rootScope, FIREBASE_CONFIG, MAP_CONFIG){

  firebase.initializeApp(FIREBASE_CONFIG);
  GoogleMapsLoader.KEY = MAP_CONFIG;
  GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];
  GoogleMapsLoader.REGION = 'US';
  GoogleMapsLoader.load(function(google) { });

 });

app.config(function( $locationProvider, $routeProvider ){

  $routeProvider
    .when("/NewMeet", {
      templateUrl: 'partials/newMeet.html',
      controller: 'NewMeetCtrl'

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
