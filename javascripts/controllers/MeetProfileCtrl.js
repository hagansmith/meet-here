

app.controller("MeetProfileCtrl", function($rootScope, $scope, MapService){
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
 });
