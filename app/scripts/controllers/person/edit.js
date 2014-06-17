'use strict';

angular.module('v9App')
  .controller('PersonEditCtrl', function ($scope, $http, $routeParams, $window) {

        $scope.person = {};
        $scope.person.projects = $scope.person.projects || [];

        if ($routeParams.personId) {
            $http.get('/rest/person/'+$routeParams.personId).success(function(person) {
                $scope.person = person.payload;
                $scope.person.projects = $scope.person.projects || [];
            });
        }

        $scope.addProject = function() {
            $scope.person.projects.push({});
        }

        $scope.save = function(elt) {
            $scope.saveInProgress = true;

            $http.post('/person/save', elt).success(function() {
                $scope.saveInProgress = false;
                $window.history.back();
            });
        }

        $scope.removeProject = function(index) {
            $scope.person.projects.splice(index, 1);
        }
  });
