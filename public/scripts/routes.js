angular.module('appRoutes', [])
    .config(['$routeProvider', '$locationProvider', '$provide', ($routeProvider, $locationProvider, $provide) => {
        $provide.decorator('$sniffer', function($delegate) {
            $delegate.history = false;
            return $delegate;
        })

        $routeProvider.when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeController',
            resolve: {
                printers: function($printers) {
                    return $printers.get();
                },
                locations: function($locations) {
                    return $locations.get();
                }
            }
        }).when('/404', {
            templateUrl: 'views/error.html'
        }).otherwise({
            redirectTo: '/404'
        })

        $locationProvider.html5Mode({
            requireBase: false,
            enabled: true,
            hashPrefix: '!'
        })
}])
