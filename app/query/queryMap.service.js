(function () {
    'use strict';

    angular.module('map.query')
        .factory('queryMap', queryMap);

    queryMap.$inject = ['Map'];

    function queryMap(Map) {

        function QueryMap(latColumn, lngColumn) {
            Map.call(this, latColumn, lngColumn);
        }

        QueryMap.prototype = Object.create(Map.prototype);

        QueryMap.prototype.setMarkers = function (data, zoomTo) {
            Map.prototype.setMarkers.call(this, data, generatePopupContent, zoomTo);
        };

        QueryMap.prototype.addMarkers = function (data, zoomTo) {
            Map.prototype.addMarkers.call(this, data, generatePopupContent, zoomTo);
        };

        return new QueryMap('latitude', 'longitude');

	function generatePopupContent(resource) {
            return "<strong>ScientificName</strong>:  " + resource._source.scientificName + "<br>" +
                "<strong>Year</strong>:  " + resource._source.year + "<br>" +
                "<strong>Source</strong>:  " + resource._source.source + "<br>";
        }
    }
})();
