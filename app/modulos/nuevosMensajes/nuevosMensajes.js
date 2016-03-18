'use strict';

angular.module('monitorSocial.nuevosMensajes', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/read/new', {
    templateUrl: 'modulos/nuevosMensajes/nuevosMensajes.html',
    controller: 'NuevosMensajesCtrl'
  });
}])

.controller('NuevosMensajesCtrl', [function() {

}]);