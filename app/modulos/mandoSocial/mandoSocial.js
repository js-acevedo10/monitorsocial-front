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
    
    $scope.stop = function() {
        $interval.cancel(counters);
    };
    
    $scope.$on('$destroy', function() {
      $scope.stop();
    });

    //CUENTA UNREAD DE TWITTER
    $scope.twitter = {
        unreadCount: 0,
        positiveCount: 0,
        neutralCount: 0,
        negativeCount: 0
    };
    
    function getUnreadMessages() {
        $scope.tUnreadPromise = $http({
            method: 'GET',
            url: 'https://monitorsocial-back.herokuapp.com/twitter/' + $localStorage.userInfo.id + '/messageCount',
            //url: 'http://localhost:8081/twitter/' + $localStorage.userInfo.id + '/messageCount',
            headers: {
                "Authorization": $localStorage.userInfo !== undefined ? $localStorage.userInfo.accessToken : null
            }
        }).then(function successCallback(response) {
            var r = response.data;
            $scope.twitter.unreadCount = r.unreadCount;
            $scope.twitter.positiveCount = r.positiveCount;
            $scope.twitter.neutralCount = r.neutralCount;
            $scope.twitter.negativeCount = r.negativeCount;
            
        }, function errorCallback(response) {

        })
    };
    getUnreadMessages();
    var counters = $interval(getUnreadMessages, 1 * 5 * 3600);

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