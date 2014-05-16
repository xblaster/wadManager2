'use strict';

angular.module('v9App')
  .service('TeamService', function TeamService($http) {
    	return {
    		get: function() {
    			return $http.get('/dummyservice/teams')
    		}
    	}
  });
