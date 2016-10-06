'use strict';

angular.module('personality.controller', [])

.controller('PersonalityController', [
'$scope', '$http', 'personalityService',
function($scope, $http, roastModel) {
  $scope.getData = function() {
    $http.put('/api/watson/' + $scope.twitter)
      .success((data) => {
        $scope.array = data;
        $scope.preference = roastModel.determinePreference(data);
      })
      .error((err) => {
        console.log(err);
      });
  };
}]);
