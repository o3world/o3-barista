'use strict';

angular.module("app", [])

.controller('name', [
'$scope', '$http',
function($scope, $http) {
  $scope.getData = function() {
    $http.put('/api/watson/' + $scope.twitter)
      .success((data) => {
        $scope.array = data;
      })
      .error((err) => {
        console.log(err);
      });
  };
}]);
