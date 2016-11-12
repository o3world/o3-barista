'use strict';

angular.module('personality.controller', [])

.controller('PersonalityController', [
'$scope', '$http', 'personalityService',
($scope, $http, personalityService) => {
  $scope.roastOptions = [
    'light',
    'medium',
    'dark'
  ];

  $scope.getData = () => {
    $http.put('/api/watson/' + $scope.twitter)
      .success(data => {
        $scope.array = data;

        $scope.preference = personalityService.determinePreference(data);
        $scope.curiosity = personalityService.getCuriosityPercentage(data);
        $scope.liberty = personalityService.getLibertyPercentage(data);
      })
      .error(err => {
        console.log(err);
      });
  };

  $scope.submitFeedback = actualPreference => {
    $http.post('/api/feedback', {
      twitter_handle: $scope.twitter,
      expected_preference: $scope.preference,
      actual_preference: actualPreference
    });
  };
}]);
