'use strict';

angular.module('personality.controller', [])

.controller('PersonalityController', [
'$scope', '$http', 'personalityService',
function($scope, $http, personalityService) {
  $scope.getData = function() {
    $http.put('/api/watson/' + $scope.twitter)
      .success((data) => {
        $scope.array = data;

        $scope.preference = personalityService.determinePreference(data);
        $scope.curiosity = personalityService.getCuriosityPercentage(data);
        $scope.liberty = personalityService.getLibertyPercentage(data);
      })
      .error((err) => {
        console.log(err);
      });
  };
}]);
