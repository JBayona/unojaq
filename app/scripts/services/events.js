'use strict';

/**
 * @ngdoc service
 * @name vestaParkingApp.events
 * @description
 * # events
 * Service in the vestaParkingApp.
 */
angular.module('vestaParkingApp')
  .service('Events',['Proxy', function (Proxy) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var getEvents = function(){
	  	var data = {
	  		'include':'user',
	  		'limit':5000,
	  		'order':'startsAt',
	  		'where':'{"endsAt":{"$gte":{"__type":"Date","iso":"'+moment().day(-1).toISOString()+'"}}}'
	  	};
	  	return Proxy.getCall('https://api.parse.com/1/classes/Events',data);
	  };

	  var createEvent = function(event){
			return Proxy.postCall(event,'https://api.parse.com/1/classes/Events');
		};

		var deleteEvent = function(objectId){
			return Proxy.deleteCall({'objectId':objectId},'https://api.parse.com/1/classes/Events/'+objectId);
		};

	  return{
	  	getEvents:getEvents,
	  	createEvent:createEvent,
	  	deleteEvent:deleteEvent
	  }
  }]);
