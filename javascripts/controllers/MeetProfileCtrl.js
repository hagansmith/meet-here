"use strict";

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

   $scope.editMeet = (meet, meetId) => {
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
     MapService.deleteMeet(meetid);
     loadMeetProfile();
   };

   $scope.saveMeet = (meet) => {
     meet.saved = true;
     let meetId = meet.marker1.meetid;
     MapService.updateMeet(meet, meetId);
     loadMeetProfile();
   };

 });
