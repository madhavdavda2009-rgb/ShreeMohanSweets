// Starter catalogue for a fresh database. Importing the live PHP database replaces this.
// Prices are per kg. Only the 20 prices in the old database.sql are real; 0 means
// "price on request" until the shop sets one in /admin/products. The PHP site
// auto-generated prices for everything else, so those were not carried over.
const SWEETS = 1;
const NAMKEEN = 2;
const VRAT = 3;
const FARSAN = 4;

// [name, category, image file, price per kg, featured]
export const catalog = [
  ["Kaju Katli", SWEETS, "Kaju_Katli.jpg", 800, 1],
  ["Mohan Thal", SWEETS, "Mohan_Thal.jpg", 560, 1],
  ["Kesar Penda", SWEETS, "Kesar_Penda.jpg", 520, 1],
  ["Besan Laddu", SWEETS, "Besan Laddu.jpg", 480, 1],
  ["Cadbury Penda", SWEETS, "Cadbury_Penda.jpg", 560, 1],
  ["Motichoor Laddu", SWEETS, "Boondi Ladu.jpg", 420, 1],
  ["Churma Laddu", SWEETS, "Churma_Laddu.jpg", 500, 0],
  ["Soan Papdi", SWEETS, "Soan Papdi.jpg", 350, 0],
  ["Malai Barfi", SWEETS, "Malai Barfi.jpeg", 0, 0],
  ["Cadbury Burfi", SWEETS, "Cadbury Burfi.jpeg", 0, 0],
  ["Kathiyavadi Penda", SWEETS, "kathiyavadi penda.jpg", 0, 0],
  ["Lakarshi Laddu", SWEETS, "Lakarshi_Labu.jpg", 0, 0],
  ["Dudh no Halvo", SWEETS, "dudhno halvo.jpg", 0, 0],
  ["Topra Pak", SWEETS, "topra park.jpg", 0, 0],
  ["Masor", SWEETS, "masor.jpg", 0, 0],
  ["Galefa", SWEETS, "Galefa.jpg", 0, 0],
  ["Gulab Jamun", SWEETS, "Gulab Jamun.jpg", 0, 0],
  ["Jalebi", SWEETS, "jalebi.jpg", 0, 0],

  ["Mixture Namkeen", NAMKEEN, "Chavanu.jpg", 260, 1],
  ["Karkhadiya", NAMKEEN, "kharkhadiya.jpg.jpeg", 260, 0],
  ["Dal Namkeen", NAMKEEN, "dal muth.jpg", 220, 0],
  ["Chana Namkeen", NAMKEEN, "Chana Chor.jpeg", 200, 0],
  ["Bikaneri Sev", NAMKEEN, "Bikaneri_Sev.jpg", 150, 0],
  ["Boondi", NAMKEEN, "tikhi mamri.jpg", 140, 0],
  ["Bhakharwadi", NAMKEEN, "Bhakharwadi.jpeg", 0, 0],
  ["Mini Bhakharwadi", NAMKEEN, "mini bharkharwadi.jpg", 0, 0],
  ["Bhavnagri Gathiya", NAMKEEN, "bhavnagri gathiya.jpg", 0, 0],
  ["Vanela Gathiya", NAMKEEN, "vanela gathiya.jpg", 0, 0],
  ["Makhaniya Gathiya", NAMKEEN, "makhaniya gathiya.jpg", 0, 0],
  ["Nylon Gathiya", NAMKEEN, "naylon gathia.jpg", 0, 0],
  ["Ratlami Sev", NAMKEEN, "Ratlami-Sev.jpg", 0, 0],
  ["Nylon Sev", NAMKEEN, "nylon sev.jpg", 0, 0],
  ["Jadi Sev", NAMKEEN, "jadi sev.jpg", 0, 0],
  ["Medium Sev", NAMKEEN, "Medium_Sev.jpeg", 0, 0],
  ["Medium Tikhi Sev", NAMKEEN, "Medium tikhi Sev.jpg", 0, 0],
  ["Sanchar Sev", NAMKEEN, "Sanchar_Sev.jpeg", 0, 0],
  ["Sev Mamra", NAMKEEN, "sev mamra.jpg", 0, 0],
  ["Bhel Mix", NAMKEEN, "bhel mix.jpg", 0, 0],
  ["Bhel ni Puri", NAMKEEN, "Bhel ni Puri.jpg", 0, 0],
  ["Misal Mix", NAMKEEN, "misal mix.jpg", 0, 0],
  ["Special Papad Mix", NAMKEEN, "sp.papad mix.jpg", 0, 0],
  ["Khatu Meethu Chavanu", NAMKEEN, "khatu meethu chavanu.jpg", 0, 0],
  ["Makai no Chevdo", NAMKEEN, "Makaino chevdo.jpg", 0, 0],
  ["Bhadran na Mag", NAMKEEN, "bhadrn na mag.jpg", 0, 0],
  ["Mag Jor", NAMKEEN, "mag jor.jpg", 0, 0],
  ["Mogar Dal", NAMKEEN, "Mogar_Dal.jpg", 0, 0],
  ["Chana Dal", NAMKEEN, "Chana Dal.jpeg", 0, 0],
  ["Masala Sing", NAMKEEN, "Masala Sing.jpg", 0, 0],
  ["Sing Bhujiya", NAMKEEN, "Sing_Bhujiya.jpg", 0, 0],
  ["Mamari", NAMKEEN, "Mamari.jpg", 0, 0],
  ["Tam Tam", NAMKEEN, "tam tam.jpg", 0, 0],
  ["Papadi", NAMKEEN, "papadi.jpg", 0, 0],
  ["Masala Papdi", NAMKEEN, "masala papdi.jpg", 0, 0],
  ["Farsi Puri", NAMKEEN, "farsi puri.jpg", 0, 0],
  ["Masala Puri", NAMKEEN, "Masala puri.jpg", 0, 0],
  ["Methi Puri", NAMKEEN, "methi puri.jpg", 0, 0],
  ["Sakarpara", NAMKEEN, "sakarpara.jpg", 0, 0],
  ["Methi Sakarpara", NAMKEEN, "methi sakarpara.jpg", 0, 0],
  ["Fulwadi", NAMKEEN, "Fulwadi.jpg", 0, 0],
  ["Dry Kachori", NAMKEEN, "Dry Kachori.jpg", 0, 0],

  ["Plain Banana Chips", VRAT, "Yellow_Banana_Chips.jpg", 220, 1],
  ["Masala Banana Chips", VRAT, "Mari_Banana_Chips.jpg", 240, 1],
  ["Red Chilli Banana Chips", VRAT, "Red_Chilli_Banana_Chips.jpg", 240, 1],
  ["Salted Potato Chips", VRAT, "Salted_Potato_Chips.jpg", 220, 0],
  ["Red Chilli Potato Chips", VRAT, "Red_Chilli_Potato_Chips.jpg", 240, 0],
  ["Farali Potato Chevdo", VRAT, "farali-potato chevdo.jpg", 0, 0],
  ["Farali Moro Potato Chevdo", VRAT, "farali-moro potato chevdo.jpg", 0, 0],
  ["Farali Moro Banana Chevdo", VRAT, "farali moro banana chedvo.jpg", 0, 0],
  ["Farali Spicy Banana Chevdo", VRAT, "farali-spicy banana chevdo.jpg", 0, 0],

  ["Dhokla", FARSAN, "khaman.jpg", 120, 1],
  ["Fafda", FARSAN, "fafda.jpg", 0, 0],
  ["Sandwich Dhokla", FARSAN, "Sandwich Dhokla.jpg", 0, 0],
  ["Vatidal na Khaman", FARSAN, "vatidal na khaman.jpg", 0, 0],
  ["Patra", FARSAN, "patra.jpg", 0, 0],
  ["Samosa", FARSAN, "samosa.jpg", 0, 0],
  ["Lilva ni Kachori", FARSAN, "lilva ni kachori.jpg", 0, 0],
  ["Bafvada", FARSAN, "Bafvada.jpg", 0, 0],
];

// Testimonials that were hard-coded on the old homepage. They now live in the
// reviews table so the shop can remove or replace them from the admin panel.
export const reviews = [
  ["Priyanshi Patel", 5, "Best fafda jalebi in Ahmedabad. Fresh taste and fast service."],
  ["Harsh Shah", 5, "Kaju katli quality is premium. Packaging was also beautiful."],
  ["Meera Joshi", 5, "Our family always orders sweets from Shree Mohan during festivals."],
];
