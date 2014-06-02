'use strict';

angular.module('v9App')
  .controller('EntryAddCtrl', function ($scope, $http, $window) {
    /*$http.get('/api/awesomeThings').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });*/


  $scope.save = function(elt) {
  	$scope.saveInProgress = true;

  	elt.amount = elt.amount.replace(",",".");

  	$http.post('/entry/save', elt).success(function() {
      $scope.saveInProgress = false;
      $window.history.back();
    })
  }

  $('.datepicker').pickadate({
    monthsFull: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    today: 'aujourd\'hui',
    clear: 'effacer',
    format: 'yyyy/mm/dd',
    formatSubmit: 'yyyy/mm/dd'
  })

  });
