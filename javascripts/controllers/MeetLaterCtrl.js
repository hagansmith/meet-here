

app.controller("MeetLaterCtrl", function($location, $rootScope, $scope, MapService){

  $scope.meetNowDetails = (meet) => {
    if (!$rootScope.uid) {
      meet.uid = "randomUid";
    } else {
      meet.uid = $rootScope.uid;
    }
    meet.saved = true;
    MapService.saveQuery(meet).then((result)=> {
      let meetId = result.data.name;
      $location.path(`/MeetHere/${meetId}`);
    }).catch((error) => {
      console.log("error in controller, meetNowDetails", error);
    })

  };
 });
