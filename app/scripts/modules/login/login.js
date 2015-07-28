'use strict';

/**
 * @ngdoc overview
 * @name vestaParkingApp
 * @description
 * # vestaParkingApp
 *
 * login module of the application.
 */
angular
  .module('login', [
  ])
  .config(['$routeProvider','localStorageServiceProvider',function ($routeProvider,localStorageServiceProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        auth:false
      }).when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        auth:true
      }).when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        auth: true
      }).when('/donuts', {
        templateUrl: 'views/donuts.html',
        controller: 'DonutsCtrl',
        auth: true
      }).when('/fifa', {
        templateUrl: 'views/fifa.html',
        controller: 'FifaCtrl',
        auth: true
      }).otherwise({
        redirectTo: '/'
      });
      localStorageServiceProvider.setStorageType('sessionStorage');
  }]).run(['$rootScope','$location','$cookieStore','Session','LoginService','$timeout','material',function($rootScope,$location,$cookieStore,Session,LoginService,$timeout,material){
    material.init();
    $rootScope.logout = function(){
      Session.logout();
    };
    $rootScope.passwordReset = function(){
      $rootScope.resetConfirmation = true;
      LoginService.reset($rootScope.session.email).then(function(){
        $timeout(function(){
            $rootScope.resetConfirmation = false;
          },3000);
      });
    };
    //Prevent unauthorized access
    $rootScope.$on('$routeChangeStart', function (event, next) {
        $rootScope.activeMenu = $location.url();
        if($location.url() === '/login'){
          return;
        }
        var userAuthenticated = false;
        if(Session.hasSession()){
          userAuthenticated = true;
        }

        if (!userAuthenticated && next.auth ) {
            /* You can save the user's location to take him back to the same page after he has logged-in */
            $rootScope.savedLocation = $location.url();

            $location.path('/login');
        }else if(next.auth){
          Session.tokenValidate().then(function(response){
            if(!response.sessionToken){
              $location.path('/login');
            }
          },function(error){
            $location.path('/login');
          });  
        }
        
    });
  }]);
