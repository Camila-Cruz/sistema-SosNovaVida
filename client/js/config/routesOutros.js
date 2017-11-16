angular.module('novaVida').config( function( $routeProvider ) {
    $routeProvider.when('/config', {
        templateUrl: 'view/formConfig.html',
        controller: 'configController'
    });
    $routeProvider.when('/index', {
        templateUrl: 'view/inicio.html'
    });
    $routeProvider.when('/login', {
        templateUrl: 'view/login.html'
    });
    $routeProvider.otherwise({ redirectTo: '/index'});
});