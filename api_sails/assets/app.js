angular.module('myApp', ['ng-admin'])
    .config(function (NgAdminConfigurationProvider, Application, Entity, Field, Reference,
                      ReferencedList, ReferenceMany, $stateProvider) {

        // Create a new route for a custom page
        $stateProvider
            .state('new-page', {
                parent: 'main',
                url: '/new-page',
                controller: 'NewPageController',
                controllerAs: 'listController',
                template: '<h1>{{ title }}</h1><a ng-click="goToDashboard()">Go to dashboard</a>'
            });

        function truncate(value) {
            if (!value) {
                return '';
            }

            return value.length > 50 ? value.substr(0, 50) + '...' : value;
        }

        // set the main API endpoint for this admin
        var app = new Application('My backend')
            .baseApiUrl('http://127.0.0.1/');

        // define an entity mapped by the http://localhost:3000/posts endpoint
        var post = new Entity('user')
            .identifier(new Field('id')); // you can optionally customize the identifier used in the api ('id' by default)


        // set the list of fields to map in each post view

        // customize the entity menu icon
        post.menuView()
            .icon('<span class="glyphicon glyphicon-file"></span>');

        // customize the dashboard panel for this entity
        post.dashboardView()
            .title('Uporabniki')
            .order(1) // display the post panel first in the dashboard
            .limit(5) // limit the panel to the 5 latest posts
            .fields([new Field('username').isDetailLink(true).map(truncate)]); // fields() called with arguments add fields to the view

        post.listView()
            .title('Vsi uporabniki') // default title is "[Entity_name] list"
            .description('List of posts with infinite pagination') // description appears under the title
            .infinitePagination(true) // load pages as the user scrolls
            .fields([
                new Field('id').label('ID'), // The default displayed name is the camelCase field name. label() overrides id
                new Field('username'), // the default list field type is "string", and displays as a string
                new Field('createdAt').type('date'), // Date field type allows date formatting
            ])
            .listActions(['show', 'edit', 'delete']);

        NgAdminConfigurationProvider.configure(app);
    })

    .controller('main', function ($scope, $rootScope, $location) {
        $rootScope.$on('$stateChangeSuccess', function () {
            $scope.displayBanner = $location.$$path === '/dashboard';
        });
    })

    .controller('NewPageController', function ($scope, $location) {
        $scope.title = 'Custom page';

        $scope.goToDashboard = function () {
            $location.path('dashboard');
        };
    });