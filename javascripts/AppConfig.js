"use strict";

app.config(function( $locationProvider, $routeProvider ){

  $routeProvider
    .when("/", {
      templateUrl: 'partials/newMeet.html',
      controller: 'NewMeetCtrl',

    } )
    .when("/MeetNow", {
      templateUrl: 'partials/meetNow.html',
      controller: 'MeetNowCtrl',

    } )
    .when("/MeetLater", {
      templateUrl: 'partials/meetLater.html',
      controller: 'MeetLaterCtrl',

    } )
    .when("/MeetHere", {
      templateUrl: 'partials/meetHere.html',
      controller: 'MeetHereCtrl',

    } )
    .when("/Profile", {
      templateUrl: 'partials/meetProfile.html',
      controller: 'MeetProfileCtrl',

    } )
    .otherwise('/');
});
