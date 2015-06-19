angular.module('starter.controllers', [])

  .controller('AppCtrl', function($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function() {
        $scope.closeLogin();
      }, 1000);
    };
  })

  .controller('AgendaCtrl',function($scope, $ionicModal, agendaService, locationFavoriteService, $http) {

    $scope.favorites = JSON.parse(window.localStorage['locations']) || [];
    console.log('locations are:', $scope.favorites[0]);
    $ionicModal.fromTemplateUrl('templates/addNewEvent.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.addNewEvent = function() {
      $scope.modal.show();
    };

    $scope.createNewEvent = function(){
      var req = {
        method: 'POST',
        url: '/api/events/',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {"name":"Event 4", "location":"1", "owner":"0634124981", "event_date":"2015-05-17T00:00"}
      };

      $http(req).success(function(data, status) {
        if(status === 201 ){
          console.log('success create events');
          console.log(' events', data);
        }
      }).error(function(data, status, headers) {
        console.log('error create events');
      });
    };
    Number.prototype.toHHMMSS = function () {
      var hours   = Math.floor(this / 3600);
      var minutes = Math.floor((this - (hours * 3600)) / 60);
      if (hours   < 10) {hours   = "0"+hours;}
      if (minutes < 10) {minutes = "0"+minutes;}
      var time    = hours+':'+minutes+':00';
      return time;
    };

    Date.prototype.formatMMDDYYYY = function(){
      return this.getDate() +
        "/" +  ((this.getMonth() + 1)  < 10 ? "0" + (this.getMonth() + 1):(this.getMonth() + 1)) +
        "/" +  this.getFullYear();
    };
    $scope.currentDate = new Date();
    $scope.dateShortFormat = $scope.currentDate.formatMMDDYYYY();

    $scope.datePickerCallback = function (val) {
      if(typeof(val)==='undefined'){
        console.log('Date not selected');
      }else{
        $scope.dateShortFormat = val.formatMMDDYYYY();
        console.log('Selected date is : ', val);
      }
    };

    $scope.slots = {epochTime: 12600, format: 12, step: 15};

    $scope.timepicker =  $scope.slots.epochTime.toHHMMSS();
    $scope.timePickerCallback = function (val) {
      if (typeof (val) === 'undefined') {
        console.log('Time not selected');
      } else {
        $scope.timepicker = val.toHHMMSS();
        console.log('Selected time is : ', val);    // `val` will contain the selected time in epoch
      }
    };

    var req = {
      method: 'GET',
      url: '/api/events/',
      headers: {
        'Accept': 'application/json'
      }
    };

    $http(req).success(function(data, status, headers, config) {
      console.log('success get events');
      console.log(' events', data);
      $scope.events = data;
      console.log(data);
      agendaService.setList(data);
    }).error(function(data, status, headers, config) {
        console.log('error get events');
        console.log(' events', data);
        console.log(' events', status);
        console.log(' events', headers);
      });

  })


  .controller('AgendaDetailCtrl', function($scope, agendaService, $stateParams) {
    $scope.event = agendaService.getEvent($stateParams.eventId);

  })

  .controller('LocationCtrl',['$scope', 'locationService', 'locationFavoriteService', '$http', function($scope, locationService, locationFavoriteService, $http) {

    var req = {
      method: 'GET',
      url: '/api/locations/',
      headers: {
        'Accept': 'application/json'
      }
    };

    $http(req).success(function(data) {
      console.log('success get locations');
      $scope.locations = data;
      console.log(data);
      window.localStorage['locations'] = JSON.stringify(data);
      locationService.setList(data);
      locationFavoriteService.setList(data);
    }).error(function() {
        console.log('error get locations');
      });

  }])

  .controller('LocationDetailCtrl', function($scope, locationService, $stateParams) {
    $scope.location = locationService.getLocation($stateParams.eventId);

  })

  .controller('SettingCtrl', function($scope, $stateParams) {
  })

  .factory('locationService', function() {
    var locations =[];

    function getList(){
      return locations;
    }
    function setList(locationList){
      locations = locationList;
    }
    function getLocation(locationId){
      var filteredLocation =  locations.filter(function (location) {
        var bool = Number(location.location_id) === Number(locationId);
        return bool;
      });
      console.log('event filtered', filteredLocation.length);
      return filteredLocation[0];
    }
    return {
      getList: getList,
      setList: setList,
      getLocation: getLocation
    }
  })

  .factory('locationFavoriteService', function() {
    var locations =[];

    function getList(){
      return locations;
    }
    function setList(locationList){
      locations = locationList;
    }
    function getLocation(locationId){
      var filteredLocation =  locations.filter(function (location) {
        var bool = Number(location.location_id) === Number(locationId);
        return bool;
      });
      console.log('event filtered', filteredLocation.length);
      return filteredLocation[0];
    }
    return {
      getList: getList,
      setList: setList,
      getLocation: getLocation
    }
  })

  .factory('agendaService', function() {
    var events =[];

    function getList(){
      return events;
    }
    function setList(eventList){
      events = eventList;
    }
    function getEvent(eventId){
      console.log('eventId', eventId);
      var filteredEvent =  events.filter(function (event) {
        console.log('eventId', event.event_id);
        console.log('event name', event.name);
        console.log('event owner', event.owner.firstname);
        var bool = Number(event.event_id) === Number(eventId);
        console.log('event',event.event_id, 'eventId', eventId, bool);
        return bool;
      });
      console.log('event filtered', filteredEvent.length);
      return filteredEvent[0];
    }
    return {
      getList: getList,
      setList: setList,
      getEvent: getEvent
    }
  });

