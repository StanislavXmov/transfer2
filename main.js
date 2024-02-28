import * as d3 from 'd3';
import './style.scss';
import { fromRegionField, inType, typeField, regions, outType, insideType, toRegionField } from './fields';
import { colors, setPointData } from './transfersPoints';
import { setLeagues } from './transfersLeagues';

let topFilter = inType;

let europe = true;
let southAmerica = true;
let northAmerica = true;
let asia = true;
let africa = true;
let none = true;

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

const topButtons = [toTopLeaguesButton, fromTopLeaguesButton, insideTopLeaguesButton];
const regionButtons = [
  europeButton,
  southAmericaButton,
  northAmericaButton,
  asiaButton,
  africaButton,
  noneButton,
];

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

const changeRegionFilter = (target) => {
  console.log(target.dataset.type);
  const type = target.dataset.type;
  target.classList.toggle('active');
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

let data = [];
let filteredData = [];

const getFilteredData = () => {
  // by type
  filteredData = data.filter(t => t[typeField] === topFilter);

  //by region
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

  setPointData(filteredData);
  setLeagues(filteredData);

  return filteredData;
}

const getCsv = async () => {
  data = await d3.csv('./football-transfers.csv');
  // console.log(data);

  getFilteredData();
}

getCsv();