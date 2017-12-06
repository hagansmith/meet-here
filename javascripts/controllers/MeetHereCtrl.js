

app.controller("MeetHereCtrl", function($http, $q, FIREBASE_CONFIG, MapService){
 $scope.mapData = {};

 const getSingleMeet = () => {
   MapService.getCurrentMeet($routeParams.id).then((results)=>{
     $scope.mapData=results.data;
 }).catch((error)=>{
   console.log("error in getSingleMeet", error);
 });
};

getSingleMeet();

console.log(scope.mapData)
  // GoogleMapsLoader.load(function(google) {
  //
  //
  //
  //
  //     new google.maps.Map(document.getElementById('map'), {
  //           center: {lat: 40.714, lng: -74.006},
  //           zoom: 8
  //     });
  //   });
  //
  //   GoogleMapsLoader.onLoad(function() {
  //     console.log('I just loaded google maps api');
  //   });

});
