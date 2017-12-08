

app.controller("MeetProfileCtrl", function($location, $rootScope, $scope, MapService){
   $scope.meets = {};

   const loadMeetProfile = ( ) => {
     if (!$rootScope.uid) {
       console.log("umm login");
     } else {
       MapService.getMeetInfoByUid($rootScope.uid).then((results) => {
          $scope.meets = results;
       }).catch((err)=>{
         console.log("error in meet profile controller loadMeetProfile", err);
       });
     }
   };

   loadMeetProfile();

   $scope.viewMeet = (meetId) => {
     $location.path(`/MeetHere/${meetId}`)
   };

   $scope.eraseMeet = (meetid) => {
     MapService.deleteMeet(meetid);
     loadMeetProfile();
   }

   $scope.saveMeet = (meetid) => {
     console.log(meetid);
   }

 });
