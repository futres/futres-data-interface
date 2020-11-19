(function (angular) {
    'use strict';
    var app = angular.module('map.query');
    app.controller('QueryFormController', QueryFormController);
    app.$inject = [  '$http', '$scope', 'ui-bootstrap', 'queryParams', 'queryService', 'queryMap', 'queryResults', 'usSpinnerService', 'alerts', '$sce'];
    function QueryFormController($http, $scope, queryParams, queryService, queryMap, queryResults, usSpinnerService, alerts, $sce) {
 
     	// toggle download modal dialog
        $scope.downloadModalShown = false;
        $scope.toggleDownloadModal = function() { 
	    // Before showing the download modal, decide if we should show
	    // the verification text or not, PEP725 data cannot be downloaded now
	   if ($scope.hasPEP725Data) {
	       $scope.verificationStep = true
	       $scope.downloadButtonShown = false
	   } else {
	       $scope.verificationStep = false
	       $scope.downloadButtonShown = true
 	   }
            $scope.downloadModalShown = !$scope.downloadModalShown; 
        };

        $scope.hasPEP725Data = false;

        // toggle modal dialog
        $scope.modalShown = false;
        $scope.toggleModal = function(modalType) { 
	    $scope.modalType = modalType
	    if (modalType == "Traits") {
			$scope.modalText= $sce.trustAsHtml("The traits listed here are derived from the Futres Ontology for Vertebrate Traits (FOVT).");
	    } else if (modalType == "ScientificName") {
            	$scope.modalText = $sce.trustAsHtml("Current browsers will enable autocompletion of scientific names when you begin to type. The list of scientific names here are drawn from the list of names that have been identified from source datasets.");	   
	    } else if (modalType == "Source") {
            	$scope.modalText = $sce.trustAsHtml("Data Sources include those from VertNet and GEOME.  GEOME datasets only include those that have been made publically available.");
	    } else if (modalType == "Year") {
            	$scope.modalText = $sce.trustAsHtml("Year designates the year that the specimen was collected.");
	    }

	    $scope.modalShown = !$scope.modalShown; 
	};

        var vm = this;
        var _currentLayer = undefined;

        var SOURCE = ["decimalLatitude", "decimalLongitude", "yearCollected", "scientificName", "measurementType"];

        var vm = this;

        //Handle Download Dialog Events
        $scope.downloadButtonShown = false;


	queryParams.fromYear= 1541;
	queryParams.toYear= 2020;
	vm.year = {
	    options: {
                floor: queryParams.fromYear,
                ceil: queryParams.toYear,
		step: 1,
		// note this is never called
		onEnd: function() {$scope.queryForm.$setPristine(false)}
	    }
	};

	//Get trait data to populate dropdown
	var fetchTraits = $http({
		method: 'GET',
		url: 'https://raw.githubusercontent.com/futres/FutresAPI/master/data/measurementType.json'
	 }).then(
	 	function successCallback(response) {
			var dataObj = response.data
			var newObj = {}
			//alert(newObj)
			dataObj.forEach(function(obj) { 
				newObj[obj.measurementType] = obj.measurementType
			});	
			//alert(newObj)
			vm.traits = newObj
		}, 
		function errorCallback(response) {
			console.log('error fetching traits from fovt data service');
			vm.traits = {}
		}
	);


	var fetchProjects = $http({
		method: 'GET',
		url: 'https://raw.githubusercontent.com/futres/FutresAPI/master/data/projects.json'
	}).then(
		function successCallback(response) {
		   var dataObj = response.data
		   var newObj = {}
		   dataObj.forEach(function(obj) {
			   if (obj.public == "True") { 
					// projectId 232 is sample project
					if (obj.projectId != 232)   					
						newObj[obj.projectId] = obj.projectTitle
			   }
		   });	
		   vm.dataSources = newObj
		   var selectedSources = []
			for (var key in vm.dataSources) 

				selectedSources.push(key);
			queryParams.source = selectedSources;
	   }, 
	   function errorCallback(response) {
		   console.log('error fetching projects from fovt data service');
		   vm.dataSources={}
	   }
   );
   

   var fetchScientificNames = $http({
	method: 'GET',
	url: 'https://raw.githubusercontent.com/futres/FutresAPI/master/data/scientificName.json'
}).then(
	function successCallback(response) {
	   var dataObj = response.data
	   var newObj = []
	   dataObj.forEach(function(obj) {		   
			newObj.push(obj.scientificName)
	   });	
	   vm.scientificName = newObj	   
   }, 
   function errorCallback(response) {
	   console.log('error fetching projects from fovt data service');
	   vm.scientificName=[]
   }
);

        // view toggles
        vm.moreSearchOptions = false;
        vm.showMap = true;
        vm.spatialLayer = undefined;
        vm.basisOfRecord= undefined;


        vm.params = queryParams;
        vm.map = queryMap;

        vm.queryJson = queryJson;

        function queryJson() {
            $scope.hasPEP725Data = false;
            if ($scope.queryForm.$invalid) return true;
    	    usSpinnerService.spin('query-spinner');
	    var first = true
	    var last = false 
	    var count = 0
	    // loop through selected datasources using the queryParams.source
	    // element
	    //for (var key in queryParams.source) {
		// The datasource, e.g. PEP725, NEON, USA-NPN, etc...
		//var dataSource=queryParams.source
                queryService.queryJson(queryParams.build(), 0, SOURCE)
                    .then(queryJsonSuccess)
                    .catch(queryJsonFailed)
                    .finally(queryJsonFinally);
	    //}

            function queryJsonSuccess(data) {
		// if PEP725 has data then set this flag 
		if (data.source == "PEP725" && data.size > 0) 
  	 		$scope.hasPEP725Data = true;

	        count = count + 1	
		// if this is the first time we update a source, then use update routine
		if (first) {
               	    queryResults.update(data);
		// otherwise append data for all successive calls
		} else {
                    queryResults.append(data);
		}
		first = false;

                queryMap.setMarkers(queryResults.data);
		$scope.queryForm.$setPristine(true)
            }

            function queryJsonFailed(response) {
                alerts.info("Problem loading query results: " + response.message);
                vm.queryResults.isSet = false;
            }

            function queryJsonFinally() {
                usSpinnerService.stop('query-spinner');
            }
        }

   }

})(angular);
