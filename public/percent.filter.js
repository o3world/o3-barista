'use strict';

angular.module('percent.filter', [])

.filter('decimalToPercent',
function() {
  return (decimal) => {
    var percent = decimal * 100;
    return percent + '%';
  };
});
