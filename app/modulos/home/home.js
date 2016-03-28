'use strict';

angular.module('monitorSocial.home', ['ngRoute', 'ngStorage', 'cgBusy'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/home', {
        templateUrl: 'modulos/home/home.html',
        controller: 'HomeCtrl',
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

.controller('HomeCtrl', ['$scope', '$localStorage', '$location', '$http', '$interval', function ($scope, $localStorage, $location, $http, $interval) {    
    //CUENTA UNREAD DE TWITTER
    $scope.twitter = {
        unreads: undefined,
        count: 0
    };
    function readFromTwitter() {
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

    })};
    readFromTwitter();
    $interval(readFromTwitter, 1 * 60 * 1000);
    
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
    
    //CUENTA UNREAD DE NEGATIVOS
    $scope.negativos = {
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
    
    //CUENTA UNREAD DE NEUTRALES
    $scope.neutrales = {
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

    //BARRA DE HERRAMIENTAS PROVISIONAL
    $scope.twitterListenerButton = "Start Listening on Twitter";
    $scope.listeningTwitter = false;
    $scope.startListening = function () {
        if (!$scope.listeningTwitter) {
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
                $scope.twitterListenerButton = "Stop Listening on Twitter";
                $scope.listeningTwitter = true;
            }, function errorCallback(response) {
                $scope.error = response.data;
            });
        } else {
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
                $scope.twitterListenerButton = "Start Listening on Twitter";
                $scope.listeningTwitter = false;
            }, function errorCallback(response) {
                $scope.error = response.data;
            });
        }
    };
}]);