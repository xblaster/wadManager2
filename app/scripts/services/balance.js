'use strict';

angular.module('v9App')
  .service('BalanceService', function Balance($http) {
    	return {
    		get: function(year, month) {
    			return $http.get('/rest/balanceentry/finder/findForMonth?limit=500&year='+year+'&month='+month);
    		}
    	}
  });
