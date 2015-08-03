'use strict';

/**
 * @ngdoc function
 * @name vestaParkingApp.controller:TournamentsCtrl
 * @description
 * # TournamentsCtrl
 * Controller of the vestaParkingApp
 */
angular.module('vestaParkingApp')
  .controller('TournamentsCtrl',['$scope','Fifa','LoginService','$filter', function ($scope,Fifa,LoginService,$filter) {
  	$scope.pageData = {};      
    $scope.pageData.leaguesByCountry = {};
    $scope.currentPage = 0;
		$scope.pageSize = 16;
		var orderBy = $filter('orderBy');
		

    var getTournaments = function(){
    	Fifa.getTournaments().then(function(response){      		
    		$scope.pageData.tournaments = response.results;
    		$scope.selectTournament($scope.pageData.tournaments[0]);
    	});
    };

    var getTournamentPlayers = function(tournamentId){
    	$scope.pageData.tournamentPlayers = [];
    	Fifa.getTournamentPlayers(tournamentId).then(function(response){
    		$scope.pageData.tournamentPlayers = response.results;
    		$scope.pageData.teamByPlayer = {};
    		angular.forEach(response.results,function(item){
    			$scope.pageData.teamByPlayer[item.player.objectId] = item.team;	
    		});
    	});
    };

    var getEmptyTableRow = function(){
    	return {
    		points: 0,    		
    		played: 0,
    		win: 0,
    		draw: 0,
    		lost: 0,
    		scored: 0,
    		received: 0
    	};
    };

    var getTable = function(){
    	$scope.pageData.table = {};
    	angular.forEach($scope.pageData.tournamentMatches,function(match){
    		if(match.wildcard || match.playoffs){
    			return;
    		}
    		//add points
    		if(!$scope.pageData.table[match.home.objectId]){
    			$scope.pageData.table[match.home.objectId] = getEmptyTableRow();
    			$scope.pageData.table[match.home.objectId].player = match.home.objectId;
    		}
    		if(!$scope.pageData.table[match.away.objectId]){
    			$scope.pageData.table[match.away.objectId] = getEmptyTableRow();
    			$scope.pageData.table[match.away.objectId].player = match.away.objectId;
    		}
    		if(match.home_score === match.away_score){
    			$scope.pageData.table[match.home.objectId].points += 1;
    			$scope.pageData.table[match.away.objectId].points += 1;
    			$scope.pageData.table[match.home.objectId].draw += 1;
    			$scope.pageData.table[match.away.objectId].draw += 1
    		}else if(match.home_score > match.away_score){
    			$scope.pageData.table[match.home.objectId].points += 3;   
    			$scope.pageData.table[match.home.objectId].win += 1; 
    			$scope.pageData.table[match.away.objectId].lost += 1;    	
    		}else if(match.away_score > match.home_score){
    			$scope.pageData.table[match.away.objectId].points += 3; 
    			$scope.pageData.table[match.home.objectId].lost += 1; 
    			$scope.pageData.table[match.away.objectId].win += 1;     	
    		}
    		$scope.pageData.table[match.home.objectId].scored += match.home_score;
    		$scope.pageData.table[match.away.objectId].received += match.home_score;
    		$scope.pageData.table[match.away.objectId].scored += match.away_score;
    		$scope.pageData.table[match.home.objectId].received += match.away_score;
    		$scope.pageData.table[match.home.objectId].played += 1;
    		$scope.pageData.table[match.away.objectId].played += 1;    		
    	});
			$scope.pageData.tableArray = [];
			angular.forEach($scope.pageData.table,function(tableRow){
				tableRow.diff = tableRow.scored - tableRow.received;
				$scope.pageData.tableArray.push(tableRow);
			});
			$scope.order(['-points','-diff'],false);
    };

    var getTournamentMatches = function(tournamentId){    	
    	Fifa.getTournamentMatches(tournamentId).then(function(response){
    		$scope.pageData.tournamentMatches = response.results;
    		getTable();
    	});
    };

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

    $scope.selectTournament = function(tournament){    	
    	$scope.pageData.selectedTournament = tournament;    	
    	getTournamentPlayers($scope.pageData.selectedTournament.objectId);
    	getTournamentMatches($scope.pageData.selectedTournament.objectId);
    };
    
    $scope.selectCountry = function(country){
    	$scope.pageData.selectedCountry = country;
    	$scope.pageData.selectedLeague = $scope.pageData.leaguesByCountry[country][0];
    	$scope.pageData.selectTeam = null;
    	getTeams($scope.pageData.selectedLeague.objectId);
    }

    $scope.selectLeague = function(league){
    	$scope.pageData.selectedLeague = league;
    	$scope.pageData.selectTeam = null;
    	getTeams(league.objectId);
    }

    $scope.addPlayer = function(){
    	Fifa.createUserTournament($scope.pageData.selectedTournament.objectId,$scope.pageData.newPlayer.selectedUser.objectId,$scope.pageData.selectedTeam.objectId);
    	$scope.pageData.newPlayer = {};
    	$scope.pageData.selectedCountry = null;
    	$scope.pageData.selectedLeague = null;
    	$scope.pageData.selectedTeam = null;
    	$scope.pageData.teams = {};
    	getTournamentPlayers($scope.pageData.selectedTournament.objectId);

    };

    $scope.addMatch = function(){
    	Fifa.createTournamentMatch(
    		$scope.pageData.selectedTournament.objectId,
    		$scope.pageData.newMatch.home.player.objectId,
    		$scope.pageData.newMatch.away.player.objectId,
    		$scope.pageData.newMatch.homeScore,
    		$scope.pageData.newMatch.awayScore,
    		$scope.pageData.newMatch.wildcard,
    		$scope.pageData.newMatch.playoffs,
    		$scope.pageData.newMatch.homePenalties,
    		$scope.pageData.newMatch.awayPenalties,
    		$scope.pageData.newMatch.round
    		);
    	//$scope.pageData.newMatch = {};
    	getTournamentMatches($scope.pageData.selectedTournament.objectId);
    };

    $scope.updateScore = function(objectId,field,value){
    	Fifa.updateMatchScore(objectId,field,value);
    };

    $scope.numberOfPages=function(){
    	if(!$scope.pageData.tournamentMatches){
    		return;
    	}
      return Math.ceil($scope.pageData.tournamentMatches.length/$scope.pageSize);                
    };

    $scope.matchFilter = function(item){
    	var result = [];    	
    	angular.forEach($scope.pageData.tournamentMatches,function(match){
    		if(match.home.objectId === item.objectId || match.away.objectId === item.objectId || match.home.objectId === item.objectId || match.away.objectId === item.objectId){
    			result.push(match);
    		}
    	});
    	$scope.pageData.tournamentMatches = result;
    	$scope.currentPage = 0;
    };

    $scope.clearFilters = function(){
    	getTournamentMatches($scope.pageData.selectedTournament.objectId);
    };

    $scope.getRoundLabel = function(round){
    	if(!round){
    		return;
    	}
    	if(round === 4){
    		return 'Quarter final';
    	}else if(round === 2){
    		return 'Semifinal';
    	} else if(round === 1){
    		return 'Final';
    	}else{
    		return round;
    	}
    };

    $scope.order = function(predicate, reverse) {
	    $scope.pageData.tableArray = orderBy($scope.pageData.tableArray, predicate, reverse);
	  };

    //init routines
    getTournaments();
    getLeagues();
    getUsers();
  }]);
