'use strict';

angular.module('v9App')
  .service('BalanceService', function Balance() {
    	return {
    		get: function(year, month) {
    			return $http.get('/rest/balanceentry/finder/findForMonth',  {'year': year, 'month' : month})
    		}
    	}
  });
