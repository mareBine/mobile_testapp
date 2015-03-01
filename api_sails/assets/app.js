angular.module('myApp', ['ng-admin'])
    .config(function (NgAdminConfigurationProvider, Application, Entity, Field, Reference, ReferencedList, ReferenceMany, $stateProvider, RestangularProvider) {

        // overridaš default obnašanje REST parametrov; glej API-mapping.md
        // tukaj sem nastavil tako kot ima sails blueprint
        RestangularProvider.addFullRequestInterceptor(function (element, operation, what, url, headers, params, httpConfig) {
            if (operation == 'getList' /*&& what == 'entityName'*/) {
                params.skip = (params._page - 1) * params._perPage;
                params.limit = params._perPage;
                params.sort = params._sortField + ' ' + params._sortDir;
                //params.page = params._page;
                delete params._page;
                delete params._perPage;
                delete params._sortField;
                delete params._sortDir;
            }
            return { params: params };
        });

        // tole je za sparsat total number of results, ki ga rabi za paginacijo
        // https://github.com/marmelab/ng-admin/blob/master/doc/API-mapping.md#total-number-of-results
        // VENDAR: sails blueprint default ne vrača tega headerja
        // REŠITEV: custom find.js v /api/blueprints, ki zna vračat ta header
        RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response) {
            if (operation == "getList") {
                var contentRange = response.headers('Content-Range');
                response.totalCount = contentRange.split('/')[1];
            }
            return data;
        });

        // Create a new route for a custom page
        $stateProvider
            .state('custom', {
                parent: 'main',
                url: '/custom',
                controller: 'NewPageController',
                controllerAs: 'listController',
                template: '<h1>{{ title }}</h1>' +
                    '<a ng-click="goToDashboard()">Go to dashboard</a>'
            });

        // custom f. za truncate
        function truncate(value) {
            if (!value) {
                return '';
            }
            return value.length > 50 ? value.substr(0, 50) + '...' : value;
        }

        // set the main API endpoint for this admin
        var app = new Application('CRUD testiranje')
            .baseApiUrl('http://127.0.0.1:1337/api/');

        // define an entity mapped by the http://localhost:3000/posts endpoint
        var user = new Entity('user')
//                .identifier(new Field('id')) // you can optionally customize the identifier used in the api ('id' by default)
//            .url(function(view, entityId) {
//                return 'user/142'; // Can be absolute or relative
//            })
            ;

        // dodaš glavno entiteto
        app.addEntity(user);

        // vsako menijsko postavko lahko customiziraš
        user.menuView().icon('<span class="glyphicon glyphicon-file"></span>');

        // dashboard pogled, ko se prijaviš
        user.dashboardView()
            .title('Uporabniki')
            .order(1) // display the post panel first in the dashboard
            .limit(5) // limit the panel to the 5 latest posts
            // fields() called with arguments add fields to the view
            .fields([
                new Field('username').isDetailLink(true).map(truncate),
                new Field('createdAt').type('date'),
                new Field('updatedAt').type('date')
            ]);

        // list pogled (index)
        user.listView()
            .title('Vsi uporabniki') // default title is "[Entity_name] list"
            .description('List of posts with infinite pagination') // description appears under the title
            .infinitePagination(true) // load pages as the user scrolls
            .perPage(10)
            .fields([
                new Field('id').label('ID').isDetailLink(false), // The default displayed name is the camelCase field name. label() overrides id
                user.dashboardView().fields()
            ])
            .listActions(['show', 'edit', 'delete']);

        // add pogled (dodajanje)
        user.creationView()
            .title('Kreiranje')
            .fields([
                //new Field('title') // the default edit field type is "string", and displays as a text input
                //     .attributes({ placeholder: 'the post title' }) // you can add custom attributes, too
                //     .validation({ required: true, minlength: 3, maxlength: 100 }), // add validation rules for fields
                new Field('username', 'text'), // text field type translates to a textarea
                new Field('password', 'test') // text field type translates to a textarea
            ]);

        user.editionView()
            .title('Uredi "{{ entry.values.username }}"') // title() accepts a template string, which has access to the entry
            .actions(['list', 'create', 'delete']) // choose which buttons appear in the top action bar. Show is disabled by default
            .fields([
                user.creationView().fields() // fields() without arguments returns the list of fields. That way you can reuse fields from another view to avoid repetition
            ]);

        user.showView() // a showView displays one entry in full page - allows to display more data than in a a list
            .fields([
                //new Field('id'),
                user.creationView().fields(), // reuse fields from another view in another order
                new Field('custom_action', 'template')
                    .template('<other-page-link></other-link-link>')
            ]);

        NgAdminConfigurationProvider.configure(app);
    })

    // main controller
    .controller('main', function ($scope, $rootScope, $location, $log) {
        $rootScope.$on('$stateChangeSuccess', function () {
            $scope.displayBanner = $location.$$path === '/dashboard';
        });
    })

    // controller za custom page
    .controller('NewPageController', function ($scope, $location) {
        $scope.title = 'Custom page';

        $scope.goToDashboard = function () {
            $location.path('dashboard');
        };
    })

    // direktiva za izris custom linka
    .directive('otherPageLink', ['$location', function ($location) {
        return {
            restrict: 'E',
            scope: true,
            template: '<p class="form-control-static"><a ng-click="changePage()">Change page</a></p>',
            link: function ($scope) {
                $scope.changePage = function () {
                    $location.path('/new-page');
                };
            }
        };
    }]);