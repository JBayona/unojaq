'use strict';

/**
 * @ngdoc function
 * @name vestaParkingApp.controller:DonutsCtrl
 * @description
 * # DonutsCtrl
 * Controller of the vestaParkingApp
 */
angular.module('vestaParkingApp')
  .controller('DonutsCtrl',['$scope','Donuts','$rootScope','LoginService','$timeout',function ($scope,Donuts,$rootScope,LoginService,$timeout) {
  	$scope.pageData = {};
  	$scope.pageData.donutsByUser = {};

    var getEvents = function(){
    	var paymentDate = undefined;
    	var paymentDateCounter = 0;
    	if(moment().day(2).isBefore(moment())){
    		paymentDate = moment().day(2).add(7,'day');
    	}else{
    		paymentDate = moment().day(2);
    	}
    	Donuts.getEvents().then(function(response){
    		$scope.pageData.events = response.results;
        $scope.pageData.donutsByUser = {};
    		angular.forEach($scope.pageData.events,function(donutEvent){
    			if($scope.pageData.donutsByUser[donutEvent.user.objectId]){
    				$scope.pageData.donutsByUser[donutEvent.user.objectId] = $scope.pageData.donutsByUser[donutEvent.user.objectId] +1;
    			}else{
    				$scope.pageData.donutsByUser[donutEvent.user.objectId] = 1;	
    			}
    			donutEvent.paymentDate = paymentDate.toISOString();
    			paymentDateCounter++;
    			if(paymentDateCounter === 2){
    				paymentDate.add(7,'day');
    				paymentDateCounter = 0;
    			}
    		});
    	});
    }

    $scope.addEvent = function(){
    	$scope.addedConfirmation = true;
    	var item = {
    		user:{'__type':'Pointer','className':'_User','objectId':$scope.pageData.newEvent.selectedUser.objectId},
    		reason:$scope.pageData.newEvent.reason,
    		paid:false
    	}
    	Donuts.createEvent(item).then(function(){
    		getEvents();
    		$timeout(function(){
	          $scope.addedConfirmation = false;
	      },2000);
    	});
    	$scope.pageData.newEvent = {};
    };

    $scope.deleteEvent = function(objectId){
    	Donuts.payEvent(objectId).then(function(){
    		getEvents();
    	});
    }
    //init routines
    if($rootScope.session.donut_manager){
      $scope.pageData.newEvent = {};
      LoginService.getUsers().then(function(response){
        $scope.pageData.users = response.results;
      });
    }
    getEvents();

  }]);
