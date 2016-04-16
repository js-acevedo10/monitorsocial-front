'use strict';

angular.module('monitorSocial.incidencias', ['ngRoute', 'ngStorage', 'cgBusy'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/incidencias', {
        templateUrl: 'modulos/incidencias/incidencias.html',
        controller: 'IncidenciasListCtrl',
        resolve: {
            "logged": ['$localStorage', '$location', function ($localStorage, $location) {
                if ($localStorage.userInfo === null || $localStorage.userInfo === undefined) {
                    $location.path("/login");
                    return false;
                } else {
                    return true;
                }
            }]
        }
    });
}])

.controller('IncidenciasListCtrl', ['$scope', '$localStorage', '$location', '$http', '$interval', function ($scope, $localStorage, $location, $http, $interval) {
    $scope.error = false;
    $scope.casos = [];
    $scope.formatPrioridad = function(value) {
        if(value == 1) {
            return 'ALTA';
        } else if(value == 2) {
            return 'MEDIA';
        } else {
            return 'BAJA';
        }
    };
    $scope.formatCategoria = function (value) {
        if(value == 1) {
            return 'Soporte';
        } else if(value == 2) {
            return 'Queja';
        } else if(value == 3) {
            return 'Petición';
        } else if(value == 4) {
            return 'Reclamo';
        } else {
            return 'Otros';
        }
    };
    $scope.formatEstado = function (value) {
        if(value == 0) {
            return 'Registrada';
        } else if(value == 1) {
            return 'En Cola';
        } else if(value == 2) {
            return 'Investigando';
        } else if(value == 3) {
            return 'Esperando';
        } else if(value == 4) {
            return 'Resuelta';
        } else {
            return 'Confirmada';
        }
    };
    $scope.casosPromise = $http({
        method: 'GET',
        url: 'https://monitorsocial-back.herokuapp.com/casos/' + $localStorage.userInfo.id,
        //url: 'http://localhost:8081/casos/' + $localStorage.userInfo.id,
        headers: {
            "Authorization": $localStorage.userInfo !== undefined ? $localStorage.userInfo.accessToken : null
        }
    }).then(function successCallback(response) {
        $scope.casos = response.data;
        $scope.error = false;
    }, function errorCallback(respose) {
        $scope.error = true;
    });
}]);