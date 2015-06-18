angular.module('localStorage', ['LocalForageModule', 'uuid4'])

  .factory('localStorageService', function($q, $localForage, uuid4, opiConstants) {

    function getDefault() {
      return getOrCreateInstance();
    }

    function getInstanceName(name) {
      if (name) {
        return opiConstants.opiScheme + '-' + name;
      }
      return opiConstants.opiScheme;
    }

    function createInstance(name, options) {
      options = options || {};
      options.name = getInstanceName(name);
      return $localForage.createInstance(options);
    }

    function getInstance(name) {
      return $localForage.instance(getInstanceName(name));
    }

    function getOrCreateInstance(name, options) {
      options = options || {};
      var instance;

      try {
        instance = getInstance(name);
      } catch (Error) {
        instance = createInstance(name, options);
      }
      return instance;
    }

    function setItemWithUuidKey(localForageInstance, value) {
      if (!localForageInstance) {
        return $q.reject(new Error('localForageInstance parameter is undefined'));
      }
      if (!value) {
        value = {};
      }
      value._id = uuid4.generate();
      return localForageInstance.setItem(value._id, value);
    }

    return {
      getDefault: getDefault,
      getInstanceName: getInstanceName,
      createInstance: createInstance,
      getInstance: getInstance,
      getOrCreateInstance: getOrCreateInstance,
      setItemWithUuidKey: setItemWithUuidKey
    };
  });