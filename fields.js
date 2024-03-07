// [
//   "Player",
//   "",
//   "Loan: start/end",
//   "Age",
//   "Nationality",
//   "Position",
//   "Market value",
//   "From Team",
//   "From League",
//   "From Region",
//   "From Country",
//   "From Level",
//   "To Team",
//   "To League",
//   "To Region",
//   "To Country",
//   "To Level",
//   "End of Loan Date",
//   "Fee",
//   "Transfer ID"
// ]

export const regionsOrder = [
  'Top', 
  'Europe, ex. Top Leagues', 
  'Asia', 
  'South America', 
  'North America', 
  'Africa', 
  'No club',
  'Retired'
];

export const regions = {
  europe: 'Europe, ex. Top Leagues',
  southAmerica: 'South America',
  northAmerica: 'North America',
  asia: 'Asia',
  africa: 'Africa',
  none: 'No club',
}

export const playerField = "Player";
export const transferIdField = "Transfer ID";
export const typeField = "";
export const fromRegionField = "From Region";
export const fromCountryField = "From Country";
export const fromLeagueField = "From League";
export const fromLevelField = "From Level";
export const fromTeamField = "From Team";
export const toRegionField = "To Region";
export const toCountryField = "To Country";
export const toLeagueField = "To League";
export const toLevelField = "To Level";
export const toTeamField = "To Team";

export const regionNatField ='Region Nat';
export const marketValueField ='Market value';
export const feeField ='Fee';
export const ageField ='Age';
export const nationalityField ='Nationality';
export const positionField ='Position';

export const outType = 'Out';
export const inType = 'In';
export const insideType = 'Inside';

export const region = 'Top';
export const regionEurope = 'Europe, ex. Top Leagues';

export const allPositions = 'All Positions';
export const positions = [
  "Left Winger",
  "Central Midfield",
  "Defensive Midfield",
  "Right-Back",
  "Right Winger",
  "Centre-Back",
  "Centre-Forward",
  "Attacking Midfield",
  "Goalkeeper",
  "Left-Back",
  "Right Midfield",
  "Second Striker",
  "Left Midfield",
  "Midfield"
];

export const countries = {
  "France": "🇫🇷",
  "Saudi Arabia": "🇸🇦",
  "Italy": "🇮🇹",
  "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "Qatar": "🇶🇦",
  "Portugal": "🇵🇹",
  "US": "🇺🇸",
  "Spain": "🇪🇸",
  "Netherlands": "🇳🇱",
  "Germany": "🇩🇪",
  "Ukraine": "🇺🇦",
  "Turkey": "🇹🇷",
  "Greece": "🇬🇷",
  "-": null,
  "Mexico": "🇲🇽",
  "Brazil": "🇧🇷",
  "Belgium": "🇧🇪",
  "Austria": "🇦🇹",
  "Switzerland": "🇨🇭",
  "Russia": "🇷🇺",
  "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "Denmark": "🇩🇰",
  "Uruguay": "🇺🇾",
  "Argentina": "🇦🇷",
  "UAE": "🇦🇪",
  "Croatia": "🇭🇷",
  "Czech": "🇨🇿",
  "Sweden": "🇸🇪",
  "Poland": "🇵🇱",
  "Australia": "🇦🇺",
  "Azerbaijan": "🇦🇿",
  "Paraguay": "🇵🇾",
  "Cyprus": "🇨🇾",
  "Japan": "🇯🇵",
  "Iran": "🇮🇷",
  "Egypt": "🇪🇬",
  "Serbia": "🇷🇸",
  "Norway": "🇳🇴",
  "Hungary": "🇭🇺",
  "Slovenia": "🇸🇮",
  "Armenia": "🇦🇲",
  "Bulgaria": "🇧🇬",
  "Malta": "🇲🇹",
  "Luxembourgh": "🇱🇺",
  "Ireland": "🇮🇪",
  "Korea": "🇰🇷",
  "Algeria": "🇩🇿",
  "Bosnia-H": "🇧🇦",
  "Slovakia": "🇸🇰",
  "Colombia": "🇨🇴",
  "Israel": "🇮🇱",
  "Romania": "🇷🇴",
  "Georgia": "🇬🇪",
  "Belarus": "🇧🇾",
  "Jamaica": "🇯🇲",
  "Senegal": "🇸🇳",
  "Morocco": "🇲🇦",
  "Cote d'Ivoire": "🇨🇮",
  "Ghana": "🇬🇭",
  "Nigeria": "🇳🇬",
  "Czech Republic": "🇨🇿",
  "Albania": "🇦🇱",
  "United States": "🇺🇸",
  "Guinea": "🇬🇳",
  "The Gambia": "🇬🇲",
  "Wales": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
  "Chile": "🇨🇱",
  "Ecuador": "🇪🇨",
  "Angola": "🇦🇴",
  "Mali": "🇲🇱",
  "Venezuela": "🇻🇪",
  "Tunisia": "🇹🇳",
  "Bosnia-Herzegovina": "🇧🇦",
  "Northern Ireland": "🇮🇪",
  "Cameroon": "🇨🇲",
  "Central African Republic": "🇨🇫",
  "Canada": "🇨🇦",
  "Guinea-Bissau": "🇬🇼",
  "Iceland": "🇮🇸",
  "Montenegro": "🇲🇪",
  "Kenya": "🇰🇪",
  "Cape Verde": "🇨🇻",
  "Benin": "🇧🇯",
  "Panama": "🇵🇦",
  "Jordan": "🇯🇴",
  "Kosovo": "🇽🇰",
  "French Guiana": "🇬🇫",
  "Finland": "🇫🇮",
  "Uzbekistan": "🇺🇿",
  "Gabon": "🇬🇦",
  "Equatorial Guinea": "🇬🇶",
  "Haiti": "🇭🇹",
  "Zambia": "🇿🇲",
  "Korea, South": "🇰🇷",
  "Zimbabwe": "🇿🇼",
  "New Zealand": "🇳🇿",
  "Bosnia-Herzegovin": "🇧🇦",
  "Burkina Faso": "🇧🇫",
  "Honduras": "🇭🇳",
  "Dominican Republic": "🇩🇴",
  "Martinique": "🇲🇶",
  "Sierra Leone": "🇸🇱",
  "DR Congo": "🇨🇩",
  "Guadeloupe": "🇬🇵",
  "Congo": "🇨🇬",
  "Mauritania": "🇲🇷",
  "Philippines": "🇵🇭",
  "Peru": "🇵🇪",
  "Neukaledonien": "🇳🇨",
  "Iraq": "🇮🇶",
  "North Macedonia": "🇲🇰",
  "Montserrat": "🇲🇸",
  "Togo": "🇹🇬",
  "Antigua and Barbuda": "🇦🇬",
  "Lithuania": "🇱🇹",
  "Comoros": "🇰🇲",
  "Moldova": "🇲🇩",
  "Madagascar": "🇲🇬",
  "": "",
}