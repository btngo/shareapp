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


