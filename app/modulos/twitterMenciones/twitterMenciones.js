'use strict';

angular.module('monitorSocial.twitterMenciones', ['ngRoute', 'ngStorage', 'cgBusy'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/menciones/:tipo', {
            templateUrl: 'modulos/twitterMenciones/twitterMenciones.html',
            controller: 'TwitterMencionesCtrl',
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
    .controller('TwitterMencionesCtrl', ['$scope', '$localStorage', '$location', '$http', '$interval', '$routeParams', function ($scope, $localStorage, $location, $http, $interval, $routeParams) {
        var tipoMenciones = 'unreadMessages';
        if ($routeParams.tipo == 'positiva') {
            tipoMenciones = 'positiveMessages';
        } else if ($routeParams.tipo == 'negativa') {
            tipoMenciones = 'negativeMessages';
        } else if ($routeParams.tipo == 'neutral') {
            tipoMenciones = 'neutralMessages';
        }
        $scope.mencionesPromise = $http({
            method: 'GET',
            url: 'https://monitorsocial-back.herokuapp.com/twitter/' + $localStorage.userInfo.id + '/' + tipoMenciones,
            //url: 'http://localhost:8081/twitter/' + $localStorage.userInfo.id + '/unreadMessages',
            headers: {
                "Authorization": $localStorage.userInfo !== undefined ? $localStorage.userInfo.accessToken : null
            }
        }).then(function successCallback(response) {
            $scope.menciones = response.data.mensajes;
        }, function errorCallback(response) {
            if (response.status == 404) {
                $scope.error = 'No se encontró ninguna mención ' + $routeParams.tipo;
            }
        });

        $scope.getSentimiento = function (sentimiento) {
            if (sentimiento == 5) {
                return 'Neutral';
            } else if (sentimiento < 5) {
                return 'Negativo';
            } else {
                return 'Positivo';
            }
        }
        $scope.calcMaxLength = function (nomUsuario) {
            return 140 - (nomUsuario.length + 1);
        }

        $scope.sort = 'createdAt';

        $scope.eliminarMencion = function (mencion)  {
            var accessToken = $localStorage.userInfo !== undefined ? $localStorage.userInfo.accessToken : null;
            $http({
                method: 'PUT',
                url: 'https://monitorsocial-back.herokuapp.com/twitter/' + $localStorage.userInfo.id + '/menciones/' + mencion.id.$oid,
                //url: 'http://localhost:8081/twitter/' + $localStorage.userInfo.id + '/stopListening',
                headers: {
                    "Authorization": accessToken
                }
            }).then(function successCallback(response) {
                $scope.menciones.delete(mencion);
                $scope.success = response.data;
            }, function errorCallback(response) {
                $scope.error = response.data;
            });
        }
    }]);