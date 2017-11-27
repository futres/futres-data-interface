(function (angular) {
    'use strict';
         var app = angular.module('map.query');
    //var app = angular.module('map.query');
    app.controller('QueryFormController', QueryFormController);
    app.$inject = [  '$scope', 'ui-bootstrap', 'queryParams', 'queryService', 'queryMap', 'queryResults', 'usSpinnerService', 'alerts'];
    function QueryFormController($scope, queryParams, queryService, queryMap, queryResults, usSpinnerService, alerts) {
    //app.controller('QueryFormController', function ($scope, $rootScope, $timeout, queryParams,queryService,queryMap,queryResults,usSpinnerService,alerts,rzModule) {
        var vm = this;
        var _currentLayer = undefined;

        var SOURCE = ["latitude", "longitude", "startDayOfYear", "year", "dayOfYear", "genus", "specificEpithet", "source"];

        var vm = this;

	$scope.yearslider = {
	    minRange: 1950,
	    maxRange: 2018,
	    options: {
                floor: 1950,
                ceil: 2018,
		step: 1
	    }
	};
	$scope.dayslider = {
	    minRange: 1,
	    maxRange: 365,
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

	vm.scientificNames = [

'Abies alba', 'Abies balsamea', 'Abies balsamea (L.) Mill.', 'Abies concolor', 'Abies grandis', 'Abies lasiocarpa', 'Abies magnifica', 'Acacia berlandieri', 'Acacia greggii', 'Acacia koa', 'Acer circinatum', 'Acer glabrum', 'Acer grandidentatum', 'Acer macrophyllum', 'Acer negundo', 'Acer nigrum', 'Acer pensylvanicum', 'Acer pensylvanicum L.', 'Acer platanoides', 'Acer pseudoplatanus', 'Acer rubrum', 'Acer rubrum L.', 'Acer rubrum L. var. rubrum', 'Acer saccharinum', 'Acer saccharum', 'Acer saccharum Marshall', 'Acer spicatum', 'Achillea millefolium', 'Achlys triphylla', 'Actaea pachypoda', 'Actaea racemosa', 'Actinidia deliciosa', 'Adenostoma fasciculatum', 'Aesculus californica', 'Aesculus flava', 'Aesculus glabra', 'Aesculus hippocastanum', 'Aesculus pavia', 'Agave deserti', 'Agave lechuguilla', 'Agave murpheyi', 'Agave palmeri', 'Agave parryi', 'Ageratina altissima', 'Alliaria petiolata', 'Allium perdulce', 'Alnus glutinosa', 'Alnus incana', 'Alnus rubra', 'Alnus viridis', 'Alopecurus pratensis', 'Ambrosia artemisiifolia', 'Ambrosia dumosa', 'Ambrosia psilostachya', 'Amelanchier alnifolia', 'Amelanchier arborea', 'Amelanchier canadensis', 'Amelanchier grandiflora-autumnbrilliance', 'Amelanchier laevis', 'Amelanchier utahensis', 'Amorpha canescens', 'Anacardium excelsum', 'Andromeda polifolia', 'Andropogon gerardii', 'Andropogon gerardii Vitman', 'Andropogon virginicus L.', 'Anemone acutiloba', 'Anemone hepatica', 'Anemone nemorosa', 'Apocynum cannabinum', 'Aquilegia caerulea', 'Aquilegia canadensis', 'Aquilegia formosa', 'Aralia elata', 'Aralia nudicaulis', 'Aralia nudicaulis L.', 'Arbutus menziesii', 'Arbutus unedo', 'Arctostaphylos patula', 'Arctostaphylos pungens', 'Arctostaphylos uva-ursi', 'Arisaema triphyllum', 'Aristida beyrichiana Trin. & Rupr.', 'Aristida purpurea', 'Aristida purpurea Nutt.', 'Aristida stricta', 'Arnica alpina', 'Aronia arbutifolia', 'Artemisia absinthium L.', 'Artemisia californica', 'Artemisia douglasiana', 'Artemisia filifolia', 'Artemisia tridentata', 'Artemisia tridentata Nutt.', 'Artemisia vulgaris', 'Aruncus dioicus', 'Asarum canadense', 'Asclepias asperula', 'Asclepias cordifolia', 'Asclepias curassavica', 'Asclepias fascicularis', 'Asclepias humistrata', 'Asclepias incarnata', 'Asclepias latifolia', 'Asclepias linaria', 'Asclepias perennis', 'Asclepias speciosa', 'Asclepias subulata', 'Asclepias subverticillata', 'Asclepias sullivanti', 'Asclepias syriaca', 'Asclepias tuberosa', 'Asclepias verticillata', 'Asclepias viridis', 'Asimina obovata', 'Asimina reticulata Shuttlw. ex Chapm.', 'Asimina triloba', 'Asparagus officinalis', 'Atriplex canescens', 'Atriplex hymenelytra', 'Atropa belladonna', 'Avena sativa', 'Avicennia germinans', 'Baccharis halimifolia', 'Baccharis pilularis', 'Baccharis salicifolia', 'Baileya multiradiata', 'Balsamorhiza sagittata', 'Baptisia australis', 'Barbarea vulgaris', 'Berberis thunbergii', 'Berberis vulgaris', 'Beta vulgaris', 'Betula alleghaniensis', 'Betula glandulosa Michx.', 'Betula glandulosa/nana', 'Betula lenta', 'Betula nana', 'Betula nana L.', 'Betula nigra', 'Betula papyrifera', 'Betula pendula', 'Betula pubescens', 'Bouteloua curtipendula', 'Bouteloua dactyloides', 'Bouteloua dactyloides (Nutt.) J.T. Columbus', 'Bouteloua eriopoda (Torr.) Torr.', 'Bouteloua gracilis', 'Bouteloua gracilis (Willd. ex Kunth) Lag. ex Griffiths', 'Brassica napus', 'Brassica oleracea', 'Brassica rapa', 'Brassica tournefortii', 'Bromus diandrus Roth', 'Bromus inermis', 'Bromus inermis Leyss.', 'Bromus rubens', 'Bromus tectorum', 'Bromus tectorum L.', 'Bursera simaruba', 'Calamagrostis canadensis', 'Callicarpa americana', 'Calluna vulgaris', 'Caltha palustris', 'Calylophus hartwegii (Benth.) P.H. Raven ssp. fendleri (A. Gray) Towner & P.H. Raven', 'Calystegia sepium', 'Camassia quamash', 'Camissoniopsis cheiranthifolia', 'Campanula griffinii', 'Campsis radicans', 'Cardamine californica', 'Cardamine concatenata', 'Cardamine pratensis', 'Carex aquatilis', 'Carex bigelowii', 'Carex pensylvanica', 'Carex rupestris All.', 'Carnegiea gigantea', 'Carpinus betulus', 'Carpinus caroliniana', 'Carpinus caroliniana Walter', 'Carya cordiformis', 'Carya glabra', 'Carya illinoinensis', 'Carya ovata', 'Carya ovata (Mill.) K. Koch', 'Carya tomentosa', 'Castanea dentata', 'Castanea sativa', 'Castilleja miniata', 'Catalpa bignonioides', 'Caulophyllum thalictroides', 'Ceanothus americanus', 'Ceanothus cuneatus', 'Ceanothus greggii', 'Ceanothus integerrimus', 'Ceanothus prostratus', 'Ceanothus thyrsiflorus', 'Ceanothus velutinus', 'Celtis laevigata', 'Celtis laevigata Willd.', 'Celtis occidentalis', 'Celtis occidentalis L.', 'Celtis reticulata', 'Centaurea solstitialis', 'Centaurea stoebe', 'Cephalanthus occidentalis', 'Ceratocephala testiculata (Crantz) Roth', 'Cercis canadensis', 'Cercocarpus ledifolius', 'Cercocarpus montanus', 'Chamaecyparis thyoides', 'Chamaedaphne calyculata', 'Chamerion angustifolium', 'Cheirodendron trigynum', 'Chilopsis linearis', 'Chimaphila umbellata', 'Cirsium arvense', 'Cirsium occidentale', 'Cirsium vulgare', 'Cistus albidus', 'Citrus aurantium', 'Citrus limon', 'Citrus reticulata', 'Citrus sinensis', 'Citrus spp.', 'Citrus unshiu', 'Cladrastis kentukea', 'Claytonia lanceolata', 'Claytonia perfoliata', 'Claytonia virginica', 'Clematis vitalba', 'Clintonia borealis', 'Coccoloba uvifera', 'Colchicum autumnale', 'Coleogyne ramosissima', 'Conocarpus erectus', 'Convallaria majalis', 'Coptis laciniata', 'Coptis trifolia', 'Coreopsis lanceolata', 'Cornus alternifolia', 'Cornus canadensis', 'Cornus drummondii', 'Cornus drummondii C.A. Mey.', 'Cornus florida', 'Cornus florida L.', 'Cornus florida-appalachianspring', 'Cornus foemina', 'Cornus kousa', 'Cornus mas', 'Cornus nuttallii', 'Cornus racemosa', 'Cornus sericea', 'Corylus americana', 'Corylus avellana', 'Corylus cornuta', 'Corylus cornuta Marshall', 'Corylus cornuta Marshall var. californica (A. DC.) Sharp', 'Crataegus douglasii', 'Crataegus monogyna', 'Crataegus spp.', 'Crinum americanum', 'Crocus spp.', 'Cuscuta epithymum', 'Cyclamen purpurascens', 'Cydonia oblonga', 'Cynodon nlemfuensis Vanderyst', 'Cypripedium acaule', 'Cypripedium reginae', 'Cytisus scoparius', 'Dactylis glomerata', 'Dalea purpurea', 'Dasiphora floribunda', 'Dasylirion wheeleri', 'Datura wrightii', 'Daucus carota', 'Delphinium trolliifolium', 'Deschampsia cespitosa', 'Desmodium glutinosum', 'Desmodium glutinosum (Muhl. ex Willd.) Alph. Wood', 'Diapensia lapponica', 'Dicentra canadensis', 'Dicentra cucullaria', 'Dicentra formosa', 'Dichanthium annulatum (Forssk.) Stapf', 'Dichelostemma capitatum', 'Diospyros virginiana', 'Diplacus aurantiacus', 'Dittrichia viscosa', 'Dodecatheon meadia', 'Dodecatheon pulchellum', 'Dodonaea viscosa', 'Dryas octopetala', 'Echinacea purpurea', 'Echinocereus engelmannii', 'Eichhornia crassipes', 'Elaeagnus angustifolia', 'Empetrum nigrum', 'Encelia californica', 'Encelia farinosa', 'Enemion biternatum', 'Ephedra viridis Coville', 'Epigaea repens', 'Epilobium angustifolium', 'Epilobium canum', 'Epipactis helleborine', 'Ericameria laricifolia', 'Ericameria nauseosa', 'Erigeron peregrinus', 'Eriogonum fasciculatum', 'Eriogonum umbellatum', 'Eriophorum angustifolium', 'Eriophorum vaginatum', 'Eriophorum virginicum', 'Eriophyllum lanatum', 'Erodium botrys (Cav.) Bertol.', 'Erythronium albidum', 'Erythronium americanum', 'Erythronium oregonum', 'Eschscholzia californica', 'Escobaria vivipara', 'Euonymus alatus', 'Euphorbia esula', 'Eurybia divaricata', 'Euthamia caroliniana (L.) Greene ex Porter & Britton', 'Euthamia graminifolia', 'Eutrochium fistulosum', 'Eutrochium maculatum', 'Fagus grandifolia', 'Fagus grandifolia Ehrh.', 'Fagus sylvatica', 'Ferocactus wislizeni', 'Festuca arizonica', 'Festuca idahoensis', 'Ficus carica', 'Flourensia cernua', 'Foeniculum vulgare', 'Forestiera pubescens', 'Forsythia intermedia', 'Forsythia spp.', 'Forsythia suspensa', 'Fouquieria splendens', 'Fragaria chiloensis', 'Fragaria vesca', 'Fragaria virginiana', 'Frangula purshiana', 'Fraxinus americana', 'Fraxinus excelsior', 'Fraxinus latifolia', 'Fraxinus nigra', 'Fraxinus pennsylvanica', 'Fraxinus velutina', 'Fritillaria camschatcensis', 'Fritillaria pudica', 'Gaillardia pulchella', 'Galanthus nivalis', 'Gardenia angusta', 'Garrya elliptica', 'Garrya wrightii', 'Gaultheria procumbens', 'Gaultheria shallon', 'Gaultheria shallon Pursh', 'Gaylussacia baccata', 'Gelsemium sempervirens', 'Gentiana andrewsii', 'Gentianopsis crinita', 'Geranium maculatum', 'Geranium robertianum', 'Geranium sylvaticum', 'Geum peckii', 'Geum rossii', 'Geum rossii (R. Br.) Ser.', 'Ginkgo biloba', 'Gleditsia triacanthos', 'Glycine max', 'Goodyera oblongifolia', 'Gossypium barbadense', 'Gossypium hirsutum', 'Guaiacum sanctum', 'Guazuma ulmifolia', 'Gutierrezia sarothrae', 'Gymnanthes lucida Sw.', 'Halesia carolina', 'Hamamelis virginiana', 'Handroanthus guayacan', 'Hedera helix', 'Hedysarum alpinum', 'Helianthus annuus', 'Helleborus niger', 'Helleborus spp.', 'Hemerocallis fulva', 'Heracleum maximum', 'Hesperostipa comata', 'Hesperostipa comata (Trin. & Rupr.) Barkworth', 'Heteromeles arbutifolia', 'Hieracium aurantiacum', 'Hilaria jamesii', 'Holodiscus discolor', 'Hordeum vulgare', 'Hydrophyllum tenuipes', 'Hymenocallis occidentalis', 'Ilex aquifolium', 'Ilex cassine', 'Ilex decidua', 'Ilex decidua Walter', 'Ilex verticillata', 'Ilex vomitoria', 'Impatiens capensis', 'Ipomopsis aggregata', 'Iris douglasiana', 'Iris setosa', 'Iris tenax', 'Jacaranda copaia', 'Juglans major', 'Juglans nigra', 'Juglans nigra L.', 'Juglans regia', 'Juniperus ashei', 'Juniperus communis', 'Juniperus deppeana', 'Juniperus monosperma', 'Juniperus osteosperma', 'Juniperus pinchotii', 'Juniperus scopulorum', 'Juniperus virginiana', 'Kalmia angustifolia', 'Kalmia latifolia', 'Kosteletzkya virginica', 'Krascheninnikovia lanata', 'Krascheninnikovia lanata (Pursh) A. Meeuse & Smit', 'Laguncularia racemosa', 'Larix decidua', 'Larix laricina', 'Larix lyallii', 'Larix occidentalis', 'Larrea tridentata', 'Larrea tridentata (DC.) Coville', 'Lathyrus japonicus', 'Lathyrus littoralis', 'Laurus nobilis', 'Ledum groenlandicum', 'Ledum palustre', 'Ledum palustre L.', 'Leucaena leucocephala', 'Leucanthemum vulgare', 'Leucojum vernum', 'Leucophyllum frutescens', 'Lewisia rediviva', 'Leymus mollis', 'Liatris aspera', 'Liatris elegans', 'Liatris spicata', 'Licania michauxii', 'Ligustrum sinense', 'Ligustrum sinense Lour.', 'Ligustrum spp.', 'Lilium superbum', 'Limonium carolinianum', 'Lindera benzoin', 'Lindera benzoin (L.) Blume', 'Linnaea borealis', 'Linum  usitatissimum', 'Liquidambar styraciflua', 'Liquidambar styraciflua L.', 'Liriodendron tulipifera', 'Liriodendron tulipifera L.', 'Lobelia cardinalis', 'Lonicera involucrata', 'Lonicera japonica', 'Lonicera korolkowii-zabelii', 'Lonicera maackii', 'Lonicera maackii (Rupr.) Herder', 'Lonicera morrowii', 'Lonicera sempervirens', 'Lonicera tatarica', 'Lonicera tatarica-arnoldred', 'Lupinus andersonii', 'Lupinus arcticus', 'Lupinus latifolius', 'Lupinus obtusilobus', 'Lupinus perennis', 'Lupinus polyphyllus', 'Lupinus texensis', 'Lycium berlandieri', 'Lysichiton americanus', 'Lythrum salicaria', 'Magnolia fraseri', 'Magnolia grandiflora', 'Magnolia stellata', 'Magnolia tripetala', 'Magnolia virginiana', 'Mahonia aquifolium', 'Mahonia nervosa', 'Mahonia repens', 'Maianthemum canadense', 'Maianthemum dilatatum', 'Maianthemum racemosum', 'Malacothrix glabrata', 'Malosma laurina', 'Malus domestica', 'Malus floribunda', 'Malus pumila', 'Malus sieboldii', 'Malus spp.', 'Medeola virginiana', 'Medicago sativa', 'Melilotus officinalis', 'Mertensia virginica', 'Mespilus germanica', 'Metasequoia glyptostroboides', 'Metrosideros polymorpha', 'Microstegium vimineum', 'Microstegium vimineum (Trin.) A. Camus', 'Mimosa aculeaticarpa', 'Mimulus guttatus', 'Minuartia obtusiloba (Rydb.) House', 'Mitella diphylla', 'Monarda didyma', 'Monarda fistulosa', 'Moneses uniflora', 'Morella cerifera', 'Morella pensylvanica', 'Morus alba', 'Muhlenbergia porteri', 'Muhlenbergia rigens', 'Myoporum sandwicense', 'Myrica gale', 'Myriophyllum spicatum', 'Nassella pulchra', 'Nolina microcarpa', 'Nuphar lutea', 'Nymphaea odorata', 'Nyssa aquatica', 'Nyssa sylvatica', 'Oemleria cerasiformis', 'Oenothera biennis', 'Oenothera caespitosa', 'Oenothera speciosa', 'Olea europaea', 'Oligoneuron rigidum', 'Olneya tesota', 'Oplopanax horridus', 'Opuntia acanthocarpa', 'Opuntia basilaris', 'Opuntia humifusa', 'Opuntia imbricata', 'Opuntia santa-rita', 'Orobanche minor', 'Ostrya virginiana', 'Ostrya virginiana (Mill.) K. Koch', 'Oxalis montana', 'Oxalis oregana', 'Oxydendrum arboreum', 'Oxyria digyna', 'Panicum miliaceum L.', 'Panicum virgatum', 'Papaver rhoeas', 'Parkinsonia florida', 'Parkinsonia microphylla', 'Parthenocissus quinquefolia', 'Pascopyrum smithii', 'Passiflora incarnata', 'Pennisetum ciliare', 'Penstemon digitalis', 'Penstemon eatoni', 'Penstemon newberryi', 'Penstemon palmeri', 'Penstemon parryi', 'Penstemon pseudospectabilis', 'Persea americana', 'Persea borbonia', 'Petasites frigidus', 'Phacelia hastata', 'Phalaris arundinacea', 'Phellodendron amurense', 'Philadelphus coronarius', 'Philadelphus lewisii', 'Phlox divaricata', 'Phlox paniculata', 'Phragmites americanus', 'Phragmites australis', 'Physocarpus capitatus', 'Physocarpus malvaceus', 'Phytolacca americana', 'Picea abies', 'Picea engelmannii', 'Picea glauca', 'Picea glauca (Moench) Voss', 'Picea mariana', 'Picea mariana (Mill.) Britton, Sterns & Poggenb.', 'Picea rubens', 'Picea sitchensis', 'Pinus albicaulis', 'Pinus cembroides', 'Pinus contorta', 'Pinus edulis', 'Pinus elliottii', 'Pinus flexilis', 'Pinus jeffreyi', 'Pinus longaeva', 'Pinus monophylla', 'Pinus monticola', 'Pinus muricata', 'Pinus nigra', 'Pinus palustris', 'Pinus palustris Mill.', 'Pinus ponderosa', 'Pinus resinosa', 'Pinus strobus', 'Pinus sylvestris', 'Pinus taeda', 'Pinus taeda L.', 'Pisonia albida (Heimerl) Britton ex Standl.', 'Pithecellobium dulce (Roxb.) Benth.', 'Platanus occidentalis', 'Platanus racemosa', 'Pleuraphis jamesii Torr.', 'Poa pratensis', 'Poa pratensis L.', 'Podophyllum peltatum', 'Polemonium pulcherrimum', 'Polygonatum biflorum', 'Polygonum cuspidatum', 'Poncirus trifoliata', 'Pontederia cordata', 'Populus alba', 'Populus angustifolia', 'Populus balsamifera', 'Populus canadensis', 'Populus canescens', 'Populus deltoides', 'Populus fremontii', 'Populus grandidentata', 'Populus nigra', 'Populus tremula', 'Populus tremuloides', 'Populus tremuloides Michx.', 'Populus trichocarpa', 'Potentilla simplex', 'Prosopis glandulosa', 'Prosopis glandulosa Torr.', 'Prosopis juliflora', 'Prosopis pubescens', 'Prosopis sp.', 'Prosopis velutina', 'Prunus americana', 'Prunus amygdalus', 'Prunus armeniaca', 'Prunus avium', 'Prunus cerasifera', 'Prunus cerasus', 'Prunus domestica', 'Prunus dulcis', 'Prunus emarginata', 'Prunus ilicifolia', 'Prunus laurocerasus', 'Prunus maritima', 'Prunus padus', 'Prunus pensylvanica', 'Prunus persica', 'Prunus serotina', 'Prunus serrulata', 'Prunus spinosa', 'Prunus tomentosa', 'Prunus virginiana', 'Prunus yedoensis', 'Pseudobombax septenatum', 'Pseudoroegneria spicata', 'Pseudotsuga menziesii', 'Pseudotsuga menziesii (Mirb.) Franco var. menziesii', 'Pueraria montana', 'Pulsatilla patens', 'Punica granatum', 'Purshia stansburiana', 'Purshia tridentata', 'Pyrus calleryana', 'Pyrus communis', 'Quercus agrifolia', 'Quercus alba', 'Quercus arizonica', 'Quercus douglasii', 'Quercus douglasii Hook. & Arn.', 'Quercus emoryi', 'Quercus falcata', 'Quercus falcata Michx.', 'Quercus gambelii', 'Quercus garryana', 'Quercus geminata', 'Quercus ilex', 'Quercus ilicifolia', 'Quercus imbricaria', 'Quercus kelloggii', 'Quercus laevis', 'Quercus laevis Walter', 'Quercus laurifolia', 'Quercus lobata', 'Quercus macrocarpa', 'Quercus marilandica Münchh.', 'Quercus montana', 'Quercus montana Willd.', 'Quercus palustris', 'Quercus phellos', 'Quercus robur', 'Quercus rubra', 'Quercus rubra L.', 'Quercus shumardii', 'Quercus vacciniifolia', 'Quercus velutina', 'Quercus virginiana', 'Ranunculus ficaria', 'Ranunculus glaberrimus', 'Raphanus raphanistrum', 'Ratibida columnifera', 'Ratibida pinnata', 'Rhamnus californica ', 'Rhamnus cathartica', 'Rhamnus davurica Pall.', 'Rhizophora mangle', 'Rhododendron macrophyllum', 'Rhododendron maximum', 'Rhododendron occidentale ', 'Rhododendron periclymenoides', 'Rhus aromatica', 'Rhus copallinum', 'Rhus glabra', 'Rhus integrifolia', 'Rhus ovata', 'Rhus typhina', 'Ribes alpinum', 'Ribes aureum', 'Ribes cereum', 'Ribes grossularia', 'Ribes montigenum', 'Ribes roezlii', 'Ribes rubrum', 'Ribes sanguineum', 'Robinia neomexicana', 'Robinia pseudoacacia', 'Romneya coulteri', 'Rorippa nasturtium-aquaticum', 'Rosa acicularis', 'Rosa californica', 'Rosa gymnocarpa', 'Rosa multiflora', 'Rosa nutkana', 'Rosa rugosa', 'Rosa woodsii', 'Rosmarinus officinalis', 'Rubus discolor', 'Rubus idaeus', 'Rubus laciniatus', 'Rubus parviflorus', 'Rubus rubus', 'Rubus spectabilis', 'Rubus ursinus', 'Rudbeckia hirta', 'Sabal palmetto', 'Salix acutifolia', 'Salix arctica', 'Salix aurita', 'Salix caprea', 'Salix caroliniana', 'Salix discolor', 'Salix exigua', 'Salix glauca', 'Salix gooddingii', 'Salix hookeriana', 'Salix laevigata', 'Salix lasiolepis', 'Salix nigra', 'Salix planifolia', 'Salix reticulata', 'Salix scouleriana', 'Salix smithiana', 'Salix viminalis', 'Salvia apiana', 'Salvia columbariae', 'Salvia dorrii', 'Salvia mellifera', 'Salvia spathacea', 'Sambucus nigra', 'Sambucus nigra-cerulea', 'Sambucus racemosa', 'Sanguinaria canadensis', 'Sarracenia purpurea', 'Sassafras albidum', 'Satureja montana', 'Schizachyrium scoparium', 'Schizachyrium scoparium (Michx.) Nash', 'Schoenoplectus acutus', 'Scilla siberica', 'Scirpus microcarpus', 'Secale cereale', 'Senna covesii', 'Serenoa repens', 'Shepherdia argentea (Pursh) Nutt.', 'Shepherdia canadensis', 'Silphium laciniatum', 'Simmondsia chinensis', 'Sisyrinchium bellum', 'Solanum dulcamara', 'Solanum elaeagnifolium', 'Solanum tuberosum', 'Solidago altissima L.', 'Solidago canadensis', 'Solidago missouriensis', 'Solidago rugosa', 'Solidago sempervirens', 'Solidago stricta', 'Sophora chrysophylla', 'Sorbus americana', 'Sorbus aucuparia', 'Sorghastrum nutans (L.) Nash', 'Spartium junceum', 'Sphaeralcea coccinea', 'Spigelia marilandica', 'Spiraea alba', 'Spiraea douglasii', 'Spiraea vanhouttei', 'Spondias mombin', 'Sporobolus airoides', 'Sterculia apetala', 'Symphoricarpos albus', 'Symphoricarpos occidentalis Hook.', 'Symphoricarpos orbiculatus Moench', 'Symphoricarpos oreophilus', 'Symphyotrichum ericoides', 'Symphyotrichum novae-angliae', 'Symplocarpus foetidus', 'Synthyris reniformis', 'Syringa chinensis', 'Syringa pubescens', 'Syringa vulgaris', 'Tabebuia heterophylla', 'Tabebuia rosea', 'Tamarix spp.', 'Taraxacum officinale', 'Taxodium distichum', 'Taxus cuspidata', 'Tellima grandiflora', 'Tephrosia virginiana', 'Thalictrum thalictroides', 'Thelesperma filifolium (Hook.) A. Gray', 'Thuja plicata', 'Thymus vulgaris', 'Tiarella cordifolia', 'Tilia americana', 'Tilia cordata', 'Tilia platyphyllos', 'Tillandsia usneoides', 'Toxicodendron diversilobum', 'Toxicodendron radicans', 'Tradescantia ohiensis', 'Triadica sebifera', 'Trientalis borealis', 'Trifolium pratense', 'Trifolium repens', 'Trillium erectum', 'Trillium grandiflorum', 'Trillium ovatum', 'Trillium undulatum', 'Triticum aestivum', 'Triticum aestivum L.', 'Triticum spp.', 'Tsuga canadensis', 'Tsuga canadensis (L.) Carrière', 'Tsuga heterophylla', 'Tsuga mertensiana', 'Tulipa clusiana', 'Tussilago farfara', 'Ulmus alata', 'Ulmus americana', 'Ulmus crassifolia', 'Ulmus minor', 'Ulmus pumila', 'Ulmus rubra', 'Umbellularia californica', 'Urochloa maxima', 'Urochloa maxima (Jacq.) R. Webster', 'Urtica dioica', 'Uvularia grandiflora', 'Uvularia sessilifolia', 'Vaccinium angustifolium', 'Vaccinium arboreum', 'Vaccinium arboreum Marshall', 'Vaccinium corymbosum', 'Vaccinium macrocarpon', 'Vaccinium membranaceum', 'Vaccinium myrtillus', 'Vaccinium ovatum', 'Vaccinium oxycoccos', 'Vaccinium parvifolium', 'Vaccinium uliginosum', 'Vaccinium uliginosum L.', 'Vaccinium virgatum', 'Vaccinium vitis-idaea', 'Vaccinium vitis-idaea L.', 'Vachellia constricta', 'Veratrum californicum', 'Veratrum viride', 'Verbesina alternifolia', 'Verbesina encelioides', 'Verbesina virginica', 'Vernonia baldwinii Torr.', 'Vernonia fasciculata', 'Vernonia noveboracensis', 'Viburnum acerifolium', 'Viburnum dentatum', 'Viburnum lantanoides', 'Viburnum obovatum', 'Viburnum prunifolium', 'Viola glabella', 'Viola sempervirens', 'Viola sororia', 'Vitex agnus-castus', 'Vitis arizonica', 'Vitis labrusca', 'Vitis vinifera', 'Wyethia mollis', 'Xerophyllum tenax', 'Yucca baccata', 'Yucca brevifolia', 'Yucca elata', 'Yucca elata (Engelm.) Engelm.', 'Yucca glauca', 'Yucca schidigera', 'Zea mays', 'Zea mays L.', 'Zelkova serrata', 'Zinnia acerosa (DC.) A. Gray', 'Zizia aurea',
	];

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
