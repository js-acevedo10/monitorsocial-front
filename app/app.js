'use strict';

// Declare app level module which depends on views, and components
angular.module('monitorSocial', [
    'ngRoute',
    'ngStorage',
    'monitorSocial.mandoSocial',
    'monitorSocial.twitterList',
    'monitorSocial.incidencias',
    'monitorSocial.incidencia',
    'monitorSocial.login'
]).
config(['$routeProvider', function ($routeProvider) {
    $routeProvider.otherwise({
        redirectTo: '/mandoSocial'
    });
}])
.controller('IndexCtrl', ['$scope', '$localStorage', '$location', function ($scope, $localStorage, $location) {
    $scope.$storage = $localStorage;
    $scope.logOut = function () {
        delete $localStorage.userInfo;
        $location.path("/login");
    };
}]);