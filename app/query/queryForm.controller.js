(function (angular) {
    'use strict';
    var app = angular.module('map.query');
    //var app = angular.module('map.query');
    app.controller('QueryFormController', QueryFormController);
    app.$inject = [  '$scope', 'ui-bootstrap', 'queryParams', 'queryService', 'queryMap', 'queryResults', 'usSpinnerService', 'alerts'];
    function QueryFormController($scope, queryParams, queryService, queryMap, queryResults, usSpinnerService, alerts) {
 
        // toggle modal dialog
        $scope.modalShown = false;
        $scope.toggleModal = function(modalType) { 
	    $scope.modalType = modalType
	    if (modalType == "Traits") {
            	$scope.modalText = "The traits listed here are derived from the Plant Phenology Ontology (PPO). Included are mostly upper level traits and  queries " +
	    	"encompass all sub-traits.  For example, 'fruits present', will return both instances of both 'ripening fruits present' and 'unripe fruits present' from the PPO. " +  
	    	"Currently, queries are limited to only one trait from the list. " + 
	    	"For more information on the PPO, visit the PPO website (https://github.com/PlantPhenoOntology/ppo) "
	    } else if (modalType == "Genus") {
            	$scope.modalText = "The genus list contains plant genus names that have 3,000 or more observations from source databases."
	    }

	    $scope.modalShown = !$scope.modalShown; 
	};

        var vm = this;
        var _currentLayer = undefined;

        var SOURCE = ["latitude", "longitude", "startDayOfYear", "year", "dayOfYear", "genus", "specificEpithet", "source"];

        var vm = this;

	queryParams.fromYear= 1800;
	queryParams.toYear= 2018;
	vm.year = {
	    options: {
                floor: queryParams.fromYear,
                ceil: queryParams.toYear,
		step: 1
	    }
	};
	queryParams.fromDay= 1; 
	queryParams.toDay= 365;
	$scope.day = {
	    options: {
                floor: 1,
                ceil: 365,
		step: 1
	    }
	};


        // select lists
        vm.traits = {
          'floral structures present':'obo:PPO_0002324',
          'fruits present':'obo:PPO_0002342',
          'vascular leaves present':'obo:PPO_0002312',
          'cones present':'obo:PPO_0002346',
          'new above-ground shoot-borne shoot systems present':'obo:PPO_0002302',
          'new shoot systems emerging from ground present':'obo:PPO_0002303',
          'abscised leaves present':'obo:PPO_0002357',
          'abscised fruits or seeds present':'obo:PPO_0002358',
          'abscised cones or seeds present':'obo:PPO_0002359',
        }
		    /*
        vm.traits = {
          'plant structures present':'obo:PPO_0002300',
          '-------------------':'',
          'new shoot system present':'obo:PPO_0002301',
          *'new above-ground shoot-borne shoot systems present':'obo:PPO_0002302',
          *'new shoot systems emerging from ground present':'obo:PPO_0002303',
          'new shoot systems emerging from ground in first growth cycle present':'obo:PPO_0002304',
          'seedling present':'obo:PPO_0002305',
          'new shoot systems emerging from ground in later growth cycle present':'obo:PPO_0002306',
          'leaf buds present':'obo:PPO_0002307',
          'dormant leaf buds present':'obo:PPO_0002308',
          'non-dormant leaf buds present':'obo:PPO_0002309',
          'swelling leaf buds present':'obo:PPO_0002310',
          'breaking leaf buds present':'obo:PPO_0002311',
          '-------------------':'',
          *'vascular leaves present':'obo:PPO_0002312',
          'true leaves present':'obo:PPO_0002313',
          'unfolding true leaves present':'obo:PPO_0002314',
          'unfolded true leaves present':'obo:PPO_0002315',
          'non-senescing unfolded true leaves present':'obo:PPO_0002316',
          'senescing true leaves present':'obo:PPO_0002317',
          'immature unfolded true leaves present':'obo:PPO_0002318',
          'mature true leaves present':'obo:PPO_0002319',
          'expanding unfolded true leaves present':'obo:PPO_0002320',
          'expanded immature true leaves present':'obo:PPO_0002321',
          'expanding true leaves present':'obo:PPO_0002322',
          '-------------------':'',
          'reproductive structures present':'obo:PPO_0002323',
          *'floral structures present':'obo:PPO_0002324',
          'non-senesced floral structures present':'obo:PPO_0002325',
          'unopened floral structures present':'obo:PPO_0002326',
          'open floral structures present':'obo:PPO_0002327',
          'pollen-releasing floral structures present':'obo:PPO_0002328',
          'senesced floral structures present':'obo:PPO_0002329',
          'flowers present':'obo:PPO_0002330',
          'non-senesced flowers present':'obo:PPO_0002331',
          'unopened flowers present':'obo:PPO_0002332',
          'open flowers present':'obo:PPO_0002333',
          'pollen-releasing flowers present':'obo:PPO_0002334',
          'senesced flowers present':'obo:PPO_0002335',
          'flower heads present':'obo:PPO_0002336',
          'non-senesced flower heads present':'obo:PPO_0002337',
          'unopened flower heads present':'obo:PPO_0002338',
          'open flower heads present':'obo:PPO_0002339',
          'pollen-releasing flower heads present':'obo:PPO_0002340',
          'senesced flower heads present':'obo:PPO_0002341',
          *'fruits present':'obo:PPO_0002342',
          'ripening fruits present':'obo:PPO_0002343',
          'unripe fruits present':'obo:PPO_0002344',
          'ripe fruits present':'obo:PPO_0002345',
          '-------------------':'',
          *'cones present':'obo:PPO_0002346',
          'pollen cones present':'obo:PPO_0002347',
          'fresh pollen cones present':'obo:PPO_0002348',
          'open pollen cones present':'obo:PPO_0002349',
          'pollen-releasing pollen cones present':'obo:PPO_0002350',
          'seed cones present':'obo:PPO_0002351',
          'fresh seed cones present':'obo:PPO_0002352',
          'ripening seed cones present':'obo:PPO_0002353',
          'unripe seed cones present':'obo:PPO_0002354',
          'ripe seed cones present':'obo:PPO_0002355',
          '-------------------':'',
          'abscised plant structures present':'obo:PPO_0002356',
          *'abscised leaves present':'obo:PPO_0002357',
          *'abscised fruits or seeds present':'obo:PPO_0002358',
          *'abscised cones or seeds present':'obo:PPO_0002359',
        }
	*/
 	vm.dataSources = {
          'National Phenology Network':'NPN',
          'The European Phenology Database':'PEP725',
          'National Ecological Observatory Network':'NEON'
        };	
          //'Regional North American Herbaria Network':'ASU'

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
    	    usSpinnerService.spin('query-spinner');

            queryService.queryJson(queryParams.build(), 0, SOURCE)
                .then(queryJsonSuccess)
                .catch(queryJsonFailed)
                .finally(queryJsonFinally);

            function queryJsonSuccess(data) {
                queryResults.update(data);
                queryMap.setMarkers(queryResults.data);
            }

            function queryJsonFailed(response) {
                alerts.info("Problem loading query results: " + response.message);
		    //TODO: i may need this value set later
                //vm.queryResults.isSet = false;
            }

            function queryJsonFinally() {
                usSpinnerService.stop('query-spinner');
            }
        }

 ////        function getBasisOfRecords() {
     //                vm.basisOfRecord = records;
      //           }, function () {
       //              alerts.error('error fetching basisOfRecord terms');
        //         });
         //}
        // function getCountryCodes() {
        //     queryService.countryCodes()
        //         .then(function (codes) {
        //             vm.countryCodes = codes;
        //         }, function () {
        //             alerts.error('error fetching countryCodes');
        //         });
        // }

//        function getSpatialLayers() {
 //           queryService.spatialLayers()
  //              .then(function (response) {
   //                 vm.spatialLayers = response.data;
    //            }, function () {
     //               alerts.error('error fetching spatial layers');
      //          });
       // }
   }

   /* dynamically search taxon data */
	/*
   function searchTaxonData(characters,$http,rank) {
	   return $http.get("http://api.gbif.org/v1/species/suggest/?q="+characters+"&rank="+rank)
	       .then(queryJsonComplete);//function(response) {
	   function queryJsonComplete(response) {
               return response.data;
            } 
   }
	*/

   /* directive to handlie click events for the taxon empty contents x button */
	/*
   function taxonEmptyContents($filter,$http) {
      return {
        restrict: 'A',
        scope: true,
        link: function (scope, elem, attrs) {

            function functionToBeCalled () {
                scope.$apply(function(){
	        	scope.queryFormVm.params.taxonomy = '';
	        	scope.queryFormVm.params.taxonKey = '';
	        	scope.queryFormVm.params.selectedTaxonomy = '';
		});
            }

            elem.on('click', functionToBeCalled);
        }
      };
   }
	*/

   /* Directive for working with taxon-based autocomplete functions */
	/*
   function taxonAutoCompleteDir($filter,$http) {
         return {
		require: "ngModel",
                restrict: 'A',       
                link: function (scope, elem, attrs, ngModel) {
                        elem.autocomplete({
                        source: function (request, response) {
                            //term has the data typed by the user
                            var params = request.term;
			    // TODO: fetch radio button rank
			    //var rank = scope.queryFormVm.params.rank
	 		    var rank = (scope.queryFormVm.params.rank).toString().toLowerCase()
				
			    // cal searchTaxonData function and wait for response
			    searchTaxonData(params,$http,rank)
				.then(function(data) {
                            	   if (data) { 
					var result = ''
					if (rank == "species")
                                	    result = $filter('filter')(data, {'species':params});
					if (rank == "genus")
                                	    result = $filter('filter')(data, {'genus':params});
					if (rank == "family")
                                	    result = $filter('filter')(data, {'family':params});
					if (rank == "order")
                                	    result = $filter('filter')(data, {'order':params});
					if (rank == "class")
                                	    result = $filter('filter')(data, {'class':params});
					if (rank == "phylum")
                                	    result = $filter('filter')(data, {'phylum':params});
					if (rank == "kingdom")
                                	    result = $filter('filter')(data, {'kingdom':params});

                                        angular.forEach(result, function (item) {
						if (rank == "species") 
                                               		item['value'] = item['scientificName'];
						else
                                               		item['value'] = item[rank];
                                	});                       
                            	    }
                                    response(result);
			    });
                        },
                        minLength: 2,                       
			// Detect if user changes values and if ui['item'] (taxonomy) is null
			// and then set other key values to empty
                        change: function (event, ui) {
		            if (ui['item'] == null) {
				 alert('Click on name in drop-down list to filter by taxonomy')
			         scope.queryFormVm.params.taxonomy = ''
			         scope.queryFormVm.params.taxonKey = ''
			         scope.queryFormVm.params.selectedTaxonomy = ''
			    } 
                        },
                        select: function (event, ui) {
                           //force a digest cycle to update taxonKey based on chosen taxon
                           scope.$apply(function(){
			    	 var rank = (scope.queryFormVm.params.rank).toString().toLowerCase()
				 if (rank == "species") {
			         	scope.queryFormVm.params.taxonKey = ui['item'][rank+'Key'];
			         	scope.queryFormVm.params.selectedTaxonomy = ui['item']['scientificName'];
				 } else {
			         	scope.queryFormVm.params.taxonKey = ui['item'][rank+'Key'];
			         	scope.queryFormVm.params.selectedTaxonomy = ui['item'][rank];
				 }
                           });                       
                        },
                       
                    });
                }
          };
    }
	*/

})(angular);
