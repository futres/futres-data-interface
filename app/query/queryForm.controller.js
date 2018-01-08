(function (angular) {
    'use strict';
    var app = angular.module('map.query');
    app.controller('QueryFormController', QueryFormController);
    app.$inject = [  '$scope', 'ui-bootstrap', 'queryParams', 'queryService', 'queryMap', 'queryResults', 'usSpinnerService', 'alerts', '$sce'];
    function QueryFormController($scope, queryParams, queryService, queryMap, queryResults, usSpinnerService, alerts, $sce) {
 
     	// toggle download modal dialog
        $scope.downloadModalShown = false;
        $scope.toggleDownloadModal = function() { 
            $scope.downloadModalShown = !$scope.downloadModalShown; 
        };

        // toggle modal dialog
        $scope.modalShown = false;
        $scope.toggleModal = function(modalType) { 
	    $scope.modalType = modalType
	    if (modalType == "Traits") {
		$scope.modalText= $sce.trustAsHtml(
            	"The traits listed here are derived from the Plant Phenology Ontology (PPO). Included are mostly upper level traits which will " +
	    	"encompass all child traits.  For example, a query for 'fruits present', will return instances of 'ripening fruits present', "+
	        "'unripe fruits present', and 'ripe fruits present' from the PPO. Currently, this interface enables searching on one trait at time. " + 
	    	"For more information on the PPO, visit the <a href='https://github.com/PlantPhenoOntology/ppo' target='_blank'>PPO Website</a>." +
	    	"<p></p>For USA-NPN and NEON data, all present traits were inferred by looking at positive count or percentages included with the source "+
		"data.  For zero count or percentage data, the traits were inferred as absent.  To determine how mappings were assigned for each data " +
		"source, visit the <a href='https://github.com/biocodellc/ppo-data-pipeline/blob/master/projects/pep725/phenophase_descriptions.csv' target='_blank'>PEP725</a>, <a href='https://github.com/biocodellc/ppo-data-pipeline/blob/master/projects/npn/phenophase_descriptions.csv' target='_blank'>USA-NPN</a>, or <a href='https://github.com/biocodellc/ppo-data-pipeline/blob/master/projects/neon/phenophase_descriptions.csv' target='_blank'>NEON</a> mapping tables at the <a href='https://github.com/biocodellc/ppo-data-pipeline' target='_blank'>ppo-data-pipeline</a> site.");
	    } else if (modalType == "Genus") {
            	$scope.modalText = $sce.trustAsHtml("Queries on genus are required in order to help constrain the number of records returned on queries and improve the performance of the interface itself.  Also, we encourage genus level queries over genus + species queries since genus is typically a better metric for comparing phenological patterns across continents, which is the primary purpose of this interface.  The genus list contains only plant genus names that have 3,000 or more observations from source databases.");
	    } else if (modalType == "Year") {
            	$scope.modalText = $sce.trustAsHtml("USA-NPN and NEON data, which constitutes all of the North American data in this portal, appear only after the year 2009, with the exception of the genus <i>Syringa</i> (Lilac).  USA-NPN Lilac data begins in 1956.  PEP725 data constitutes all of our European data, and begins in 1868.");
	    } else if (modalType == "Day of Year") {
            	$scope.modalText = $sce.trustAsHtml("Constrain by the Day of Year a particular observation was made.  For instance, to view all traits appearing before day 100, slide the upper level slider from 365 down to 100, while leaving the lower end of the slider tool at 1.");
	    }

	    $scope.modalShown = !$scope.modalShown; 
	};

	// Submitted form
        
/*
        $scope.isSubmitted = false;
        $scope.add = function() {
           if ($scope.queryForm.$valid) {
              alert('here1')
           } else {
              alert('here2')
              $scope.isSubmitted = true;
           }
        }
*/

        var vm = this;
        var _currentLayer = undefined;

        var SOURCE = ["latitude", "longitude", "startDayOfYear", "year", "dayOfYear", "genus", "specificEpithet", "source", "eventId"];

        var vm = this;

        // Handle Download Dialog Events
        $scope.downloadButtonShown = false;
        $scope.verify= function () {
                if (queryParams.verifyDownload == "ppo2017") {
                        $scope.downloadButtonShown = true;
                }
        }

	queryParams.fromYear= 1868;
	queryParams.toYear= 2018;
	vm.year = {
	    options: {
                floor: queryParams.fromYear,
                ceil: queryParams.toYear,
		step: 1,
		// note this is never called
		onEnd: function() {$scope.queryForm.$setPristine(false)}
	    }
	};
	queryParams.fromDay= 1; 
	queryParams.toDay= 365;
	$scope.day = {
	    options: {
                floor: 1,
                ceil: 365,
		step: 1, 
		// note this is never called
		onEnd: function() {$scope.queryForm.$setPristine(false)}
	    }
	};

        // An abbreviated list of trist
        vm.traits = {
		'new shoot system present':'obo:PPO_0002301',
		'unfolded true leaves present':'obo:PPO_0002315',
		'senescing true leaves present':'obo:PPO_0002616',
		'abscised leaves present':'obo:PPO_0002357',
		'floral structures present':'obo:PPO_0002324',
		'open flowers present':'obo:PPO_0002333',
		'fruits present':'obo:PPO_0002342',
		'ripe fruits present':'obo:PPO_0002345',
		'abscised fruits or seeds present':'obo:PPO_0002358',
		'pollen cones present':'obo:PPO_0002347',
		'open pollen cones present':'obo:PPO_0002349',
		'seed cones present':'obo:PPO_0002351',
		'ripe seed cones present':'obo:PPO_0002355',
		'abscised cones or seeds present':'obo:PPO_0002359'
        }

	// Dataserouces we are included
 	vm.dataSources = {
          'National Phenology Network':'NPN',
          'The European Phenology Database':'PEP725',
          'National Ecological Observatory Network':'NEON'
        };	
          //'Regional North American Herbaria Network':'ASU'

	// An abbreviated list of genus names (selectec by genera with > 3,000 observations amongst data sources
	vm.genus = [ 
'Abies', 'Acacia', 'Acer', 'Achillea', 'Adenostoma', 'Aesculus', 'Alliaria', 'Alnus', 'Alopecurus', 'Ambrosia', 'Amelanchier', 'Amorpha', 'Andropogon', 'Anemone', 'Aquilegia', 'Aralia', 'Arctostaphylos', 'Arisaema', 'Aristida', 'Artemisia', 'Asclepias', 'Asimina', 'Atriplex', 'Avena', 'Baccharis', 'Berberis', 'Beta', 'Betula', 'Bouteloua', 'Bromus', 'Callicarpa', 'Calluna', 'Caltha', 'Calylophus', 'Campsis', 'Cardamine', 'Carex', 'Carnegiea', 'Carpinus', 'Carya', 'Ceanothus', 'Celtis', 'Centaurea', 'Cephalanthus', 'Ceratocephala', 'Cercis', 'Cercocarpus', 'Chamaedaphne', 'Chamerion', 'Chilopsis', 'Cirsium', 'Citrus', 'Cladrastis', 'Claytonia', 'Clintonia', 'Colchicum', 'Coleogyne', 'Cornus', 'Corylus', 'Crataegus', 'Cydonia', 'Cynodon', 'Cytisus', 'Dactylis', 'Diapensia', 'Diospyros', 'Diplacus', 'Echinacea', 'Ephedra', 'Epilobium', 'Ericameria', 'Eriogonum', 'Erythronium', 'Eschscholzia', 'Eurybia', 'Euthamia', 'Fagus', 'Ferocactus', 'Forsythia', 'Fouquieria', 'Fragaria', 'Fraxinus', 'Galanthus', 'Garrya', 'Gaultheria', 'Gaylussacia', 'Geum', 'Ginkgo', 'Gleditsia', 'Halesia', 'Hamamelis', 'Hedera', 'Helianthus', 'Hemerocallis', 'Heracleum', 'Hesperostipa', 'Heteromeles', 'Hordeum', 'Ilex', 'Impatiens', 'Juglans', 'Juniperus', 'Kalmia', 'Krascheninnikovia', 'Larix', 'Larrea', 'Lathyrus', 'Ledum', 'Liatris', 'Ligustrum', 'Lindera', 'Liquidambar', 'Liriodendron', 'Lonicera', 'Lupinus', 'Magnolia', 'Mahonia', 'Maianthemum', 'Malus', 'Medicago', 'Mertensia', 'Metrosideros', 'Microstegium', 'Monarda', 'Morella', 'Nyssa', 'Oemleria', 'Olea', 'Olneya', 'Opuntia', 'Ostrya', 'Oxydendrum', 'Panicum', 'Parkinsonia', 'Parthenocissus', 'Passiflora', 'Pennisetum', 'Penstemon', 'Philadelphus', 'Picea', 'Pinus', 'Pithecellobium', 'Platanus', 'Poa', 'Podophyllum', 'Populus', 'Prosopis', 'Prunus', 'Pseudoroegneria', 'Pseudotsuga', 'Pueraria', 'Pulsatilla', 'Purshia', 'Pyrus', 'Quercus', 'Ratibida', 'Rhamnus', 'Rhododendron', 'Rhus', 'Ribes', 'Robinia', 'Rosa', 'Rubus', 'Salix', 'Salvia', 'Sambucus', 'Sanguinaria', 'Sassafras', 'Schizachyrium', 'Scilla', 'Secale', 'Senna', 'Simmondsia', 'Solanum', 'Solidago', 'Sorbus', 'Sphaeralcea', 'Spiraea', 'Symphoricarpos', 'Symphyotrichum', 'Syringa', 'Tamarix', 'Taraxacum', 'Taxodium', 'Thalictrum', 'Thelesperma', 'Tilia', 'Toxicodendron', 'Trientalis', 'Trifolium', 'Trillium', 'Triticum', 'Tsuga', 'Tussilago', 'Ulmus', 'Umbellularia', 'Urochloa', 'Vaccinium', 'Verbesina', 'Viburnum', 'Viola', 'Vitis', 'Yucca', 'Zea', 'Zinnia'
	]

        // view toggles
        vm.moreSearchOptions = false;
        vm.showMap = true;
        vm.spatialLayer = undefined;
        vm.basisOfRecord= undefined;


        vm.params = queryParams;
        vm.map = queryMap;

        vm.queryJson = queryJson;
//	vm.spatialLayerChanged = spatialLayerChanged;
        //activate();

 //       function activate() {
  //          // getCountryCodes();
   //         getSpatialLayers();
    //        getBasisOfRecords();
     //   }

//	function spatialLayerChanged() {
//		zoomLayer();
//	}

//	function zoomLayer() {
 //           var l = omnivore.wkt.parse(vm.spatialLayer);
  //          vm.params.bounds = l.getBounds();
//
 //           if (_currentLayer && l.getBounds() !== _currentLayer.getBounds()) {
  //              queryMap.removeLayer(_currentLayer);
   //         }
//
 //           queryMap.addLayer(l);
  //          _currentLayer = l;

//	}
        function queryJson() {
            if ($scope.queryForm.$invalid) return true;
    	    usSpinnerService.spin('query-spinner');

            queryService.queryJson(queryParams.build(), 0, SOURCE)
                .then(queryJsonSuccess)
                .catch(queryJsonFailed)
                .finally(queryJsonFinally);

            function queryJsonSuccess(data) {
                queryResults.update(data);
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
