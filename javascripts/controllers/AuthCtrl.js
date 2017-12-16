app.controller("AuthCtrl", function($location, $rootScope, $scope, AuthService){

  $scope.authenticate = () => {
    AuthService.authenticateGoogle().then((result) => {
      $rootScope.navbar = true;
      $rootScope.uid = result.user.uid;
      $scope.$apply(()=>{
      $location.url("/Profile");
      });
    }).catch((error) => {
    console.log("error in auth google", error);
  });
  };

});
