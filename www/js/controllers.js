angular.module('starter.controllers', ['starter.services',
  'ngCordova'])

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

  .controller('AgendaCtrl',function($scope, $rootScope, $ionicModal, $cordovaSms, agendaService, $cordovaContacts, locationFavoriteService, $http, $timeout, $localStorage, AttendeeService, $ionicPlatform) {
    $scope.event = {
      name: '',
      location: ''
    };
    $scope.getContacts = function() {
      $scope.token = $localStorage.get('token', '');
      var req = {
        method: 'GET',
        url: 'http://dqlenguyen.myds.me:8000/persons/',
        headers: {
          'Authorization': 'Token ' + $scope.token
        }
      };
      $http(req).success(function(data) {
        console.log(data);
        $scope.sharePlayContacts = data;
        $scope.sharePlayContacts.name = 'SharePlay Contacts';
        $scope.sharePlayContacts.forEach(function (element) {
          element.name = element.firstname + ' ' + element.lastname;
        });
      }).error(function() {
      });
    };

    $scope.addAttendee = function(contact) {
      AttendeeService.addAttendee(contact);
    };

    $scope.deleteAttendee = function(contact) {
      AttendeeService.removeAttendee(contact);
    };

    $scope.getContacts();
    var phoneContacts = {
      show: false,
      name: 'Telephone Contacts',
      contacts: $scope.telephoneContacts
    };

    var sharePlayContacts = {
      show: false,
      name: 'SharePlay Contacts',
      contacts: $scope.sharePlayContacts
    };

    $scope.groups = [phoneContacts, sharePlayContacts];
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

    $scope.inviteAttendees = function () {
      $scope.modal3.hide();
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

    $ionicModal.fromTemplateUrl('templates/addNewAttendees.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal3 = modal;
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

    $scope.closeModal = function() {
      $scope.modal2.hide();
      $scope.modal3.hide();
    };

    $scope.addNewEvent = function() {
      $scope.event.name = '';
      $scope.event.location = '';
      $scope.modal2.show();
    };

    $scope.addAttendees = function() {
      AttendeeService.cleanList();
      $scope.modal3.show();
    };

    function geteventDate () {
      var epocheTime = $scope.timePickerObject.inputEpochTime;
      $scope.datepickerObject.inputDate.setHours(parseInt(epocheTime / 3600));
      $scope.datepickerObject.inputDate.setMinutes((epocheTime / 60) % 60);
      return $scope.datepickerObject.inputDate.toJSON();
    }

    function addAttendeeToEvent(att, event) {
      $scope.token = $localStorage.get('token', '');
      var req = {
        method: 'POST',
        url: 'http://dqlenguyen.myds.me:8000/players/',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + $scope.token
        },
        data: {"event": event.event_id, "player": att.telephone , "inviter": $localStorage.get('username', ''), "invite_reason": 'SharePlay', "confirmed": false}
      };

      $http(req).success(function(data, status) {
        if(status === 201 ){
          var options = {
            replaceLineBreaks: false, // true to replace \n by a new line, false by default
            android: {
              intent: 'INTENT'
            }
          };
          $cordovaSms
            .send(att.telephone, 'Your are invited to a football game by ' + att.telephone + ' via SharePlay', options)
            .then(function() {
              console.log('Success! SMS was sent');
            }, function(error) {
              console.log('An error occurred when sending sms');
            });
          console.log('success add attendee');
          console.log('result', data);
        }
      }).error(function() {
        console.log('error invite attendee');
      });
    }

    $scope.createNewEvent = function(){
      $scope.token = $localStorage.get('token', '');
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
          var listAttendees = AttendeeService.getList();
          if (listAttendees.length > 0) {
            listAttendees.forEach(function(att) {
              addAttendeeToEvent(att, data);
            });
          }
          $scope.closeModal();
          $scope.$broadcast('Event created');
          console.log('success create events');
          console.log(' events', data);
        }
      }).error(function() {
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
        console.log(data);
        $scope.events = data;
        agendaService.setList(data);
      }).error(function(data, status, headers, config) {
      }).finally(function() {
        $scope.$broadcast('scroll.refreshComplete');
      });
    };
    $scope.getEvents();

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

  .controller('ContactCtrl', function($scope, $ionicPlatform, $cordovaContacts, $localStorage, $http, AttendeeService) {

    $scope.getContacts = function() {
      $scope.token = $localStorage.get('token', '');
      var req = {
        method: 'GET',
        url: 'http://dqlenguyen.myds.me:8000/persons/',
        headers: {
          'Authorization': 'Token ' + $scope.token
        }
      };
      $http(req).success(function(data) {
        console.log(data);
        $scope.sharePlayContacts = data;
        $scope.sharePlayContacts.name = 'SharePlay Contacts';
        $scope.sharePlayContacts.forEach(function (element) {
          element.name = element.firstname + ' ' + element.lastname;
        });
      }).error(function() {
      });
    };

    $scope.addAttendee = function(contact) {
      AttendeeService.addAttendee(contact);
    };

    $scope.deleteAttendee = function(contact) {
      AttendeeService.removeAttendee(contact);
    };

    $ionicPlatform.ready(function() {
      $scope.getAllContacts = function() {
        var options = new ContactFindOptions();
        options.multiple = true;
        options.filter = '';
        options.fields = ['name.formatted', 'phoneNumbers'];
        if (ionic.Platform.isAndroid()) {
          options.hasPhoneNumber = true;
        };
        $cordovaContacts.find(options).then(function(allContacts) {
          var telephoneContacts = allContacts.filter(function (value) {
            return (value.phoneNumbers !== null);
          });
          telephoneContacts.forEach(function (element) {
            element.name = element.name.formatted;
            element.telephone = element.phoneNumbers[0].value;
          });
          $scope.telephoneContacts = telephoneContacts;
          $scope.telephoneContacts.name = 'Telephone Contacts';
          $localStorage.set('telephoneContacts', JSON.stringify(telephoneContacts));
        });
      };
      if ($localStorage.get('telephoneContacts', []).length == 0) {
        $scope.getAllContacts();
      } else {
        $scope.telephoneContacts = JSON.parse($localStorage.get('telephoneContacts', []));
        console.log($scope.telephoneContacts[0]);
        $scope.telephoneContacts.name = 'Telephone Contacts';
      }
    }, false);

    $scope.getContacts();
    var phoneContacts = {
      show: false,
      name: 'Telephone Contacts',
      contacts: $scope.telephoneContacts
    };

    var sharePlayContacts = {
      show: false,
      name: 'SharePlay Contacts',
      contacts: $scope.sharePlayContacts
    };

    $scope.groups = [phoneContacts, sharePlayContacts];
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
  });
