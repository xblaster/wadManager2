'use strict';

angular.module('v9App')
  .controller('PersonEditCtrl', function ($scope, $http, $routeParams, $window) {


        $scope.tab = 'visit_report';
        $scope.moment = moment;
        $scope.person = {};
        $scope.person.projects = $scope.person.projects || [];

        if ($routeParams.personId) {
            $http.get('/rest/person/'+$routeParams.personId).success(function(person) {
                $scope.person = person.payload;
                $scope.person.projects = $scope.person.projects || [];
            });
        }
        $scope.addVisit =function(description) {
            $scope.person.content.visites.push({'date': new Date(), content: description});
            $scope.mode='not';
        }

        $scope.isFutureVisit= function(visit) {
            return moment(visit.date).isAfter(new Date());
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
