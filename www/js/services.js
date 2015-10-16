angular.module('starter.services', [])

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

  .factory('AttendeeService', function() {
    var attendees =[];

    function addAttendee(att){
      if (attendees.filter(function(contact) {
          return att.telephone == contact.telephone;
        }).length == 0) {
        attendees.push(att);
      }
    }

    function setList(locationList){
      attendees = locationList;
    }

    function cleanList() {
      attendees =[];
    }

    function getList(){
      return attendees;
    }

    function removeAttendee(att) {
      return attendees.filter(function(contact) {
        return att.telephone !== contact.telephone;
      });
    }

    return {
      addAttendee: addAttendee,
      setList: setList,
      getList: getList,
      cleanList: cleanList,
      removeAttendee: removeAttendee
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


