'use strict';

/**
 * @ngdoc function
 * @name vestaParkingApp.controller:ResetCtrl
 * @description
 * # ResetCtrl
 * Controller of the vestaParkingApp
 */
angular.module('login')
  .controller('ResetCtrl', ['$scope','LoginService',function ($scope,LoginService) {
    $scope.credentials = {};
    $scope.reset = function(){
    	$scope.submitted=true;
    	LoginService.reset();
      
    };	
  }]);
