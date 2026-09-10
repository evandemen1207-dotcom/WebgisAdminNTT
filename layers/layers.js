var wms_layers = [];


        var lyr_ESRISatellite_0 = new ol.layer.Tile({
            'title': 'ESRI Satellite',
            'type':'base',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
            attributions: ' ',
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            })
        });
var format_BatasAdministrasiKabupatenKotaProvinsiNTT_1 = new ol.format.GeoJSON();
var features_BatasAdministrasiKabupatenKotaProvinsiNTT_1 = format_BatasAdministrasiKabupatenKotaProvinsiNTT_1.readFeatures(json_BatasAdministrasiKabupatenKotaProvinsiNTT_1, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_BatasAdministrasiKabupatenKotaProvinsiNTT_1 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_BatasAdministrasiKabupatenKotaProvinsiNTT_1.addFeatures(features_BatasAdministrasiKabupatenKotaProvinsiNTT_1);
var lyr_BatasAdministrasiKabupatenKotaProvinsiNTT_1 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_BatasAdministrasiKabupatenKotaProvinsiNTT_1, 
                style: style_BatasAdministrasiKabupatenKotaProvinsiNTT_1,
                popuplayertitle: 'Batas Administrasi Kabupaten/Kota Provinsi NTT',
                interactive: true,
    title: 'Batas Administrasi Kabupaten/Kota Provinsi NTT<br />\
    <img src="styles/legend/BatasAdministrasiKabupatenKotaProvinsiNTT_1_0.png" /> Alor<br />\
    <img src="styles/legend/BatasAdministrasiKabupatenKotaProvinsiNTT_1_1.png" /> Belu<br />\
    <img src="styles/legend/BatasAdministrasiKabupatenKotaProvinsiNTT_1_2.png" /> Ende<br />\
    <img src="styles/legend/BatasAdministrasiKabupatenKotaProvinsiNTT_1_3.png" /> Flores Timur<br />\
    <img src="styles/legend/BatasAdministrasiKabupatenKotaProvinsiNTT_1_4.png" /> Kota Kupang<br />\
    <img src="styles/legend/BatasAdministrasiKabupatenKotaProvinsiNTT_1_5.png" /> Kupang<br />\
    <img src="styles/legend/BatasAdministrasiKabupatenKotaProvinsiNTT_1_6.png" /> Lembata<br />\
    <img src="styles/legend/BatasAdministrasiKabupatenKotaProvinsiNTT_1_7.png" /> Malaka<br />\
    <img src="styles/legend/BatasAdministrasiKabupatenKotaProvinsiNTT_1_8.png" /> Manggarai<br />\
    <img src="styles/legend/BatasAdministrasiKabupatenKotaProvinsiNTT_1_9.png" /> Manggarai Barat<br />\
    <img src="styles/legend/BatasAdministrasiKabupatenKotaProvinsiNTT_1_10.png" /> Manggarai Timur<br />\
    <img src="styles/legend/BatasAdministrasiKabupatenKotaProvinsiNTT_1_11.png" /> Nagekeo<br />\
    <img src="styles/legend/BatasAdministrasiKabupatenKotaProvinsiNTT_1_12.png" /> Ngada<br />\
    <img src="styles/legend/BatasAdministrasiKabupatenKotaProvinsiNTT_1_13.png" /> Rote Ndao<br />\
    <img src="styles/legend/BatasAdministrasiKabupatenKotaProvinsiNTT_1_14.png" /> Sabu Raijua<br />\
    <img src="styles/legend/BatasAdministrasiKabupatenKotaProvinsiNTT_1_15.png" /> Sikka<br />\
    <img src="styles/legend/BatasAdministrasiKabupatenKotaProvinsiNTT_1_16.png" /> Sumba Barat<br />\
    <img src="styles/legend/BatasAdministrasiKabupatenKotaProvinsiNTT_1_17.png" /> Sumba Barat Daya<br />\
    <img src="styles/legend/BatasAdministrasiKabupatenKotaProvinsiNTT_1_18.png" /> Sumba Tengah<br />\
    <img src="styles/legend/BatasAdministrasiKabupatenKotaProvinsiNTT_1_19.png" /> Sumba Timur<br />\
    <img src="styles/legend/BatasAdministrasiKabupatenKotaProvinsiNTT_1_20.png" /> Timor Tengah Selatan<br />\
    <img src="styles/legend/BatasAdministrasiKabupatenKotaProvinsiNTT_1_21.png" /> Timor Tengah Utara<br />' });

lyr_ESRISatellite_0.setVisible(true);lyr_BatasAdministrasiKabupatenKotaProvinsiNTT_1.setVisible(true);
var layersList = [lyr_ESRISatellite_0,lyr_BatasAdministrasiKabupatenKotaProvinsiNTT_1];
lyr_BatasAdministrasiKabupatenKotaProvinsiNTT_1.set('fieldAliases', {'METADATA': 'METADATA', 'SRS_ID': 'SRS_ID', 'WADMKK': 'WADMKK', 'UUPP': 'UUPP', });
lyr_BatasAdministrasiKabupatenKotaProvinsiNTT_1.set('fieldImages', {'METADATA': 'TextEdit', 'SRS_ID': 'TextEdit', 'WADMKK': 'TextEdit', 'UUPP': 'TextEdit', });
lyr_BatasAdministrasiKabupatenKotaProvinsiNTT_1.set('fieldLabels', {'METADATA': 'hidden field', 'SRS_ID': 'hidden field', 'WADMKK': 'no label', 'UUPP': 'hidden field', });
lyr_BatasAdministrasiKabupatenKotaProvinsiNTT_1.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});