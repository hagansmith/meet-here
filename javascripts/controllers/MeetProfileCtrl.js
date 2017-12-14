

app.controller("MeetProfileCtrl", function($location, $rootScope, $scope, MapService, MeetService){
   $scope.meets = {};
   let userUid = $rootScope.uid;
   const loadMeetProfile = ( ) => {
     if (userUid) {
       MeetService.getMeetInfoByUid($rootScope.uid).then((results) => {
          $scope.meets = results;
       }).catch((err)=>{
         console.log("error in meet profile controller loadMeetProfile", err);
       });
     }
   };

   loadMeetProfile();

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
     MeetService.deleteMeet(meetid);
     loadMeetProfile();
   };

   $scope.saveMeet = (meet) => {
     meet.saved = true;
     let meetId = meet.marker1.meetid;
     MeetService.updateMeet(meet, meetId);
     loadMeetProfile();
   };

 });
