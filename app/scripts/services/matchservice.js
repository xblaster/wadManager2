'use strict';

angular.module('v9App')
  .service('Matchservice', function Matchservice() {
    	return {
    		get: function() {
    			return $http.get('/api/matchs/all')
    		}
    	}
  });
