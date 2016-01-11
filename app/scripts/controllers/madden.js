'use strict';

/**
 * @ngdoc function
 * @name vestaParkingApp.controller:MaddenCtrl
 * @description
 * # MaddenCtrl
 * Controller of the vestaParkingApp
 */
angular.module('vestaParkingApp')
  .controller('MaddenCtrl', ["$scope", "madden" , "LoginService", function ($scope, madden, LoginService) {
   
  	$scope.pageData = {};
    $scope.pageData.leaguesByCountry = {};

    var getLeagues = function(){
    	madden.getLeagues().then(function(response){    	
	    	$scope.pageData.leagues = response.results; //This variable store the league and the league info
	    	angular.forEach($scope.pageData.leagues,function(league){ //For each item of the results the function will be executed, in this case the league country
	    		if(!$scope.pageData.leaguesByCountry[league.country]){ //Check if the country already exists.
	    			$scope.pageData.leaguesByCountry[league.country] = [];
	    		}
	    		$scope.pageData.leaguesByCountry[league.country].push(league); //We create JSON objects with the league information

	    	});
	    	$scope.pageData.selectedCountry = 'USA';
	    	$scope.pageData.selectedLeague = $scope.pageData.leaguesByCountry['USA'][0];
	    	getTeams($scope.pageData.selectedLeague.objectId);
	    });	
    }

    var getTeams = function(leagueId){
    	madden.getTeams(leagueId).then(function(response){    	
	    	$scope.pageData.teams = response.results;
	    });
    };

    $scope.selectCountry = function(country){
    	$scope.pageData.selectedCountry = country;
    	$scope.pageData.selectedLeague = $scope.pageData.leaguesByCountry[country][0];
    	getTeams($scope.pageData.selectedLeague.objectId);
    }


    //init routines
    getLeagues();

  }]);
