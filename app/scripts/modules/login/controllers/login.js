'use strict';

/**
 * @ngdoc function
 * @name login.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the login module
 */
angular.module('login')
  .controller('LoginCtrl',['$scope','LoginService','$location','$rootScope','Session','Parking',function ($scope,LoginService,$location,$rootScope,Session,Parking) {
    
    $scope.credentials = {};
    $scope.login = function(){
    	$scope.submitted=true;
    	LoginService.login($scope.credentials.user,$scope.credentials.password).then(function(response){        
        Session.setSession(response);        
        Parking.getParkingInfo($rootScope.session.objectId).then(function(response){          
          angular.forEach(response.results[0],function(value,key){
            if(key === 'objectId'){
              Session.setAttribute('parkingId',value);
            }else{
              Session.setAttribute(key,value);  
            }            
          });
          console.log($rootScope.session);
          Session.saveSession();
          $location.path('/main');
        });        
    	},function(error){
    		$scope.loginError=true;
    		console.log(error);
    	});
      
    };	

  }]);
