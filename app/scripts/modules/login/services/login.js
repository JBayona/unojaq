'use strict';

/**
 * @ngdoc service
 * @name login.login
 * @description
 * # login
 * Service in the login module.
 */
angular.module('login')
  .service('LoginService',['Proxy', function login(Proxy) {
  	/*login calls*/
		var login = function(user,password){
  		var params = {
  			'username':encodeURIComponent(user),
  			'password':encodeURIComponent(password)
  		};
  		return Proxy.getCall('https://api.parse.com/1/login',params);
	  };


    var reset = function(email){
      var params = {
        'email':email
      };
      return Proxy.postCall(params,'https://api.parse.com/1/requestPasswordReset');
    };

    var getUsers = function(){
      var params = {
        'order':'first_name'
      };
      return Proxy.getCall('https://api.parse.com/1/users',params);
    }

    return{
      login:login,
      reset:reset,
      getUsers:getUsers
    }
	
  }]);
