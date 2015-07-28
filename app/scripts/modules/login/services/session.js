'use strict';

/**
 * @ngdoc service
 * @name login.session
 * @description
 * # Session
 * Service in the login module.
 */
angular.module('login')
  .service('Session',['$location','$rootScope','localStorageService','Proxy', function Session($location,$rootScope,localStorageService,Proxy) {
  	this.setSession = function(session){
      if(session){
        $rootScope.session = session; 
        localStorageService.set('jac-session',session); 
      }
  	};

    this.setAttribute = function(attribute,value){
      $rootScope.session[attribute] = value;
    };

    this.saveSession = function(){
      localStorageService.set('jac-session',$rootScope.session); 
    };

  	this.getSession = function(){
  		var session = localStorageService.get('jac-session');
	    if(session){
	      $rootScope.session = session;
	    }
  		return session ? $rootScope.session : undefined;
  	};

  	this.hasSession = function(){
  		var session = this.getSession();
  		return session ? true : false;
  	};

  	this.logout = function(){
      Proxy.postCall({},'https://api.parse.com/1/logout',{'X-Parse-Session-Token':$rootScope.session.sessionToken}).then(function(response){
        localStorageService.remove('jac-session');
        $rootScope.session = null;
        $location.path('/login');  
      });  		
  	};

    this.tokenValidate = function(){
      return Proxy.getCall('https://api.parse.com/1/users/me',{},{'X-Parse-Session-Token':$rootScope.session.sessionToken});
    };

  }]);
