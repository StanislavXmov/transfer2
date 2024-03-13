import * as d3 from 'd3';
import './style.scss';
import {
  fromRegionField,
  inType,
  typeField,
  regions,
  outType,
  insideType,
  toRegionField,
  fromCountryField,
  toCountryField,
  loanField,
  loanTypeNo,
  marketValueField,
  feeField
} from './fields';
import { colors, setPointData, getMarketValue } from './transfersPoints';
import { setLeagues } from './transfersLeagues';
import { setDatas } from './transfersDatas';
import { setTreeMap } from './transfersTreemap';
let topFilter = inType;

let loanFilter = loanTypeNo;

let europe = true; // 5
let southAmerica = true; // 4
let northAmerica = true; // 3
let asia = true; // 2
let africa = true; // 1
let none = true; // 0

let maxFeeValue = 0;

const toTopLeaguesButton = document.getElementById('toTopLeagues');
const fromTopLeaguesButton = document.getElementById('fromTopLeagues');
const insideTopLeaguesButton = document.getElementById('insideTopLeagues');

const regionsFilters = document.getElementById('regionsFilters');
const regionsSubTitle = document.getElementById('regionsSubTitle');

const europeButton = document.getElementById('europe');
const southAmericaButton = document.getElementById('southAmerica');
const northAmericaButton = document.getElementById('northAmerica');
const asiaButton = document.getElementById('asia');
const africaButton = document.getElementById('africa');
const noneButton = document.getElementById('none');

const normalTransfersButton = document.getElementById('normalTransfers');
const loanTransfersButton = document.getElementById('loanTransfers');

const topButtons = [toTopLeaguesButton, fromTopLeaguesButton, insideTopLeaguesButton];
const regionButtons = [
  europeButton,
  southAmericaButton,
  northAmericaButton,
  asiaButton,
  africaButton,
  noneButton,
];
const loanButtons = [normalTransfersButton, loanTransfersButton];

const changeTopType = (target) => {
  topFilter = target.dataset.type;
  console.log(topFilter);
  topButtons.forEach(b => b.classList.remove('active'));
  target.classList.add('active');

  switch (topFilter) {
    case inType:
      regionsFilters.style.display = 'flex';
      regionsSubTitle.textContent = 'From region';
      break;
    case outType:
      regionsFilters.style.display = 'flex';
      regionsSubTitle.textContent = 'To region';
      break;
    case insideType:
      europe = true;
      southAmerica = true;
      northAmerica = true;
      asia = true;
      africa = true;
      none = true;
      regionButtons.forEach(b => b.classList.add('active'));
      regionsFilters.style.display = 'none';
      break;
  
    default:
      break;
  }

  getFilteredData();
}

const changeLoanFilter = (target) => {
  loanFilter = target.dataset.type;
  loanButtons.forEach(b => b.classList.remove('active'));
  target.classList.add('active');

  getFilteredData();
}

const checkAllFilter = () => {
  if (europe && southAmerica && northAmerica && asia && africa && none) {
    return true;
  } else {
    return false;
  }
}

const resetAllRegionsFilter = () => {
  europe = false;
  southAmerica = false;
  northAmerica = false;
  asia = false;
  africa = false;
  none = false;
}

const changeFilter = (type) => {
  switch (type) {
    case regions.europe:
      europe = !europe;
      break;
    case regions.southAmerica:
      southAmerica = !southAmerica;
      break;
    case regions.northAmerica:
      northAmerica = !northAmerica;
      break;
    case regions.asia:
      asia = !asia;
      break;
    case regions.africa:
      africa = !africa;
      break;
    case regions.none:
      none = !none;
      break;
    default:
      break;
  }
}

const changeRegionFilter = (target) => {
  console.log(target.dataset.type);
  const type = target.dataset.type;
  if (checkAllFilter()) {
    regionButtons.forEach(b => b.classList.remove('active'));
    resetAllRegionsFilter();
    target.classList.add('active');
    changeFilter(type);
  } else {
    target.classList.toggle('active');
    changeFilter(type);
  }

  getFilteredData();
  // console.log({
  //   europe,
  //   southAmerica,
  //   northAmerica,
  //   asia,
  //   africa,
  //   none,
  // });
}

topButtons.forEach(b => {
  b.addEventListener('click', (e) => changeTopType(e.target));
});

regionButtons.forEach(b => {
  b.addEventListener('click', (e) => changeRegionFilter(e.target));
});

loanButtons.forEach(b => {
  b.addEventListener('click', (e) => changeLoanFilter(e.target));
});

let data = [];
let filteredData = [];

const getFilteredData = () => {
  // by type
  filteredData = data.filter(t => t[typeField] === topFilter);

  // by loan

  
  if (loanFilter === loanTypeNo) {
    filteredData = filteredData.filter(t => t[loanField] === loanFilter);
  } else {
    filteredData = filteredData.filter(t => t[loanField] !== loanTypeNo);
  }

  // by region
  let filterFiels = fromRegionField;
  if (topFilter === inType) {
    filterFiels = fromRegionField;
  } else if (topFilter === outType) {
    filterFiels = toRegionField;
  }
  if (!europe) {
    filteredData = filteredData.filter(t => t[filterFiels] !== regions.europe);
  }
  if (!northAmerica) {
    filteredData = filteredData.filter(t => t[filterFiels] !== regions.northAmerica);
  }
  if (!southAmerica) {
    filteredData = filteredData.filter(t => t[filterFiels] !== regions.southAmerica);
  }
  if (!asia) {
    filteredData = filteredData.filter(t => t[filterFiels] !== regions.asia);
  }
  if (!africa) {
    filteredData = filteredData.filter(t => t[filterFiels] !== regions.africa);
  }
  if (!none) {
    filteredData = filteredData.filter(t => 
      t[filterFiels].toLocaleLowerCase() !== regions.none.toLocaleLowerCase()
      && t[filterFiels].toLocaleLowerCase() !== 'retired'
    );
  }

  console.log(filteredData);

  setPointData(filteredData, topFilter, maxFeeValue);
  setLeagues(filteredData);
  setDatas(filteredData, data);
  setTreeMap(filteredData);

  return filteredData;
}

const getOrder = (region) => {
  switch (region) {
    case 'Top':
      return 6;
    case regions.europe:
      return 5;
    case regions.southAmerica:
      return 4;
    case regions.northAmerica:
      return 3;
    case regions.asia:
      return 2;
    case regions.africa:
      return 1;
    case regions.none:
      return 0;
    default:
      return 0;
  }
}

const getMaxValue = (data) => {
  const obj = {};
  data.forEach(t => {
    if (obj[getMarketValue(t[marketValueField])]) {
      obj[getMarketValue(t[marketValueField])].counter += 1;
    } else {
      obj[getMarketValue(t[marketValueField])] = {};
      obj[getMarketValue(t[marketValueField])].counter = 1;
    }
  });
  return Math.max(...Object.values(obj).map(v => v.counter));
}

const getCsv = async () => {
  data = await d3.csv('./football-transfers.csv');
  data.forEach(t => {
    t.fromOrder = getOrder(t[fromRegionField]);
    t.toOrder = getOrder(t[toRegionField]);
  });

  {
    let toTopData = data.filter(t => t[typeField] === inType);
    toTopData = toTopData.filter(t => t[feeField] === '0' || t[feeField] === '?');
    const filtered = toTopData.filter(t => t[loanField] === loanTypeNo);
    const v = getMaxValue(filtered)
    maxFeeValue = Math.max(maxFeeValue, v);
  }
  {
    let toTopData = data.filter(t => t[typeField] === inType);
    toTopData = toTopData.filter(t => t[feeField] === '0' || t[feeField] === '?');
    const filtered = toTopData.filter(t => t[loanField] !== loanTypeNo);
    const v = getMaxValue(filtered)
    maxFeeValue = Math.max(maxFeeValue, v);
  }
  {
    let toTopData = data.filter(t => t[typeField] === outType);
    toTopData = toTopData.filter(t => t[feeField] === '0' || t[feeField] === '?');
    const filtered = toTopData.filter(t => t[loanField] === loanTypeNo);
    const v = getMaxValue(filtered)
    maxFeeValue = Math.max(maxFeeValue, v);
  }
  {
    let toTopData = data.filter(t => t[typeField] === outType);
    toTopData = toTopData.filter(t => t[feeField] === '0' || t[feeField] === '?');
    const filtered = toTopData.filter(t => t[loanField] !== loanTypeNo);
    const v = getMaxValue(filtered)
    maxFeeValue = Math.max(maxFeeValue, v);
  }
  {
    let toTopData = data.filter(t => t[typeField] === insideType);
    toTopData = toTopData.filter(t => t[feeField] === '0' || t[feeField] === '?');
    const filtered = toTopData.filter(t => t[loanField] === loanTypeNo);
    const v = getMaxValue(filtered)
    maxFeeValue = Math.max(maxFeeValue, v);
  }
  {
    let toTopData = data.filter(t => t[typeField] === insideType);
    toTopData = toTopData.filter(t => t[feeField] === '0' || t[feeField] === '?');
    const filtered = toTopData.filter(t => t[loanField] !== loanTypeNo);
    const v = getMaxValue(filtered)
    maxFeeValue = Math.max(maxFeeValue, v);
  }
  // console.log(data);

  getFilteredData();
}

getCsv();