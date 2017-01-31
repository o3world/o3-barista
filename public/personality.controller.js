'use strict';

angular.module('personality.controller', [])

.controller('PersonalityController', [
'$scope', '$http', 'R', 'personalityService',
($scope, $http, R, personalityService) => {
  $scope.roastOptions = [
    'light',
    'medium',
    'dark'
  ];

  const isParent = id => id.indexOf('_parent') !== -1;
  const rejectParentTraits = R.reject(trait => isParent(trait.id));

  $scope.getData = () => {
    const twitterHandle = normalizeHandle($scope.twitter);

    $http
      .put('/api/watson/' + twitterHandle)
      .then(personalityResponse => {
        const profile = personalityResponse.data;

        const profileWithoutParents = rejectParentTraits(profile);
        $scope.personalityData = profileWithoutParents;

        $scope.preference = personalityService.determinePreference(profile);
        $scope.curiosity = personalityService.getCuriosityPercentage(profile);
        $scope.liberty = personalityService.getLibertyPercentage(profile);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => resetFeedback());
  };

  $scope.submitFeedback = actualPreference => {
    const twitterHandle = normalizeHandle($scope.twitter);

    $http
      .post('/api/feedback', {
        twitter_handle: twitterHandle,
        expected_preference: $scope.preference,
        actual_preference: actualPreference
      })
      .then(() => $scope.feedbackSubmitted = true);
  };

  $scope.showRoastFeedbackOptions = () => {
    $scope.roastFeedbackVisible = true;
  };

  function resetFeedback() {
    $scope.feedbackSubmitted = false;
    $scope.roastFeedbackVisible = false;
  }

  function normalizeHandle(handle) {
    return handle.replace(/^@/, '').toLowerCase().trim();
  }
}]);
