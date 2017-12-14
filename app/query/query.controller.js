(function () {
    'use strict';

    angular.module('map.query')
        .controller('QueryController', QueryController);

    QueryController.$inject = ['$scope', 'queryParams', 'queryResults', 'queryService', 'queryMap', 'alerts'];

    function QueryController($scope, queryParams, queryResults, queryService,queryMap, alerts) {


        var vm = this;

        vm.alerts = alerts;
        vm.queryResults = queryResults;

        vm.showSidebar = true;
        vm.showMap = true;
        vm.sidebarToggleToolTip = "hide sidebar";

        vm.queryMap = queryMap;
        vm.invalidSize = false;

        activate();

	// downloadCSV file
        vm.downloadCsv = function () {
            queryService.downloadCsv(queryParams.build())
        }; 

        function activate() {
            queryParams.clear();
            queryResults.clear();
        }

        $scope.$watch('vm.showSidebar', function () {
            if (vm.showSidebar) {
                vm.sidebarToggleToolTip = "hide sidebar";
            } else {
                vm.sidebarToggleToolTip = "show sidebar";
            }
        });

        $scope.$watch('vm.showSidebar', updateMapSize);
        $scope.$watch('vm.showMap', updateMapSize);

        function updateMapSize(newVal, oldVal) {
            if (newVal != oldVal) {
                vm.invalidSize = true;
            }
        }
    }

})();
