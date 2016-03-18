'use strict';

angular.module('monitorSocial.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'modulos/home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$scope', function($scope) {
    $scope.today = true;
    $scope.mensajes = {
        hoy: 0,
        facebook: 0,
        twitter: 0,
        positivos: 0,
        neutrales: 0,
        negativos: 0,
        relevante: '@JuanSantiagoAcev: Lorem ipsum dolor sit amet.'
    };
}]);