'use strict';

angular.module('v9App')
  .controller('MainCtrl', function ($scope, $http, BalanceService, $routeParams, $location) {

    $scope.moment = moment;

    //fetch persons
    $scope.refresh = function() {
        $http.get('/rest/person/').success(function(data) {
            $scope.data = data
        });
    }


    $scope.removePerson = function(id) {
        if (confirm("are you sure ?")) {
            $http.delete('/rest/person/'+id).success(function(data) {
                $scope.refresh();
            });
        }
    }

    $scope.refresh();
  });

