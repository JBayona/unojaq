'use strict';

/**
 * @ngdoc filter
 * @name vestaParkingApp.filter:startFrom
 * @function
 * @description
 * # startFrom
 * Filter in the vestaParkingApp.
 */
angular.module('vestaParkingApp')
  .filter('startFrom', function () {
    return function(input, start) {
    	if(!input){
    		return;
    	}
      start = +start;
      return input.slice(start);
    }
  });
