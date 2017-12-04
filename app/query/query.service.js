/**
 * query.service.js
 * Structures the query request to ppo-data-service
 */
(function () {
    'use strict';

    angular.module('map.query')
        .factory('queryService', queryService);

    queryService.$inject = ['$http', '$window', 'queryMap', 'queryResults', 'alerts', '$q'];

    function queryService($http, $window,  queryMap, queryResults, alerts, $q ) {

        var queryService = {
            queryJson: queryJson,
            downloadExcel: downloadExcel,
            downloadKml: downloadKml,
            downloadCsv: downloadCsv,
            downloadFasta: downloadFasta,
            downloadFastq: downloadFastq
        };

        return queryService;

	function queryLooper(query,from,size,source) {
                 //   alerts.removeTmp();
		//q=year:2012%20AND%20genus:Quercus%20AND%20plantStructurePresenceTypes:"obo:PPO_0002324"
		//+plantStructurePresenceTypes:"obo:PPO_0002324"=undefined&+genus:Abies=undefined
	   	//var query = "q=genus:Quercus";
		    // remove all alerts
	  		var a = alerts.getAlerts();
                        for (var i = 0; i < a.length; i++) { alerts.remove(a[i]); }	
                    var url = "http://www.dev.plantphenology.org/api/_search?from=" + from + "&size=" + size + "&_source=" + encodeURIComponent(source); 
		    alerts.info("Loading results ...");
		    console.log(url+JSON.stringify(query))
            	    return $http({
                	method: 'GET',
                	url: url,
                	params: query,
                	keepJson: true
            	     }).then(queryJsonComplete);

 	           function queryJsonComplete(response) {
			// Removing the loading alert
                        var a = alerts.getAlerts();
         		for (var i = 0; i < a.length; i++) {
                       	     if (a[i].msg === 'Loading results ...') {
                                  alerts.remove(a[i]);
                             }
                        }
			// Initialize the results array
                	var results = {
                    		size: 0,
                    		totalElements: 0,
                    		data: []
                	};

                	if (response.data) {
			    // Found elements is total possible results returned by ES
	             	    results.foundElements = response.data.hits.total;

			    // if the number of elements in result set is larger than the "size" then constrain variables 
			    // accordingly.  Uses ES max record limit of 10,000
                            if (results.foundElements > size) {
                                alerts.info(results.foundElements +" total matches to query. Returned results limited to " + size)
                    	        results.size = size
	             	    	results.totalElements = size
                            } else {
                    	        results.size = results.foundElements;
	             	    	results.totalElements = results.foundElements;
			    }

                            if (results.foundElements == 0) {
                                alerts.info("No results found.")
                            }

                            results.data = response.data.hits.hits;
                	}

                	return results;
            	}

	}

	    
	// Manage the query to provider
        function queryJson(query, page, source) {
 	        var from = 0;
	        //var size = 2000;
	        var size = 10000;
	        //var maxRecords = 10000;
	        var maxRecords = 10000;
		
		// TODO: write an elasticsearch query client that can fetch more than 10,000 records using "scroll"
		// for now, am using the "queryLooper" function which was designed to loop through successive queries.
		// the "scroll" function, howerver, works differently
                return queryLooper(query, 0, maxRecords, source);
	}

        function downloadExcel(query) {
            download("excel", query);
        }

        function downloadKml(query) {
            download("kml", query);
        }

        function downloadCsv(query) {
            download("csv", query);
        }

        function downloadFasta(query) {
            download("fasta", query);
        }

        function downloadFastq(query) {
            download("fastq", query);
        }

        function download(path, query) {
            return $http({
                method: 'GET',
                url: REST_ROOT + "projects/query/" + path,
                params: query,
                keepJson: true
            })
                .then(downloadFile)
                .catch(downloadFileFailed);
        }

        function downloadFile(response) {
            if (response.status == 204) {
                alerts.info("No results found.");
                return
            }

            $window.open(response.data.url);
        }

        function downloadFileFailed(response) {
            alerts.info("Failed downloading file!");
        }
    }
})();
