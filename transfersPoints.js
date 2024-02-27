import * as d3 from 'd3';
import { feeField, fromCountryField, fromLeagueField, fromRegionField, fromTeamField, inType, insideType, marketValueField, outType, playerField, region, toCountryField, toLeagueField, toRegionField, toTeamField, transferIdField, typeField } from './fields';
import { players } from './players';


export const colors = {
  'Top': '#FEFEFE',
  'Europe, ex. Top Leagues': '#1FB35F',
  'Asia': '#F051AE',
  'South America': '#FEB74F',
  'North America': '#55AFE1',
  'Africa': '#FD3A34',
  'No club': '#C1C1C1',
  'Retired': '#C1C1C1',
};

const container = document.getElementById('transfersPoints');
const clientWidth = container.clientWidth;

const axisYTop = document.getElementById('axisYTop');
const axisYTopBorder = document.getElementById('axisYTopBorder');
const axisX = document.getElementById('axisX');

const transferInfo = document.getElementById('transferInfo');
const playerImage = document.getElementById('playerImage');
const name = document.getElementById('name');
const fromTeam = document.getElementById('fromTeam');
const age = document.getElementById('age');
const fromLeague = document.getElementById('fromLeague');
const fromCountry = document.getElementById('fromCountry');
const toTeam = document.getElementById('toTeam');
const toLeague = document.getElementById('toLeague');
const toCountry = document.getElementById('toCountry');
const marketValue = document.getElementById('marketValue');
const fee = document.getElementById('fee');

const axisData = [0, 100_000, 1_000_000, 10_000_000, 100_000_000, 1_000_000_000];
const axisDataY = [50_000, 100_000, 1_000_000, 10_000_000, 100_000_000, 1_000_000_000];
const axisDataString = {
  "0": "0",
  "10000": "10k",
  "50000": "50k",
  "100000": "100k",
  "1000000": "1M",
  "10000000": "10M",
  "100000000": "100M",
  "1000000000": "1B",
}

const axisStepY = Math.min(Math.round(clientWidth / 7), 100);
const axisStep = Math.round(clientWidth / 7);
const paddingLeft = 32;
const dy = axisStepY * 2.1;

const width = (axisData.length - 1) * axisStep + axisStep;
const height = (axisData.length) * axisStepY + axisStepY;

axisYTop.style.top = `${axisStepY * 2.5}px`;
axisYTopBorder.style.top = `${axisStepY * 2.5}px`;
axisYTopBorder.style.width = `${axisStepY * 4.5}px`;
// axisX.style.top = `${axisStepY * 5 + 6}px`;
axisX.style.top = `${height - axisStepY / 4 - dy + 3}px`;
axisX.style.left = `${axisStep * 5 + axisStep / 2 + 32}px`;
axisX.style.left = `${axisStep * 5 + axisStep / 2 + 32}px`;
if (axisStep < 100) {
  axisX.style.left = `auto`;
  axisX.style.right = `0px`;
}

const axis = {
  x: {},
  y: {},
};

const stepD = width * 1.13;
const stepXD = Math.round(stepD / 17);
axisData.forEach((step, i) => {
  if (!axisData[i + 1]) {
    return;
  }
  if (i === 0) {
    axis.x[step] = d3.scaleLinear()
      .domain([step, axisData[i + 1]])
      .range([0, stepXD]);
  } else if (i === 1) {
    axis.x[step] = d3.scaleLinear()
      .domain([step, axisData[i + 1]])
      .range([stepXD, stepXD + (stepXD * 4) * i]);
  } else if (i === 2) {
    axis.x[step] = d3.scaleLinear()
      .domain([step, axisData[i + 1]])
      .range([stepXD + (stepXD * 4) * (i - 1), stepXD + (stepXD * 4) * i]);
  } else if (i === 3) {
    axis.x[step] = d3.scaleLinear()
      .domain([step, axisData[i + 1]])
      .range([stepXD + (stepXD * 4) * (i - 1), stepXD + (stepXD * 4) * i]);
  } else if (i === 4) {
    axis.x[step] = d3.scaleLinear()
      .domain([step, axisData[i + 1]])
      .range([stepXD + (stepXD * 4) * (i - 1), stepXD + (stepXD * 4) * i]);
  } 
});

axisDataY.forEach((step, i) => {
  if (!axisDataY[i + 1]) {
    return;
  }

  axis.y[step] = d3.scaleLinear()
    .domain([step, axisDataY[i + 1]])
    .range([height - (i * axisStepY),height - (i + 1) * axisStepY]);
});

const svg = d3.select('#transfersPoints').append("svg")
  .attr("width", width)
  .attr("height", axisStepY * 5 + 10)
  .attr("viewBox", [0, 0, width, axisStepY * 5]);

Object.keys(axis.x).forEach(key => {
  if (Number(key) === axisData[axisData.length - 2]) {
    return;
  }
  svg.append("g")
    .attr("transform", `translate(${paddingLeft},${height - axisStepY / 4 - dy })`)
    .attr("class", `domainX`)
    .call(d3.axisBottom(axis.x[key]).ticks(1).tickFormat((d => `${axisDataString[d]}`)))
    .call(g => g.select(".domain").remove());
});

svg.selectAll('.domainX')
  .selectAll("line").remove();

svg.selectAll('.domainX')
  .selectAll("text")
  .attr("text-anchor", 'start');

svg.selectAll('.tick')
  .attr('transform', (d, i, e) => {
    const x = Number(e[i].getAttribute('transform').split('(')[1].split(',')[0]);
    return `translate(${x + 2}, 0)`;
  });

Object.keys(axis.y).forEach(key => {
  if (Number(key) === axisData[axisData.length - 2]) {
    return;
  }
  svg.append("g")
    .attr("transform", `translate(${paddingLeft}, ${- axisStep / 4  - dy - 20 })`)
    .call(d3.axisLeft(axis.y[key]).ticks(1).tickFormat((d => `${axisDataString[d]}`)))
    .call(g => g.select(".domain").remove());
});

axis.y[0] = d3.scaleLinear()
  .domain([0, 50000])
  .range([height - (0 * axisStep),height - (0 + 1) * axisStep]);

const getX = (d) => {
  for (let j = axisData.length - 1; j >= 0; j--) {
    const x = axisData[j - 1];
    const v = getMarketValue(d[marketValueField]);
    if (v >= x) {
      return axis.x[x];
    }
  }
}

const getMarketValue = (v) => Number(v.split(',').join(''));

const setState = (d, state) => {
  if (d[feeField] === '0' || d[feeField] === '?') {
    if (state[getMarketValue(d[marketValueField])]) {
      state[getMarketValue(d[marketValueField])] += 1; 
    } else {
      state[getMarketValue(d[marketValueField])] = 1;
    }
  }
}

const getY = (d) => {
  if (d[feeField] == 0) {
    return axis.y['0'];
  }
  for (let j = axisDataY.length - 1; j >= 0; j--) {
    let y = axisDataY[j - 1];
    if (d[feeField] === '?') {
      return axis.y['0'];
    }
    if (d[feeField] >= y) {
      return axis.y[y];
    }
  }
}

const getFromColor = (d) => {
  return colors[d[fromRegionField]] || colors['No club'];
}

const getToColor = (d) => {
  return colors[d[toRegionField]] || colors['No club'];
}

let allDataState = [];
let dataState = [];
let dataFeeState = [];
let selected = '-1';

export const getPointsData = () => allDataState;

const circleOver = (e) => {
  if (e.target.dataset.index && selected !== e.target.dataset.index) {
    selected = e.target.dataset.index;
    const d = dataState.find(t => t[transferIdField] === e.target.dataset.index);
    // const d = dataState[Number(e.target.dataset.index)];
    if (d) {
      transferInfo.style.display = 'block';
      transferInfo.style.width = `320px`;
      transferInfo.style.left = `${Number(e.target.dataset.left) + 10}px`;
      transferInfo.style.top = `${Number(e.target.dataset.top)}px`
      
      name.textContent = d[playerField];
      // playerImage.src = players[d[playerField]].img;
      age.textContent = d['Age'];
      fromTeam.textContent = d[fromTeamField];
      fromLeague.textContent = d[fromLeagueField];
      fromCountry.textContent = d[fromCountryField];
      toTeam.textContent = d[toTeamField];
      toLeague.textContent = d[toLeagueField];
      toCountry.textContent = d[toCountryField];
      marketValue.textContent = getMarketValue(d[marketValueField]).toLocaleString();
      fee.textContent = Number(d[feeField]).toLocaleString();
    }
  }
}

const feeCircleOver = (e) => {
  if (e.target.dataset.index && selected !== e.target.dataset.index) {
    selected = e.target.dataset.index;
    // const d = dataFeeState[Number(e.target.dataset.index)];
    const d = dataFeeState.find(t => t[transferIdField] === e.target.dataset.index);
    if (d) {
      transferInfo.style.display = 'block';
      if (document.body.clientWidth <= 1200) {
        transferInfo.style.left = `${Number(e.target.dataset.left) + 10}px`;
        transferInfo.style.top = `${Number(e.target.dataset.top) + axisStepY * 5 - 6}px`
      } else {
        transferInfo.style.width = `320px`;
        transferInfo.style.left = `${Number(e.target.dataset.left) - 330}px`;
        transferInfo.style.top = `${Number(e.target.dataset.top) + axisStepY * 5 - 6}px`;
      }
      
      name.textContent = d[playerField];
      playerImage.src = players[d[playerField]].img;
      age.textContent = d['Age'];
      fromTeam.textContent = d[fromTeamField];
      fromLeague.textContent = d[fromLeagueField];
      fromCountry.textContent = d[fromCountryField];
      toTeam.textContent = d[toTeamField];
      toLeague.textContent = d[toLeagueField];
      toCountry.textContent = d[toCountryField];
      marketValue.textContent = getMarketValue(d[marketValueField]).toLocaleString();
      fee.textContent = Number(d[feeField]).toLocaleString();
    }
  }
}

const circleOut = (e) => {
  transferInfo.style.display = 'none';
  playerImage.src = "";
  selected = '-1';
}

const outD = 'M2 5L5 2M5 5L2 2';
const inD = 'M5 3.5H1.5M5 3.5L3.5 2M5 3.5L3.5 5';

const createPoints = (data) => {

  svg.append("g")
    .attr("id", "group1")
    .selectAll()
    .data(data)
    .join("g")
      .on('mouseover', circleOver)
      .on('mouseout', circleOut)
      .style("cursor", "pointer")
      .attr("transform", d => {
        return `
        translate(
          ${getX(d)(getMarketValue(d[marketValueField])) + paddingLeft - 3}, 
          ${getY(d)(d[feeField] === '?' ? 0 : d[feeField]) - axisStep / 4 - 3 - dy - 20})
        `})
      .append("circle")
        .attr("cx", 3.5)
        .attr("cy", 3.5)
        .attr("r", 3.5)
        .attr("fill", d => {
          if (d[typeField] === insideType || d[typeField] === inType) {
            return getFromColor(d);
          } else {
            return getToColor(d);
          }
        })
        .attr("stroke", d => {
          if (d[fromRegionField] === region && d[toRegionField] === region) {
            return "#00000060";
          } else {
            getToColor(d)
          }
        })
        .attr("data-index", (d, i) => d[transferIdField])
        .attr("data-left", d => getX(d)(getMarketValue(d[marketValueField])) + paddingLeft - 3)
        .attr("data-top", d => {
          return getY(d)(d[feeField] === '?' ? 0 : d[feeField]) - axisStep / 4 - 3 - dy - 20;
        })
        .select(function() { return this.parentNode; })
          .append("path")
          .attr("data-index", (d, i) => d[transferIdField])
          .attr("d", d => {
            if (d[typeField] === insideType || d[typeField] === inType) {
              return inD
            } else {
              return outD;
            }
          })
          .style("pointer-events", 'none')
          .attr('stroke', '#FFFFFF');
}

const clearGraph = () => {
  const group1 = document.querySelector('#group1');
  const group2 = document.querySelector('#group2');
  const line = document.querySelector('#feeLine');
  group1 && group1.remove();
  group2 && group2.remove();
  line && line.remove();
}

export const setPointData = (data) => {
  clearGraph();
  let filtered = [];
  allDataState = data;

  dataFeeState = data.filter(t => t[feeField] === '0' || t[feeField] === '?');
  filtered = data.filter(t => t[feeField] !== '0' && t[feeField] !== '?');
  console.log({dataFeeState, filtered});

  dataState = filtered;
  dataState = dataState.map((d, i) => ({...d, i}));
  createPoints(filtered);
}