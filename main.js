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

export const leaguesFilter = {
  from: null,
  to: null,
}

let europe = true; // 5
let southAmerica = true; // 4
let northAmerica = true; // 3
let asia = true; // 2
let africa = true; // 1
let none = true; // 0

let maxFeeValue = 0;

const counters = {};

const toTopLeaguesButton = document.getElementById('toTopLeagues');
const fromTopLeaguesButton = document.getElementById('fromTopLeagues');
const insideTopLeaguesButton = document.getElementById('insideTopLeagues');

const toTopCounter = document.getElementById('toTopCounter');
const fromTopCounter = document.getElementById('fromTopCounter');
const insideTopCounter = document.getElementById('insideTopCounter');

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

const normalTransfersCounterButton = document.getElementById('normalTransfersCounter');
const loanTransfersCounterButton = document.getElementById('loanTransfersCounter');

const europeCounter = document.getElementById('europeCounter');
const southAmericaCounter = document.getElementById('southAmericaCounter');
const northAmericaCounter = document.getElementById('northAmericaCounter');
const asiaCounter = document.getElementById('asiaCounter');
const africaCounter = document.getElementById('africaCounter');
const noneCounter = document.getElementById('noneCounter');

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
      regionsSubTitle.textContent = 'From Region';
      break;
    case outType:
      regionsFilters.style.display = 'flex';
      regionsSubTitle.textContent = 'To Region';
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

export const chacheLeaguesFilter = (from, to) => {
  if (from) {
    if (from === leaguesFilter.from) {
      leaguesFilter.from = null;
    } else {
      leaguesFilter.from = from;
    }
  }
  if (to) {
    if (to === leaguesFilter.to) {
      leaguesFilter.to = null;
    } else {
      leaguesFilter.to = to;
    }
  }
  console.log(leaguesFilter);
}

topButtons.forEach(b => {
  b.addEventListener('click', (e) => changeTopType(e.currentTarget));
});

regionButtons.forEach(b => {
  b.addEventListener('click', (e) => changeRegionFilter(e.currentTarget));
});

loanButtons.forEach(b => {
  b.addEventListener('click', (e) => changeLoanFilter(e.currentTarget));
});

let data = [];
let filteredData = [];

const percentage = (partialValue, totalValue) => {
  const v = (100 * partialValue) / totalValue;
  if (!v) {
    return `0%`;
  }
  return `${(v).toFixed(1)}%`;
} 

const getFilteredData = () => {
  // by type
  filteredData = data.filter(t => t[typeField] === topFilter);

  if (topFilter === inType) {
    normalTransfersCounterButton.textContent = `${Math.round(
      100 / (counters.toTopCounter.counter / counters.toTopCounter.loan.normal)
      )}%`;
    loanTransfersCounterButton.textContent = `${Math.round(
      100 / (counters.toTopCounter.counter / counters.toTopCounter.loan.loan)
      )}%`;
    if (loanFilter === loanTypeNo) {
      europeCounter.textContent = percentage(counters.toTopCounter.loanNormal.europe, counters.toTopCounter.loan.normal);
      southAmericaCounter.textContent = percentage(counters.toTopCounter.loanNormal.southAmerica, counters.toTopCounter.loan.normal);
      northAmericaCounter.textContent = percentage(counters.toTopCounter.loanNormal.northAmerica, counters.toTopCounter.loan.normal);
      asiaCounter.textContent = percentage(counters.toTopCounter.loanNormal.asia, counters.toTopCounter.loan.normal);
      africaCounter.textContent = percentage(counters.toTopCounter.loanNormal.africa, counters.toTopCounter.loan.normal);
      noneCounter.textContent = percentage(counters.toTopCounter.loanNormal.none, counters.toTopCounter.loan.normal);
    } else {
      europeCounter.textContent = percentage(counters.toTopCounter.loanTransfers.europe, counters.toTopCounter.loan.loan);
      southAmericaCounter.textContent = percentage(counters.toTopCounter.loanTransfers.southAmerica, counters.toTopCounter.loan.loan);
      northAmericaCounter.textContent = percentage(counters.toTopCounter.loanTransfers.northAmerica, counters.toTopCounter.loan.loan);
      asiaCounter.textContent = percentage(counters.toTopCounter.loanTransfers.asia, counters.toTopCounter.loan.loan);
      africaCounter.textContent = percentage(counters.toTopCounter.loanTransfers.africa, counters.toTopCounter.loan.loan);
      noneCounter.textContent = percentage(counters.toTopCounter.loanTransfers.none, counters.toTopCounter.loan.loan);
    }
  } else if (topFilter === outType) {
    normalTransfersCounterButton.textContent = `${Math.round(
      100 / (counters.fromTopCounter.counter / counters.fromTopCounter.loan.normal)
      )}%`;
    loanTransfersCounterButton.textContent = `${Math.round(
      100 / (counters.fromTopCounter.counter / counters.fromTopCounter.loan.loan)
      )}%`;
    if (loanFilter === loanTypeNo) {
      europeCounter.textContent = percentage(counters.fromTopCounter.loanNormal.europe, counters.fromTopCounter.loan.normal);
      southAmericaCounter.textContent = percentage(counters.fromTopCounter.loanNormal.southAmerica, counters.fromTopCounter.loan.normal);
      northAmericaCounter.textContent = percentage(counters.fromTopCounter.loanNormal.northAmerica, counters.fromTopCounter.loan.normal);
      asiaCounter.textContent = percentage(counters.fromTopCounter.loanNormal.asia, counters.fromTopCounter.loan.normal);
      africaCounter.textContent = percentage(counters.fromTopCounter.loanNormal.africa, counters.fromTopCounter.loan.normal);
      noneCounter.textContent = percentage(counters.fromTopCounter.loanNormal.none, counters.fromTopCounter.loan.normal);
    } else {
      europeCounter.textContent = percentage(counters.fromTopCounter.loanTransfers.europe, counters.fromTopCounter.loan.loan);
      southAmericaCounter.textContent = percentage(counters.fromTopCounter.loanTransfers.southAmerica, counters.fromTopCounter.loan.loan);
      northAmericaCounter.textContent = percentage(counters.fromTopCounter.loanTransfers.northAmerica, counters.fromTopCounter.loan.loan);
      asiaCounter.textContent = percentage(counters.fromTopCounter.loanTransfers.asia, counters.fromTopCounter.loan.loan);
      africaCounter.textContent = percentage(counters.fromTopCounter.loanTransfers.africa, counters.fromTopCounter.loan.loan);
      noneCounter.textContent = percentage(counters.fromTopCounter.loanTransfers.none, counters.fromTopCounter.loan.loan);
    }
  } else if (topFilter === insideType) {
    normalTransfersCounterButton.textContent = `${Math.round(
      100 / (counters.insideTopCounter.counter / counters.insideTopCounter.loan.normal)
      )}%`;
    loanTransfersCounterButton.textContent = `${Math.round(
      100 / (counters.insideTopCounter.counter / counters.insideTopCounter.loan.loan)
      )}%`;
  }

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

    toTopCounter.textContent = toTopData.length;
    counters.toTopCounter = {counter: toTopData.length};
    counters.toTopCounter.loan = {normal: 0, loan: 0};
    counters.toTopCounter.loan.normal = toTopData.filter(t => t[loanField] === loanTypeNo).length;
    counters.toTopCounter.loan.loan = toTopData.filter(t => t[loanField] !== loanTypeNo).length;

    counters.toTopCounter.loanNormal = {};
    counters.toTopCounter.loanNormal.europe = toTopData.filter(t => t[fromRegionField] === regions.europe && t[loanField] === loanTypeNo).length;
    counters.toTopCounter.loanNormal.southAmerica = toTopData.filter(t => t[fromRegionField] === regions.southAmerica && t[loanField] === loanTypeNo).length;
    counters.toTopCounter.loanNormal.northAmerica = toTopData.filter(t => t[fromRegionField] === regions.northAmerica && t[loanField] === loanTypeNo).length;
    counters.toTopCounter.loanNormal.asia = toTopData.filter(t => t[fromRegionField] === regions.asia && t[loanField] === loanTypeNo).length;
    counters.toTopCounter.loanNormal.africa = toTopData.filter(t => t[fromRegionField] === regions.africa && t[loanField] === loanTypeNo).length;

    {const none = toTopData.filter(t => 
      t[fromRegionField].toLocaleLowerCase() === regions.none.toLocaleLowerCase()
      || t[fromRegionField].toLocaleLowerCase() === 'retired'
    );
    counters.toTopCounter.loanNormal.none = none.filter(t => t[loanField] === loanTypeNo).length;}

    counters.toTopCounter.loanTransfers = {};
    counters.toTopCounter.loanTransfers.europe = toTopData.filter(t => t[fromRegionField] === regions.europe && t[loanField] !== loanTypeNo).length;
    counters.toTopCounter.loanTransfers.southAmerica = toTopData.filter(t => t[fromRegionField] === regions.southAmerica && t[loanField] !== loanTypeNo).length;
    counters.toTopCounter.loanTransfers.northAmerica = toTopData.filter(t => t[fromRegionField] === regions.northAmerica && t[loanField] !== loanTypeNo).length;
    counters.toTopCounter.loanTransfers.asia = toTopData.filter(t => t[fromRegionField] === regions.asia && t[loanField] !== loanTypeNo).length;
    counters.toTopCounter.loanTransfers.africa = toTopData.filter(t => t[fromRegionField] === regions.africa && t[loanField] !== loanTypeNo).length;

    {const none = toTopData.filter(t => 
      t[fromRegionField].toLocaleLowerCase() === regions.none.toLocaleLowerCase()
      || t[fromRegionField].toLocaleLowerCase() === 'retired'
    );
    counters.toTopCounter.loanTransfers.none = none.filter(t => t[loanField] !== loanTypeNo).length;}

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

    fromTopCounter.textContent = toTopData.length;
    counters.fromTopCounter = {counter: toTopData.length};
    counters.fromTopCounter.loan = {normal: 0, loan: 0};
    counters.fromTopCounter.loan.normal = toTopData.filter(t => t[loanField] === loanTypeNo).length;
    counters.fromTopCounter.loan.loan = toTopData.filter(t => t[loanField] !== loanTypeNo).length;

    counters.fromTopCounter.loanNormal = {};
    counters.fromTopCounter.loanNormal.europe = toTopData.filter(t => t[toRegionField] === regions.europe && t[loanField] === loanTypeNo).length;
    counters.fromTopCounter.loanNormal.southAmerica = toTopData.filter(t => t[toRegionField] === regions.southAmerica && t[loanField] === loanTypeNo).length;
    counters.fromTopCounter.loanNormal.northAmerica = toTopData.filter(t => t[toRegionField] === regions.northAmerica && t[loanField] === loanTypeNo).length;
    counters.fromTopCounter.loanNormal.asia = toTopData.filter(t => t[toRegionField] === regions.asia && t[loanField] === loanTypeNo).length;
    counters.fromTopCounter.loanNormal.africa = toTopData.filter(t => t[toRegionField] === regions.africa && t[loanField] === loanTypeNo).length;

    {const none = toTopData.filter(t => 
      t[toRegionField].toLocaleLowerCase() === regions.none.toLocaleLowerCase()
      || t[toRegionField].toLocaleLowerCase() === 'retired'
    );
    counters.fromTopCounter.loanNormal.none = none.filter(t => t[loanField] === loanTypeNo).length;}

    counters.fromTopCounter.loanTransfers = {};
    counters.fromTopCounter.loanTransfers.europe = toTopData.filter(t => t[toRegionField] === regions.europe && t[loanField] !== loanTypeNo).length;
    counters.fromTopCounter.loanTransfers.southAmerica = toTopData.filter(t => t[toRegionField] === regions.southAmerica && t[loanField] !== loanTypeNo).length;
    counters.fromTopCounter.loanTransfers.northAmerica = toTopData.filter(t => t[toRegionField] === regions.northAmerica && t[loanField] !== loanTypeNo).length;
    counters.fromTopCounter.loanTransfers.asia = toTopData.filter(t => t[toRegionField] === regions.asia && t[loanField] !== loanTypeNo).length;
    counters.fromTopCounter.loanTransfers.africa = toTopData.filter(t => t[toRegionField] === regions.africa && t[loanField] !== loanTypeNo).length;

    {const none = toTopData.filter(t => 
      t[toRegionField].toLocaleLowerCase() === regions.none.toLocaleLowerCase()
      || t[toRegionField].toLocaleLowerCase() === 'retired'
    );
    counters.fromTopCounter.loanTransfers.none = none.filter(t => t[loanField] !== loanTypeNo).length;}

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

    insideTopCounter.textContent = toTopData.length;
    counters.insideTopCounter = {counter: toTopData.length};
    counters.insideTopCounter.loan = {normal: 0, loan: 0};
    counters.insideTopCounter.loan.normal = toTopData.filter(t => t[loanField] === loanTypeNo).length;
    counters.insideTopCounter.loan.loan = toTopData.filter(t => t[loanField] !== loanTypeNo).length;

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
  console.log(counters);

  getFilteredData();
}

getCsv();