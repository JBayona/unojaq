'use strict';

/**
 * @ngdoc service
 * @name vestaParkingApp.parking
 * @description
 * # parking
 * Service in the vestaParkingApp.
 */
angular.module('vestaParkingApp')
  .service('Parking',['Proxy', function (Proxy) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var getParkingInfo = function(objectId){
	  	return Proxy.getCall('https://api.parse.com/1/classes/Parking?where={"user":{"__type":"Pointer","className":"_User","objectId":"'+objectId+'"}}',{});
	  };

	  return{
	  	getParkingInfo:getParkingInfo
	  }
  }]);
