'use strict';

angular.module('monitorSocial.mandoSocial', ['ngRoute', 'ngStorage', 'cgBusy'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/mandoSocial', {
        templateUrl: 'modulos/mandoSocial/mandoSocial.html',
        controller: 'MandoSocialCtrl',
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

.controller('MandoSocialCtrl', ['$scope', '$localStorage', '$location', '$http', '$interval', function ($scope, $localStorage, $location, $http, $interval) {
    //CUENTA UNREAD DE TWITTER
    $scope.twitter = {
        unreads: undefined,
        count: 0
    };
    
    $scope.stop = function() {
        $interval.cancel(unread);
        $interval.cancel(positive);
        $interval.cancel(neutral);
        $interval.cancel(negative);
    };
    
    $scope.$on('$destroy', function() {
      $scope.stop();
    });

    function getUnreadMessages() {
        $scope.tUnreadPromise = $http({
            method: 'GET',
            url: 'https://monitorsocial-back.herokuapp.com/twitter/' + $localStorage.userInfo.id + '/unreadMessages',
            //url: 'http://localhost:8081/twitter/' + $localStorage.userInfo.id + '/unreadMessages',
            headers: {
                "Authorization": $localStorage.userInfo !== undefined ? $localStorage.userInfo.accessToken : null
            }
        }).then(function successCallback(response) {
            $scope.twitter.unreads = response.data.mensajes;
            $scope.twitter.count = response.data.count;
        }, function errorCallback(response) {

        })
    };
    getUnreadMessages();
    var unread = $interval(getUnreadMessages, 1 * 60 * 1000);

    //CUENTA UNREAD DE FACEBOOK
    $scope.facebook = {
        unreads: undefined,
        count: 0
    };
    /*$scope.tUnreadPromise = $http({
        method: 'GET',
        url: 'http://localhost:8081/twitter/' + $localStorage.userInfo.id + '/unreadMessages',
        headers: {
            "Authorization": $localStorage.userInfo !== undefined ? $localStorage.userInfo.accessToken : null
        }
    }).then(function successCallback(response) {
        $scope.twitter.unreads = response.data;
        $scope.twitter.count = response.data.length;
    }, function errorCallback(response) {

    });*/

    //CUENTA UNREAD DE POSITIVOS
    $scope.positivos = {
        unreads: undefined
    };

    function getPositive() {
        $scope.posUnreadPromise = $http({
            method: 'GET',
            url: 'https://monitorsocial-back.herokuapp.com/twitter/' + $localStorage.userInfo.id + '/positiveMessages',
            //url: 'http://localhost:8081/twitter/' + $localStorage.userInfo.id + '/positiveMessages',
            headers: {
                "Authorization": $localStorage.userInfo !== undefined ? $localStorage.userInfo.accessToken : null
            }
        }).then(function successCallback(response) {
            $scope.positivos.unreads = response.data.mensajes;
            //$scope.positivos.count = response.data.count;
        }, function errorCallback(response) {

        })
    };
    getPositive();
    var positive = $interval(getPositive, 1 * 60 * 1000);

    //CUENTA UNREAD DE NEGATIVOS
    $scope.negativos = {
        unreads: undefined,
        count: 0
    };

    function getNegative() {
        $scope.negUnreadPromise = $http({
            method: 'GET',
            url: 'https://monitorsocial-back.herokuapp.com/twitter/' + $localStorage.userInfo.id + '/negativeMessages',
            //url: 'http://localhost:8081/twitter/' + $localStorage.userInfo.id + '/negativeMessages',
            headers: {
                "Authorization": $localStorage.userInfo !== undefined ? $localStorage.userInfo.accessToken : null
            }
        }).then(function successCallback(response) {
            $scope.negativos.unreads = response.data.mensajes;
            $scope.negativos.count = response.data.count;
        }, function errorCallback(response) {

        })
    };
    getNegative();
    var negative = $interval(getNegative, 1 * 60 * 1000);

    //CUENTA UNREAD DE NEUTRALES
    $scope.neutrales = {
        unreads: undefined,
        count: 0
    };

    function getNeutral() {
        $scope.neutUnreadPromise = $http({
            method: 'GET',
            url: 'https://monitorsocial-back.herokuapp.com/twitter/' + $localStorage.userInfo.id + '/neutralMessages',
            //url: 'http://localhost:8081/twitter/' + $localStorage.userInfo.id + '/neutralMessages',
            headers: {
                "Authorization": $localStorage.userInfo !== undefined ? $localStorage.userInfo.accessToken : null
            }
        }).then(function successCallback(response) {
            $scope.neutrales.unreads = response.data.mensajes;
            $scope.neutrales.count = response.data.count;
        }, function errorCallback(response) {

        })
    };
    getNeutral();
    var neutral = $interval(getNeutral, 1 * 60 * 1000);

    //BARRA DE HERRAMIENTAS PROVISIONAL
    $scope.startListening = function () {
        var accessToken = $localStorage.userInfo !== undefined ? $localStorage.userInfo.accessToken : null;
        $http({
            method: 'GET',
            url: 'https://monitorsocial-back.herokuapp.com/twitter/' + $localStorage.userInfo.id + '/startListening',
            //url: 'http://localhost:8081/twitter/' + $localStorage.userInfo.id + '/startListening',
            headers: {
                "Authorization": accessToken
            }
        }).then(function successCallback(response) {
            $scope.success = response.data;
        }, function errorCallback(response) {
            $scope.error = response.data;
        });
    };

    $scope.stopListening = function () {
        var accessToken = $localStorage.userInfo !== undefined ? $localStorage.userInfo.accessToken : null;
        $http({
            method: 'GET',
            url: 'https://monitorsocial-back.herokuapp.com/twitter/' + $localStorage.userInfo.id + '/stopListening',
            //url: 'http://localhost:8081/twitter/' + $localStorage.userInfo.id + '/stopListening',
            headers: {
                "Authorization": accessToken
            }
        }).then(function successCallback(response) {
            $scope.success = response.data;
        }, function errorCallback(response) {
            $scope.error = response.data;
        });
    };
}]);