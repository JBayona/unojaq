'use strict';

/**
 * @ngdoc function
 * @name vestaParkingApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the vestaParkingApp
 */
angular.module('vestaParkingApp')
  .controller('MainCtrl', ['$scope','Current','Events','$rootScope','$q','$timeout','Mailgun','LoginService','Parking',function ($scope,Current,Events,$rootScope,$q,$timeout,Mailgun,LoginService,Parking) {
    //These variables MUST be set as a minimum for the calendar to work
    $scope.calendarView = 'month';
    $scope.calendarDay = new Date();
    $scope.newSpecialEvent = {};
    $scope.newEvent = {};
    $scope.events=[];
    $scope.fullDays = [];
    $scope.myEvents = [];
    $scope.tokens = 0;
    var dateDisableDeferred =  $q.defer();
  	$scope.dateDisablePromise = dateDisableDeferred.promise;
    var setNextTurn = function(){
      Current.getTotalUsers().then(function(response){
        if($rootScope.session.turn < response.count){
          Current.updateTurn($rootScope.session.turn+1).then(function(){
            getCurrent();
          });
        }else{
          Current.updateTurn(1);
        }
        Current.updateTokens(3);
      });
    }
  	var getCurrent = function(){
  		Current.getCurrent().then(function(response){
	    	if(response.results[0].turn === $rootScope.session.turn){
	    		$scope.tokens = response.results[0].tokens;
          if($rootScope.session.tokens){
            $scope.tokens += $rootScope.session.tokens;
            Current.updateUserTokens(0,$rootScope.session.parkingId);
            if($scope.tokens <= 0){
              setNextTurn();
            }else{
              Current.updateTokens($scope.tokens);  
            }            
          }
	    	}
	    	Current.getCurrentUser(response.results[0].turn).then(function(response){
	    		$scope.currentUser = response.results[0].user;
	    	});
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
	    			item.title = calendarEvent.user.first_name;	
	    			dayCount = lastDay && lastDay === moment(item.startsAt).day() ? dayCount+1 : 1;
		    		lastDay = moment(item.startsAt).day();
		    		if(dayCount>=6){
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
	    			item.deletable = $rootScope.session.objectId === calendarEvent.user.objectId;	
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
                  user.tokens = response.results[0].tokens;    
                  user.fixed = response.results[0].fixed;                
                }
              });                         
            });  
          }
          
        })
      });
    };
    
    $scope.addFixedEvent = function(){
    	for(var i=0;i<19;i++){
	    	var item={};
	    	item.user={'__type':'Pointer','className':'_User','objectId':$rootScope.session.objectId};
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
    
    $scope.addEvent = function(userId){
      userId = userId ? userId : $rootScope.session.objectId;
    	$scope.tokens--;
    	var item = {};
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
    		if($scope.tokens === 0){
    			setNextTurn();
    		}else{
    			Current.updateTokens($scope.tokens);
    		}
    	});
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
      sendEmail($rootScope.session.email,'erik.villa@unosquare.com','Garage open request','Please open the garage',
        function(response){
        $scope.emailSent = true;
        $scope.emailSentConfirmation = true;
        $timeout(function(){
            $scope.emailSentConfirmation = false;
          },3000);
      });	  	
	  };

	  $scope.openGarageVisible = function(){
	  	return $scope.myEvents.indexOf(moment().hour(0).minutes(0).seconds(0).milliseconds(0).toISOString()) !==-1 && !$rootScope.session.fixed;
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
  }]);
