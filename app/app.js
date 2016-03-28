'use strict';

// Declare app level module which depends on views, and components
angular.module('monitorSocial', [
    'ngRoute',
    'ngStorage',
    'monitorSocial.home',
    'monitorSocial.login'
]).
config(['$routeProvider', function ($routeProvider) {
    $routeProvider.otherwise({
        redirectTo: '/home'
    });
}])
.controller('IndexCtrl', ['$scope', '$localStorage', '$location', function ($scope, $localStorage, $location) {
    $scope.$storage = $localStorage;
    $scope.logOut = function () {
        delete $localStorage.userInfo;
        $location.path("/login");
    };
}]);