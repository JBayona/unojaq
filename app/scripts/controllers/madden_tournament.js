'use strict';

/**
 * @ngdoc function
 * @name vestaParkingApp.controller:MaddenTournamentCtrl
 * @description
 * # MaddenTournamentCtrl
 * Controller of the vestaParkingApp
 */
angular.module('vestaParkingApp')
  .controller('MaddenTournamentCtrl', ['$scope', 'madden', 'LoginService', '$filter', function ($scope, madden, LoginService, $filter) {
   	$scope.pageData = {};    
    $scope.pageData.newMatch = {};  
    $scope.pageData.leaguesByCountry = {};
    $scope.currentPage = 0;
		$scope.pageSize = 16;
		var orderBy = $filter('orderBy');

	var getTournaments = function(){
    	madden.getTournaments().then(function(response){      		
    		$scope.pageData.tournaments = response.results;
    		$scope.selectTournament($scope.pageData.tournaments[0]);
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
    		received: 0,
    		divW: 0, //Div win
    		divL: 0, //Div loose
    	};
    };

     var getTournamentPlayers = function(tournamentId){
    	$scope.pageData.tournamentPlayers = [];
    	madden.getTournamentPlayers(tournamentId).then(function(response){
		$scope.pageData.tournamentPlayers = response.results;
		$scope.pageData.teamByPlayer = {};
        $scope.pageData.tournamentGroups = {};
    		angular.forEach(response.results,function(item){
    			$scope.pageData.teamByPlayer[item.player.objectId] = item.team;	
          		$scope.pageData.tournamentGroups[item.group] = item.group;
    		});
        getTournamentMatches(tournamentId);
    	});
    };

    var getTournamentMatches = function(tournamentId){    	
    	madden.getTournamentMatches(tournamentId).then(function(response){
	    	$scope.pageData.regularMatches = [];
	    	angular.forEach(response.results,function(match){
	    			if(!match.wildcard && !match.playoffs){
	    				$scope.pageData.regularMatches.push(match);
	    			}
	    	});
	    	$scope.pageData.tournamentMatches = response.results; //Here we have the tournament matches
	        $scope.pageData.tournamentMatchesBk = response.results;
	    	getTable();
    	});
    };

    var getLeagues = function(){
    	madden.getLeagues().then(function(response){	    	
	    	$scope.pageData.leagues = response.results;
	    	angular.forEach($scope.pageData.leagues,function(league){
	    		if(!$scope.pageData.leaguesByCountry[league.country]){
	    			$scope.pageData.leaguesByCountry[league.country] = [];
	    		}
	    		$scope.pageData.leaguesByCountry[league.country].push(league);

	    	});
	    	$scope.pageData.selectedCountry = 'USA';
	    	$scope.pageData.selectedLeague = $scope.pageData.leaguesByCountry['USA'][0];
	    	getTeams($scope.pageData.selectedLeague.objectId);
	    });	
    }

    var getUsers = function(){
    	LoginService.getUsers().then(function(response){
        $scope.pageData.users = response.results;
      });
    };

    var getTeams = function(leagueId){
    	madden.getTeams(leagueId).then(function(response){    	
	    	$scope.pageData.teams = response.results;
	    });
    };

    var getPlayedGames = function(){
      if(!$scope.pageData.newMatch.home || !$scope.pageData.newMatch.away){
        return;
      }
      $scope.pageData.faceToFaceMatches = [];
      $scope.pageData.faceToFaceTable = []; //The bellow function is in order to get the face to face statics
      madden.getPlayerMatches($scope.pageData.newMatch.home.player.objectId,$scope.pageData.newMatch.away.player.objectId).then(function(response){
        angular.forEach(response.results,function(match){
          $scope.pageData.faceToFaceMatches.push(match);
        });
        getTable($scope.pageData.faceToFaceMatches,$scope.pageData.faceToFaceTable,true);
      });
      var playedGames = $scope.matchFilter($scope.pageData.newMatch.home.player,$scope.pageData.tournamentMatchesBk);
      $scope.pageData.newMatch.playedGames = $scope.matchFilter($scope.pageData.newMatch.away.player,playedGames);
    };

     $scope.selectTournament = function(tournament){    
      $scope.pageData.tableArray = [];	
      $scope.pageData.selectedTournament = tournament;  
      $scope.pageData.faceToFaceMatches = [];
      $scope.pageData.faceToFaceTable = [];
      $scope.pageData.newMatch = {};  	
      $scope.currentPage = 0;
      getTournamentPlayers($scope.pageData.selectedTournament.objectId);
    };

    $scope.selectCountry = function(country){
    	$scope.pageData.selectedCountry = country;
    	$scope.pageData.selectedLeague = $scope.pageData.leaguesByCountry[country][0];
    	$scope.pageData.selectTeam = null;
    	getTeams($scope.pageData.selectedLeague.objectId);
    };

    var getTable = function(matchArray,outputArray,includeWildCardAndPlayoffs){
    	var table = {};
      if(!outputArray){
        $scope.pageData.tableArray = []; //Creation of the tableArray object if is not created
      };
      matchArray = matchArray ? matchArray : $scope.pageData.tournamentMatches; //if matchArray is defined, we assigned to the variable, otherwise we assign all matches to matchArray
      outputArray = outputArray ? outputArray : $scope.pageData.tableArray; //We assign the outputArray if is defined, otherwise we add the tableArray variable
      includeWildCardAndPlayoffs = includeWildCardAndPlayoffs ? includeWildCardAndPlayoffs : false; //By default wildcard is false
      if(!includeWildCardAndPlayoffs){ //First will enter here
        angular.forEach($scope.pageData.tournamentPlayers, function(item){ //For each tournament player (is an array Array[x], inside we have more objects like player,team, etc.
          table[item.player.objectId] = getEmptyTableRow(); //table is an object with the id's of the player and inside the object we have the getEmptyTableRow structure.
          table[item.player.objectId].group = item.group; //als we define the group property inside the table item.
          table[item.player.objectId].player = item.player; //and we add the reference of the player pointer (player table)
        });  
      }
    	angular.forEach(matchArray,function(match){ //For each match (is an array of all matches)
    		if(!includeWildCardAndPlayoffs && (match.wildcard || match.playoffs)){
    			return;
    		}
    		//add points
        if(!table[match.home.objectId]){ //Check the id of the home player and if it's not defined on the table, we defined, same as this line table[item.player.objectId].player = item.player
          table[match.home.objectId] = getEmptyTableRow();
          table[match.home.objectId].player = match.home;
        }
        if(!table[match.away.objectId]){ //Same process of the away team
          table[match.away.objectId] = getEmptyTableRow();
          table[match.away.objectId].player = match.away;
        }
    		if(match.home_score === match.away_score){ //Check if the scores were equals, if it, we check the penalties case
          if(match.home_penalties && match.away_penalties && match.home_penalties > match.away_penalties){ //if home penalties win
            table[match.home.objectId].points += 3;   
            table[match.home.objectId].win += 1; 
            table[match.away.objectId].lost += 1;  
          }else if(match.home_penalties && match.away_penalties && match.home_penalties < match.away_penalties){ //otherwise away penalties win
            table[match.away.objectId].points += 3; 
            table[match.home.objectId].lost += 1; 
            table[match.away.objectId].win += 1;   
          }else{ //it's tie
            table[match.home.objectId].points += 1;
            table[match.away.objectId].points += 1;
            table[match.home.objectId].draw += 1;
            table[match.away.objectId].draw += 1  
          }
    			
    		}else if(match.home_score > match.away_score){ //Home win the game
    			if(table[match.home.objectId].group == table[match.away.objectId].group){
    				table[match.home.objectId].divW += 1;
    				table[match.away.objectId].divL += 1;
    			}
    			table[match.home.objectId].points += 3;   
    			table[match.home.objectId].win += 1; 
    			table[match.away.objectId].lost += 1;    	
    		}else if(match.away_score > match.home_score){ //Away win the game
    			if(table[match.home.objectId].group == table[match.away.objectId].group){
    				table[match.away.objectId].divW += 1;
    				table[match.home.objectId].divL += 1;
    			}
    			table[match.away.objectId].points += 3; 
    			table[match.home.objectId].lost += 1; 
    			table[match.away.objectId].win += 1;     	
    		}

    		table[match.home.objectId].scored += match.home_score; //These values are updated from the match info and add it in the defined structure
    		table[match.away.objectId].received += match.home_score;
    		table[match.away.objectId].scored += match.away_score;
    		table[match.home.objectId].received += match.away_score;
    		table[match.home.objectId].played += 1;
    		table[match.away.objectId].played += 1;    
    	}); //table[match.away.objectId] to locate the ids data, table object is like
						/*
							7B1TRwhLOJ: ..
							DO6uVf50Nt: ..
							TDSA2OeCmn: ..
						*/
			angular.forEach(table,function(tableRow){
				tableRow.diff = tableRow.scored - tableRow.received;
				var pct = (tableRow.win + (0.5*tableRow.draw))/(tableRow.win+tableRow.draw+tableRow.lost)
				tableRow.pct = pct ? pct : 0;
				outputArray.push(tableRow);
			});
			$scope.order(['-pct','-divW'],false); //This function will order the information and using the difference
			$scope.orderGeneral(['-pct', '-scored', false]);
    };

     $scope.selectLeague = function(league){
      $scope.pageData.selectedLeague = league;
      $scope.pageData.selectTeam = null;
      getTeams(league.objectId);
    };

    $scope.selectHome = function(item){
      $scope.pageData.newMatch.home = item;
      getPlayedGames();
    };

    $scope.selectAway = function(item){
      $scope.pageData.newMatch.away = item;
      getPlayedGames();
    };

	  $scope.addPlayer = function(){
    	madden.createUserTournament($scope.pageData.selectedTournament.objectId,$scope.pageData.newPlayer.selectedUser.objectId,$scope.pageData.selectedTeam.objectId,$scope.pageData.selectedGroup);
    	$scope.pageData.newPlayer = {}; 
    	$scope.pageData.selectedCountry = null;
    	$scope.pageData.selectedLeague = null;
    	$scope.pageData.selectedTeam = null;
      $scope.pageData.selectedGroup = null;
    	$scope.pageData.teams = {};
    	getTournamentPlayers($scope.pageData.selectedTournament.objectId); //We add the user and we show all the list with the new player
    };

    $scope.deletePlayer = function(objectId){
    	madden.deleteTournamentPlayer(objectId).then(function(){
    		getTournamentPlayers($scope.pageData.selectedTournament.objectId); //We delete the user and get again the players of the tournaments
    	});
    };

    $scope.addMatch = function(){
      madden.createTournamentMatch(
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
      $scope.pageData.newMatch = {};
      getTournamentMatches($scope.pageData.selectedTournament.objectId); //With this we'll refresh the view (table)
    };

    $scope.deleteMatch = function(objectId){
      madden.deleteTournamentMatch(objectId).then(function(){
        getTournamentMatches($scope.pageData.selectedTournament.objectId); //In order to refresh the view  
      });
    };

    $scope.updateScore = function(objectId,field,value){
      madden.updateMatchScore(objectId,field,value);
    };

    $scope.numberOfPages=function(){
      if(!$scope.pageData.regularMatches){
        return;
      }
      return Math.ceil($scope.pageData.regularMatches.length/$scope.pageSize);                
    };

     $scope.matchFilter = function(item,matchArray){
      var result = [];    
      var matchArray =  matchArray ? matchArray : $scope.pageData.tournamentMatches;
      angular.forEach(matchArray,function(match){
        if(match.home.objectId === item.objectId || match.away.objectId === item.objectId || match.home.objectId === item.objectId || match.away.objectId === item.objectId){
          result.push(match);
        }
      });
      $scope.currentPage = 0;
      return result;
    };

    $scope.clearFilters = function(){
      getTournamentMatches($scope.pageData.selectedTournament.objectId);
    };

    $scope.getRoundLabel = function(round){
      if(!round){
        return;
      }
      if(round === 4){
        return 'Quarter-final';
      }else if(round === 2){
        return 'Semi-final';
      }else if(round === 1.5){
        return '3rd place';
      }else if(round === 1){
        return 'Final';
      }else{
        return round;
      }
    };

    $scope.order = function(predicate, reverse) {
      $scope.pageData.tableArray = orderBy($scope.pageData.tableArray, predicate, reverse); //Array, expression, reverse
    };

    $scope.orderGeneral = function(predicate, reverse) {
      $scope.tableArrayGeneral = angular.copy($scope.pageData.tableArray); //Creating a copy to avoid modifying the info
      $scope.tableArrayGeneral = orderBy($scope.tableArrayGeneral, predicate, reverse); //Array, expression, reverse
    };

    $scope.getCatalogScreen = function(){
      return "views/madden.html";
    }

    //init routines
    getTournaments();
    getLeagues();
    getUsers();

  }]);
