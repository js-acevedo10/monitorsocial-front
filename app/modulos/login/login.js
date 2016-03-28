'use strict';

angular.module('monitorSocial.login', ['ngRoute', 'ngStorage', 'base64'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'modulos/login/login.html',
            controller: 'LoginCtrl',
            resolve: {
                "logged": ['$localStorage', '$location', function ($localStorage, $location) {
                    if ($localStorage.userInfo === null || $localStorage.userInfo === undefined) {
                        return true;
                    } else {
                        $location.path("/home");
                        return false;
                    }
                }]
            }
        });
    }])
    .controller('LoginCtrl', ['$scope', '$base64', '$http', '$localStorage', '$location', function ($scope, $base64, $http, $localStorage, $location) {
        $scope.loginForm = {
            email: "",
            password: ""
        };
        $scope.login = function () {
            $scope.loginForm.password = $base64.encode($scope.loginForm.password);
            $scope.loginPrms = $http({
                method: 'POST',
                url: 'https://monitorsocial-back.herokuapp.com/auth',
                //url: 'http://localhost:8081/auth',
                data: {
                    email: $scope.loginForm.email,
                    password: $scope.loginForm.password
                }
            }).then(function successCallback(response) {
                $localStorage.userInfo = response.data;
            }, function errorCallback(response) {
                console.log("LOGIN: " + angular.toJson(response.data));
            }).finally(function () {
                $scope.loginForm.password = "";
                if($localStorage.userInfo !== null && $localStorage.userInfo !== undefined) {
                    $location.path("/home");
                }
            });
        };
    }]);