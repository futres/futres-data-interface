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

        return new QueryMap('decimalLatitude', 'decimalLongitude');

	function generatePopupContent(resource) {
        var source = ""
        if (resource._source.projectId == "Vertnet") {
           source = "Vertnet" 
        } else {
            source = "<a href='https://geome-db.org/workbench/project-overview?projectId=" + resource._source.projectId +"' target='_blank'>GEOME</a>";
        }
            return "<strong>Scientific Name</strong>:  " + resource._source.scientificName + "<br>" +
                "<strong>Year Collected</strong>:  " + resource._source.yearCollected + "<br>" +
                "<strong>Trait</strong>:  " + resource._source.measurementType + "<br>" +
                "<strong>Source</strong>:  " + source + "<br>";
        }
    }
})();
