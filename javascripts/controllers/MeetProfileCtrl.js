

app.controller("MeetProfileCtrl", function($location, $rootScope, $scope, AuthService, MapService, MeetService, MarkerService, LocationService){
   $scope.meets = {};
   let userUid = $rootScope.uid;

   const authCheck = () => {
     let uid = AuthService.getCurrentUid();
     if (!uid){
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
       MarkerService.deleteMarker(results.marker1.id);
       MarkerService.deleteMarker(results.marker2.id);
       LocationService.deleteLocation(results.location.id);
       MeetService.deleteMeet(meetid);
     });
     loadMeetProfile();
   };

   $scope.saveMeet = (meet) => {
     meet.saved = true;
     let meetId = meet.marker1.meetid;
     MeetService.updateMeet(meet, meetId);
     loadMeetProfile();
   };

 });
