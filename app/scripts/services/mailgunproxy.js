'use strict';

/**
 * @ngdoc service
 * @name vestaParkingApp.MailgunProxy
 * @description
 * # MailgunProxy
 * Service in the dashboardApp.
 */
angular.module('vestaParkingApp')
  .service('MailgunProxy',['$q','$http', function Proxy($q,$http) {
  	var restCall = function(method,data,url,params,headers){
  		var defer = $q.defer();
  		var req = {
		  method: method,
		  url: 'https://api:key-aebe1dc273b3d018db75c83ae17fb3520@api.mailgun.net/v3/unojaq.com/messages',
		  data:data,
		  params:params
		  };
	    $http(req).
		  success(function(data, status, headers, config) {
		    defer.resolve(data);
		  }).
		  error(function(data, status, headers, config) {
		  	defer.reject(data);
		 	});
		  return defer.promise;
	  };
	  
		var postCall = function(data,url){
			return restCall('POST',data,url);
		};

		

		return{
			postCall:postCall
		}
    // AngularJS will instantiate a singleton by calling "new" on this function
  }]);
