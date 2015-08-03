'use strict';

/**
 * @ngdoc function
 * @name vestaParkingApp.controller:FifaCtrl
 * @description
 * # FifaCtrl
 * Controller of the vestaParkingApp
 */
angular.module('vestaParkingApp')
  .controller('FifaCtrl',['$scope','Fifa','LoginService', function ($scope,Fifa,LoginService) {
  	/*var teams = JSON.parse('[{"name":"http://futhead.cursecdn.com/static/img/15/clubs/101100.png, Atl. Nacional"},{"name":"http://futhead.cursecdn.com/static/img/15/clubs/101104.png, Ind. Santa Fe"},{"name":"http://futhead.cursecdn.com/static/img/15/clubs/101106.png, Once Caldas"},{"name":"http://futhead.cursecdn.com/static/img/15/clubs/112527.png, Patriotas FC"},{"name":"http://futhead.cursecdn.com/static/img/15/clubs/101101.png, Junior FC"},{"name":"http://futhead.cursecdn.com/static/img/15/clubs/112578.png, Ãguilas Doradas"},{"name":"http://futhead.cursecdn.com/static/img/15/clubs/101105.png, Millonarios FC"},{"name":"http://futhead.cursecdn.com/static/img/15/clubs/112830.png, UniautÃ³noma FC"},{"name":"http://futhead.cursecdn.com/static/img/15/clubs/111722.png, Deportes Tolima"},{"name":"http://futhead.cursecdn.com/static/img/15/clubs/112579.png, Al. Petrolera"},{"name":"http://futhead.cursecdn.com/static/img/15/clubs/111723.png, Deportivo Pasto"},{"name":"http://futhead.cursecdn.com/static/img/15/clubs/101103.png, Indep. MedellÃ­n"},{"name":"http://futhead.cursecdn.com/static/img/15/clubs/101102.png, Deportivo Cali"},{"name":"http://futhead.cursecdn.com/static/img/15/clubs/112523.png, La Equidad"},{"name":"http://futhead.cursecdn.com/static/img/15/clubs/112528.png, AtlÃ©tico Huila"},{"name":"http://futhead.cursecdn.com/static/img/15/clubs/112834.png, Fortaleza FC"},{"name":"http://futhead.cursecdn.com/static/img/15/clubs/112526.png, Envigado"},{"name":"http://futhead.cursecdn.com/static/img/15/clubs/112019.png, BoyacÃ¡ ChicÃ³"},{"name":"http://futhead.cursecdn.com/static/img/15/clubs/111721.png, CÃºcuta Depor."},{"name":"http://futhead.cursecdn.com/static/img/15/clubs/112525.png, Depor. QuindÃ­o"}]');
    var myTeams = [];
    angular.forEach(teams,function(team){
    	var item = {};
    	item.rating = team.rating;
    	var nameAndImage = team.name.split(',');
    	item.image = nameAndImage[0];
    	item.name = nameAndImage[1];    	
    	item.league = {'__type':'Pointer','className':'fifa_leagues','objectId':'UWXJdMRFr6'};
    	//Fifa.createTeam(item);
    	//Fifa.createLeague(item);
    	//myTeams.push(item);
    });*/

    $scope.pageData = {};
    $scope.pageData.leaguesByCountry = {};

    var getLeagues = function(){
    	Fifa.getLeagues().then(function(response){	    	
	    	$scope.pageData.leagues = response.results;
	    	angular.forEach($scope.pageData.leagues,function(league){
	    		if(!$scope.pageData.leaguesByCountry[league.country]){
	    			$scope.pageData.leaguesByCountry[league.country] = [];
	    		}
	    		$scope.pageData.leaguesByCountry[league.country].push(league);

	    	});
	    	$scope.pageData.selectedCountry = 'Mexico';
	    	$scope.pageData.selectedLeague = $scope.pageData.leaguesByCountry['Mexico'][0];
	    	getTeams($scope.pageData.selectedLeague.objectId);
	    });	
    }
    

    var getUsers = function(){
    	LoginService.getUsers().then(function(response){
        $scope.pageData.users = response.results;
      });
    };

    var getTeams = function(leagueId){
    	Fifa.getTeams(leagueId).then(function(response){    	
	    	$scope.pageData.teams = response.results;
	    });
    };
    
    $scope.selectCountry = function(country){
    	$scope.pageData.selectedCountry = country;
    	$scope.pageData.selectedLeague = $scope.pageData.leaguesByCountry[country][0];
    	getTeams($scope.pageData.selectedLeague.objectId);
    }

    $scope.selectLeague = function(league){
    	$scope.pageData.selectedLeague = league;
    	getTeams(league.objectId);
    }


    //init routines
    getLeagues();
    
  }]);
