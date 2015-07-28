'use strict';

/**
 * @ngdoc service
 * @name vestaParkingApp.proxy
 * @description
 * # proxy
 * Service in the dashboardApp.
 */
angular.module('vestaParkingApp')
  .service('Proxy',['$q','$http', function Proxy($q,$http) {
  	var restCall = function(method,data,url,params,headers){
  		var defer = $q.defer();
  		var reqHeaders = {
		    'X-Parse-Application-Id': 'HMgEYiz7FYsYo4yymyJzcjkIzBuxo5SZDfKKBAoJ',
				'X-Parse-REST-API-Key': 'N9aoa2aWcwYWmNjKNc0DuTHALh28YHzVf2C8S4QW',
		    'Content-Type':'application/json'
		  };
  		if(headers){
		  	angular.forEach(headers,function(value,key){
		  		reqHeaders[key] = value;
		  	});
		  }
  		var req = {
		  method: method,
		  url: url,
		  headers: reqHeaders,
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
	  var getRestCall = function(data){
	  	return $http.get(url,{params:data});
	  }
		var postCall = function(data,url,headers){
			return restCall('POST',data,url,{},headers);
		};

		var putCall = function(data,url){
			return restCall('PUT',data,url);
		};

		var getCall = function(url,params,headers){
			params = params ? params:{};
			return restCall('GET',{},url,params,headers);
		};

		var deleteCall = function(data,url){
			return restCall('DELETE',data,url);
		};

		

		return{
			postCall:postCall,
			putCall:putCall,
			getCall:getCall,
			deleteCall:deleteCall
		}
    // AngularJS will instantiate a singleton by calling "new" on this function
  }]);
