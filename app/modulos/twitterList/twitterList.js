'use strict';

angular.module('monitorSocial.twitterList', ['ngRoute', 'ngStorage', 'cgBusy'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/tUnreadList', {
        templateUrl: 'modulos/twitterList/twitterList.html',
        controller: 'TwitterListCtrl',
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

.controller('TwitterListCtrl', ['$scope', '$localStorage', '$location', '$http', '$interval', function ($scope, $localStorage, $location, $http, $interval) {
    $scope.twitter = {
        count: 0,
        mensajes: undefined
    };
    function loadTwitterMensajes() {
        $scope.unreadPromise = $http({
            method: 'GET',
            url: 'https://monitorsocial-back.herokuapp.com/twitter/' + $localStorage.userInfo.id + '/unreadMessages',
            //url: 'http://localhost:8081/twitter/' + $localStorage.userInfo.id + '/unreadMessages',
            headers: {
                "Authorization": $localStorage.userInfo !== undefined ? $localStorage.userInfo.accessToken : null
            }
        }).then(function successCallback(response) {
            $scope.twitter.mensajes = response.data.mensajes;
            $scope.twitter.count = response.data.count;
        }, function errorCallback(response) {

        })
    };
    loadTwitterMensajes();
    //$interval(readFromTwitter, 1 * 60 * 1000);
}]);