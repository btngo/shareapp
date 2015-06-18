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

  .controller('AgendaCtrl',['$scope', 'agendaService', '$http', function($scope, agendaService, $http) {

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
    }).
      error(function(data, status, headers, config) {
        console.log('error get events');
        console.log(' events', data);
        console.log(' events', status);
        console.log(' events', headers);
      });

  }])


  .controller('AgendaDetailCtrl', function($scope, agendaService, $stateParams) {
    $scope.event = agendaService.getEvent($stateParams.eventId);

  })

  .controller('LocationCtrl',['$scope', 'locationService', '$http', function($scope, locationService, $http) {

    var req = {
      method: 'GET',
      url: '/api/locations/',
      headers: {
        'Accept': 'application/json'
      }
    };

    $http(req).success(function(data, status, headers, config) {
      console.log('success get locations');
      $scope.locations = data;
      console.log(data);
      locationService.setList(data);
    }).
      error(function(data, status, headers, config) {
        console.log('error get locations');
      });

  }])

  .controller('LocationDetailCtrl', function($scope, locationService, $stateParams) {
    $scope.location = locationService.getLocation($stateParams.eventId);

  })

  .controller('SettingCtrl', function($scope, $stateParams) {
  })

  .factory('locationService', function(Restangular) {
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

  .factory('agendaService', function(Restangular) {
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

  })
;

