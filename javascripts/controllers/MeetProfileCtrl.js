

app.controller("MeetProfileCtrl", function($rootScope, $scope, MapService){
   $scope.meets = {};

   const loadMeetProfile = ( ) => {
     if (!$rootScope.uid) {
       console.log("umm login");
     } else {
       MapService.getMeetInfoByUid($rootScope.uid).then((results) => {
          $scope.meets = results;
          console.log(results);
       }).catch((err)=>{
         console.log("error in meet profile controller loadMeetProfile", err);
       });
     }
   };

   loadMeetProfile();

   $scope.editMeet = (meetid) => {
     console.log(meetid);
   }

   $scope.deleteMeet = (meetid) => {
     console.log(meetid);
   }

   $scope.saveMeet = (meetid) => {
     console.log(meetid);
   }
   
 });
