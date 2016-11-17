(function () {
  'use strict'

  angular
    .module('bloodNetwork')
    .service('FindData', FindData);

  function FindData($http, $q) {
    var vm = this;

    return({
      someData: someData
    });

    // Get Data from server
    function someData() {
      var request = $http({
        method: "get",
        url: "",
        params: {
          action: "get"
        }
      });

      return (request.then(handleSuccess, handleError));
    }

    // Error response from Server
    function handleError(response) {
      if (
        !angular.isObject(response.data) ||
        !response.data.message
      ) {
        return ($q.reject("An unkown error occured."));
      }

      return ($q.reject(response.data.message));
    }

    // Success message from Server
    function handleSuccess(response) {
      return (response.data);
    }
  }
})();
