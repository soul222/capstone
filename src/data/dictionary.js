// File: src/data/dictionary.js

// Mapping dari class label ke key
const classToKey = {
  0: 'aceh_pintu_aceh',
  1: 'bali_barong',
  2: 'banten_surosowan',
  3: 'bengkulu_besurek',
  4: 'yogya_parang',
  5: 'solo_kawung',
  6: 'cirebon_mega_mendung',
  7: 'jakarta_ondel_ondel',
  8: 'jambi_bungo_tanjung',
  9: 'jawa_barat_cirebonan'
};

// Class labels untuk model
const classLabels = [
  'aceh_pintu_aceh',
  'bali_barong', 
  'banten_surosowan',
  'bengkulu_besurek',
  'yogya_parang',
  'solo_kawung',
  'cirebon_mega_mendung',
  'jakarta_ondel_ondel',
  'jambi_bungo_tanjung',
  'jawa_barat_cirebonan'
];

// Data motif batik lengkap
const data = {
  aceh_pintu_aceh: {
    name: "Batik Pintu Aceh",
    provinsi: "Aceh",
    description: "Batik Aceh dengan motif 'Pintu Aceh' terinspirasi dari desain pintu rumah tradisional Aceh yang sangat khas. Motif ini menggambarkan keindahan arsitektur Aceh dengan ornamen yang detail dan bermakna filosofis.",
    occasion: "Batik ini sangat cocok dikenakan dalam acara formal, pernikahan adat, dan acara budaya Aceh.",
    link_shop: "https://www.tokopedia.com/search?st=&q=batik%20aceh%20pintu%20aceh",
    link_image: "https://batik-types-forecast.s3.ap-southeast-2.amazonaws.com/samples/aceh_pintu_aceh.jpg"
  },
  
  bali_barong: {
    name: "Batik Barong Bali",
    provinsi: "Bali",
    description: "Batik dengan motif Barong yang merupakan figur mitologi Bali sebagai simbol kebaikan. Motif ini menggambarkan sosok Barong dengan detail ornamen khas Bali yang indah dan sakral.",
    occasion: "Cocok untuk upacara keagamaan Hindu, festival budaya Bali, dan acara formal di Bali.",
    link_shop: "https://www.tokopedia.com/search?st=&q=batik%20bali%20barong",
    link_image: "https://batik-types-forecast.s3.ap-southeast-2.amazonaws.com/samples/bali_barong.jpg"
  },

  banten_surosowan: {
    name: "Batik Surosowan Banten", 
    provinsi: "Banten",
    description: "Batik khas Banten dengan motif Surosowan yang terinspirasi dari Keraton Surosowan, bekas pusat pemerintahan Kesultanan Banten. Motif ini menggambarkan kemegahan arsitektur keraton dengan filosofi kepemimpinan.",
    occasion: "Ideal untuk acara kenegaraan, upacara adat Banten, dan event formal budaya.",
    link_shop: "https://www.tokopedia.com/search?st=&q=batik%20banten%20surosowan",
    link_image: "https://batik-types-forecast.s3.ap-southeast-2.amazonaws.com/samples/banten_surosowan.jpg"
  },

  bengkulu_besurek: {
    name: "Batik Besurek Bengkulu",
    provinsi: "Bengkulu", 
    description: "Batik Bengkulu dengan motif kaligrafi Arab (Besurek) yang memadukan unsur Islamic dengan budaya lokal Bengkulu. Motif ini unik karena menggabungkan tulisan Arab dengan ornamen tradisional.",
    occasion: "Cocok untuk acara keagamaan Islam, festival budaya, dan acara formal di Bengkulu.",
    link_shop: "https://www.tokopedia.com/search?st=&q=batik%20bengkulu%20besurek", 
    link_image: "https://batik-types-forecast.s3.ap-southeast-2.amazonaws.com/samples/bengkulu_besurek.jpg"
  },

  yogya_parang: {
    name: "Batik Parang Yogyakarta",
    provinsi: "Yogyakarta",
    description: "Batik klasik Yogyakarta dengan motif Parang yang melambangkan gelombang laut atau ombak. Motif ini memiliki makna filosofis tentang kekuatan dan ketabahan dalam menghadapi tantangan hidup.",
    occasion: "Sangat cocok untuk acara resmi keraton, pernikahan Jawa, upacara adat, dan acara formal.",
    link_shop: "https://www.tokopedia.com/search?st=&q=batik%20yogya%20parang",
    link_image: "https://batik-types-forecast.s3.ap-southeast-2.amazonaws.com/samples/yogya_parang.jpg"
  },

  solo_kawung: {
    name: "Batik Kawung Solo",
    provinsi: "Jawa Tengah", 
    description: "Batik Solo dengan motif Kawung yang terinspirasi dari buah kolang-kaling (kawung). Motif geometris ini melambangkan kesucian, kebijaksanaan, dan keadilan dalam kehidupan.",
    occasion: "Ideal untuk acara formal, upacara keraton Solo, pernikahan tradisional Jawa, dan acara budaya.",
    link_shop: "https://www.tokopedia.com/search?st=&q=batik%20solo%20kawung",
    link_image: "https://batik-types-forecast.s3.ap-southeast-2.amazonaws.com/samples/solo_kawung.jpg"
  },

  cirebon_mega_mendung: {
    name: "Batik Mega Mendung Cirebon",
    provinsi: "Jawa Barat",
    description: "Batik Cirebon dengan motif Mega Mendung yang menggambarkan awan mendung dengan gradasi warna yang indah. Motif ini melambangkan kesabaran dan ketenangan hati dalam menghadapi cobaan.",
    occasion: "Cocok untuk acara formal, festival batik, pernikahan, dan acara budaya Cirebon.",
    link_shop: "https://www.tokopedia.com/search?st=&q=batik%20cirebon%20mega%20mendung",
    link_image: "https://batik-types-forecast.s3.ap-southeast-2.amazonaws.com/samples/cirebon_mega_mendung.jpg"
  },

  jakarta_ondel_ondel: {
    name: "Batik Ondel-ondel Jakarta",
    provinsi: "DKI Jakarta",
    description: "Batik modern Jakarta dengan motif Ondel-ondel, boneka raksasa khas Betawi yang menjadi ikon budaya Jakarta. Motif ini menggambarkan keceriaan dan semangat masyarakat Betawi.",
    occasion: "Sempurna untuk festival Betawi, acara budaya Jakarta, dan event modern dengan nuansa tradisional.",
    link_shop: "https://www.tokopedia.com/search?st=&q=batik%20jakarta%20ondel%20ondel",
    link_image: "https://batik-types-forecast.s3.ap-southeast-2.amazonaws.com/samples/jakarta_ondel_ondel.jpg"
  },

  jambi_bungo_tanjung: {
    name: "Batik Bungo Tanjung Jambi",
    provinsi: "Jambi",
    description: "Batik Jambi dengan motif Bungo Tanjung yang terinspirasi dari bunga tanjung, bunga khas Jambi. Motif ini menggambarkan keharuman dan keindahan alam Jambi dengan filosofi kesucian hati.",
    occasion: "Cocok untuk acara pernikahan Melayu, festival budaya Jambi, dan acara formal daerah.",
    link_shop: "https://www.tokopedia.com/search?st=&q=batik%20jambi%20bungo%20tanjung",
    link_image: "https://batik-types-forecast.s3.ap-southeast-2.amazonaws.com/samples/jambi_bungo_tanjung.jpg"
  },

  jawa_barat_cirebonan: {
    name: "Batik Cirebonan Jawa Barat",
    provinsi: "Jawa Barat",
    description: "Batik khas Jawa Barat dengan pengaruh Cirebon yang menggabungkan motif tradisional Jawa dengan sentuhan budaya Tionghoa dan Islam. Motifnya kaya akan ornamen dan warna cerah.",
    occasion: "Ideal untuk acara multikultural, pernikahan campuran, dan festival seni budaya Jawa Barat.",
    link_shop: "https://www.tokopedia.com/search?st=&q=batik%20jawa%20barat%20cirebonan",
    link_image: "https://batik-types-forecast.s3.ap-southeast-2.amazonaws.com/samples/jawa_barat_cirebonan.jpg"
  }
};

module.exports = {
  data,
  classLabels,
  classToKey
};