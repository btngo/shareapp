angular.module('starter.controllers', [])

  .controller('AppCtrl', function($scope, $rootScope, $ionicModal, $http, $localStorage, $ionicPopup) {

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
      $scope.modal1 = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
      $scope.modal1.hide();
    };

    // Open the login modal
    $scope.login = function() {
      $scope.modal1.show();
    };

    $scope.createNewAccount = function() {
      $scope.modal1.hide();
      $ionicModal.fromTemplateUrl('templates/createAccount.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modalAccount = modal;
        $rootScope.$broadcast('create Account');
      });
    };
    $scope.closeRegisterForm = function() {
      $scope.modalAccount.hide();
    };

    $scope.$on('create Account', function() {
      $scope.modalAccount.show();
    });

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
      $http.post('http://dqlenguyen.myds.me:8000/api-token-auth/', {username: $scope.loginData.username, password: $scope.loginData.password})
        .then(function(response) {
          if(response.status === 200 ){
            console.log('success login');
            $localStorage.set('username', $scope.loginData.username);
            $localStorage.set('password', $scope.loginData.password);
            $localStorage.set('token', response.data.token);
            $scope.token = response.data.token;
            $scope.modal1.hide();
            $rootScope.$broadcast('loggedIn');
          }
        }, function(response) {
          console.log('error login', response.config);
          $ionicPopup.alert({
            title: 'Login failed! ',
            template: 'Please check your credentials '
          });
        })
    };

    $scope.createAccount = function(){

    };
  })

  .controller('AgendaCtrl',function($scope, $rootScope, $ionicModal, agendaService, locationFavoriteService, $http, $timeout, $localStorage) {
    $scope.event = {
      name: '',
      location: ''
    };
    $scope.timePickerObject = {
      inputEpochTime: ((new Date()).getHours() * 60 * 60),
      step: 15,
      format: 12,
      titleLabel: '12-hour Format',
      setLabel: 'Set',
      closeLabel: 'Close',
      setButtonType: 'button-positive',
      closeButtonType: 'button-stable',
      callback: function (val) {
        timePickerCallback(val);
      }
    };
    function timePickerCallback(val) {
      if (typeof (val) === 'undefined') {
        console.log('Time not selected');
      } else {
        $scope.timePickerObject.inputEpochTime = val;
      }
    }

    $scope.datepickerObject = {
      titleLabel: 'Title',
      todayLabel: 'Today',
      closeLabel: 'Close',
      setLabel: 'Set',
      setButtonType : 'button-assertive',
      todayButtonType : 'button-assertive',
      closeButtonType : 'button-assertive',
      inputDate: new Date(),
      templateType: 'popup',
      modalHeaderColor: 'bar-positive',
      modalFooterColor: 'bar-positive',
      callback: function (val) {
        datePickerCallback(val);
      }
    };

    var datePickerCallback = function (val) {
      if (typeof(val) === 'undefined') {
        console.log('No date selected');
      } else {
        $scope.datepickerObject.inputDate = val;
      }
    };

    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal1 = modal;
    });

    $ionicModal.fromTemplateUrl('templates/addNewEvent.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal2 = modal;
    });

    $timeout( function() {
      if ($localStorage.get('token', '') === ''){
        $scope.modal1.show();
      }
    }, 500);

    $scope.$on('loggedIn', function(){
      $scope.modal1.hide();
      $scope.getEvents();
    });
    $scope.$on('Event created', function(){
      $scope.getEvents();
    });
    $scope.closeLogin = function() {
      $scope.modal1.hide();
    };

    $scope.closeEventModal = function() {
      $scope.modal2.hide();
    };

    $scope.addNewEvent = function() {
      $scope.event.name = '';
      $scope.event.location = '';
      $scope.modal2.show();
    };

    function geteventDate () {
      var epocheTime = $scope.timePickerObject.inputEpochTime;
      $scope.datepickerObject.inputDate.setHours(parseInt(epocheTime / 3600));
      $scope.datepickerObject.inputDate.setMinutes((epocheTime / 60) % 60);
      return $scope.datepickerObject.inputDate.toJSON();
    }

    $scope.createNewEvent = function(){
      $scope.token = $localStorage.get('token', '');

      console.log($scope.eventName, $scope.eventLocation );
      var req = {
        method: 'POST',
        url: 'http://dqlenguyen.myds.me:8000/events/',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + $scope.token
        },
        data: {"name": $scope.event.name , "location": $scope.event.location , "owner":$localStorage.get('username', ''), "event_date":geteventDate()}
      };

      $http(req).success(function(data, status) {
        if(status === 201 ){
          $scope.closeEventModal();
          $scope.$broadcast('Event created');
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

    $scope.getEvents = function() {
      $scope.token = $localStorage.get('token', '');
      var req = {
        method: 'GET',
        url: 'http://dqlenguyen.myds.me:8000/events/',
        headers: {
          'Authorization': 'Token ' + $scope.token
        }
      };
      $http(req).success(function(data, status, headers, config) {
        $scope.events = data;
        agendaService.setList(data);
      }).error(function(data, status, headers, config) {
      }).finally(function() {
        $scope.$broadcast('scroll.refreshComplete');
      });
    }


  })

  .directive('standardTimeMeridian', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        etime: '=etime'
      },
      template: "<strong>{{stime}}</strong>",
      link: function(scope, elem, attrs) {

        scope.stime = epochParser(scope.etime, 'time');

        function prependZero(param) {
          if (String(param).length < 2) {
            return "0" + String(param);
          }
          return param;
        }

        function epochParser(val, opType) {
          if (val === null) {
            return "00:00";
          } else {
            var meridian = ['AM', 'PM'];

            if (opType === 'time') {
              var hours = parseInt(val / 3600);
              var minutes = (val / 60) % 60;
              var hoursRes = hours > 12 ? (hours - 12) : hours;

              var currentMeridian = meridian[parseInt(hours / 12)];

              return (prependZero(hoursRes) + ":" + prependZero(minutes) + " " + currentMeridian);
            }
          }
        }

        scope.$watch('etime', function(newValue, oldValue) {
          scope.stime = epochParser(scope.etime, 'time');
        });

      }
    };
  })
  .controller('AgendaDetailCtrl', function($scope, agendaService, $stateParams) {
    $scope.event = agendaService.getEvent($stateParams.eventId);

    })

    .controller('ContactCtrl', function($scope, $ionicPlatform, $cordovaContacts) {

      $scope.getAllContacts = function() {
        var options = new ContactFindOptions();
        options.multiple = true;
        options.filter = '';
        if (ionic.Platform.isAndroid()) {
          options.hasPhoneNumber = true;         //hasPhoneNumber only works for android.
          options.fields = ['name.formatted', 'phoneNumbers'];
        };
        $cordovaContacts.find(options).then(function(allContacts) {
          console.log(allContacts);

          $scope.contacts = allContacts.filter(function (value) {
            return (value.phoneNumbers !== null) || (value.emails !== null);
          });
        });
      };
      $ionicPlatform.ready(function() {
        $scope.getAllContacts();
      }, false);
    })

  .controller('LocationCtrl', function($scope, locationService, $localStorage, locationFavoriteService, $http) {
    $scope.getLocations = function() {
      $scope.token = $localStorage.get('token', '');
      var req = {
        method: 'GET',
        url: 'http://dqlenguyen.myds.me:8000/locations/',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Token ' + $scope.token
        }
      };

      $http(req).success(function(data) {
        $scope.locations = data;
        window.localStorage['locations'] = JSON.stringify(data);
        locationService.setList(data);
        locationFavoriteService.setList(data);
      }).error(function() {
        console.log('error get locations');
      }).finally(function() {
        $scope.$broadcast('scroll.refreshComplete');
      });
    };
    $scope.$on('loggedIn', function(){
      $scope.getLocations();
    });
  })

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
      var filteredEvent =  events.filter(function (event) {
        var bool = Number(event.event_id) === Number(eventId);
        return bool;
      });
      return filteredEvent[0];
    }
    return {
      getList: getList,
      setList: setList,
      getEvent: getEvent
    }
  });

