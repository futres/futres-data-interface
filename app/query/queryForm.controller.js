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
		$scope.modalText= $sce.trustAsHtml(
            	"The traits listed here are derived from the Plant Phenology Ontology (PPO). Included here are all present and absent trait values including " +
	    	"parents which encompass child traits.  For example, a query for 'fruits present', will return instances of 'ripening fruits present', "+
	        "'unripe fruits present', and 'ripe fruits present' from the PPO. Currently, this interface enables searching on one trait at time. " + 
	    	"For more information on the PPO, visit the <a href='https://github.com/PlantPhenoOntology/ppo' target='_blank'>PPO Website</a>." +
	    	"<p></p>For USA-NPN and NEON data, all present traits were inferred by looking at positive count or percentages included with the source "+
		"data.  For zero count or percentage data, the traits were inferred as absent.  To determine how mappings were assigned for each data " +
		"source, visit the <a href='https://github.com/biocodellc/ppo-data-pipeline/blob/master/projects/pep725/phenophase_descriptions.csv' target='_blank'>PEP725</a>, <a href='https://github.com/biocodellc/ppo-data-pipeline/blob/master/projects/npn/phenophase_descriptions.csv' target='_blank'>USA-NPN</a>, or <a href='https://github.com/biocodellc/ppo-data-pipeline/blob/master/projects/neon/phenophase_descriptions.csv' target='_blank'>NEON</a> mapping tables at the <a href='https://github.com/biocodellc/ppo-data-pipeline' target='_blank'>ppo-data-pipeline</a> site.");
	    //} else if (modalType == "Absent") {
	//	$scope.modalText= $sce.trustAsHtml(
         //   	"The traits listed here are derived from the Plant Phenology Ontology (PPO). Included here are all absent trait values including " +
	  //  	"parents which encompass child traits.  For example, a query for 'fruits absent', will return instances of 'ripening fruits absent', "+
	   //     "'unripe fruits absent', and 'ripe fruits absent' from the PPO. Currently, this interface enables searching on one trait at time. " + 
	    //	"For more information on the PPO, visit the <a href='https://github.com/PlantPhenoOntology/ppo' target='_blank'>PPO Website</a>." +
	    //	"<p></p>For USA-NPN and NEON data, all present traits were inferred by looking at positive count or percentages included with the source "+
	//	"data.  For zero count or percentage data, the traits were inferred as absent.  To determine how mappings were assigned for each data " +
	//	"source, visit the <a href='https://github.com/biocodellc/ppo-data-pipeline/blob/master/projects/pep725/phenophase_descriptions.csv' target='_blank'>PEP725</a>, <a href='https://github.com/biocodellc/ppo-data-pipeline/blob/master/projects/npn/phenophase_descriptions.csv' target='_blank'>USA-NPN</a>, or <a href='https://github.com/biocodellc/ppo-data-pipeline/blob/master/projects/neon/phenophase_descriptions.csv' target='_blank'>NEON</a> mapping tables at the <a href='https://github.com/biocodellc/ppo-data-pipeline' target='_blank'>ppo-data-pipeline</a> site.");
	    } else if (modalType == "Genus") {
            	$scope.modalText = $sce.trustAsHtml("Queries on genus are required in order to help constrain the number of records returned on queries and improve the performance of the interface itself.  Also, we encourage genus level queries over genus + species queries since genus is typically a better metric for comparing phenological patterns across continents, which is the primary purpose of this interface.");
	    } else if (modalType == "Species") {
            	$scope.modalText = $sce.trustAsHtml("After specifying a genus name you may also clarify with a species name.  For example, to query on <i>Oenothera biennis</i> select Oenothera from the genus drop-down list and enter 'biennis' in the species text box.")
	    } else if (modalType == "Source") {
            	$scope.modalText = $sce.trustAsHtml("You may select one or more datasources from the list provided. Use the option key (Mac) or control key (Windows) to make your selections. Currently, the PEP725 data cannot be downloaded from this interface.  If you select NEON and/or USA-NPN, or your results do not contain any PEP725 data, then you may freely download data. ");
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

        //Handle Download Dialog Events
	// If PEP725 is a datasource, must enter a code to continue,
	// otherwise can show download button
	//if ($scope.source.includes("PEP725")) {
            $scope.downloadButtonShown = false;
            $scope.verify= function () {
                if (queryParams.verifyDownload == "ppo2017") {
                        $scope.downloadButtonShown = true;
                }
            }
	//} else {
        //    $scope.downloadButtonShown = true;
//	}

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

	//Get trait data to populate dropdown
	var fetchTraits = $http({
		method: 'GET',
		url: 'https://www.plantphenology.org/api/v2/ppo/all_short'
	 }).then(
	 	function successCallback(response) {
			var dataObj = response.data
			vm.traits = dataObj
		}, 
		function errorCallback(response) {
			console.log('error fetching traits from ppo data service');
			vm.traits = {}
		}
	);
        // A list of present traits
	//vm.traits = {'abscised cones or seeds present':'obo:PPO_0002359', 'abscised fruits or seeds present':'obo:PPO_0002358', 'abscised leaves present':'obo:PPO_0002357', 'abscised plant structures present':'obo:PPO_0002356', 'breaking leaf buds present':'obo:PPO_0002311', 'cones present':'obo:PPO_0002346', 'dormant leaf buds present':'obo:PPO_0002308', 'expanded immature true leaves present':'obo:PPO_0002321', 'expanding true leaves present':'obo:PPO_0002322', 'expanding unfolded true leaves present':'obo:PPO_0002320', 'floral structures present':'obo:PPO_0002324', 'flower heads present':'obo:PPO_0002336', 'flowers present':'obo:PPO_0002330', 'fresh pollen cones present':'obo:PPO_0002348', 'fresh seed cones present':'obo:PPO_0002352', 'fruits present':'obo:PPO_0002342', 'immature unfolded true leaves present':'obo:PPO_0002318', 'leaf buds present':'obo:PPO_0002307', 'mature true leaves present':'obo:PPO_0002319', 'new above-ground shoot-borne shoot systems present':'obo:PPO_0002302', 'new shoot system present':'obo:PPO_0002301', 'new shoot systems emerging from ground in first growth cycle present':'obo:PPO_0002304', 'new shoot systems emerging from ground in later growth cycle present':'obo:PPO_0002306', 'new shoot systems emerging from ground present':'obo:PPO_0002303', 'non-dormant leaf buds present':'obo:PPO_0002309', 'non-senesced floral structures present':'obo:PPO_0002325', 'non-senesced flower heads present':'obo:PPO_0002337', 'non-senesced flowers present':'obo:PPO_0002331', 'non-senescing unfolded true leaves present':'obo:PPO_0002316', 'open floral structures present':'obo:PPO_0002327', 'open flower heads present':'obo:PPO_0002339', 'open flowers present':'obo:PPO_0002333', 'open pollen cones present':'obo:PPO_0002349', 'plant structures present':'obo:PPO_0002300', 'pollen cones present':'obo:PPO_0002347', 'pollen-releasing floral structures present':'obo:PPO_0002328', 'pollen-releasing flower heads present':'obo:PPO_0002340', 'pollen-releasing flowers present':'obo:PPO_0002334', 'pollen-releasing pollen cones present':'obo:PPO_0002350', 'reproductive structures present':'obo:PPO_0002323', 'ripe fruits present':'obo:PPO_0002345', 'ripe seed cones present':'obo:PPO_0002355', 'ripening fruits present':'obo:PPO_0002343', 'ripening seed cones present':'obo:PPO_0002353', 'seed cones present':'obo:PPO_0002351', 'seedling present':'obo:PPO_0002305', 'senesced floral structures present':'obo:PPO_0002329', 'senesced flower heads present':'obo:PPO_0002341', 'senesced flowers present':'obo:PPO_0002335', 'senescing true leaves present':'obo:PPO_0002317', 'swelling leaf buds present':'obo:PPO_0002310', 'true leaves present':'obo:PPO_0002313', 'unfolded true leaves present':'obo:PPO_0002315', 'unfolding true leaves present':'obo:PPO_0002314', 'unopened floral structures present':'obo:PPO_0002326', 'unopened flower heads present':'obo:PPO_0002338', 'unopened flowers present':'obo:PPO_0002332', 'unripe fruits present':'obo:PPO_0002344', 'unripe seed cones present':'obo:PPO_0002354', 'vascular leaves present':'obo:PPO_0002312'}

        // A list of absent traits
	//vm.absent = {'abscised cones or seeds absent':'obo:PPO_0002658', 'abscised fruits or seeds absent':'obo:PPO_0002657', 'abscised leaves absent':'obo:PPO_0002656', 'abscised plant structures absent':'obo:PPO_0002655', 'breaking leaf buds absent':'obo:PPO_0002610', 'cones absent':'obo:PPO_0002645', 'dormant leaf buds absent':'obo:PPO_0002607', 'expanded immature true leaves absent':'obo:PPO_0002620', 'expanding true leaves absent':'obo:PPO_0002621', 'expanding unfolded true leaves absent':'obo:PPO_0002619', 'floral structures absent':'obo:PPO_0002623', 'flower heads absent':'obo:PPO_0002635', 'flowers absent':'obo:PPO_0002629', 'fresh pollen cones absent':'obo:PPO_0002647', 'fresh seed cones absent':'obo:PPO_0002651', 'fruits absent':'obo:PPO_0002641', 'immature unfolded true leaves absent':'obo:PPO_0002617', 'leaf buds absent':'obo:PPO_0002606', 'mature true leaves absent':'obo:PPO_0002618', 'new above-ground shoot-borne shoot systems absent':'obo:PPO_0002601', 'new shoot system absent':'obo:PPO_0002600', 'new shoot systems emerging from ground absent':'obo:PPO_0002602', 'new shoot systems emerging from ground in first growth cycle absent':'obo:PPO_0002603', 'new shoot systems emerging from ground in later growth cycle absent':'obo:PPO_0002605', 'non-dormant leaf buds absent':'obo:PPO_0002608', 'non-senesced floral structures absent':'obo:PPO_0002624', 'non-senesced flower heads absent':'obo:PPO_0002636', 'non-senesced flowers absent':'obo:PPO_0002630', 'non-senescing unfolded true leaves absent':'obo:PPO_0002615', 'open floral structures absent':'obo:PPO_0002626', 'open flower heads absent':'obo:PPO_0002638', 'open flowers absent':'obo:PPO_0002632', 'open pollen cones absent':'obo:PPO_0002648', 'pollen cones absent':'obo:PPO_0002646', 'pollen-releasing floral structures absent':'obo:PPO_0002627', 'pollen-releasing flower heads absent':'obo:PPO_0002639', 'pollen-releasing flowers absent':'obo:PPO_0002633', 'pollen-releasing pollen cones absent':'obo:PPO_0002649', 'reproductive structures absent':'obo:PPO_0002622', 'ripe fruits absent':'obo:PPO_0002644', 'ripe seed cones absent':'obo:PPO_0002654', 'ripening fruits absent':'obo:PPO_0002642', 'ripening seed cones absent':'obo:PPO_0002652', 'seed cones absent':'obo:PPO_0002650', 'seedling absent':'obo:PPO_0002604', 'senesced floral structures absent':'obo:PPO_0002628', 'senesced flower heads absent':'obo:PPO_0002640', 'senesced flowers absent':'obo:PPO_0002634', 'senescing true leaves absent':'obo:PPO_0002616', 'swelling leaf buds absent':'obo:PPO_0002609', 'true leaves absent':'obo:PPO_0002612', 'unfolded true leaves absent':'obo:PPO_0002614', 'unfolding true leaves absent':'obo:PPO_0002613', 'unopened floral structures absent':'obo:PPO_0002625', 'unopened flower heads absent':'obo:PPO_0002637', 'unopened flowers absent':'obo:PPO_0002631', 'unripe fruits absent':'obo:PPO_0002643', 'unripe seed cones absent':'obo:PPO_0002653', 'vascular leaves absent':'obo:PPO_0002611'}

	// Dataserouces we are included
 	vm.dataSources = {
          'USA-NPN':'USA National Phenology Network',
          'PEP725':'Pan European Phenology Database',
          'NEON':'National Ecological Observatory Network'
        };	

	// Pre-select all dataSources for the source multiple drop-down box
	var selectedSources = []
	for (var key in vm.dataSources) 
		selectedSources.push(key);
	queryParams.source = selectedSources;

          //'Regional North American Herbaria Network':'ASU'

	// An abbreviated list of genus names (selectec by genera with > 3,000 observations amongst data sources
	vm.genus = [ 
'Abies', 'Acacia', 'Acer', 'Achillea', 'Achlys', 'Actaea', 'Actinidia', 'Adenostoma', 'Aesculus', 'Agave', 'Ageratina', 'Alliaria', 'Allium', 'Alnus', 'Alopecurus', 'Ambrosia', 'Amelanchier', 'Amorpha', 'Anacardium', 'Andromeda', 'Andropogon', 'Anemone', 'Apocynum', 'Aquilegia', 'Aralia', 'Arbutus', 'Arctostaphylos', 'Arisaema', 'Aristida', 'Arnica', 'Aronia', 'Artemisia', 'Aruncus', 'Asarum', 'Asclepias', 'Asimina', 'Asparagus', 'Atriplex', 'Atropa', 'Avena', 'Avicennia', 'Baccharis', 'Baileya', 'Balsamorhiza', 'Baptisia', 'Barbarea', 'Berberis', 'Beta', 'Betula', 'Bouteloua', 'Brassica', 'Bromus', 'Bursera', 'Calamagrostis', 'Callicarpa', 'Calluna', 'Caltha', 'Calylophus', 'Calystegia', 'Camassia', 'Camissoniopsis', 'Campanula', 'Campsis', 'Cardamine', 'Carex', 'Carnegiea', 'Carpinus', 'Carya', 'Castanea', 'Castilleja', 'Catalpa', 'Caulophyllum', 'Ceanothus', 'Celtis', 'Centaurea', 'Cephalanthus', 'Ceratocephala', 'Cercis', 'Cercocarpus', 'Chamaecyparis', 'Chamaedaphne', 'Chamerion', 'Cheirodendron', 'Chilopsis', 'Chimaphila', 'Cirsium', 'Cistus', 'Citrus', 'Cladrastis', 'Claytonia', 'Clematis', 'Clintonia', 'Coccoloba', 'Colchicum', 'Coleogyne', 'Conocarpus', 'Convallaria', 'Coptis', 'Coreopsis', 'Cornus', 'Corylus', 'Crataegus', 'Crinum', 'Crocus', 'Cuscuta', 'Cyclamen', 'Cydonia', 'Cynodon', 'Cypripedium', 'Cytisus', 'Dactylis', 'Dalea', 'Dasiphora', 'Dasylirion', 'Datura', 'Daucus', 'Delphinium', 'Deschampsia', 'Desmodium', 'Diapensia', 'Dicentra', 'Dichanthium', 'Dichelostemma', 'Diospyros', 'Diplacus', 'Dittrichia', 'Dodecatheon', 'Dodonaea', 'Dryas', 'Echinacea', 'Echinocereus', 'Eichhornia', 'Elaeagnus', 'Empetrum', 'Encelia', 'Enemion', 'Ephedra', 'Epigaea', 'Epilobium', 'Epipactis', 'Ericameria', 'Erigeron', 'Eriogonum', 'Eriophorum', 'Eriophyllum', 'Erodium', 'Erythronium', 'Eschscholzia', 'Escobaria', 'Euonymus', 'Euphorbia', 'Eurybia', 'Euthamia', 'Eutrochium', 'Fagus', 'Ferocactus', 'Festuca', 'Ficus', 'Flourensia', 'Foeniculum', 'Forestiera', 'Forsythia', 'Fouquieria', 'Fragaria', 'Frangula', 'Fraxinus', 'Fritillaria', 'Gaillardia', 'Galanthus', 'Gardenia', 'Garrya', 'Gaultheria', 'Gaylussacia', 'Gelsemium', 'Gentiana', 'Gentianopsis', 'Geranium', 'Geum', 'Ginkgo', 'Gleditsia', 'Glycine', 'Goodyera', 'Gossypium', 'Guaiacum', 'Guazuma', 'Gutierrezia', 'Gymnanthes', 'Halesia', 'Hamamelis', 'Handroanthus', 'Hedera', 'Hedysarum', 'Helianthus', 'Helleborus', 'Hemerocallis', 'Heracleum', 'Hesperostipa', 'Heteromeles', 'Hieracium', 'Hilaria', 'Holodiscus', 'Hordeum', 'Hydrophyllum', 'Hymenocallis', 'Ilex', 'Impatiens', 'Ipomopsis', 'Iris', 'Jacaranda', 'Juglans', 'Juniperus', 'Kalmia', 'Kosteletzkya', 'Krascheninnikovia', 'Laguncularia', 'Larix', 'Larrea', 'Lathyrus', 'Laurus', 'Ledum', 'Leucaena', 'Leucanthemum', 'Leucojum', 'Leucophyllum', 'Lewisia', 'Leymus', 'Liatris', 'Licania', 'Ligustrum', 'Lilium', 'Limonium', 'Lindera', 'Linnaea', 'Linum', 'Liquidambar', 'Liriodendron', 'Lobelia', 'Lonicera', 'Lupinus', 'Lycium', 'Lysichiton', 'Lythrum', 'Magnolia', 'Mahonia', 'Maianthemum', 'Malacothrix', 'Malosma', 'Malus', 'Medeola', 'Medicago', 'Melilotus', 'Mertensia', 'Mespilus', 'Metasequoia', 'Metrosideros', 'Microstegium', 'Mimosa', 'Mimulus', 'Minuartia', 'Mitella', 'Monarda', 'Moneses', 'Morella', 'Morus', 'Muhlenbergia', 'Myoporum', 'Myrica', 'Myriophyllum', 'Nassella', 'Nolina', 'Nuphar', 'Nymphaea', 'Nyssa', 'Oemleria', 'Oenothera', 'Olea', 'Oligoneuron', 'Olneya', 'Oplopanax', 'Opuntia', 'Orobanche', 'Ostrya', 'Oxalis', 'Oxydendrum', 'Oxyria', 'Panicum', 'Papaver', 'Parkinsonia', 'Parthenocissus', 'Pascopyrum', 'Passiflora', 'Pennisetum', 'Penstemon', 'Persea', 'Petasites', 'Phacelia', 'Phalaris', 'Phellodendron', 'Philadelphus', 'Phlox', 'Phragmites', 'Physocarpus', 'Phytolacca', 'Picea', 'Pinus', 'Pisonia', 'Pithecellobium', 'Platanus', 'Pleuraphis', 'Poa', 'Podophyllum', 'Polemonium', 'Polygonatum', 'Polygonum', 'Poncirus', 'Pontederia', 'Populus', 'Potentilla', 'Prosopis', 'Prunus', 'Pseudobombax', 'Pseudoroegneria', 'Pseudotsuga', 'Pueraria', 'Pulsatilla', 'Punica', 'Purshia', 'Pyrus', 'Quercus', 'Ranunculus', 'Raphanus', 'Ratibida', 'Rhamnus', 'Rhizophora', 'Rhododendron', 'Rhus', 'Ribes', 'Robinia', 'Romneya', 'Rorippa', 'Rosa', 'Rosmarinus', 'Rubus', 'Rudbeckia', 'Sabal', 'Salix', 'Salvia', 'Sambucus', 'Sanguinaria', 'Sarracenia', 'Sassafras', 'Satureja', 'Schizachyrium', 'Schoenoplectus', 'Scilla', 'Scirpus', 'Secale', 'Senna', 'Serenoa', 'Shepherdia', 'Silphium', 'Simmondsia', 'Sisyrinchium', 'Solanum', 'Solidago', 'Sophora', 'Sorbus', 'Sorghastrum', 'Spartium', 'Sphaeralcea', 'Spigelia', 'Spiraea', 'Spondias', 'Sporobolus', 'Sterculia', 'Symphoricarpos', 'Symphyotrichum', 'Symplocarpus', 'Synthyris', 'Syringa', 'Tabebuia', 'Tamarix', 'Taraxacum', 'Taxodium', 'Taxus', 'Tellima', 'Tephrosia', 'Thalictrum', 'Thelesperma', 'Thuja', 'Thymus', 'Tiarella', 'Tilia', 'Tillandsia', 'Toxicodendron', 'Tradescantia', 'Triadica', 'Trientalis', 'Trifolium', 'Trillium', 'Triticum', 'Tsuga', 'Tulipa', 'Tussilago', 'Ulmus', 'Umbellularia', 'Urochloa', 'Urtica', 'Uvularia', 'Vaccinium', 'Vachellia', 'Veratrum', 'Verbesina', 'Vernonia', 'Viburnum', 'Viola', 'Vitex', 'Vitis', 'Wyethia', 'Xerophyllum', 'Yucca', 'Zea', 'Zelkova', 'Zinnia', 'Zizia'
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
            $scope.hasPEP725Data = false;
            if ($scope.queryForm.$invalid) return true;
    	    usSpinnerService.spin('query-spinner');
	    var first = true
	    var last = false 
	    var count = 0
	    // loop through selected datasources using the queryParams.source
	    // element
	    for (var key in queryParams.source) {
		// The datasource, e.g. PEP725, NEON, USA-NPN, etc...
		var dataSource=queryParams.source[key]
                queryService.queryJson(queryParams.build(dataSource), 0, SOURCE, dataSource)
                    .then(queryJsonSuccess)
                    .catch(queryJsonFailed)
                    .finally(queryJsonFinally);
	    }

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
