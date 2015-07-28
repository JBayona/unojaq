'use strict';

/**
 * @ngdoc service
 * @name vestaParkingApp.donuts
 * @description
 * # donuts
 * Service in the vestaParkingApp.
 */
angular.module('vestaParkingApp')
  .service('Donuts',['Proxy', function (Proxy) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var getEvents = function(){
	  	var data = {
	  		'include':'user',
	  		'limit':1000,
	  		'order':'createdAt',
	  		'where':'{\"paid\":'+false+'}'
	  	};
	  	return Proxy.getCall('https://api.parse.com/1/classes/Donuts',data);
	  };

	  var createEvent = function(event){
			return Proxy.postCall(event,'https://api.parse.com/1/classes/Donuts');
		};

		var payEvent = function(objectId){
			return Proxy.putCall({'paid':true},'https://api.parse.com/1/classes/Donuts/'+objectId);
		};

	  return{
	  	getEvents:getEvents,
	  	createEvent:createEvent,
	  	payEvent:payEvent
	  }
  }]);
