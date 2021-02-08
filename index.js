import './style.css';
import './index.html';

//Le a API a partir do endereco fornecido 
	var dados = $.getJSON("https://apitempo.inmet.gov.br/geada",
		function(data) { addDataToMap(data, map); });

//Define o mapa, controle de zoom (se mostra ou nao), setView (ponto central do mapa), nivel de zoom
	var map = L.map('map', { zoomControl: false }).setView([-24.287027, -51.767578], 5 );
	var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);

//Desabilita alguns comportamentos do mapa, como zoom e drag.
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();

// Adiciona Legenda
	var legend = L.control({position: 'bottomright'});
	legend.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend'),
			labels = ['<strong>Intensidade da Geada</strong><br>','<img src="vm.png" width="15%" style="vertical-align:middle"> Forte', '<img src="am.png" width="15%" style="vertical-align:middle"> Moderada', '<img src="az.png" width="15%" style="vertical-align:middle"> Fraca'],
			from, to;
		div.innerHTML = labels.join('<br>');
		return div;
			};
	legend.addTo(map);

// Adiciona dados ao mapa a partir do Geojson (temperatura, latitude, longitude, cidade, estado, codigo da estacao, data da medicao e a intensidade da geada). Tambem é aqui que sao definidos os conteudos de popup e tooltip.

	function addDataToMap(data, map) {
    var dataLayer = L.geoJson(data);
        for (i = 0; i < data.length; i++) {
        	function calculaIntensidade() {
					  if (data[i].TEMP_MIN>=3) {
					    return 'Fraca';
					  } else if ( data[i].TEMP_MIN<3 && data[i].TEMP_MIN>=1) {
					    return 'Moderada';
					  } else if ( data[i].TEMP_MIN<1 && data[i].TEMP_MIN!='') {
					    return 'Forte';
					  } else (data[i].TEMP_MIN=='')
					    return 'Indefinida'
					}

//se o retorno de CalculaIntensidade for Fraca, use o icone azul, se moderada, o icone amarelo e se forte o vermelho.

  	var latitude = data[i].LATITUDE;
  	var longitude = data[i].LONGITUDE;

	console.log("Intensidade: "+calculaIntensidade()); 

  	var popupContent1 = "<style> table {font-family: arial, sans-serif; border-collapse: collapse; width: 100%;} td, th {border: 1px solid #dddddd; text-align: center; padding: 3px;} tr:nth-child(even) {background-color: #dddddd;}</style></head><body> \
  		<h4>Estação: "+data[i].NOME+" - "+data[i].UF+" ("+data[i].CODIGO+")</h4> \
  		<table><tr><th>Data</th><th>Temperatura <br>Mínima (C.º)</th><th>Intensidade</th></tr>\
	  	<tr><td>"

	var popupContent2 = data[i].DT_MEDICAO+"</td><td>" +data[i].TEMP_MIN+ "</td><td>"+calculaIntensidade()+"</td></tr></table>"

	//console.log("Cidade: "+data[i].CODIGO+ " - UF: " +data[i].UF+" - Intensidade: "+ intensidade());	
	//console.log(intensidade().toString());

	var popupContent = popupContent1+popupContent2
  	var tooltipContent = (data[i].NOME+ " - " +data[i].UF+ "<br> "
)

//icones por Intensidade
	var Forte = L.icon({
    iconUrl: "vm.png",
    iconAnchor: [15, 32],
    popupAnchor: [0, -30],
	});
	var Moderada = L.icon({
    iconUrl: 'am.png',
    iconAnchor: [15, 32],
    popupAnchor: [0, -30],
	});
	var Fraca = L.icon({
    iconUrl: 'az.png',
    iconAnchor: [15, 32],
    popupAnchor: [0, -30],
	});

// adiciona marcadores ao mapa, incluindo os conteudos de popup e tooltip adicionados anteriormente. {icon: Forte/Moderada/Fraca/square} mudam a cor do icone no mapa. 
	var geada = L.marker([latitude,longitude], {icon: Fraca}).addTo(map).bindPopup(popupContent).bindTooltip(tooltipContent);}dataLayer.addTo(map);}


//ExtraMarkers - https://github.com/coryasilva/Leaflet.ExtraMarkers
  var square = L.ExtraMarkers.icon({
    icon: 'fa-snowflake',
    markerColor: 'red',
    shape: 'square',
    prefix: 'fa'
  });

// Adiciona poligono do Brasil a partir do Wicket
    var wicket = new Wkt.Wkt();
	var brasil = wicket.read('POLYGON((-48.057736 -25.262082,-48.2301409999999 -25.469584,-48.129581 -25.2690289999999,-48.317081 -25.36514,-48.427081 -25.226805,-48.4740289999999 -25.480694,-48.7418069999999 -25.366806,-48.7087529999999 -25.4995839999999,-48.348474 -25.580694,-48.5351369999999 -25.852916,-48.7212489999999 -25.867083,-48.563752 -25.8643049999999,-48.584583 -26.173194,-48.7056959999999 -26.249027,-48.8101379999999 -26.0895809999999,-48.619025 -26.4518039999999,-48.7134699999999 -26.306804,-48.4926379999999 -26.217637,-48.688751 -26.678474,-48.6076389999999 -27.116806,-48.464862 -27.143194,-48.624584 -27.243749,-48.572918 -27.8865269999999,-48.7481949999999 -28.495138,-48.7018059999999 -28.2370829999999,-48.882637 -28.341807,-48.76014 -28.5379159999999,-49.706528 -29.3112509999999,-50.790973 -31.136249,-52.083473 -32.159027,-52.0979159999999 -31.8354169999999,-51.85875 -31.8698609999999,-51.254581 -31.4737499999999,-51.170417 -31.0654149999999,-50.701923 -30.7463089999999,-50.717476 -30.351968,-50.574355 -30.4814579999999,-50.5964279999999 -30.194925,-50.929973 -30.435754,-51.3001409999999 -30.005139,-51.2962479999999 -30.3020849999999,-51.094859 -30.365693,-51.2737509999999 -30.496805,-51.283196 -30.8123609999999,-51.369862 -30.6348619999999,-51.4418079999999 -31.087361,-51.9512489999999 -31.3418059999999,-52.0323589999999 -31.6948599999999,-52.111251 -31.5543059999999,-52.2570839999999 -31.849862,-52.1118049999999 -31.9520839999999,-52.2529179999999 -32.0470849999999,-52.079029 -32.0279149999999,-52.0981939999999 -32.1606949999999,-52.613195 -33.0862499999999,-53.373749 -33.747081,-53.5301749999999 -33.6623879999999,-53.5289189999999 -33.1723439999999,-53.0942449999999 -32.724191,-53.5941389999999 -32.4286049999999,-53.7133669999999 -32.10115,-54.525264 -31.498034,-55.2443539999999 -31.253818,-55.5927929999999 -30.8448999999999,-56.0078169999999 -31.062644,-56.020671 -30.7815009999999,-56.8350839999999 -30.0882,-57.550021 -30.263618,-57.615211 -30.179105,-55.8740469999999 -28.3593749999999,-55.6949049999999 -28.422416,-55.7723729999999 -28.2441259999999,-55.031884 -27.853931,-54.808007 -27.5330169999999,-54.2823739999999 -27.447117,-54.175957 -27.2606919999999,-53.797855 -27.1445639999999,-53.5918349999999 -26.2648879999999,-53.889825 -25.622438,-54.100365 -25.622523,-54.109864 -25.501548,-54.42947 -25.7030879999999,-54.5956409999999 -25.592119,-54.2812509999999 -24.071744,-54.667129 -23.8125649999999,-55.4118799999999 -23.958574,-55.521 -23.194309,-55.6851959999999 -22.9905289999999,-55.6121109999999 -22.65574,-55.8533439999999 -22.2785949999999,-56.2077379999999 -22.278108,-56.402675 -22.07474,-56.8304659999999 -22.2976669999999,-57.9883149999999 -22.081812,-57.8171609999999 -20.973692,-58.162831 -20.1597599999999,-57.8709489999999 -19.9764969999999,-58.1333999999999 -19.757842,-57.453851 -18.2311989999999,-57.7522309999999 -17.564458,-58.3954619999999 -17.18446,-58.4705209999999 -16.70303,-58.3203099999999 -16.2690299999999,-60.171982 -16.2621169999999,-60.2352329999999 -15.4735319999999,-60.5614859999999 -15.108008,-60.244247 -15.096813,-60.46772 -13.8009609999999,-61.0690389999999 -13.4634299999999,-61.82428 -13.53925,-62.1196589999999 -13.15354,-62.7644689999999 -13.02264,-63.093431 -12.657951,-63.3265609999999 -12.7049199999999,-63.7121199999999 -12.4578589999999,-64.2908859999999 -12.501411,-64.5127869999999 -12.222871,-65.0320589999999 -11.995081,-65.3613669999999 -11.25136,-65.250892 -10.984551,-65.4167859999999 -10.6186899999999,-65.2799539999999 -10.218301,-65.3949749999999 -9.68578099999991,-65.5604009999999 -9.84464999999994,-65.7682719999999 -9.73557099999994,-66.555549 -9.88398099999995,-67.70793 -10.7108099999999,-68.0598379999999 -10.6794109999999,-68.5435409999999 -11.110361,-69.4167849999999 -10.92746,-70.6278609999999 -11.0039299999999,-70.6303409999999 -9.82503999999994,-70.4963909999999 -9.42401999999998,-71.221558 -9.97024899999991,-72.1803349999999 -10.0002489999999,-72.35752 -9.49439899999999,-73.2093969999999 -9.41364899999991,-72.9540699999999 -8.98316899999992,-73.5289679999999 -8.35053099999993,-73.7737729999999 -7.90415099999996,-73.687202 -7.77561899999995,-73.988244 -7.55580999999995,-73.953391 -7.34610899999996,-73.690368 -7.31056999999998,-73.71083 -6.84003999999999,-73.131988 -6.50683999999995,-73.23581 -6.03168999999991,-72.820747 -5.10279899999995,-71.9067459999999 -4.51523099999997,-70.9367819999999 -4.38428999999996,-70.6452329999999 -4.12754799999993,-69.955521 -4.38516099999998,-69.368347 -1.33370099999996,-69.5932999999999 -0.516705999999942,-70.0680159999999 -0.134779999999921,-70.037346 0.553020000000004,-69.4682069999999 0.734350000000006,-69.1119299999999 0.642761000000064,-69.256722 1.02550100000008,-69.8540719999999 1.06975,-69.8551859999999 1.71492100000006,-68.1286479999999 1.73195100000009,-68.28955 1.84132000000005,-68.2187809999999 2.00652000000002,-67.941512 1.83070100000003,-67.3894119999999 2.24398100000008,-67.0974959999999 1.73257100000006,-67.0882789999999 1.16687100000013,-66.8570329999999 1.23018100000013,-66.3185119999999 0.755015000000128,-65.5855789999999 1.00891100000001,-65.5405499999999 0.648760000000095,-65.103088 1.156631,-64.7466359999999 1.22541699999994,-64.3974449999999 1.52681000000013,-64.3380049999999 1.36349400000006,-63.9954939999999 1.97986800000001,-63.3722759999999 2.2117090000001,-63.406807 2.43591000000009,-64.0560529999999 2.49765100000013,-63.9938239999999 2.76987400000007,-64.2352299999999 3.11431900000008,-64.185775 3.55958700000008,-64.796914 4.28569899999997,-64.5604939999999 4.10153400000007,-64.16439 4.12625100000002,-63.964108 3.86792199999996,-63.6768849999999 4.0190290000001,-63.497428 3.83986400000015,-63.4288169999999 3.97708799999998,-63.2049279999999 3.95125200000001,-62.9601969999999 3.60764700000004,-62.743804 3.67320000000001,-62.7485269999999 4.03486900000013,-61.9344059999999 4.11807099999999,-61.5232949999999 4.28225800000001,-61.3447499999999 4.53184400000004,-60.9913339999999 4.51606300000009,-60.589536 4.94276100000013,-60.730518 5.19712100000004,-60.2031449999999 5.26487800000012,-59.9694169999999 5.07307900000006,-60.1627579999999 4.52265000000011,-59.6734169999999 4.38313500000004,-59.7257679999999 4.19281800000005,-59.5157389999999 3.94142500000009,-59.8491969999999 3.60053200000004,-59.9815739999999 2.92923299999995,-59.909711 2.38966400000015,-59.723751 2.278232,-59.753337 1.862413,-58.795532 1.17695200000009,-58.50711 1.26440699999995,-58.3254579999999 1.59065800000002,-58.0079149999999 1.50234100000006,-57.999405 1.66695900000002,-57.5550239999999 1.69702700000011,-57.3023979999999 1.99007600000016,-55.9569239999999 1.84433300000012,-55.911927 2.04214600000006,-56.1331489999999 2.26415199999997,-55.948208 2.53200500000003,-55.3701829999999 2.40745700000008,-54.939891 2.63248000000004,-54.8638159999999 2.43851000000012,-54.313642 2.15938900000009,-54.1100529999999 2.1289460000001,-53.7835469999999 2.36567300000002,-52.904664 2.19118299999997,-52.554726 2.52337100000011,-52.346515 3.13536000000005,-51.5106919999999 4.44125000000008,-51.214026 4.14847299999997,-51.1795839999999 3.81569399999995,-51.0756939999999 3.89180500000003,-51.0415279999999 3.12958300000003,-50.6887519999999 2.13486099999994,-50.4598629999999 1.81541700000002,-49.918472 1.68819400000001,-50.0104169999999 0.312639000000104,-49.569306 0.385417000000132,-49.3245839999999 -0.161805999999899,-48.4370839999999 -0.231248999999934,-48.0176389999999 -0.699305999999979,-47.7848619999999 -0.587918000000002,-47.703752 -0.701805999999976,-47.6645849999999 -0.578194999999994,-47.428749 -0.761528999999939,-47.476529 -0.592916000000002,-47.3206949999999 -0.591527999999983,-47.168194 -0.819861000000003,-47.087359 -0.680972999999938,-47.10097 -0.8534709999999,-46.967641 -0.706527999999992,-46.7493069999999 -0.944305999999983,-46.637916 -0.791804999999954,-46.668194 -0.978194999999971,-46.4270819999999 -0.867359999999962,-46.4776379999999 -1.02735999999993,-46.318475 -1.02347199999997,-46.202362 -0.890415999999902,-46.2170829999999 -1.00458199999991,-45.96347 -1.05569399999996,-45.980415 -1.25874899999997,-45.8590279999999 -1.05124999999998,-45.9104159999999 -1.25791699999996,-45.714028 -1.119305,-45.6851389999999 -1.32180599999998,-45.630139 -1.12208299999998,-45.7004169999999 -1.37152799999996,-45.412083 -1.29763799999995,-45.488751 -1.48291599999993,-45.305695 -1.33652699999993,-45.3379179999999 -1.76819499999999,-45.154304 -1.47013899999996,-44.682641 -1.56458399999991,-44.83736 -1.82097299999998,-44.608195 -1.73486099999997,-44.4815299999999 -2.04236199999997,-44.6890249999999 -2.29097199999995,-44.4631969999999 -2.1462489999999,-44.302361 -2.487639,-44.0284719999999 -2.40902699999992,-44.235137 -2.77541599999995,-43.531529 -2.41930600000001,-43.4568059999999 -2.59736099999992,-43.464028 -2.42208399999998,-43.3479149999999 -2.44097099999993,-43.481803 -2.37263799999999,-43.3256939999999 -2.33680599999991,-42.2656929999999 -2.75680499999999,-42.281806 -2.8615289999999,-42.0065279999999 -2.715416,-41.340694 -2.92680499999994,-39.991806 -2.839583,-38.4634699999999 -3.70680499999992,-37.147641 -4.95263799999992,-36.6940269999999 -5.09652699999998,-35.9498589999999 -5.04347300000001,-35.3962529999999 -5.24624999999997,-34.7929149999999 -7.15402799999998,-34.947083 -8.3954159999999,-35.3034709999999 -9.18930499999993,-36.384582 -10.4998599999999,-36.8220819999999 -10.7168049999999,-37.3181949999999 -11.425417,-37.4456949999999 -11.406528,-37.547916 -11.548473,-37.3490299999999 -11.459306,-37.682919 -12.0926389999999,-38.244862 -12.852918,-38.5331959999999 -13.011527,-38.427082 -12.7665289999999,-38.695138 -12.5798609999999,-38.812085 -12.841805,-38.899307 -12.690696,-38.930973 -12.860972,-38.72014 -12.8768049999999,-39.0981939999999 -13.5651379999999,-38.914584 -13.3734719999999,-38.890694 -13.6534709999999,-38.99014 -13.8434729999999,-39.1509709999999 -13.753751,-39.004307 -13.854028,-39.0837509999999 -14.009027,-38.928195 -13.907638,-39.0681959999999 -14.7393059999999,-38.855694 -15.8565269999999,-39.2140279999999 -17.1693069999999,-39.137085 -17.6909709999999,-39.350419 -17.7170829999999,-39.2056959999999 -17.7720829999999,-39.4176419999999 -17.8643059999999,-39.7145839999999 -18.4612509999999,-39.810417 -19.649305,-40.233196 -19.90986,-40.1318039999999 -19.965972,-40.229584 -20.2951389999999,-40.379307 -20.2781929999999,-40.265973 -20.324307,-40.3587489999999 -20.519305,-40.7556949999999 -20.8598609999999,-41.0690259999999 -21.4970839999999,-40.98875 -22.0073599999999,-41.9623609999999 -22.534583,-41.8634709999999 -22.7568059999999,-42.0129159999999 -22.997638,-43.05153 -22.9823609999999,-43.085694 -22.67736,-43.2559729999999 -22.737916,-43.149861 -22.9509719999999,-43.2862509999999 -23.017083,-44.007085 -23.0965269999999,-43.562362 -23.0584719999999,-43.8451229999999 -22.8911539999999,-44.6687499999999 -23.054862,-44.5856939999999 -23.3601389999999,-45.059307 -23.418751,-45.416249 -23.6315269999999,-45.4318039999999 -23.833472,-46.3768049999999 -23.872083,-46.398472 -24.034027,-48.0218049999999 -25.0001389999999,-47.894306 -25.1068069999999,-48.057736 -25.262082))').toObject(); 
		brasil.addTo(map);
		wicket.fromObject(brasil.setStyle({fillColor: 'green', color: 'green', weight: 1}));
