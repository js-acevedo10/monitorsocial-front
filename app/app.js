'use strict';

// Declare app level module which depends on views, and components
angular.module('monitorSocial', [
    'ngRoute',
    'monitorSocial.nuevosMensajes',
    'monitorSocial.home'
]).
config(['$routeProvider', function ($routeProvider) {
    $routeProvider.otherwise({
        redirectTo: '/home'
    });
}]);