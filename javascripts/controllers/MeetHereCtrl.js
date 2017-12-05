"use strict";

app.controller("MeetHereCtrl", function($scope, $window, MAP_CONFIG){

  $window.GoogleMapsLoader.onLoad(function (google) {
    console.log("maps loaded");
      $window.GoogleMapsLoader.KEY = '${MAP_CONFIG}';
      $window.GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];
      var options = {
        zoom: 11,
        center: new google.maps.LatLng(54.5767, -1.2355)
      };
      console.log(options);
      new google.maps.Map(document.getElementById('map'), options);


    // new google.maps.Map(document.getElementById('map'), mapOptions);
  });

});
