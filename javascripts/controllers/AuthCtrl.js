"use strict";

app.controller("AuthCtrl", function($location, $rootScope, $scope, AuthService){
  $scope.authenticate = () => {
    AuthService.authenticateGoogle().then((result) => {
      $rootScope.navbar = true;
      $scope.$apply(()=>{
      $location.url("/meetProfile");
    });
    }).catch((error) => {
      console.log("error in auth google", error);
    });
  };
});
