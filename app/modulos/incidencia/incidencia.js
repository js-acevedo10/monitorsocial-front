'use strict';

angular.module('monitorSocial.incidencia', ['ngRoute', 'ngStorage', 'cgBusy'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/incidencia/:idCaso', {
        templateUrl: 'modulos/incidencia/incidencia.html',
        controller: 'IncidenciaCtrl',
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

.controller('IncidenciaCtrl', ['$scope', '$localStorage', '$location', '$http', '$routeParams', function ($scope, $localStorage, $location, $http, $routeParams) {
    
    $scope.responderActivado = false;
    //NAVBAR PILLS
    $scope.nav = {
        res: true,
        not: false,
        seg: false,
        sol: false
    };
    //NAVBAR METHODS
    $scope.enableRes = function () {
        $scope.nav.res = true;
        $scope.nav.not = false;
        $scope.nav.seg = false;
        $scope.nav.sol = false;
    }
    $scope.enableNot = function () {
        $scope.nav.res = false;
        $scope.nav.not = true;
        $scope.nav.seg = false;
        $scope.nav.sol = false;
    };
    $scope.enableSeg = function () {
        $scope.nav.res = false;
        $scope.nav.not = false;
        $scope.nav.seg = true;
        $scope.nav.sol = false;
    };
    $scope.enableSol = function () {
        $scope.nav.res = false;
        $scope.nav.not = false;
        $scope.nav.seg = false;
        $scope.nav.sol = true;
    };
    $scope.casos = {};
    $scope.casoPromise = $http({
        method: 'GET',
        //url: 'https://monitorsocial-back.herokuapp.com/casos/' + $localStorage.userInfo.id + /caso/ + $routeParams.idCaso,
        url: 'http://localhost:8081/casos/' + $localStorage.userInfo.id + /caso/ + $routeParams.idCaso,
        headers: {
            "Authorization": $localStorage.userInfo !== undefined ? $localStorage.userInfo.accessToken : null
        }
    }).then(function successCallback(response) {
        $scope.caso = response.data;
        $scope.casoPromise = $http({
            method: 'GET',
            //url: 'https://monitorsocial-back.herokuapp.com/twitterUsers/' + $scope.caso.twitterUserId,
            url: 'http://localhost:8081/twitterUsers/' + $scope.caso.twitterUserId,
            headers: {
                "Authorization": $localStorage.userInfo !== undefined ? $localStorage.userInfo.accessToken : null
            }
        }).then(function succesCallback(response) {
            $scope.caso.twitterUser = response.data;
        }, function errorCallback(response) {

        });
    }, function errorCallback(respose) {

    });

    $scope.addNote = function () {
        $scope.notePromise = $http({
            method: 'POST',
            //url: 'https://monitorsocial-back.herokuapp.com/twitterUsers/' + $scope.caso.twitterUserId,
            url: 'http://localhost:8081/casos/' + $routeParams.idCaso + "/notas",
            data: angular.toJson({
                texto: $scope.nuevaNota,
                creadorId: "23414",
                nombreCreador: "Juan"
            }),
            headers: {
                "Authorization": $localStorage.userInfo !== undefined ? $localStorage.userInfo.accessToken : null
            }
        }).then(function succesCallback(response) {
            var user = $scope.caso.twitterUser;
            $scope.caso = response.data;
            $scope.caso.twitterUser = user;
            $scope.nuevaNota = "";
            $scope.notasError = false;
        }, function errorCallback(response) {
            $scope.notasError = true;
        });
    };
    
    $scope.postReply = function () {
        $scope.postreplyPromise = $http({
            method: 'POST',
            //url: 'https://monitorsocial-back.herokuapp.com/twitter/' + $localStorage.userInfo.id + "/reply"
            url: 'http://localhost:8081/twitter/' + $localStorage.userInfo.id + "/reply",
            data: angular.toJson({
                userScreenName: $scope.caso.twitterUser.screenName,
                text: $scope.respuestaTweet,
                statusId: $scope.caso.conversacion.mensajes[0].statusId,
                conversacionId: $scope.caso.conversacion.id.$oid
            }),
            headers: {
                "Authorization": $localStorage.userInfo !== undefined ? $localStorage.userInfo.accessToken : null
            }
        }).then(function succesCallback(response) {
            $scope.respuestaTweet = "";
            $scope.responderActivado = false;
            $scope.funciona = response.data;
        }, function errorCallback(response) {
            
        });
    };
}]);