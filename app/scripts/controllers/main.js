'use strict';

/**
 * @ngdoc function
 * @name vestaParkingApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the vestaParkingApp
 */
angular.module('vestaParkingApp')
  .controller('MainCtrl', ['$scope','Current','Events','$rootScope','$q','$timeout','Mailgun','LoginService','Parking','Session','$interval','Proxy',function ($scope,Current,Events,$rootScope,$q,$timeout,Mailgun,LoginService,Parking,Session,$interval,Proxy) {
    //These variables MUST be set as a minimum for the calendar to work
    $scope.calendarView = 'month';
    $scope.calendarDay = new Date();
    $scope.newSpecialEvent = {};
    $scope.newEvent = {};
    $scope.events=[];
    $scope.fullDays = [];
    $scope.myEvents = [];
    var holidays = [];
    holidays.push(moment('2015-09-07').toISOString());
    holidays.push(moment('2015-09-14').toISOString());
    holidays.push(moment('2015-11-26').toISOString());
    holidays.push(moment('2015-11-27').toISOString());
    holidays.push(moment('2015-12-25').toISOString());
    $scope.tokens = 0;
    var dateDisableDeferred =  $q.defer();
  	$scope.dateDisablePromise = dateDisableDeferred.promise;
    var getParkingInfo = function(callback){
      Parking.getParkingInfo($rootScope.session.objectId).then(function(response){          
        angular.forEach(response.results[0],function(value,key){
          if(key === 'objectId'){
            Session.setAttribute('parkingId',value);
          }else{
            Session.setAttribute(key,value);  
          }            
        });
        Session.saveSession();
        if(callback){
          getCurrent($rootScope.session,callback);
        }
      });
    };
    var setNextTurn = function(user){
      Current.getTotalUsers().then(function(response){
        if(user.turn < response.count){
          Current.updateTurn(user.turn+1).then(function(){
            getCurrent();
          });
        }else{
          Current.updateTurn(1);
        }
        Current.updateTokens(3);
      });
    }
  	var getCurrent = function(user,callback){
      var user = user ? user : $rootScope.session;
  		Current.getCurrent().then(function(response){
	    	if(response.results[0].turn === user.turn){
	    		$scope.tokens = response.results[0].tokens;
          if(user.tokens){
            $scope.tokens += user.tokens;
            Current.updateUserTokens(0,user.parkingId);
            if($scope.tokens <= 0){
              setNextTurn(user);
            }else{
              Current.updateTokens($scope.tokens);  
            }            
          }
	    	}else{
          $scope.tokens = 0;
        }
	    	Current.getCurrentUser(response.results[0].turn).then(function(response){
	    		$scope.currentUser = response.results[0].user;
	    	});
        if(callback){
          callback();
        }
	    });
  	};
    
    var getEvents = function(){
    	Events.getEvents().then(function(response){
    		$scope.events=[];
    		var lastDay= undefined;
    		var dayCount = 0;
	    	angular.forEach(response.results,function(calendarEvent){
	    		var item = {};
	    		item.type = calendarEvent.type;
	    		item.startsAt = calendarEvent.startsAt.iso;
	    		if(calendarEvent.title){
	    			item.title = calendarEvent.title;	
	    		}else{
	    			item.title = calendarEvent.user.first_name + " " + calendarEvent.user.last_name.charAt(0);
	    			dayCount = lastDay && lastDay === moment(item.startsAt).day() ? dayCount+1 : 1;
		    		lastDay = moment(item.startsAt).day();
		    		if(dayCount>=7){ //We have 8 available parking spaces.
		    			$scope.fullDays.push(moment(calendarEvent.startsAt.iso).hour(0).toISOString());
		    		}
	    		}
	    		if($rootScope.session.objectId === calendarEvent.user.objectId && calendarEvent.type !== 'special'){
	    			$scope.myEvents.push(moment(calendarEvent.startsAt.iso).hour(0).toISOString());                
	    		}	    	
	    		item.endsAt = calendarEvent.endsAt.iso;
	    		item.draggable = false;
	    		item.resizable = false;
	    		if(calendarEvent.type === 'special'){
	    			item.deletable = $rootScope.session.beer_manager;	
	    		}else{
	    			item.deletable = ($rootScope.session.objectId === calendarEvent.user.objectId) || $rootScope.session.parking_manager;	
	    		}
	    		
	    		item.objectId = calendarEvent.objectId;
	    		$scope.events.push(item);
	    	});
	    	dateDisableDeferred.notify(new Date().getTime());
	    });
    };

    var getUsers = function(){
      LoginService.getUsers().then(function(response){
        $scope.users = response.results;
        angular.forEach($scope.users,function(user){
          if(user.parking_user){
            Parking.getParkingInfo(user.objectId).then(function(response){                          
              angular.forEach($scope.users,function(user){
                if(user.objectId === response.results[0].user.objectId){    
                  user.fixed = response.results[0].fixed;
                  if(user.fixed){
                    user.tokens = 'Unlimited';
                  }else{
                     user.tokens = response.results[0].tokens;
                  }   
                  user.parkingId = response.results[0].objectId;
                  user.turn = response.results[0].turn;
                }
              });                         
            });  
          }
          
        })
      });
    };
    
    $scope.addFixedEvent = function(userId){
    	for(var i=0;i<19;i++){
	    	var item={};
	    	//item.user={'__type':'Pointer','className':'_User','objectId':$rootScope.session.objectId};
        item.user = item.user={'__type':'Pointer','className':'_User','objectId':userId};
	    	item.startsAt= {__type:'Date',iso: moment($scope.newEvent.date).hour(9).add(i, 'day').toISOString()};
	    	item.endsAt= {__type:'Date',iso: moment($scope.newEvent.date).hour(18).add(i, 'day').toISOString()};
	    	item.type = 'important';
	    	if(moment(item.startsAt.iso).day()!==6 && moment(item.startsAt.iso).day()!==0){
	    		if(i===11){
	    			Events.createEvent(item).then(function(){
	    				getEvents();
	    			});	
	    		}else{
	    			Events.createEvent(item);	
	    		}	    		
	    	}
	    }
	    $scope.addedConfirmation = true;
  		$timeout(function(){
          $scope.addedConfirmation = false;
      },2000);
    };

    $scope.selectUser = function(user){
      $scope.selectedUser = user;
      dateDisableDeferred.notify(new Date().getTime());
    };

    $scope.addSpecialEvent = function(){
    	var item = {};
    	item.user = item.user={'__type':'Pointer','className':'_User','objectId':$rootScope.session.objectId};
    	item.startsAt = {__type:'Date',iso: moment(moment($scope.newSpecialEvent.date)).hour(9).toISOString()};
    	item.endsAt = {__type:'Date',iso: moment(moment($scope.newSpecialEvent.date)).hour(18).toISOString()};
    	item.type = 'special';
    	item.title = $scope.newSpecialEvent.title;
    	Events.createEvent(item).then(function(){
				getEvents();
				$scope.newSpecialEvent = {};
			});
    };

    $scope.addExternalEvent = function(userId){
      var item = {};
      item.user = item.user={'__type':'Pointer','className':'_User','objectId':userId};
      item.startsAt = {__type:'Date',iso: moment(moment($scope.newEvent.date)).hour(9).toISOString()};
      item.endsAt = {__type:'Date',iso: moment(moment($scope.newEvent.date)).hour(18).toISOString()};
      item.type = 'info';
      Parking.getParkingInfo(userId).then(function(response){        
        Current.updateUserTokens(response.results[0].tokens-1,response.results[0].objectId).then(function(){
          getUsers();
          $scope.selectedUser = $rootScope.session;
          dateDisableDeferred.notify(new Date().getTime());
        });
      });
      Events.createEvent(item).then(function(){
        $scope.addedConfirmation = true;
        $timeout(function(){
            $scope.addedConfirmation = false;
          },2000);
        getEvents();
        $scope.newEvent = {};        
      });
    };

    $scope.addAndSync = function(){
      $scope.addEvent();
      var startDate = moment(moment($scope.newEvent.date)).hour(9).toISOString();
      startDate = startDate.replace(/-|:|\.\d+/g, '');
      var endDate = moment(moment($scope.newEvent.date)).hour(18).toISOString();
      endDate = endDate.replace(/-|:|\.\d+/g, '');      
      window.open('https://www.google.com/calendar/render?action=TEMPLATE&text=Jacarandas%20Parking&dates='+startDate+'/'+endDate+'&details=Jacarandas%20parking%20turn&location=Jacarandas%20office&sprop=&sprop=name:#eventpage_6');      
    };
    var addEvent = function(userId){
      if($scope.tokens < 1 && !$rootScope.session.fixed){
        return;
      }
      if(!$rootScope.session.fixed){
        $scope.tokens--;
      }
      userId = userId ? userId : $rootScope.session.objectId;      
      var item = {};
      console.log("User = " + userId);
      item.user = item.user={'__type':'Pointer','className':'_User','objectId':userId};
      item.startsAt = {__type:'Date',iso: moment(moment($scope.newEvent.date)).hour(9).toISOString()};
      item.endsAt = {__type:'Date',iso: moment(moment($scope.newEvent.date)).hour(18).toISOString()};
      item.type = 'info';
      Events.createEvent(item).then(function(){
        $scope.addedConfirmation = true;
        $timeout(function(){
            $scope.addedConfirmation = false;
          },2000);
        getEvents();
        $scope.newEvent = {};
        if(!$rootScope.session.fixed){
          if($scope.tokens === 0){
            setNextTurn($rootScope.session);
          }else{
            Current.updateTokens($scope.tokens);
          }
        }        
      });
    };
    $scope.addSingle = function(){

    }
    $scope.addEvent = function(userId){
      getParkingInfo(addEvent);
    };
    

    $scope.disabled = function(date, mode) {
    	if($rootScope.session.parking_manager && !$scope.selectedUser.fixed){
    		return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6)) 
        || $scope.fullDays.indexOf(moment(date).hour(0).toISOString())!== -1
    		|| moment(date).isBefore(moment().add(-1,'day'));
    	}else if($rootScope.session.fixed){
        return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6)) 
        || $scope.myEvents.indexOf(moment(date).hour(0).toISOString())!== -1
        || moment(date).isBefore(moment().add(-1,'day'));
      }else{
    		return ((mode === 'day' && (date.getDay() === 0 || date.getDay() === 6)) 
	    	|| $scope.fullDays.indexOf(moment(date).hour(0).toISOString())!== -1
	    	|| $scope.myEvents.indexOf(moment(date).hour(0).toISOString())!== -1
        || holidays.indexOf(moment(date).hour(0).toISOString())!== -1
	    	|| moment(date).isBefore(moment().add(-1,'day'))
	    	|| moment(date).isAfter(moment().add(15,'day')));	
    	}
	    
	  };
    var sendEmail = function(from,to,subject,text,callback){
      callback = callback ? callback : function(){};
      var data={
        from:from,
        to:to,
        subject:subject,
        text:text
      };
      Mailgun.sendEmail(data).then(callback());
    }

	  $scope.openGarage = function(){
      sendEmail($rootScope.session.email,'jenni.hernand@unosquare.com,cesar.hernandez@unosquare.com','Garage open request','Please open the garage',
        function(response){
        $scope.emailSent = true;
        $scope.emailSentConfirmation = true;
        $timeout(function(){
            $scope.emailSentConfirmation = false;
          },3000);
      });	  	
	  };

	  $scope.openGarageVisible = function(){
	  	return $scope.myEvents.indexOf(moment().hour(0).minutes(0).seconds(0).milliseconds(0).toISOString()) !==-1;
	  };

    $scope.eventClicked = function(event) {
    };

    $scope.eventDeleted = function(event) {      
      Events.deleteEvent(event.objectId).then(function(){
      	getEvents();	        
      });
      sendEmail($rootScope.session.email,
        $scope.currentUser.email+',cesar.hernandez@unosquare.com,miguel.mora@unosquare.com',
        'New parking lot available',
        'There\'s parking lot available for:'+event.startsAt.substring(0,10)+' if you are interested in taking it please go to unojaq.com'
      );
    };

    $scope.eventTimesChanged = function(event) {
    };  

    

    //init routines
    if($rootScope.session.parking_manager){
      getUsers();
      $scope.selectedUser = $rootScope.session;
    }
    getCurrent();
    getEvents();
    getParkingInfo();

    
  }]);
