

app.controller("MeetHereCtrl", function($scope){
$scope.controller = "MeetHereCtrl";
  console.log("in lofasd");

  GoogleMapsLoader.load(function(google) {
      new google.maps.Map(document.getElementById('map'), {
            center: {lat: -34.397, lng: 150.644},
            zoom: 8
      });
    });

    GoogleMapsLoader.onLoad(function() {
      console.log('I just loaded google maps api');
    });

});
