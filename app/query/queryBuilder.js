(function () {
    'use strict';

    angular.module('map.query')
        .factory('QueryBuilder', QueryBuilder);

    QueryBuilder.$inject = [];

    function QueryBuilder() {

        function QueryBuilder() {
            this.source = [];
            this.queryString = "";
        }

        QueryBuilder.prototype = {

            add: function (q) {
                this.queryString += q + " AND ";
            },

            setSource: function (source) {
                this.source = source;
            },

            build: function () {
                if (this.queryString.trim().length === 0) {
                    this.queryString = "*";
                }
		// remove trailing AND at end of string if it is there
		this.queryString = this.queryString.replace(/\ AND $/, '')
                return new Query(this.queryString , this.source);
            }
        };

        return QueryBuilder;

        function Query(queryString, source) {
            this.q = queryString;
            this.source = source;
        }
    }

})();
