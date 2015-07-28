'use strict';

/**
 * @ngdoc service
 * @name vestaParkingApp.events
 * @description
 * # events
 * Service in the vestaParkingApp.
 */
angular.module('vestaParkingApp')
  .service('Current',['Proxy', function (Proxy) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var getCurrent = function(){
	  	return Proxy.getCall('https://api.parse.com/1/classes/Current');
	  };

	  var updateTokens = function(tokens){
		  return Proxy.putCall({'tokens':tokens},'https://api.parse.com/1/classes/Current/6cCGvGwiCp');
		};

		var updateUserTokens = function(tokens,objectId){
		  return Proxy.putCall({'tokens':tokens},'https://api.parse.com/1/classes/Parking/'+objectId);
		};

		var updateTurn = function(turn){
		  return Proxy.putCall({'turn':turn},'https://api.parse.com/1/classes/Current/6cCGvGwiCp');
		};

		var getTotalUsers = function(){
	  	var data = {
	  		'count':'1',
	  		'where':'{\"fixed\":'+false+'}'
	  	};
	  	return Proxy.getCall('https://api.parse.com/1/classes/Parking',data);
	  };

	  var getCurrentUser = function(turn){
	  	var data = {
	  		'where':'{\"turn\":'+turn+'}',
	  		'include':'user'
	  	};
	  	return Proxy.getCall('https://api.parse.com/1/classes/Parking',data);
	  };

	  return{
	  	getCurrent:getCurrent,
		  updateTokens:updateTokens,
		  updateUserTokens:updateUserTokens,
	  	updateTurn:updateTurn,
	  	getTotalUsers:getTotalUsers,
	  	getCurrentUser:getCurrentUser
	  }
  }]);
