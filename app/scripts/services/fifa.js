'use strict';

/**
 * @ngdoc service
 * @name vestaParkingApp.fifa
 * @description
 * # fifa
 * Service in the vestaParkingApp.
 */
angular.module('vestaParkingApp')
  .service('Fifa',['Proxy', function (Proxy) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.createTeam = function(team){
			return Proxy.postCall(team,'https://api.parse.com/1/classes/fifa_teams');
		};
		this.getTeams = function(leagueId){
			return Proxy.getCall('https://api.parse.com/1/classes/fifa_teams?order=name&where={"league":{"__type":"Pointer","className":"fifa_leagues","objectId":"'+leagueId+'"}}',{});
		};

		this.getLeagues = function(){
			return Proxy.getCall('https://api.parse.com/1/classes/fifa_leagues',{});
		};

		this.createLeague = function(league){
			return Proxy.postCall(league,'https://api.parse.com/1/classes/fifa_leagues');
		};

		this.getTournaments = function(){
			return Proxy.getCall('https://api.parse.com/1/classes/fifa_tournament',{order:'-active'});
		};

		this.getTournamentPlayers = function(tournamentId){
			return Proxy.getCall('https://api.parse.com/1/classes/fifa_tournament_player?include=player,team&where={"tournament":{"__type":"Pointer","className":"fifa_tournament","objectId":"'+tournamentId+'"}}',{});
		};

		this.getTournamentMatches = function(tournamentId){
			return Proxy.getCall('https://api.parse.com/1/classes/fifa_tournament_match?limit=500&include=home,away&where={"tournament":{"__type":"Pointer","className":"fifa_tournament","objectId":"'+tournamentId+'"}}',{});
		};

		this.getPlayerMatches = function(player1,player2){
			console.log(player1 +' vs '+player2);
			return Proxy.getCall('https://api.parse.com/1/classes/fifa_tournament_match?limit=500&include=home,away&where={"$or":[{"home":{"__type":"Pointer","className":"_User","objectId":"'+player1+'"},"away":{"__type":"Pointer","className":"_User","objectId":"'+player2+'"}},{"home":{"__type":"Pointer","className":"_User","objectId":"'+player2+'"},"away":{"__type":"Pointer","className":"_User","objectId":"'+player1+'"}}]}',{});
		};

		this.updateMatchScore = function(objectId,field,value){
			var data = {};
			data[field] = parseInt(value);
			return Proxy.putCall(data,'https://api.parse.com/1/classes/fifa_tournament_match/'+objectId);
		};

		this.createUserTournament = function(tournamentId,playerId,teamId){
			var item = {
				player:{'__type':'Pointer','className':'_User','objectId':playerId},
				tournament:{'__type':'Pointer','className':'fifa_tournament','objectId':tournamentId},
				team:{'__type':'Pointer','className':'fifa_teams','objectId':teamId}
			};
			return Proxy.postCall(item,'https://api.parse.com/1/classes/fifa_tournament_player');
		};
		this.createTournamentMatch = function(tournamentId,homeId,awayId,homeScore,awayScore,wildcard,playoffs,homePenalties,awayPenalties,round){
			var item = {
				tournament:{'__type':'Pointer','className':'fifa_tournament','objectId':tournamentId},
				home:{'__type':'Pointer','className':'_User','objectId':homeId},
				away:{'__type':'Pointer','className':'_User','objectId':awayId},
				home_score:parseInt(homeScore),
				away_score:parseInt(awayScore),
				wildcard: wildcard ? wildcard : false,
				playoffs: playoffs ? playoffs : false,
				home_penalties: homePenalties ? parseInt(homePenalties) : null,
				away_penalties: awayPenalties ? parseInt(awayPenalties) : null,
				round: round ? parseInt(round) : null
			};
			return Proxy.postCall(item,'https://api.parse.com/1/classes/fifa_tournament_match');
		};
  }]);
