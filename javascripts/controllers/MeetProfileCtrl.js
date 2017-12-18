app.controller("MeetProfileCtrl", function($location, $rootScope, $scope, AuthService, MapService, MeetService, MarkerService, LocationService){
   $scope.meets = {};
   let userUid = $rootScope.uid;

   const authCheck = () => {
     let userUid = AuthService.getCurrentUid();
     if (!userUid){
       return;
    } else {
      loadMeetProfile();
    }
  };

   const loadMeetProfile = ( ) => {
       MeetService.getMeetInfoByUid($rootScope.uid).then((results) => {
          $scope.meets = results;
       }).catch((err)=>{
         console.log("error in meet profile controller loadMeetProfile", err);
       });
   };

  authCheck();

   $scope.editMeet = (meet) => {
    let meetId =  meet.marker1.meetid;
     if (!meet.where){
       $location.path(`/MeetNow/${meetId}`);
     }else{
       $location.path(`/MeetLater/${meetId}`);
     }
   };

   $scope.viewMeet = (meetId) => {
     $location.path(`/MeetHere/${meetId}`);
   };

   $scope.eraseMeet = (meetid) => {
     MeetService.getAllMapDataForCurrentMeet(meetid).then((results)=>{
       MeetService.deleteMeet(meetid);
        MarkerService.deleteMarker(results.marker1.id).then(()=>{
          MarkerService.deleteMarker(results.marker2.id).then(()=>{
            if (results.location){
              LocationService.deleteLocation(results.location.id).then(()=>{
                loadMeetProfile();
              });
            } else {
              loadMeetProfile();
            }
         });
       });
     })
   };

   $scope.saveMeet = (meet) => {
     meet.saved = true;
     let meetId = meet.marker1.meetid;
     MeetService.updateMeet(meet, meetId).then(()=>{
     loadMeetProfile();
   });
   };

 });
