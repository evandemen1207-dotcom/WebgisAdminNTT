/**
 * WEBGIS Batas Admin NTT
 * Modern Geospatial Portal Engine
 */

// Global state
window.webgis = {
  map: null,
  vectorLayer: null,
  highlightLayer: null,
  measureLayer: null,
  measureDraw: null,
  activeBasemap: 'satellite',
  basemapLayers: {},
  features: [],
  selectedFeature: null,
  fillOpacity: 0.45,
  strokeWidth: 1.5,
  showLabels: true,
  colorMode: 'categorical', // 'categorical' | 'emerald' | 'sapphire' | 'amber'
  activeTab: 'regions',
  activeZoneFilter: 'all',
  searchQuery: '',
  sortBy: 'name-asc',
  measureMode: null, // null | 'LineString' | 'Polygon'
  coordFormat: 'DD', // 'DD' (Decimal Degrees) | 'DMS' (Degrees Minutes Seconds)
  lastPointerCoord: null,
  swipeActive: false,
  swipePosition: 50,
  swipeLeft: 'satellite',
  swipeRight: 'topo',
  windActive: false,
  windPattern: 'muson_tenggara',
  windSpeedLevel: 'medium',
  windDensity: 1100,
  windLineWidth: 0.85,
};

// Main island center point for each region (to guarantee single centered label)
const MAIN_ISLAND_CENTERS = {
  'Manggarai': [120.40529, -8.53733],
  'Sumba Tengah': [119.64249, -9.58437],
  'Lembata': [123.5534, -8.35557],
  'Nagekeo': [121.33852, -8.63679],
  'Kota Kupang': [123.61477, -10.20197],
  'Timor Tengah Utara': [124.54786, -9.40011],
  'Ende': [121.67207, -8.64465],
  'Kupang': [123.79644, -10.0041],
  'Rote Ndao': [123.1742, -10.69503],
  'Flores Timur': [122.84126, -8.34078],
  'Manggarai Timur': [120.729, -8.55879],
  'Belu': [124.94818, -9.18223],
  'Timor Tengah Selatan': [124.43382, -9.69698],
  'Malaka': [124.82253, -9.50104],
  'Sikka': [122.19349, -8.63245],
  'Sumba Barat Daya': [119.15612, -9.56188],
  'Sabu Raijua': [121.85958, -10.54938],
  'Manggarai Barat': [120.08966, -8.55642],
  'Sumba Timur': [120.19704, -9.93044],
  'Sumba Barat': [119.36743, -9.63715],
  'Ngada': [120.9879, -8.576],
  'Alor': [124.67543, -8.2886]
};

// Rich NTT Region Reference Database
const NTT_REGIONS_INFO = {
  'Alor': {
    ibuKota: 'Kalabahi',
    pulau: 'Kepulauan Alor, Rote & Sabu',
    zona: 'alor_rote_sabu',
    ikonik: 'Surga Taman Bawah Laut, Tradisi Adat Moko & Tenun Ikat Watatuku',
    deskripsi: 'Kabupaten kepulauan di timur laut NTT yang tergabung dalam gugusan pulau kepulauan bersama Rote dan Sabu, terkenal dengan terumbu karang kelas dunia dan tradisi megalitikum Moko.'
  },
  'Belu': {
    ibuKota: 'Atambua',
    pulau: 'Pulau Timor',
    zona: 'timor',
    ikonik: 'PLBN Motaain (Gerbang Batas RI-RDTL), Benteng Ranu Hitu',
    deskripsi: 'Kabupaten strategis berbatasan langsung dengan negara Timor Leste, menjadi koridor diplomasi dan perdagangan internasional.'
  },
  'Ende': {
    ibuKota: 'Ende',
    pulau: 'Pulau Flores',
    zona: 'flores',
    ikonik: 'Danau Kelimutu 3 Warna, Situs Pengasingan Bung Karno (Kota Pancasila)',
    deskripsi: 'Pusat historis kelahiran butir-butir Pancasila oleh Bung Karno serta rumah bagi fenomena alam Danau Kelimutu yang melegenda.'
  },
  'Flores Timur': {
    ibuKota: 'Larantuka',
    pulau: 'Pulau Flores & Adonara-Solor',
    zona: 'flores',
    ikonik: 'Tradisi Semana Santa, Kerajaan Larantuka, Selat Flores',
    deskripsi: 'Wilayah ujung timur Pulau Flores yang kaya warisan sejarah religi katolik Portugis serta gugusan kepulauan Adonara dan Solor.'
  },
  'Kota Kupang': {
    ibuKota: 'Kupang (Ibu Kota Provinsi)',
    pulau: 'Pulau Timor',
    zona: 'timor',
    ikonik: 'Pusat Pemerintahan Provinsi NTT, Pantai Lasiana, Teluk Kupang',
    deskripsi: 'Satu-satunya daerah berstatus Kota di NTT, berfungsi sebagai episentrum pemerintahan, ekonomi, pendidikan, dan pelabuhan utama provinsi.'
  },
  'Kupang': {
    ibuKota: 'Oelamasi',
    pulau: 'Pulau Timor & Semau',
    zona: 'timor',
    ikonik: 'Gunung Fatuleu, Pantai Tablolong, Cagar Alam Camplong',
    deskripsi: 'Kabupaten induk yang mengelilingi Kota Kupang dengan bentang alam karst spektakuler Fatuleu dan pesisir bahari Semau.'
  },
  'Lembata': {
    ibuKota: 'Lewoleba',
    pulau: 'Kepulauan Flores & Lembata',
    zona: 'flores',
    ikonik: 'Gunung Api Ile Lewotolok, Tradisi Perburuan Paus Lamalera',
    deskripsi: 'Kabupaten kepulauan yang terbentuk dari aktivitas vulkanik dengan kebudayaan maritim Lamalera yang terkenal di kancah internasional.'
  },
  'Malaka': {
    ibuKota: 'Betun',
    pulau: 'Pulau Timor',
    zona: 'timor',
    ikonik: 'PLBN Motamasin, Pantai Motadikin, Tradisi Budaya Rai Malaka',
    deskripsi: 'Daerah otonom hasil pemekaran Kabupaten Belu di dataran rendah pesisir selatan Pulau Timor dengan potensi lumbung pangan agraris.'
  },
  'Manggarai': {
    ibuKota: 'Ruteng',
    pulau: 'Pulau Flores',
    zona: 'flores',
    ikonik: 'Sawah Lodok Jaring Laba-laba Cancar, Kampung Adat Wae Rebo, Kota Seribu Biara',
    deskripsi: 'Wilayah dataran tinggi berhawa sejuk di Flores Barat, pusat kebudayaan Manggarai dan kampung adat Wae Rebo peraih penghargaan UNESCO.'
  },
  'Manggarai Barat': {
    ibuKota: 'Labuan Bajo',
    pulau: 'Pulau Flores & Komodo',
    zona: 'flores',
    ikonik: 'Taman Nasional Komodo (Habitat Varanus Komodoensis), Destinasi Pariwisata Super Prioritas Labuan Bajo',
    deskripsi: 'Pintu gerbang pariwisata internasional NTT, rumah bagi satwa purba endemik Komodo dan gugusan pulau karst bahari spektakuler.'
  },
  'Manggarai Timur': {
    ibuKota: 'Borong',
    pulau: 'Pulau Flores',
    zona: 'flores',
    ikonik: 'Kopi Arabika Colol, Danau Teratai Terbesar Rana Tonngoi, Pantai Cepi Watu',
    deskripsi: 'Sentra penghasil kopi unggulan internasional di lembah Colol dengan keanekaragaman lanskap danau teratai alam yang mempesona.'
  },
  'Nagekeo': {
    ibuKota: 'Mbay',
    pulau: 'Pulau Flores',
    zona: 'flores',
    ikonik: 'Gunung Berapi Ebulobo, Kawasan Pengembangan Industri Garam Mbay, Pantai Enagera',
    deskripsi: 'Kabupaten di tengah Pulau Flores dengan lanskap savana Mbay yang luas dan latar belakang megah kerucut Gunung Ebulobo.'
  },
  'Ngada': {
    ibuKota: 'Bajawa',
    pulau: 'Pulau Flores',
    zona: 'flores',
    ikonik: 'Kampung Adat Megalitikum Bena & Gurusina, Gunung Inerie, Pemandian Air Panas Soa',
    deskripsi: 'Pusat peradaban megalitikum di lereng Gunung Inerie dengan tradisi Reba dan kopi khas Arabika Flores Bajawa ber-Indikasi Geografis.'
  },
  'Rote Ndao': {
    ibuKota: 'Baa',
    pulau: 'Kepulauan Alor, Rote & Sabu',
    zona: 'alor_rote_sabu',
    ikonik: 'Titik Paling Selatan NKRI (Pulau Ndana), Alat Musik Tradisional Sasando, Ombak Surfing Nemberala',
    deskripsi: 'Kabupaten batas terselatan Indonesia yang tergabung dalam gugusan pulau kepulauan bersama Alor dan Sabu, tanah kelahiran alat musik petik Sasando dan ombak kelas dunia Nemberala.'
  },
  'Sabu Raijua': {
    ibuKota: 'Menia',
    pulau: 'Kepulauan Alor, Rote & Sabu',
    zona: 'alor_rote_sabu',
    ikonik: 'Kelabba Maja (Batu Berwarna Lembah Dewa), Pabrik Gula Lontar, Pasola Sabu',
    deskripsi: 'Pulau eksotis di Laut Sawu dalam gugusan kepulauan bersama Alor dan Rote, terkenal dengan ngarai berwarna Kelabba Maja dan kearifan pohon lontar.'
  },
  'Sikka': {
    ibuKota: 'Maumere',
    pulau: 'Pulau Flores',
    zona: 'flores',
    ikonik: 'Taman Wisata Alam Laut Teluk Maumere, Tenun Ikat Sikka, Bukit Nilo',
    deskripsi: 'Pusat perdagangan dan kebudayaan tenun ikat Flores Timur dengan keanekaragaman hayati bawah laut Teluk Maumere.'
  },
  'Sumba Barat': {
    ibuKota: 'Waikabubak',
    pulau: 'Pulau Sumba',
    zona: 'sumba',
    ikonik: 'Kampung Adat Megalitikum Tarung-Waitabar, Pasola Lamboya',
    deskripsi: 'Jantung budaya Sumba dengan perkampungan megalitikum di puncak bukit dan ritual adat Pasola lempar lembing berkuda.'
  },
  'Sumba Barat Daya': {
    ibuKota: 'Tambolaka',
    pulau: 'Pulau Sumba',
    zona: 'sumba',
    ikonik: 'Laguna Danau Weekuri, Kampung Adat Ratenggaro Beratap Menara 20 Meter',
    deskripsi: 'Wilayah barat daya Sumba yang masyhur akan keajaiban Danau Weekuri air asin dan arsitektur rumah adat Uma Kelada Ratenggaro.'
  },
  'Sumba Tengah': {
    ibuKota: 'Waibakul',
    pulau: 'Pulau Sumba',
    zona: 'sumba',
    ikonik: 'Taman Nasional Manupeu Tanah Daru, Air Terjun Matayangu',
    deskripsi: 'Kawasan konservasi hutan alam dan koridor hayati burung endemik Sumba dengan bentang air terjun biru Matayangu.'
  },
  'Sumba Timur': {
    ibuKota: 'Waingapu',
    pulau: 'Pulau Sumba',
    zona: 'sumba',
    ikonik: 'Kabupaten Terluas NTT (7.028 km²), Bukit Savana Warinding, Kuda Sandalwood Puru Kambera',
    deskripsi: 'Daerah terluas di NTT dengan panorama bukit sabana bergelombang yang magis, padang gembala kuda Sandalwood, dan tenun ikat raja-raja Sumba.'
  },
  'Timor Tengah Selatan': {
    ibuKota: 'Soe',
    pulau: 'Pulau Timor',
    zona: 'timor',
    ikonik: 'Kawasan Konservasi Gunung Mutis (Atap Pulau Timor), Hawa Dingin Soe, Air Terjun Oehala',
    deskripsi: 'Wilayah pegunungan sejuk berhutan bonsai Ampupu purba di lereng Mutis serta kearifan suku Dawan (Atoni Pah Meto).'
  },
  'Timor Tengah Utara': {
    ibuKota: 'Kefamenanu',
    pulau: 'Pulau Timor',
    zona: 'timor',
    ikonik: 'Pos Lintas Batas Negara (PLBN) Wini, Pantai Tanjung Bastian, Tradisi Kure',
    deskripsi: 'Kabupaten strategis perbatasan utara Pulau Timor dengan Timor Leste enklave Oecusse, memiliki bentang pantai utara yang menawan.'
  }
};

// Vibrant, harmonious cartographic color palette
const REGION_COLORS = {
  'Alor': '#0284c7',
  'Belu': '#059669',
  'Ende': '#d97706',
  'Flores Timur': '#7c3aed',
  'Kota Kupang': '#e11d48',
  'Kupang': '#2563eb',
  'Lembata': '#0891b2',
  'Malaka': '#16a34a',
  'Manggarai': '#ea580c',
  'Manggarai Barat': '#0d9488',
  'Manggarai Timur': '#ca8a04',
  'Nagekeo': '#9333ea',
  'Ngada': '#c026d3',
  'Rote Ndao': '#4f46e5',
  'Sabu Raijua': '#db2777',
  'Sikka': '#b45309',
  'Sumba Barat': '#047857',
  'Sumba Barat Daya': '#0ea5e9',
  'Sumba Tengah': '#65a30d',
  'Sumba Timur': '#b91c1c',
  'Timor Tengah Selatan': '#4338ca',
  'Timor Tengah Utara': '#3b82f6',
};

// Helper: Hex to RGBA
function hexToRgba(hex, alpha) {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')},${alpha})`;
  }
  return `rgba(37, 99, 235, ${alpha})`;
}

// Geodesic Area calculation for GeoJSON feature
function calculateGeodesicArea(geometry) {
  let sourceProj = window.webgis.map.getView().getProjection();
  let geom3857 = geometry.clone().transform(sourceProj, 'EPSG:3857');
  let areaM2 = Math.abs(ol.sphere.getArea(geom3857));
  let km2 = areaM2 / 1e6;
  return {
    m2: Math.round(areaM2),
    km2: Math.round(km2),
    hectares: Math.round(areaM2 / 10000)
  };
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initMap();
  initVectorLayer();
  initHighlightLayer();
  initMeasureTool();
  initUIControls();
  initRegionList();
  renderStatistics();
  initSwipeTool();
  initWindAnimation();
  bindEvents();
});

// Map Initialization
function initMap() {
  // Tile Sources for Basemaps (Removed CartoDB Positron & Dark Matter as requested)
  window.webgis.basemapLayers = {
    satellite: new ol.layer.Tile({
      title: 'ESRI World Imagery',
      type: 'base',
      visible: true,
      source: new ol.source.XYZ({
        attributions: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        crossOrigin: 'anonymous',
        maxZoom: 19
      })
    }),
    osm: new ol.layer.Tile({
      title: 'OpenStreetMap Standard',
      type: 'base',
      visible: false,
      source: new ol.source.OSM({
        crossOrigin: 'anonymous'
      })
    }),
    topo: new ol.layer.Tile({
      title: 'ESRI World Topo',
      type: 'base',
      visible: false,
      source: new ol.source.XYZ({
        attributions: 'Tiles © Esri — Source: USGS, Esri, TANA, DeLorme, NPS, NRCan',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        crossOrigin: 'anonymous',
        maxZoom: 19
      })
    })
  };

  const layers = [
    window.webgis.basemapLayers.satellite,
    window.webgis.basemapLayers.osm,
    window.webgis.basemapLayers.topo
  ];

  window.webgis.map = new ol.Map({
    target: 'map',
    layers: layers,
    controls: [
      new ol.control.Attribution({
        collapsible: true,
        collapsed: true
      }),
      new ol.control.ScaleLine({
        units: 'metric',
        bar: false,
        steps: 4,
        text: true,
        minWidth: 120
      })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([122.06, -9.39]),
      zoom: 7.6,
      minZoom: 5,
      maxZoom: 20
    })
  });
}

// Vector Layer Initialization
function initVectorLayer() {
  if (typeof json_BatasAdministrasiKabupatenKotaProvinsiNTT_1 === 'undefined') {
    console.error('GeoJSON BatasAdministrasiKabupatenKotaProvinsiNTT_1 tidak ditemukan');
    return;
  }

  const format = new ol.format.GeoJSON();
  const features = format.readFeatures(json_BatasAdministrasiKabupatenKotaProvinsiNTT_1, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857'
  });

  // Attach enriched data, pre-simplified LOD geometries, and single centered label point
  features.forEach((feature) => {
    const name = feature.get('WADMKK');
    const rawGeom = feature.getGeometry();
    const area = calculateGeodesicArea(rawGeom);
    const info = NTT_REGIONS_INFO[name] || {};
    
    feature.set('calculatedAreaKm2', area.km2);
    feature.set('calculatedAreaHa', area.hectares);
    feature.set('ibuKota', info.ibuKota || '-');
    feature.set('pulau', info.pulau || '-');
    feature.set('zona', info.zona || 'flores');
    feature.set('ikonik', info.ikonik || '-');
    feature.set('deskripsi', info.deskripsi || '-');
    feature.set('colorHex', REGION_COLORS[name] || '#3b82f6');

    // Feature Simplification / Level of Detail (LOD)
    // Minimizes memory and CPU load on mobile devices & slow connections:
    // - geom_low (tolerance 150m): ~44,000 vertices (90% reduction) for province overview
    // - geom_med (tolerance 40m): ~110,000 vertices (75% reduction) for regency zoom
    // - geom_high: 100% native resolution for detailed district zoom
    feature.set('geom_high', rawGeom);
    feature.set('geom_med', rawGeom.simplify(40));
    feature.set('geom_low', rawGeom.simplify(150));

    // Attach single center point for label to prevent repeated text on multi-polygons/islands
    const centerLonLat = MAIN_ISLAND_CENTERS[name];
    if (centerLonLat) {
      const labelPointGeom = new ol.geom.Point(ol.proj.fromLonLat(centerLonLat));
      feature.set('labelPoint', labelPointGeom);
    } else {
      // Fallback to interior point of geometry
      const extent = rawGeom.getExtent();
      const center = ol.extent.getCenter(extent);
      feature.set('labelPoint', new ol.geom.Point(center));
    }
  });

  window.webgis.features = features;

  const vectorSource = new ol.source.Vector({
    features: features
  });

  window.webgis.vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: getFeatureStyle,
    declutter: true,
    renderBuffer: 100,
    updateWhileAnimating: false,
    updateWhileInteracting: false
  });

  window.webgis.map.addLayer(window.webgis.vectorLayer);

  // Zoom directly into vector layer's current extent on first open
  zoomToVectorExtent(true);
  setTimeout(() => {
    zoomToVectorExtent(false);
  }, 250);
}

// Zoom in directly to the current bounding extent of the vector layer (100% centered and maximized zoom)
function zoomToVectorExtent(immediate = false) {
  if (!window.webgis.map || !window.webgis.vectorLayer) return;
  const source = window.webgis.vectorLayer.getSource();
  if (!source || !source.getFeatures().length) return;

  const extent = source.getExtent();
  const isMobile = window.innerWidth < 768;

  // Balanced symmetric padding ensures the entire NTT archipelago is strictly centered
  // horizontally and vertically within the visible map area, with maximum possible zoom.
  const padding = isMobile ? [36, 18, 36, 18] : [44, 44, 44, 44];

  window.webgis.map.updateSize();
  window.webgis.map.getView().fit(extent, {
    padding: padding,
    duration: immediate ? 0 : 750,
    maxZoom: 10
  });
}

// Vector Styling Function with Dynamic Feature Simplification LOD
// - When zoomed out: uses simplified geometry (90% fewer vertices) for fluid mobile pan/zoom
// - When zoomed in: displays EXACTLY ONE label placed right at the center of each region
function getFeatureStyle(feature, resolution) {
  const name = feature.get('WADMKK');
  const baseColor = REGION_COLORS[name] || '#3b82f6';
  const opacity = window.webgis.fillOpacity;
  const strokeW = window.webgis.strokeWidth;
  
  // Dynamic Level of Detail (LOD) Geometry based on view resolution
  let activeGeom;
  if (resolution > 120) {
    activeGeom = feature.get('geom_low') || feature.getGeometry();
  } else if (resolution > 40) {
    activeGeom = feature.get('geom_med') || feature.getGeometry();
  } else {
    activeGeom = feature.get('geom_high') || feature.getGeometry();
  }

  let fillColor = hexToRgba(baseColor, opacity);
  let strokeColor = '#ffffff';

  if (window.webgis.colorMode === 'sapphire') {
    fillColor = `rgba(30, 64, 175, ${opacity})`;
    strokeColor = '#93c5fd';
  } else if (window.webgis.colorMode === 'emerald') {
    fillColor = `rgba(6, 95, 70, ${opacity})`;
    strokeColor = '#a7f3d0';
  } else if (window.webgis.colorMode === 'amber') {
    fillColor = `rgba(180, 83, 9, ${opacity})`;
    strokeColor = '#fde68a';
  }

  const styles = [
    new ol.style.Style({
      geometry: activeGeom,
      fill: new ol.style.Fill({ color: fillColor }),
      stroke: new ol.style.Stroke({
        color: strokeColor,
        width: strokeW
      })
    })
  ];

  // Only show label when zoomed in enough (resolution < 280, approx zoom >= 8.2),
  // and render ONLY ONCE using the precomputed single center point
  if (window.webgis.showLabels && resolution < 280) {
    let fontSize = 11;
    if (resolution < 140) fontSize = 13;
    if (resolution < 60) fontSize = 15;

    const labelPoint = feature.get('labelPoint');
    if (labelPoint) {
      styles.push(
        new ol.style.Style({
          geometry: labelPoint,
          text: new ol.style.Text({
            text: name,
            font: `bold ${fontSize}px "Plus Jakarta Sans", sans-serif`,
            fill: new ol.style.Fill({ color: '#0f172a' }),
            stroke: new ol.style.Stroke({ color: '#ffffff', width: 3.5 }),
            textAlign: 'center',
            textBaseline: 'middle',
            overflow: true
          })
        })
      );
    }
  }

  return styles;
}

// Highlight Overlay Layer
function initHighlightLayer() {
  const highlightSource = new ol.source.Vector();
  
  window.webgis.highlightLayer = new ol.layer.Vector({
    source: highlightSource,
    style: (feature) => {
      const isSelected = window.webgis.selectedFeature === feature;
      return new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: isSelected ? '#f59e0b' : '#06b6d4',
          width: isSelected ? 4 : 3,
          lineDash: isSelected ? null : [6, 4]
        }),
        fill: new ol.style.Fill({
          color: isSelected ? 'rgba(245, 158, 11, 0.25)' : 'rgba(6, 182, 212, 0.2)'
        })
      });
    }
  });

  window.webgis.map.addLayer(window.webgis.highlightLayer);
}

// Measurement Tool
function initMeasureTool() {
  const measureSource = new ol.source.Vector();
  
  window.webgis.measureLayer = new ol.layer.Vector({
    source: measureSource,
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(59, 130, 246, 0.25)'
      }),
      stroke: new ol.style.Stroke({
        color: '#2563eb',
        lineDash: [10, 10],
        width: 2.5
      }),
      image: new ol.style.Circle({
        radius: 6,
        stroke: new ol.style.Stroke({ color: '#ffffff', width: 2 }),
        fill: new ol.style.Fill({ color: '#2563eb' })
      })
    })
  });

  window.webgis.map.addLayer(window.webgis.measureLayer);
}

function startMeasure(type) {
  if (window.webgis.measureDraw) {
    window.webgis.map.removeInteraction(window.webgis.measureDraw);
  }

  window.webgis.measureMode = type;
  document.getElementById('measure-banner').classList.remove('hidden');
  document.getElementById('measure-type-badge').textContent = type === 'LineString' ? 'Jarak / Panjang' : 'Luas Wilayah';

  window.webgis.measureDraw = new ol.interaction.Draw({
    source: window.webgis.measureLayer.getSource(),
    type: type
  });

  window.webgis.measureDraw.on('drawstart', (evt) => {
    const sketch = evt.feature;
    sketch.getGeometry().on('change', (e) => {
      const geom = e.target;
      let output = '';
      if (geom instanceof ol.geom.Polygon) {
        const area = ol.sphere.getArea(geom.clone().transform('EPSG:3857', 'EPSG:3857'));
        if (area > 1e6) {
          output = `${(area / 1e6).toFixed(2)} km² (${(area / 10000).toFixed(0)} Ha)`;
        } else {
          output = `${area.toFixed(0)} m²`;
        }
      } else if (geom instanceof ol.geom.LineString) {
        const length = ol.sphere.getLength(geom);
        if (length > 1000) {
          output = `${(length / 1000).toFixed(2)} km`;
        } else {
          output = `${length.toFixed(1)} m`;
        }
      }
      document.getElementById('measure-result-val').textContent = output;
    });
  });

  window.webgis.map.addInteraction(window.webgis.measureDraw);
}

function stopMeasure() {
  if (window.webgis.measureDraw) {
    window.webgis.map.removeInteraction(window.webgis.measureDraw);
    window.webgis.measureDraw = null;
  }
  window.webgis.measureLayer.getSource().clear();
  window.webgis.measureMode = null;
  document.getElementById('measure-banner').classList.add('hidden');
  document.getElementById('measure-result-val').textContent = '-';
}

// Toast Notification HUD
function showToast(message, type = 'info', icon = 'info-circle') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const typeColors = {
    info: 'bg-slate-900/95 border-sky-500/50 text-sky-300',
    success: 'bg-slate-900/95 border-emerald-500/50 text-emerald-300',
    warning: 'bg-slate-900/95 border-amber-500/50 text-amber-300'
  };
  const colorClass = typeColors[type] || typeColors.info;

  toast.className = `flex items-center gap-2.5 px-3.5 py-2 rounded-xl border shadow-xl backdrop-blur text-xs font-medium ${colorClass} transition-all duration-300 translate-y-2 opacity-0 pointer-events-auto`;
  toast.innerHTML = `
    <i class="fas fa-${icon} text-sm"></i>
    <span class="text-slate-100 font-normal">${message}</span>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-1');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3200);
}

// Coordinate Formatting
function formatCoordinates(lon, lat, format = 'DD') {
  if (format === 'DMS') {
    const toDms = (deg, isLat) => {
      const absolute = Math.abs(deg);
      const d = Math.floor(absolute);
      const minutesNotTruncated = (absolute - d) * 60;
      const m = Math.floor(minutesNotTruncated);
      const s = ((minutesNotTruncated - m) * 60).toFixed(1);
      const dir = isLat ? (deg >= 0 ? 'N' : 'S') : (deg >= 0 ? 'E' : 'W');
      return `${d}° ${m}' ${s}" ${dir}`;
    };
    return `${toDms(lat, true)}, ${toDms(lon, false)}`;
  }
  // Decimal Degrees
  const latStr = Math.abs(lat).toFixed(5) + '° ' + (lat >= 0 ? 'N' : 'S');
  const lonStr = Math.abs(lon).toFixed(5) + '° ' + (lon >= 0 ? 'E' : 'W');
  return `${latStr}, ${lonStr}`;
}

function updateHudCoords(lon, lat) {
  const el = document.getElementById('hud-coords');
  if (!el) return;
  el.textContent = formatCoordinates(lon, lat, window.webgis.coordFormat);
}

function toggleCoordFormat() {
  window.webgis.coordFormat = window.webgis.coordFormat === 'DD' ? 'DMS' : 'DD';
  const tag = document.getElementById('hud-coord-format-tag');
  if (tag) tag.textContent = window.webgis.coordFormat;
  
  if (window.webgis.lastPointerCoord) {
    updateHudCoords(window.webgis.lastPointerCoord[0], window.webgis.lastPointerCoord[1]);
  }
  showToast(`Format koordinat diubah ke ${window.webgis.coordFormat === 'DD' ? 'Derajat Desimal (DD)' : 'Derajat Menit Detik (DMS)'}`, 'info', 'compass');
}

// Island Quick Jump
function zoomToZone(zoneKey) {
  const features = window.webgis.features.filter(f => f.get('zona') === zoneKey);
  if (!features || features.length === 0) return;

  const extent = ol.extent.createEmpty();
  features.forEach(f => {
    ol.extent.extend(extent, f.getGeometry().getExtent());
  });

  const isMobile = window.innerWidth < 768;
  const padding = isMobile ? [40, 20, 40, 20] : [55, 48, 55, 48];

  window.webgis.map.updateSize();
  window.webgis.map.getView().fit(extent, {
    padding: padding,
    duration: 850,
    maxZoom: 11
  });

  const zoneNames = {
    'flores': 'Flores & Lembata',
    'timor': 'Pulau Timor',
    'sumba': 'Pulau Sumba',
    'alor_rote_sabu': 'Alor, Rote & Sabu'
  };
  const name = zoneNames[zoneKey] || zoneKey;
  showToast(`Lompat ke gugusan ${name}`, 'info', 'paper-plane');
}

// Shortcuts Modal
function toggleShortcutsModal() {
  const modal = document.getElementById('shortcuts-modal');
  if (modal) modal.classList.toggle('hidden');
}

// UI Initialization & Tabs
function initUIControls() {
  // Coordinate Tracker
  window.webgis.map.on('pointermove', (evt) => {
    if (evt.dragging) return;
    const coord = ol.proj.toLonLat(evt.coordinate);
    window.webgis.lastPointerCoord = coord;
    updateHudCoords(coord[0], coord[1]);

    // Pointer cursor on feature
    const hit = window.webgis.map.hasFeatureAtPixel(evt.pixel, {
      layerFilter: (l) => l === window.webgis.vectorLayer
    });
    window.webgis.map.getViewport().style.cursor = hit ? 'pointer' : '';

    // Quick hover feature update
    if (hit) {
      window.webgis.map.forEachFeatureAtPixel(evt.pixel, (f, layer) => {
        if (layer === window.webgis.vectorLayer) {
          document.getElementById('hud-hover-region').textContent = f.get('WADMKK');
        }
      });
    } else {
      document.getElementById('hud-hover-region').textContent = 'Arahkan kursor ke wilayah';
    }
  });

  // Zoom Level Monitor
  window.webgis.map.getView().on('change:resolution', () => {
    const zoom = window.webgis.map.getView().getZoom();
    if (zoom) {
      document.getElementById('hud-zoom').textContent = `Zoom: ${zoom.toFixed(1)}`;
    }
  });
}

// Region List Directory Render
function initRegionList() {
  const container = document.getElementById('region-list-container');
  if (!container) return;

  container.innerHTML = '';

  let filtered = window.webgis.features.filter((f) => {
    const name = f.get('WADMKK').toLowerCase();
    const query = window.webgis.searchQuery.toLowerCase();
    const matchesSearch = name.includes(query);

    const zona = f.get('zona');
    const matchesZone = window.webgis.activeZoneFilter === 'all' || zona === window.webgis.activeZoneFilter;

    return matchesSearch && matchesZone;
  });

  // Sort
  if (window.webgis.sortBy === 'name-asc') {
    filtered.sort((a, b) => a.get('WADMKK').localeCompare(b.get('WADMKK')));
  } else if (window.webgis.sortBy === 'name-desc') {
    filtered.sort((a, b) => b.get('WADMKK').localeCompare(a.get('WADMKK')));
  } else if (window.webgis.sortBy === 'area-desc') {
    filtered.sort((a, b) => b.get('calculatedAreaKm2') - a.get('calculatedAreaKm2'));
  } else if (window.webgis.sortBy === 'area-asc') {
    filtered.sort((a, b) => a.get('calculatedAreaKm2') - b.get('calculatedAreaKm2'));
  }

  document.getElementById('region-count-badge').textContent = `${filtered.length} Wilayah`;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="py-12 text-center text-slate-400">
        <i class="fas fa-search text-2xl mb-2 text-slate-500"></i>
        <p class="text-sm font-medium">Tidak ada wilayah yang cocok</p>
        <p class="text-xs text-slate-500 mt-1">Coba gunakan kata kunci atau filter pulau lain</p>
      </div>
    `;
    return;
  }

  filtered.forEach((feature) => {
    const name = feature.get('WADMKK');
    const isKota = name.includes('Kota');
    const areaKm2 = feature.get('calculatedAreaKm2');
    const ibuKota = feature.get('ibuKota');
    const color = feature.get('colorHex');
    const isSelected = window.webgis.selectedFeature === feature;

    const card = document.createElement('div');
    card.className = `p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
      isSelected
        ? 'bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-500/10'
        : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
    }`;

    card.innerHTML = `
      <div class="flex items-start justify-between gap-2">
        <div class="flex items-center gap-2.5">
          <span class="w-3 h-3 rounded-full flex-shrink-0" style="background-color: ${color}; box-shadow: 0 0 8px ${color}80"></span>
          <div>
            <h4 class="text-sm font-semibold text-white leading-snug flex items-center gap-1.5">
              ${name}
              ${
                isKota
                  ? '<span class="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">KOTA</span>'
                  : '<span class="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">KAB</span>'
              }
            </h4>
            <p class="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
              <i class="fas fa-landmark text-[10px] text-slate-500"></i>
              Ibu Kota: <span class="text-slate-300 font-medium">${ibuKota}</span>
            </p>
          </div>
        </div>
        <div class="text-right flex-shrink-0">
          <span class="text-xs font-mono font-bold text-emerald-400">${areaKm2.toLocaleString('id-ID')} km²</span>
        </div>
      </div>
      <div class="mt-2.5 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
        <span class="truncate max-w-[200px]" title="${feature.get('pulau')}">
          <i class="fas fa-map-marked-alt mr-1 text-slate-500"></i>${feature.get('pulau')}
        </span>
        <span class="text-sky-400 font-medium hover:text-sky-300 flex items-center gap-1">
          Pusatkan <i class="fas fa-chevron-right text-[10px]"></i>
        </span>
      </div>
    `;

    card.addEventListener('click', () => {
      selectAndFocusFeature(feature);
    });

    container.appendChild(card);
  });
}

// Statistics Tab Render
function renderStatistics() {
  const container = document.getElementById('statistics-container');
  if (!container || !window.webgis.features.length) return;

  const features = [...window.webgis.features];
  const totalCount = features.length;
  const totalAreaKm2 = features.reduce((sum, f) => sum + f.get('calculatedAreaKm2'), 0);

  // Sorted by area descending
  features.sort((a, b) => b.get('calculatedAreaKm2') - a.get('calculatedAreaKm2'));

  const largest = features[0];
  const smallest = features[features.length - 1];

  // Islands distribution: Alor, Rote & Sabu merged into 1 group
  const zoneCounts = {
    'flores': { name: 'Gugusan Flores & Lembata', count: 0, area: 0 },
    'timor': { name: 'Pulau Timor', count: 0, area: 0 },
    'sumba': { name: 'Pulau Sumba', count: 0, area: 0 },
    'alor_rote_sabu': { name: 'Kepulauan Alor, Rote & Sabu', count: 0, area: 0 },
  };

  features.forEach((f) => {
    const z = f.get('zona');
    if (zoneCounts[z]) {
      zoneCounts[z].count++;
      zoneCounts[z].area += f.get('calculatedAreaKm2');
    }
  });

  // Top 5 Largest
  const top5 = features.slice(0, 5);
  const maxArea = largest.get('calculatedAreaKm2');

  let top5Html = top5
    .map((f, i) => {
      const pct = ((f.get('calculatedAreaKm2') / maxArea) * 100).toFixed(0);
      return `
      <div class="space-y-1">
        <div class="flex justify-between text-xs">
          <span class="font-medium text-slate-300 flex items-center gap-1.5">
            <span class="w-4 text-slate-500 font-mono text-[11px]">${i + 1}.</span>
            ${f.get('WADMKK')}
          </span>
          <span class="font-mono font-semibold text-emerald-400">${f.get('calculatedAreaKm2').toLocaleString('id-ID')} km²</span>
        </div>
        <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-sky-500 to-emerald-400 rounded-full" style="width: ${pct}%"></div>
        </div>
      </div>
    `;
    })
    .join('');

  // Zone breakdown HTML
  let zoneHtml = Object.values(zoneCounts)
    .map((z) => {
      const areaPct = ((z.area / totalAreaKm2) * 100).toFixed(1);
      return `
      <div class="p-3 bg-slate-800/70 border border-slate-700/60 rounded-xl flex items-center justify-between">
        <div>
          <div class="text-xs font-semibold text-white">${z.name}</div>
          <div class="text-[11px] text-slate-400 mt-0.5">${z.count} Kabupaten/Kota</div>
        </div>
        <div class="text-right">
          <div class="text-xs font-mono font-bold text-sky-400">${z.area.toLocaleString('id-ID')} km²</div>
          <div class="text-[10px] text-slate-500">${areaPct}% total</div>
        </div>
      </div>
    `;
    })
    .join('');

  container.innerHTML = `
    <div class="grid grid-cols-2 gap-2 mb-4">
      <div class="p-3 bg-slate-800/80 border border-slate-700 rounded-xl">
        <span class="text-[11px] text-slate-400 block font-medium">Total Daerah</span>
        <span class="text-xl font-bold text-white mt-1 block">22 <span class="text-xs text-slate-400 font-normal">Wilayah</span></span>
        <span class="text-[10px] text-sky-400 mt-0.5 block">21 Kab · 1 Kota</span>
      </div>
      <div class="p-3 bg-slate-800/80 border border-slate-700 rounded-xl">
        <span class="text-[11px] text-slate-400 block font-medium">Estimasi Luas Total</span>
        <span class="text-xl font-bold text-emerald-400 mt-1 block font-mono">${totalAreaKm2.toLocaleString('id-ID')}</span>
        <span class="text-[10px] text-slate-400 mt-0.5 block">km² Daratan NTT</span>
      </div>
    </div>

    <div class="p-3 bg-slate-800/50 border border-slate-700/60 rounded-xl mb-4 space-y-2">
      <div class="flex justify-between text-xs py-1 border-b border-slate-700/40">
        <span class="text-slate-400">Wilayah Terluas:</span>
        <span class="font-semibold text-white">${largest.get('WADMKK')} (${largest.get('calculatedAreaKm2').toLocaleString('id-ID')} km²)</span>
      </div>
      <div class="flex justify-between text-xs py-1">
        <span class="text-slate-400">Wilayah Terkecil:</span>
        <span class="font-semibold text-white">${smallest.get('WADMKK')} (${smallest.get('calculatedAreaKm2').toLocaleString('id-ID')} km²)</span>
      </div>
    </div>

    <div class="mb-4">
      <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
        <i class="fas fa-chart-bar text-sky-400"></i> 5 Wilayah Terluas
      </h4>
      <div class="space-y-3 p-3 bg-slate-800/40 border border-slate-700/50 rounded-xl">
        ${top5Html}
      </div>
    </div>

    <div>
      <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
        <i class="fas fa-globe-asia text-emerald-400"></i> Distribusi Wilayah Pulau
      </h4>
      <div class="space-y-2">
        ${zoneHtml}
      </div>
    </div>
  `;
}

// Select & Focus Feature
function selectAndFocusFeature(feature) {
  window.webgis.selectedFeature = feature;

  // Update Highlight Layer
  const highlightSource = window.webgis.highlightLayer.getSource();
  highlightSource.clear();
  highlightSource.addFeature(feature);

  // Smooth Camera Fly-To
  const isMobile = window.innerWidth < 768;
  // Account for the floating feature modal on bottom-right
  const padding = isMobile ? [60, 20, 320, 20] : [70, 180, 70, 70];
  window.webgis.map.updateSize();
  window.webgis.map.getView().fit(feature.getGeometry(), {
    padding: padding,
    duration: 900,
    maxZoom: 12
  });

  // Open Detailed Inspector
  showFeatureModal(feature);

  // Re-render region list to highlight selected card
  initRegionList();
}

// Feature Detail Drawer / Modal
function showFeatureModal(feature) {
  const modal = document.getElementById('feature-detail-modal');
  if (!modal) return;

  const name = feature.get('WADMKK');
  const isKota = name.includes('Kota');
  const areaKm2 = feature.get('calculatedAreaKm2');
  const areaHa = feature.get('calculatedAreaHa');
  const ibuKota = feature.get('ibuKota');
  const pulau = feature.get('pulau');
  const uupp = feature.get('UUPP') || 'Hasil Delineasi Batas Desa';
  const srsId = feature.get('SRS_ID') || 'SRGI 2013';
  const metadata = feature.get('METADATA') || 'TASWIL_BIG_NTT';
  const ikonik = feature.get('ikonik');
  const deskripsi = feature.get('deskripsi');
  const color = feature.get('colorHex');

  // Centroid
  const geom = feature.getGeometry();
  const extent = geom.getExtent();
  const center = ol.extent.getCenter(extent);
  const lonLat = ol.proj.toLonLat(center);
  const lonStr = lonLat[0].toFixed(5);
  const latStr = lonLat[1].toFixed(5);

  document.getElementById('modal-region-color-bar').style.backgroundColor = color;
  document.getElementById('modal-region-name').textContent = name;
  document.getElementById('modal-region-type').textContent = isKota ? 'KOTA OTONOM' : 'KABUPATEN OTONOM';
  document.getElementById('modal-region-island').textContent = pulau;
  document.getElementById('modal-ibukota').textContent = ibuKota;
  document.getElementById('modal-area-km2').textContent = `${areaKm2.toLocaleString('id-ID')} km²`;
  document.getElementById('modal-area-ha').textContent = `${areaHa.toLocaleString('id-ID')} Hektar`;
  document.getElementById('modal-coords').textContent = `${latStr}°, ${lonStr}°`;
  document.getElementById('modal-uupp').textContent = uupp;
  document.getElementById('modal-srs').textContent = srsId;
  document.getElementById('modal-meta').textContent = metadata;
  document.getElementById('modal-ikonik').textContent = ikonik;
  document.getElementById('modal-deskripsi').textContent = deskripsi;

  // Spatial Proportion Insight
  const totalNttArea = 46446; // km²
  const pct = Math.min(100, Math.max(0.1, (areaKm2 / totalNttArea) * 100));
  const avgKabArea = 2111; // km²
  const ratio = (areaKm2 / avgKabArea).toFixed(1);

  const pctEl = document.getElementById('modal-area-pct');
  if (pctEl) pctEl.textContent = `${pct.toFixed(1)}%`;

  const barEl = document.getElementById('modal-area-bar');
  if (barEl) barEl.style.width = `${Math.min(pct * 4.5, 100)}%`;

  const compareEl = document.getElementById('modal-area-compare-text');
  if (compareEl) {
    if (areaKm2 >= avgKabArea) {
      compareEl.textContent = `${ratio}x lebih luas dari rata-rata kabupaten di NTT (2.111 km²)`;
    } else {
      const subPct = Math.round((areaKm2 / avgKabArea) * 100);
      compareEl.textContent = `${subPct}% dari rata-rata luas kabupaten di NTT (2.111 km²)`;
    }
  }

  // Google Maps safe link (anchor href)
  const gmapsLink = document.getElementById('btn-gmaps');
  if (gmapsLink) {
    gmapsLink.href = `https://www.google.com/maps/search/?api=1&query=${latStr},${lonStr}`;
  }

  // Copy Coords button with Toast
  const copyBtn = document.getElementById('btn-copy-coords');
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(`${latStr}, ${lonStr}`);
    showToast(`Koordinat ${latStr}, ${lonStr} berhasil disalin!`, 'success', 'check-circle');
    copyBtn.innerHTML = '<i class="fas fa-check text-emerald-400 mr-1.5"></i>Tersalin!';
    setTimeout(() => {
      copyBtn.innerHTML = '<i class="fas fa-copy mr-1.5 text-emerald-400"></i>Salin Koordinat';
    }, 2000);
  };

  // Download Individual GeoJSON button
  const exportBtn = document.getElementById('btn-export-feature');
  exportBtn.onclick = () => {
    exportSingleFeature(feature);
  };

  modal.classList.remove('hidden');
}

function closeFeatureModal() {
  const modal = document.getElementById('feature-detail-modal');
  if (modal) modal.classList.add('hidden');
  
  // Clear highlight
  window.webgis.selectedFeature = null;
  window.webgis.highlightLayer.getSource().clear();
  initRegionList();
}

// Export single feature as GeoJSON
function exportSingleFeature(feature) {
  const format = new ol.format.GeoJSON();
  const geojsonStr = format.writeFeature(feature, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857'
  });

  const blob = new Blob([geojsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = feature.get('WADMKK').replace(/\s+/g, '_');
  a.href = url;
  a.download = `Batas_Administrasi_${safeName}_NTT.geojson`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`Data GeoJSON ${feature.get('WADMKK')} berhasil diunduh`, 'success', 'download');
}

// Export All Features GeoJSON
function exportAllGeoJSON() {
  const format = new ol.format.GeoJSON();
  const geojsonStr = format.writeFeatures(window.webgis.features, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857'
  });

  const blob = new Blob([geojsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Batas_Administrasi_Kabupaten_Kota_Provinsi_NTT.geojson';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Seluruh batas administrasi NTT (GeoJSON) berhasil diunduh', 'success', 'download');
}

// Check if a canvas is tainted by cross-origin data
function isCanvasTainted(canvas) {
  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;
    ctx.getImageData(0, 0, 1, 1);
    return false;
  } catch (e) {
    return true;
  }
}

// Export Map as High-Res Image (PNG)
function exportMapImage() {
  const map = window.webgis.map;
  const modal = document.getElementById('export-modal');
  modal.classList.remove('hidden');

  const spinner = document.getElementById('export-loading-spinner');
  const preview = document.getElementById('export-preview-img');
  if (spinner) {
    spinner.classList.remove('hidden');
    spinner.innerHTML = `
      <i class="fas fa-spinner fa-spin text-2xl text-sky-400"></i>
      <span class="text-xs text-slate-400">Memproses tangkapan layar peta...</span>
    `;
  }
  if (preview) {
    preview.classList.add('hidden');
    preview.src = '';
  }

  map.once('rendercomplete', () => {
    try {
      const mapCanvas = document.createElement('canvas');
      const size = map.getSize();
      mapCanvas.width = size[0];
      mapCanvas.height = size[1];
      const mapContext = mapCanvas.getContext('2d');

      // Base background color
      mapContext.fillStyle = '#090d16';
      mapContext.fillRect(0, 0, size[0], size[1]);

      Array.prototype.forEach.call(
        map.getViewport().querySelectorAll('.ol-layer canvas, canvas.ol-layer'),
        (canvas) => {
          if (canvas.width > 0) {
            // Guard against tainted canvas to prevent SecurityError on toDataURL
            if (isCanvasTainted(canvas)) {
              console.warn('Canvas layer is tainted by CORS, skipping layer to preserve export capability');
              return;
            }

            const opacity = canvas.parentNode.style.opacity || canvas.style.opacity;
            mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
            let matrix;
            const transform = canvas.style.transform;
            if (transform) {
              matrix = transform
                .match(/^matrix\(([^\(]*)\)$/)[1]
                .split(',')
                .map(Number);
            } else {
              matrix = [
                parseFloat(canvas.style.width) / canvas.width,
                0,
                0,
                parseFloat(canvas.style.height) / canvas.height,
                0,
                0
              ];
            }
            CanvasRenderingContext2D.prototype.setTransform.apply(mapContext, matrix);
            const backgroundColor = canvas.parentNode.style.backgroundColor;
            if (backgroundColor) {
              mapContext.fillStyle = backgroundColor;
              mapContext.fillRect(0, 0, canvas.width, canvas.height);
            }
            mapContext.drawImage(canvas, 0, 0);
          }
        }
      );

      mapContext.globalAlpha = 1;
      mapContext.setTransform(1, 0, 0, 1, 0, 0);

      // Add Banner Title at top of exported PNG
      mapContext.fillStyle = 'rgba(15, 23, 42, 0.9)';
      mapContext.fillRect(0, 0, size[0], 52);

      mapContext.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
      mapContext.fillStyle = '#ffffff';
      mapContext.fillText('WEBGIS BATAS ADMIN NTT · PETA BATAS ADMINISTRASI KABUPATEN/KOTA', 20, 33);

      const now = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      mapContext.font = '12px "Plus Jakarta Sans", sans-serif';
      mapContext.fillStyle = '#94a3b8';
      mapContext.fillText(`Kreator: Evan · Dicetak: ${now}`, size[0] - 280, 33);

      // Safe export to DataURL
      const dataUrl = mapCanvas.toDataURL('image/png');

      const link = document.getElementById('download-map-btn');
      if (link) {
        link.href = dataUrl;
        link.download = `Peta_Batas_Administrasi_NTT_${Date.now()}.png`;
        link.classList.remove('opacity-50', 'pointer-events-none');
      }

      if (spinner) spinner.classList.add('hidden');
      if (preview) {
        preview.src = dataUrl;
        preview.classList.remove('hidden');
      }
    } catch (err) {
      console.error('Error in mapCanvas export:', err);
      if (spinner) {
        spinner.innerHTML = `
          <div class="text-center p-4">
            <i class="fas fa-shield-alt text-amber-400 text-3xl mb-2"></i>
            <p class="text-xs text-slate-300 font-semibold">Terkendala Kebijakan Keamanan Browser (CORS)</p>
            <p class="text-[11px] text-slate-400 mt-1 max-w-sm">Browser membatasi ekspor gambar canvas eksternal. Silakan gunakan fitur "Unduh Data (GeoJSON)" atau tombol tangkapan layar browser.</p>
          </div>
        `;
      }
    }
  });

  map.renderSync();
}

// Basemap Switcher
function switchBasemap(name) {
  if (window.webgis.swipeActive) {
    toggleSwipeTool(false);
  }
  window.webgis.activeBasemap = name;
  Object.keys(window.webgis.basemapLayers).forEach((key) => {
    window.webgis.basemapLayers[key].setVisible(key === name);
  });

  // Update UI chips
  document.querySelectorAll('.basemap-option-card').forEach((card) => {
    const bName = card.dataset.basemap;
    if (bName === name) {
      card.classList.add('border-sky-500', 'bg-sky-500/10');
      card.classList.remove('border-slate-700', 'bg-slate-800');
    } else {
      card.classList.remove('border-sky-500', 'bg-sky-500/10');
      card.classList.add('border-slate-700', 'bg-slate-800');
    }
  });
}

// Reset Map Extent to NTT
function resetExtent() {
  zoomToVectorExtent(false);
}

// Bind Global UI Events
function bindEvents() {
  // Map Click Listener
  window.webgis.map.on('singleclick', (evt) => {
    if (window.webgis.measureMode) return; // In measurement mode, click is reserved

    let foundFeature = null;
    window.webgis.map.forEachFeatureAtPixel(evt.pixel, (f, layer) => {
      if (layer === window.webgis.vectorLayer && !foundFeature) {
        foundFeature = f;
      }
    });

    if (foundFeature) {
      selectAndFocusFeature(foundFeature);
    } else {
      closeFeatureModal();
    }
  });

  // Sidebar Tabs Switching
  document.querySelectorAll('.sidebar-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      window.webgis.activeTab = tab;

      // Update button active state
      document.querySelectorAll('.sidebar-tab-btn').forEach((b) => {
        if (b.dataset.tab === tab) {
          b.classList.add('border-sky-400', 'text-sky-400', 'bg-sky-500/10');
          b.classList.remove('border-transparent', 'text-slate-400');
        } else {
          b.classList.remove('border-sky-400', 'text-sky-400', 'bg-sky-500/10');
          b.classList.add('border-transparent', 'text-slate-400');
        }
      });

      // Show/hide tab panels
      document.querySelectorAll('.tab-content-panel').forEach((panel) => {
        if (panel.id === `tab-panel-${tab}`) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      });

      if (tab === 'stats') {
        renderStatistics();
      }
    });
  });

  // Search Input & Clear Button
  const searchInput = document.getElementById('region-search-input');
  const clearSearchBtn = document.getElementById('btn-clear-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      window.webgis.searchQuery = val.trim();
      if (clearSearchBtn) {
        clearSearchBtn.classList.toggle('hidden', !val);
      }
      initRegionList();
    });

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        window.webgis.searchQuery = '';
        clearSearchBtn.classList.add('hidden');
        initRegionList();
        searchInput.focus();
      });
    }
  }

  // Zone Filter Pills
  document.querySelectorAll('.zone-filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const zone = btn.dataset.zone;
      window.webgis.activeZoneFilter = zone;

      document.querySelectorAll('.zone-filter-btn').forEach((b) => {
        if (b.dataset.zone === zone) {
          b.classList.add('bg-sky-500', 'text-white', 'font-semibold');
          b.classList.remove('bg-slate-800', 'text-slate-400');
        } else {
          b.classList.remove('bg-sky-500', 'text-white', 'font-semibold');
          b.classList.add('bg-slate-800', 'text-slate-400');
        }
      });

      initRegionList();
    });
  });

  // Sort Select
  const sortSelect = document.getElementById('sort-region-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      window.webgis.sortBy = e.target.value;
      initRegionList();
    });
  }

  // Fill Opacity Slider
  const opacitySlider = document.getElementById('opacity-slider');
  if (opacitySlider) {
    opacitySlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      window.webgis.fillOpacity = val;
      document.getElementById('opacity-val-label').textContent = `${Math.round(val * 100)}%`;
      window.webgis.vectorLayer.changed();
    });
  }

  // Stroke Width Slider
  const strokeSlider = document.getElementById('stroke-slider');
  if (strokeSlider) {
    strokeSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      window.webgis.strokeWidth = val;
      document.getElementById('stroke-val-label').textContent = `${val}px`;
      window.webgis.vectorLayer.changed();
    });
  }

  // Toggle Labels Checkbox
  const labelCheck = document.getElementById('toggle-labels-check');
  if (labelCheck) {
    labelCheck.addEventListener('change', (e) => {
      window.webgis.showLabels = e.target.checked;
      window.webgis.vectorLayer.changed();
    });
  }

  // Toggle Layer Visibility Checkbox
  const layerCheck = document.getElementById('toggle-layer-check');
  if (layerCheck) {
    layerCheck.addEventListener('change', (e) => {
      window.webgis.vectorLayer.setVisible(e.target.checked);
    });
  }

  // Color Theme Selector
  document.querySelectorAll('.color-mode-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      window.webgis.colorMode = mode;
      document.querySelectorAll('.color-mode-btn').forEach((b) => {
        b.classList.remove('ring-2', 'ring-sky-400');
      });
      btn.classList.add('ring-2', 'ring-sky-400');
      window.webgis.vectorLayer.changed();
    });
  });

  // Basemap Selector Cards
  document.querySelectorAll('.basemap-option-card').forEach((card) => {
    card.addEventListener('click', () => {
      const bName = card.dataset.basemap;
      switchBasemap(bName);
    });
  });

  // Sidebar Toggle Button
  const sidebar = document.getElementById('sidebar-drawer');
  const toggleBtn = document.getElementById('btn-toggle-sidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        sidebar.classList.toggle('-translate-x-full');
        const isClosed = sidebar.classList.contains('-translate-x-full');
        toggleBtn.innerHTML = isClosed
          ? '<i class="fas fa-bars text-sm"></i>'
          : '<i class="fas fa-times text-sm"></i>';
      } else {
        sidebar.classList.toggle('md:-ml-96');
        const isClosed = sidebar.classList.contains('md:-ml-96');
        toggleBtn.innerHTML = isClosed
          ? '<i class="fas fa-bars text-sm"></i>'
          : '<i class="fas fa-chevron-left text-sm"></i>';
        setTimeout(() => {
          if (window.webgis.map) {
            window.webgis.map.updateSize();
            zoomToVectorExtent(false);
          }
        }, 320);
      }
    });
  }

  // Window Resize Listener to automatically refresh map canvas & centering
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.webgis.map) {
        window.webgis.map.updateSize();
      }
    }, 150);
  });

  // Modal Close Button
  const closeModalBtn = document.getElementById('btn-close-modal');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeFeatureModal);
  }

  // Export Modal Close
  const closeExportBtn = document.getElementById('btn-close-export');
  if (closeExportBtn) {
    closeExportBtn.addEventListener('click', () => {
      document.getElementById('export-modal').classList.add('hidden');
    });
  }

  // Keyboard Shortcuts (Hotkeys)
  window.addEventListener('keydown', (e) => {
    const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);

    if (e.key === 'Escape') {
      closeFeatureModal();
      if (window.webgis.measureMode) stopMeasure();
      const shortcuts = document.getElementById('shortcuts-modal');
      if (shortcuts) shortcuts.classList.add('hidden');
      const exportModal = document.getElementById('export-modal');
      if (exportModal) exportModal.classList.add('hidden');
      return;
    }

    if (isInput) return;

    if (e.key === '/' || (e.ctrlKey && e.key.toLowerCase() === 'k')) {
      e.preventDefault();
      const search = document.getElementById('region-search-input');
      if (search) {
        search.focus();
        search.select();
      }
    } else if (e.key.toLowerCase() === 'h' || e.key === 'Home') {
      e.preventDefault();
      resetExtent();
    } else if (e.key === '?') {
      e.preventDefault();
      toggleShortcutsModal();
    }
  });
}

/* ==========================================================================
   FEATURE 1: SWIPE TOOL (Bandingkan Citra Saja)
   ========================================================================== */

let swipePrerenderKey = null;
let swipePostrenderKey = null;
let isDraggingSwipe = false;

function initSwipeTool() {
  const handle = document.getElementById('swipe-handle');
  const mapElem = document.getElementById('map');

  if (!handle || !mapElem) return;

  // Pointer drag events on the handle for desktop and touch screens
  handle.addEventListener('pointerdown', (e) => {
    if (!window.webgis.swipeActive) return;
    isDraggingSwipe = true;
    try {
      handle.setPointerCapture(e.pointerId);
    } catch (_) {}
    e.preventDefault();
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDraggingSwipe || !window.webgis.swipeActive) return;
    const rect = mapElem.getBoundingClientRect();
    if (!rect.width) return;
    const clientX = e.clientX;
    let percent = ((clientX - rect.left) / rect.width) * 100;
    percent = Math.max(1, Math.min(99, percent));
    updateSwipePosition(percent);
  });

  const endDrag = (e) => {
    if (isDraggingSwipe) {
      isDraggingSwipe = false;
      try {
        if (e.pointerId !== undefined) handle.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
  };

  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);
}

function getBasemapShortTitle(key) {
  switch (key) {
    case 'satellite': return 'Satelit';
    case 'osm': return 'OSM Jalan';
    case 'topo': return 'Topografi';
    default: return key;
  }
}

function toggleSwipeTool(enable) {
  if (enable === undefined) {
    enable = !window.webgis.swipeActive;
  }
  window.webgis.swipeActive = !!enable;

  const toggleCheck = document.getElementById('toggle-swipe-check');
  if (toggleCheck) toggleCheck.checked = window.webgis.swipeActive;

  const container = document.getElementById('swipe-controls-container');
  if (container) container.classList.toggle('hidden', !window.webgis.swipeActive);

  const badge = document.getElementById('swipe-status-badge');
  if (badge) {
    badge.textContent = window.webgis.swipeActive ? 'AKTIF' : 'OFF';
    badge.className = window.webgis.swipeActive 
      ? 'text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/40 font-semibold'
      : 'text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700';
  }

  const divider = document.getElementById('swipe-divider');
  if (divider) divider.classList.toggle('hidden', !window.webgis.swipeActive);

  if (window.webgis.swipeActive) {
    applySwipeClip();
    showToast('Mode Swipe Aktif', 'Bandingkan citra dengan menggeser garis tirai pemisah di tengah peta.', 'info');
  } else {
    // Unbind swipe prerender/postrender listeners
    if (swipePrerenderKey) {
      ol.Observable.unByKey(swipePrerenderKey);
      swipePrerenderKey = null;
    }
    if (swipePostrenderKey) {
      ol.Observable.unByKey(swipePostrenderKey);
      swipePostrenderKey = null;
    }

    // Restore standard single basemap visibility
    Object.keys(window.webgis.basemapLayers).forEach((k) => {
      window.webgis.basemapLayers[k].setVisible(k === window.webgis.activeBasemap);
    });

    if (window.webgis.map) window.webgis.map.render();
    showToast('Mode Swipe Nonaktif', 'Tampilan citra dasar dikembalikan normal.', 'info');
  }
}

function updateSwipePosition(percent) {
  percent = Math.max(1, Math.min(99, percent));
  window.webgis.swipePosition = percent;

  const rangeInput = document.getElementById('swipe-range-input');
  if (rangeInput) rangeInput.value = percent;

  const sliderVal = document.getElementById('swipe-slider-val');
  if (sliderVal) sliderVal.textContent = Math.round(percent) + '%';

  const badge = document.getElementById('swipe-percent-badge');
  if (badge) badge.textContent = Math.round(percent) + '%';

  const divider = document.getElementById('swipe-divider');
  if (divider) divider.style.left = percent + '%';

  if (window.webgis.map) window.webgis.map.render();
}

function onSwipeSliderInput(val) {
  updateSwipePosition(parseFloat(val));
}

function onSwipeLayerChange() {
  const leftSelect = document.getElementById('swipe-left-select');
  const rightSelect = document.getElementById('swipe-right-select');

  if (leftSelect && rightSelect) {
    window.webgis.swipeLeft = leftSelect.value;
    window.webgis.swipeRight = rightSelect.value;

    const labelLeft = document.getElementById('swipe-label-left');
    const labelRight = document.getElementById('swipe-label-right');
    if (labelLeft) labelLeft.innerHTML = `<i class="fas fa-caret-left"></i> ${getBasemapShortTitle(leftSelect.value)}`;
    if (labelRight) labelRight.innerHTML = `${getBasemapShortTitle(rightSelect.value)} <i class="fas fa-caret-right"></i>`;

    if (window.webgis.swipeActive) {
      applySwipeClip();
    }
  }
}

function getSafeRenderPixel(event, pixel) {
  if (typeof ol !== 'undefined' && ol.render && typeof ol.render.getRenderPixel === 'function') {
    try {
      return ol.render.getRenderPixel(event, pixel);
    } catch (_) {}
  }
  const ratio = (event.frameState && event.frameState.pixelRatio) || window.devicePixelRatio || 1;
  return [pixel[0] * ratio, pixel[1] * ratio];
}

function applySwipeClip() {
  if (swipePrerenderKey) {
    ol.Observable.unByKey(swipePrerenderKey);
    swipePrerenderKey = null;
  }
  if (swipePostrenderKey) {
    ol.Observable.unByKey(swipePostrenderKey);
    swipePostrenderKey = null;
  }

  if (!window.webgis.swipeActive || !window.webgis.map) return;

  const leftKey = window.webgis.swipeLeft || 'satellite';
  const rightKey = window.webgis.swipeRight || 'topo';
  const layerLeft = window.webgis.basemapLayers[leftKey];
  const layerRight = window.webgis.basemapLayers[rightKey];

  if (!layerLeft || !layerRight) return;

  // Make only left and right basemap layers visible
  Object.keys(window.webgis.basemapLayers).forEach((k) => {
    window.webgis.basemapLayers[k].setVisible(k === leftKey || k === rightKey);
  });

  const mapLayers = window.webgis.map.getLayers().getArray();
  const idxLeft = mapLayers.indexOf(layerLeft);
  const idxRight = mapLayers.indexOf(layerRight);

  // If left and right are the exact same layer, no clipping needed
  if (idxLeft === idxRight) {
    window.webgis.map.render();
    return;
  }

  // The layer higher in the stack gets clipped so the lower one shows through
  const higherLayer = idxLeft > idxRight ? layerLeft : layerRight;
  const higherIsLeft = (higherLayer === layerLeft);

  swipePrerenderKey = higherLayer.on('prerender', (event) => {
    const ctx = event.context;
    if (!ctx) return;
    const mapSize = window.webgis.map.getSize();
    if (!mapSize) return;

    const width = mapSize[0] * (window.webgis.swipePosition / 100);

    let tl, tr, br, bl;
    if (higherIsLeft) {
      // higherLayer is Left -> render only on left side [0 to width]
      tl = getSafeRenderPixel(event, [0, 0]);
      tr = getSafeRenderPixel(event, [width, 0]);
      br = getSafeRenderPixel(event, [width, mapSize[1]]);
      bl = getSafeRenderPixel(event, [0, mapSize[1]]);
    } else {
      // higherLayer is Right -> render only on right side [width to mapSize[0]]
      tl = getSafeRenderPixel(event, [width, 0]);
      tr = getSafeRenderPixel(event, [mapSize[0], 0]);
      br = getSafeRenderPixel(event, mapSize);
      bl = getSafeRenderPixel(event, [width, mapSize[1]]);
    }

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(tl[0], tl[1]);
    ctx.lineTo(tr[0], tr[1]);
    ctx.lineTo(br[0], br[1]);
    ctx.lineTo(bl[0], bl[1]);
    ctx.closePath();
    ctx.clip();
  });

  swipePostrenderKey = higherLayer.on('postrender', (event) => {
    const ctx = event.context;
    if (ctx) ctx.restore();
  });

  window.webgis.map.render();
}


/* ==========================================================================
   FEATURE 2: WIND FLOW SIMULATION (Animasi Arah Angin NTT)
   ========================================================================== */

let windAnimId = null;
let windParticles = [];
let windCanvas = null;
let windCtx = null;

function initWindAnimation() {
  windCanvas = document.getElementById('wind-canvas');
  if (!windCanvas) return;
  windCtx = windCanvas.getContext('2d');

  // Keep particle canvas in sync with map movement and zooming
  if (window.webgis.map) {
    window.webgis.map.on('movestart', () => {
      if (window.webgis.windActive && windCtx && windCanvas) {
        windCtx.clearRect(0, 0, windCanvas.width, windCanvas.height);
      }
    });

    window.webgis.map.on('moveend', () => {
      if (window.webgis.windActive) {
        resizeWindCanvas();
        seedWindParticles();
      }
    });
  }

  window.addEventListener('resize', () => {
    if (window.webgis.windActive) {
      resizeWindCanvas();
      seedWindParticles();
    }
  });

  // Pause simulation if user switches tabs to preserve CPU/battery
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (windAnimId) {
        cancelAnimationFrame(windAnimId);
        windAnimId = null;
      }
    } else if (window.webgis.windActive && !windAnimId) {
      windAnimId = requestAnimationFrame(animateWind);
    }
  });
}

function resizeWindCanvas() {
  if (!windCanvas || !window.webgis.map) return;
  const mapSize = window.webgis.map.getSize();
  if (!mapSize) return;

  const dpr = window.devicePixelRatio || 1;
  windCanvas.width = mapSize[0] * dpr;
  windCanvas.height = mapSize[1] * dpr;
  windCanvas.style.width = mapSize[0] + 'px';
  windCanvas.style.height = mapSize[1] + 'px';
  if (windCtx) {
    windCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
}

function seedWindParticles() {
  if (!window.webgis.map) return;
  const mapSize = window.webgis.map.getSize();
  if (!mapSize) return;

  const count = window.webgis.windDensity || 1200;
  windParticles = [];

  for (let i = 0; i < count; i++) {
    windParticles.push({
      x: Math.random() * mapSize[0],
      y: Math.random() * mapSize[1],
      age: Math.floor(Math.random() * 80),
      maxAge: 40 + Math.floor(Math.random() * 60)
    });
  }
}

function computeWindVector(lon, lat, pattern) {
  let u = -16;
  let v = 10;
  let speedKnot = 22;

  if (pattern === 'muson_tenggara') {
    // Winds blow from Southeast (Australia ~135°) to Northwest (~315°)
    // Realistic monsoon wave pattern across Flores Sea, Savu Sea, and Timor Sea
    const wave = Math.sin(lat * 1.8 + lon * 0.9) * 3 + Math.cos(lon * 2.2) * 2;
    speedKnot = Math.max(12, Math.min(32, 22 + wave));
    const rad = (315 + Math.sin(lon * 1.4) * 10) * Math.PI / 180;
    u = speedKnot * Math.sin(rad);
    v = speedKnot * Math.cos(rad);
  } else if (pattern === 'muson_barat') {
    // Winds blow from Northwest (~315°) to Southeast (~135°) [Musim Hujan]
    const wave = Math.sin(lat * 1.6 - lon * 1.1) * 3 + Math.cos(lat * 2.4) * 2;
    speedKnot = Math.max(10, Math.min(28, 19 + wave));
    const rad = (135 + Math.cos(lat * 1.5) * 8) * Math.PI / 180;
    u = speedKnot * Math.sin(rad);
    v = speedKnot * Math.cos(rad);
  } else if (pattern === 'siklon_sawu') {
    // Cyclonic vortex centered in Laut Sawu (lon: 122.0, lat: -9.7)
    const centerLon = 122.0;
    const centerLat = -9.7;
    const dLon = lon - centerLon;
    const dLat = lat - centerLat;
    const r = Math.hypot(dLon, dLat);
    const phi = Math.atan2(dLat, dLon);

    // Southern hemisphere Coriolis: CLOCKWISE rotation
    const tangentAngle = phi - Math.PI / 2;
    const vt = 32 * Math.exp(-r / 3.0) * (r / (r + 0.35)) + 6;
    const vr = -6 * Math.exp(-r / 3.5); // inward spiral inflow

    u = (vt * Math.cos(tangentAngle) + vr * Math.cos(phi)) * 0.9;
    v = (vt * Math.sin(tangentAngle) + vr * Math.sin(phi)) * 0.9;
    speedKnot = Math.hypot(u, v);
  }

  return { u, v, speedKnot };
}

function getWindColor(speed) {
  if (speed < 12) {
    return 'rgba(56, 189, 248, 0.75)'; // sky-400
  } else if (speed < 20) {
    return 'rgba(45, 212, 191, 0.8)';  // teal-400
  } else if (speed < 28) {
    return 'rgba(251, 191, 36, 0.85)'; // amber-400
  } else {
    return 'rgba(244, 63, 94, 0.9)';   // rose-500
  }
}

function getSpeedFactor() {
  switch (window.webgis.windSpeedLevel) {
    case 'slow': return 0.6;
    case 'fast': return 1.6;
    default: return 1.0;
  }
}

function animateWind() {
  if (!window.webgis.windActive) return;

  const map = window.webgis.map;
  if (!map || !windCanvas || !windCtx) return;
  const mapSize = map.getSize();
  if (!mapSize) {
    windAnimId = requestAnimationFrame(animateWind);
    return;
  }

  const speedMultiplier = getSpeedFactor();
  const pattern = window.webgis.windPattern || 'muson_tenggara';

  // Soft trail fade: destination-out preserves the underlying map canvas with zero darkening
  windCtx.globalCompositeOperation = 'destination-out';
  windCtx.fillStyle = 'rgba(0, 0, 0, 0.085)';
  windCtx.fillRect(0, 0, mapSize[0], mapSize[1]);
  windCtx.globalCompositeOperation = 'source-over';
  windCtx.lineCap = 'round';
  windCtx.lineWidth = 1.6;

  for (let i = 0; i < windParticles.length; i++) {
    const p = windParticles[i];

    if (p.age >= p.maxAge) {
      p.x = Math.random() * mapSize[0];
      p.y = Math.random() * mapSize[1];
      p.age = 0;
      p.maxAge = 40 + Math.floor(Math.random() * 60);
      continue;
    }

    const coord = map.getCoordinateFromPixel([p.x, p.y]);
    if (!coord) {
      p.x = Math.random() * mapSize[0];
      p.y = Math.random() * mapSize[1];
      p.age = 0;
      continue;
    }

    const lonLat = ol.proj.toLonLat(coord);
    const vec = computeWindVector(lonLat[0], lonLat[1], pattern);

    // Coordinate displacement in EPSG:3857 (meters)
    const displacementMeters = 350 * speedMultiplier;
    const nextCoord = [coord[0] + vec.u * displacementMeters, coord[1] + vec.v * displacementMeters];
    const nextPixel = map.getPixelFromCoordinate(nextCoord);

    if (!nextPixel) {
      p.x = Math.random() * mapSize[0];
      p.y = Math.random() * mapSize[1];
      p.age = 0;
      continue;
    }

    // Clamp step to avoid long streaks on sudden zoom or view transitions
    const dx = nextPixel[0] - p.x;
    const dy = nextPixel[1] - p.y;
    const dist = Math.hypot(dx, dy);
    const maxStep = 18;
    let targetX = nextPixel[0];
    let targetY = nextPixel[1];

    if (dist > maxStep) {
      const angle = Math.atan2(dy, dx);
      targetX = p.x + Math.cos(angle) * maxStep;
      targetY = p.y + Math.sin(angle) * maxStep;
    }

    windCtx.beginPath();
    windCtx.moveTo(p.x, p.y);
    windCtx.lineTo(targetX, targetY);
    windCtx.strokeStyle = getWindColor(vec.speedKnot);
    windCtx.stroke();

    p.x = targetX;
    p.y = targetY;
    p.age++;

    if (p.x < 0 || p.x > mapSize[0] || p.y < 0 || p.y > mapSize[1]) {
      p.x = Math.random() * mapSize[0];
      p.y = Math.random() * mapSize[1];
      p.age = 0;
    }
  }

  windAnimId = requestAnimationFrame(animateWind);
}

function toggleWindAnimation(enable) {
  if (enable === undefined) {
    enable = !window.webgis.windActive;
  }
  window.webgis.windActive = !!enable;

  const toggleCheck = document.getElementById('toggle-wind-check');
  if (toggleCheck) toggleCheck.checked = window.webgis.windActive;

  const container = document.getElementById('wind-controls-container');
  if (container) container.classList.toggle('hidden', !window.webgis.windActive);

  const badge = document.getElementById('wind-status-badge');
  if (badge) {
    badge.textContent = window.webgis.windActive ? 'AKTIF (60 FPS)' : 'OFF';
    badge.className = window.webgis.windActive
      ? 'text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold'
      : 'text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700';
  }

  const hud = document.getElementById('wind-hud-badge');
  if (hud) hud.classList.toggle('hidden', !window.webgis.windActive);

  if (window.webgis.windActive) {
    if (windCanvas) windCanvas.classList.remove('hidden');
    resizeWindCanvas();
    seedWindParticles();
    if (!windAnimId) {
      windAnimId = requestAnimationFrame(animateWind);
    }
    updateWindMetricHUD();
    showToast('Animasi Angin Aktif', 'Simulasi aliran vektor partikel arah angin NTT aktif.', 'info');
  } else {
    if (windAnimId) {
      cancelAnimationFrame(windAnimId);
      windAnimId = null;
    }
    if (windCanvas) {
      windCanvas.classList.add('hidden');
      if (windCtx) windCtx.clearRect(0, 0, windCanvas.width, windCanvas.height);
    }
    showToast('Animasi Angin Nonaktif', 'Simulasi partikel angin dimatikan.', 'info');
  }
}

function updateWindMetricHUD() {
  const pattern = window.webgis.windPattern || 'muson_tenggara';
  const hudTitle = document.getElementById('wind-hud-title');
  const hudSpeed = document.getElementById('wind-hud-speed');
  const hudArrow = document.getElementById('wind-hud-arrow');

  const dirMetric = document.getElementById('wind-dir-metric');
  const speedMetric = document.getElementById('wind-speed-metric');
  const beaufortMetric = document.getElementById('wind-beaufort-metric');

  let title = 'Muson Tenggara';
  let speedText = '22 knot (~40.7 km/j)';
  let dirText = 'Tenggara ➔ Barat Laut (135°)';
  let beaufort = '5 (Fresh Breeze)';
  let rotDeg = -45; // points NW

  if (pattern === 'muson_barat') {
    title = 'Muson Barat Daya';
    speedText = '19 knot (~35.2 km/j)';
    dirText = 'Barat Laut ➔ Tenggara (315°)';
    beaufort = '4 (Moderate Breeze)';
    rotDeg = 135; // points SE
  } else if (pattern === 'siklon_sawu') {
    title = 'Siklon Laut Sawu';
    speedText = '32 knot (~59.3 km/j)';
    dirText = 'Pusaran Siklonik Spiral';
    beaufort = '7 (Near Gale)';
    rotDeg = 45;
  }

  if (hudTitle) hudTitle.textContent = title;
  if (hudSpeed) hudSpeed.textContent = speedText;
  if (hudArrow) hudArrow.style.transform = `rotate(${rotDeg}deg)`;

  if (dirMetric) dirMetric.textContent = dirText;
  if (speedMetric) speedMetric.textContent = speedText;
  if (beaufortMetric) beaufortMetric.textContent = beaufort;
}

function onWindPatternChange(pattern) {
  window.webgis.windPattern = pattern;
  updateWindMetricHUD();
  if (window.webgis.windActive && windCtx && windCanvas) {
    windCtx.clearRect(0, 0, windCanvas.width, windCanvas.height);
    seedWindParticles();
  }
}

function setWindSpeed(level) {
  window.webgis.windSpeedLevel = level;
  ['slow', 'medium', 'fast'].forEach((lvl) => {
    const btn = document.getElementById(`btn-wind-${lvl}`);
    if (!btn) return;
    if (lvl === level) {
      btn.className = 'wind-speed-btn py-1.5 px-2 rounded-xl border border-sky-500 bg-sky-500/20 text-sky-300 text-center font-medium transition';
    } else {
      btn.className = 'wind-speed-btn py-1.5 px-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-center font-medium transition hover:border-slate-600';
    }
  });
}

function onWindDensityInput(val) {
  const count = parseInt(val, 10);
  window.webgis.windDensity = count;
  const valBadge = document.getElementById('wind-density-val');
  if (valBadge) valBadge.textContent = `${count} Partikel`;
  if (window.webgis.windActive) {
    seedWindParticles();
  }
}

// Attach globally
window.initSwipeTool = initSwipeTool;
window.toggleSwipeTool = toggleSwipeTool;
window.updateSwipePosition = updateSwipePosition;
window.onSwipeSliderInput = onSwipeSliderInput;
window.onSwipeLayerChange = onSwipeLayerChange;
window.initWindAnimation = initWindAnimation;
window.toggleWindAnimation = toggleWindAnimation;
window.onWindPatternChange = onWindPatternChange;
window.setWindSpeed = setWindSpeed;
window.onWindDensityInput = onWindDensityInput;
