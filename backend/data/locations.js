// Full list of countries so the picker/search covers the whole world.
// Only a handful of "flagship" markets get deep state/city + alt-data-rail detail
// (that's the honest, scalable story: start deep in a few markets, expand over time).
// Any country NOT in FLAGSHIP_DATA still works — the frontend falls back to free-text
// state/city entry and a generic set of alternative data sources.

export const ALL_COUNTRIES = [
  { code: "AF", name: "Afghanistan" }, { code: "AL", name: "Albania" }, { code: "DZ", name: "Algeria" },
  { code: "AO", name: "Angola" }, { code: "AR", name: "Argentina" }, { code: "AM", name: "Armenia" },
  { code: "AU", name: "Australia" }, { code: "AT", name: "Austria" }, { code: "AZ", name: "Azerbaijan" },
  { code: "BD", name: "Bangladesh" }, { code: "BY", name: "Belarus" }, { code: "BE", name: "Belgium" },
  { code: "BJ", name: "Benin" }, { code: "BT", name: "Bhutan" }, { code: "BO", name: "Bolivia" },
  { code: "BA", name: "Bosnia and Herzegovina" }, { code: "BW", name: "Botswana" }, { code: "BR", name: "Brazil" },
  { code: "BG", name: "Bulgaria" }, { code: "BF", name: "Burkina Faso" }, { code: "BI", name: "Burundi" },
  { code: "KH", name: "Cambodia" }, { code: "CM", name: "Cameroon" }, { code: "CA", name: "Canada" },
  { code: "CL", name: "Chile" }, { code: "CN", name: "China" }, { code: "CO", name: "Colombia" },
  { code: "CD", name: "Congo (DRC)" }, { code: "CR", name: "Costa Rica" }, { code: "CI", name: "Côte d'Ivoire" },
  { code: "HR", name: "Croatia" }, { code: "CU", name: "Cuba" }, { code: "CZ", name: "Czechia" },
  { code: "DK", name: "Denmark" }, { code: "DO", name: "Dominican Republic" }, { code: "EC", name: "Ecuador" },
  { code: "EG", name: "Egypt" }, { code: "SV", name: "El Salvador" }, { code: "EE", name: "Estonia" },
  { code: "ET", name: "Ethiopia" }, { code: "FJ", name: "Fiji" }, { code: "FI", name: "Finland" },
  { code: "FR", name: "France" }, { code: "GA", name: "Gabon" }, { code: "GM", name: "Gambia" },
  { code: "GE", name: "Georgia" }, { code: "DE", name: "Germany" }, { code: "GH", name: "Ghana" },
  { code: "GR", name: "Greece" }, { code: "GT", name: "Guatemala" }, { code: "GN", name: "Guinea" },
  { code: "HT", name: "Haiti" }, { code: "HN", name: "Honduras" }, { code: "HK", name: "Hong Kong" },
  { code: "HU", name: "Hungary" }, { code: "IS", name: "Iceland" }, { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" }, { code: "IR", name: "Iran" }, { code: "IQ", name: "Iraq" },
  { code: "IE", name: "Ireland" }, { code: "IL", name: "Israel" }, { code: "IT", name: "Italy" },
  { code: "JM", name: "Jamaica" }, { code: "JP", name: "Japan" }, { code: "JO", name: "Jordan" },
  { code: "KZ", name: "Kazakhstan" }, { code: "KE", name: "Kenya" }, { code: "KW", name: "Kuwait" },
  { code: "KG", name: "Kyrgyzstan" }, { code: "LA", name: "Laos" }, { code: "LV", name: "Latvia" },
  { code: "LB", name: "Lebanon" }, { code: "LR", name: "Liberia" }, { code: "LY", name: "Libya" },
  { code: "LT", name: "Lithuania" }, { code: "MG", name: "Madagascar" }, { code: "MW", name: "Malawi" },
  { code: "MY", name: "Malaysia" }, { code: "ML", name: "Mali" }, { code: "MT", name: "Malta" },
  { code: "MX", name: "Mexico" }, { code: "MD", name: "Moldova" }, { code: "MN", name: "Mongolia" },
  { code: "ME", name: "Montenegro" }, { code: "MA", name: "Morocco" }, { code: "MZ", name: "Mozambique" },
  { code: "MM", name: "Myanmar" }, { code: "NA", name: "Namibia" }, { code: "NP", name: "Nepal" },
  { code: "NL", name: "Netherlands" }, { code: "NZ", name: "New Zealand" }, { code: "NI", name: "Nicaragua" },
  { code: "NE", name: "Niger" }, { code: "NG", name: "Nigeria" }, { code: "MK", name: "North Macedonia" },
  { code: "NO", name: "Norway" }, { code: "OM", name: "Oman" }, { code: "PK", name: "Pakistan" },
  { code: "PA", name: "Panama" }, { code: "PG", name: "Papua New Guinea" }, { code: "PY", name: "Paraguay" },
  { code: "PE", name: "Peru" }, { code: "PH", name: "Philippines" }, { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" }, { code: "QA", name: "Qatar" }, { code: "RO", name: "Romania" },
  { code: "RU", name: "Russia" }, { code: "RW", name: "Rwanda" }, { code: "SA", name: "Saudi Arabia" },
  { code: "SN", name: "Senegal" }, { code: "RS", name: "Serbia" }, { code: "SL", name: "Sierra Leone" },
  { code: "SG", name: "Singapore" }, { code: "SK", name: "Slovakia" }, { code: "SI", name: "Slovenia" },
  { code: "SO", name: "Somalia" }, { code: "ZA", name: "South Africa" }, { code: "KR", name: "South Korea" },
  { code: "SS", name: "South Sudan" }, { code: "ES", name: "Spain" }, { code: "LK", name: "Sri Lanka" },
  { code: "SD", name: "Sudan" }, { code: "SE", name: "Sweden" }, { code: "CH", name: "Switzerland" },
  { code: "SY", name: "Syria" }, { code: "TW", name: "Taiwan" }, { code: "TJ", name: "Tajikistan" },
  { code: "TZ", name: "Tanzania" }, { code: "TH", name: "Thailand" }, { code: "TG", name: "Togo" },
  { code: "TT", name: "Trinidad and Tobago" }, { code: "TN", name: "Tunisia" }, { code: "TR", name: "Turkey" },
  { code: "TM", name: "Turkmenistan" }, { code: "UG", name: "Uganda" }, { code: "UA", name: "Ukraine" },
  { code: "AE", name: "United Arab Emirates" }, { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" }, { code: "UY", name: "Uruguay" }, { code: "UZ", name: "Uzbekistan" },
  { code: "VE", name: "Venezuela" }, { code: "VN", name: "Vietnam" }, { code: "YE", name: "Yemen" },
  { code: "ZM", name: "Zambia" }, { code: "ZW", name: "Zimbabwe" }
];

// Deep-supported "flagship" markets: full state -> city breakdown + the real
// alternative-data rails that exist there. This is the honest MVP story —
// start narrow and deep, expand country-by-country.
export const FLAGSHIP_DATA = {
  IN: {
    dataRails: ["UPI Transactions", "Electricity Bill Payments", "Mobile Recharge History"],
    states: {
      "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
      "Karnataka": ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru"],
      "Delhi": ["New Delhi", "Dwarka", "Rohini", "Saket"],
      "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"],
      "Uttar Pradesh": ["Lucknow", "Kanpur", "Noida", "Varanasi", "Agra"],
      "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
      "West Bengal": ["Kolkata", "Howrah", "Siliguri"],
      "Telangana": ["Hyderabad", "Warangal"],
      "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur"],
      "Punjab": ["Ludhiana", "Amritsar", "Chandigarh"]
    }
  },
  NG: {
    dataRails: ["Mobile Money (Opay/Paga)", "Electricity Bill Payments"],
    states: {
      "Lagos": ["Ikeja", "Lekki", "Surulere"],
      "Kano": ["Kano City"],
      "Rivers": ["Port Harcourt"],
      "FCT": ["Abuja"]
    }
  },
  KE: {
    dataRails: ["M-Pesa Transactions", "Utility Bill Payments"],
    states: {
      "Nairobi County": ["Nairobi"],
      "Mombasa County": ["Mombasa"],
      "Kisumu County": ["Kisumu"]
    }
  },
  BD: {
    dataRails: ["bKash Mobile Payments", "Utility Bill Payments"],
    states: {
      "Dhaka Division": ["Dhaka", "Gazipur"],
      "Chattogram Division": ["Chattogram"]
    }
  },
  PH: {
    dataRails: ["GCash Transactions", "Utility Bill Payments"],
    states: {
      "Metro Manila": ["Manila", "Quezon City", "Makati"],
      "Cebu": ["Cebu City"]
    }
  },
  ID: {
    dataRails: ["GoPay / OVO Transactions", "Utility Bill Payments"],
    states: {
      "Jakarta": ["Jakarta"],
      "West Java": ["Bandung"],
      "East Java": ["Surabaya"]
    }
  }
};

const GENERIC_DATA_RAILS = ["Mobile Money Transactions", "Utility Bill Payments"];

// Currency by country (covers the flagship + most common markets; falls back to USD)
const CURRENCY_BY_COUNTRY = {
  IN: "INR", NG: "NGN", KE: "KES", BD: "BDT", PH: "PHP", ID: "IDR",
  US: "USD", GB: "GBP", CA: "CAD", AU: "AUD", DE: "EUR", FR: "EUR", IT: "EUR", ES: "EUR",
  NL: "EUR", BE: "EUR", AT: "EUR", IE: "EUR", PT: "EUR", GR: "EUR", FI: "EUR",
  CN: "CNY", JP: "JPY", KR: "KRW", BR: "BRL", MX: "MXN", ZA: "ZAR", EG: "EGP",
  PK: "PKR", VN: "VND", TH: "THB", MY: "MYR", SG: "SGD", TR: "TRY", RU: "RUB",
  SA: "SAR", AE: "AED", AR: "ARS", CO: "COP", PE: "PEN", CL: "CLP", GH: "GHS",
  TZ: "TZS", UG: "UGX", ET: "ETB", MA: "MAD", DZ: "DZD", TN: "TND",
};

export function getCurrency(code) {
  return CURRENCY_BY_COUNTRY[code] || "USD";
}

export const INDUSTRIES = [
  "Retail / Kirana Store",
  "Food & Beverage",
  "Textiles & Apparel",
  "Agriculture & Agri-trading",
  "Manufacturing (Small-scale)",
  "Transportation & Logistics",
  "Home Services & Repair",
  "Beauty & Wellness",
  "Education & Tutoring",
  "Technology / IT Services",
  "Handicrafts & Artisan Goods",
  "Healthcare (Clinics/Pharmacy)"
];

// Returns full detail for any country code. Flagship markets get real
// state/city data; everything else gets a "supported: false" flag so the
// frontend can fall back to free-text state/city fields.
export function getCountryDetail(code) {
  const base = ALL_COUNTRIES.find((c) => c.code === code);
  if (!base) return null;

  const flagship = FLAGSHIP_DATA[code];
  const currency = getCurrency(code);
  if (flagship) {
    return { ...base, supported: true, dataRails: flagship.dataRails, states: flagship.states, currency };
  }
  return { ...base, supported: false, dataRails: GENERIC_DATA_RAILS, states: {}, currency };
}
