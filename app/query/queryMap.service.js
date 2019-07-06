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
            return "<strong>Genus</strong>:  " + resource._source.genus + "<br>" +
                "<strong>Species</strong>:  " + resource._source.specificEpithet+ "<br>" +
                "<strong>Year</strong>:  " + resource._source.year + "<br>" +
                "<strong>DayOfYear</strong>:  " + resource._source.dayOfYear+ "<br>" +
                "<strong>Source</strong>:  " + resource._source.source + "<br>" +
                "<strong>subSource</strong>:  " + resource._source.subSource + "<br>";
        }
    }
})();
