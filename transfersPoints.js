import * as d3 from 'd3';
import {
  ageField,
  countries,
  feeField,
  fromCountryField,
  fromLeagueField,
  fromRegionField,
  fromTeamField,
  inType,
  insideType,
  loanField,
  loanTypeNo,
  marketValueField,
  nationalityField,
  outType,
  playerField,
  region,
  toCountryField,
  toLeagueField,
  toRegionField,
  toTeamField,
  transferIdField,
  typeField
} from './fields';
import { players } from './players';
import { setLeaguesOpacity, setLeaguesOpacityByTransfer } from './transfersLeagues';
import { setMapOpacity, setMapOpacityByTransfer } from './transfersTreemap';


export const colors = {
  // 'Top': '#FEFEFE',
  'Top': '#c0ffff',
  'Europe, ex. Top Leagues': '#1FB35F',
  'Europe': '#1FB35F',
  'Asia': '#F051AE',
  'South America': '#FEB74F',
  'North America': '#55AFE1',
  'Africa': '#FD3A34',
  'No club': '#C1C1C1',
  'Retired': '#C1C1C1',
  'No Club': '#C1C1C1',
  'Oceania': '#C1C1C1',
};

const container = document.getElementById('transfersPoints');
const clientWidth = container.clientWidth;

const axisYTop = document.getElementById('axisYTop');
const axisYTopBorder = document.getElementById('axisYTopBorder');
// const axisX = document.getElementById('axisX');

const transferInfo = document.getElementById('transferInfo');
const playerImage = document.getElementById('playerImage');
const playerImageBg = document.getElementById('playerImageBg');
const name = document.getElementById('name');
const playerNationality = document.getElementById('playerNationality');
const fromTeam = document.getElementById('fromTeam');
const age = document.getElementById('age');
const fromLeague = document.getElementById('fromLeague');
const fromCountry = document.getElementById('fromCountry');
const toTeam = document.getElementById('toTeam');
const toLeague = document.getElementById('toLeague');
const toCountry = document.getElementById('toCountry');
const marketValue = document.getElementById('marketValue');
const fee = document.getElementById('fee');
const averageFeeTitleWrapper = document.getElementById('averageFeeTitle');
const averageFeeTitleData = document.getElementById('averageFeeData');
const averageMarketTitleWrapper = document.getElementById('averageMarketTitle');
const averageMarketTitleData = document.getElementById('averageMarketData');

const axisYTopPercent = document.getElementById('axisYTopPercent');

const counters = {
  all: 0,
  normal: 0,
  fee: 0,
};

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
const axisStep = Math.round(clientWidth / 6);
const paddingLeft = 32;
const dy = axisStepY * 2.1;

const width = (axisData.length - 1) * axisStep + axisStep;
const height = (axisData.length) * axisStepY + axisStepY;

axisYTop.style.top = `${axisStepY * 2.5}px`;
axisYTopBorder.style.top = `${axisStepY * 2.5}px`;
axisYTopBorder.style.width = `${axisStepY * 4.5}px`;
// axisX.style.top = `${axisStepY * 5 + 6}px`;
// axisX.style.top = `${height - axisStepY / 4 - dy + 3}px`;
// axisX.style.left = `${axisStep * 5 + axisStep / 2 + 32}px`;
// axisX.style.left = `${axisStep * 5 + axisStep / 2 + 32}px`;
// if (axisStep < 100) {
//   axisX.style.left = `auto`;
//   axisX.style.right = `0px`;
// }

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

// all 780px
const allheight = 780;
const svgHeight = axisStepY * 5 + 10;
const svg = d3.select('#transfersPoints').append("svg")
  .attr("width", width)
  .attr("height", svgHeight)
  .attr("viewBox", [0, 0, width, axisStepY * 5]);

// console.log("width", width, "height", svgHeight);

// Object.keys(axis.x).forEach(key => {
//   if (Number(key) === axisData[axisData.length - 2]) {
//     return;
//   }
//   svg.append("g")
//     .attr("transform", `translate(${paddingLeft},${height - axisStepY / 4 - dy })`)
//     .attr("class", `domainX`)
//     .call(d3.axisBottom(axis.x[key]).ticks(1).tickFormat((d => `${axisDataString[d]}`)))
//     .call(g => g.select(".domain").remove());
// });

// const lineGroup = svg.append('g')
//   .attr("id", 'line');

// const dy1Axis = height - axisStepY / 4 - dy + 6;
// const dy2Axis = height - axisStepY / 4 - dy + 18;
// for (let i = 0; i < 6; i++) {
//   if (i === 0) {
//     lineGroup.append('path')
//       .attr("d", `
//       M${0 + paddingLeft} ${dy1Axis}V${dy2Axis}
//       `)
//       .attr('stroke', '#E0E0E0');
//   } else if (i === 1) {
//     lineGroup.append('path')
//       .attr("d", `
//       M${stepXD + paddingLeft} ${dy1Axis}V${dy2Axis}
//       `)
//       .attr('stroke', '#E0E0E0');
//   } else if (i === 2) {
//     lineGroup.append('path')
//       .attr("d", `
//       M${stepXD + (stepXD * 4) * (i - 1) + paddingLeft} ${dy1Axis}V${dy2Axis}
//       `)
//       .attr('stroke', '#E0E0E0');
//   } else if (i === 3) {
//     lineGroup.append('path')
//       .attr("d", `
//       M${stepXD + (stepXD * 4) * (i - 1) + paddingLeft} ${dy1Axis}V${dy2Axis}
//       `)
//       .attr('stroke', '#E0E0E0');
//   } else if (i === 4) {
//     lineGroup.append('path')
//       .attr("d", `
//       M${stepXD + (stepXD * 4) * (i - 1) + paddingLeft} ${dy1Axis}V${dy2Axis}
//       `)
//       .attr('stroke', '#E0E0E0');
//   } 
// }

// svg.selectAll('.domainX')
//   .selectAll("line").remove();

// svg.selectAll('.domainX')
//   .selectAll("text")
//   .attr("text-anchor", 'start');

// svg.selectAll('.tick')
//   .attr('transform', (d, i, e) => {
//     const x = Number(e[i].getAttribute('transform').split('(')[1].split(',')[0]);
//     return `translate(${x + 2}, 0)`;
//   });

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

export const getMarketValue = (v) => Number(v.split(',').join(''));

let yState = {};
let yStatePL = {};

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
    if (d) {

      setLeaguesOpacity(0.1);
      setMapOpacity(0.1);
      setLeaguesOpacityByTransfer(d);
      setMapOpacityByTransfer(d);

      transferInfo.style.display = 'flex';
      transferInfo.style.width = `380px`;
      transferInfo.style.left = `${Number(e.target.dataset.left) + 10}px`;
      transferInfo.style.top = `${Number(e.target.dataset.top)}px`;
      transferInfo.style.bottom = `auto`;
      
      name.textContent = d[playerField];
      playerImage.src = players[d[playerField]].img;
      const ctx = playerImageBg.getContext("2d");
      const baseImage = new Image();
      baseImage.src = players[d[playerField]].img;
      baseImage.onload = function(){
        // playerImage.src = baseImage.src;
        ctx.drawImage(baseImage, 0, 0, 1, baseImage.naturalHeight, 0, 0, 30, 128);
        ctx.drawImage(baseImage, baseImage.naturalWidth - 1, 0, 1, baseImage.naturalHeight, 128 - 30, 0, 30, 128);
      }
      age.textContent = d[ageField];
      playerNationality.textContent = `${countries[d[nationalityField]]} ${d[nationalityField]}`;
      marketValue.textContent = (getMarketValue(d[marketValueField])/ 1000000).toLocaleString();
      fromCountry.textContent = d[fromCountryField];
      fromLeague.textContent = d[fromLeagueField];
      fromTeam.textContent = d[fromTeamField];
      toTeam.textContent = d[toTeamField];
      toLeague.textContent = d[toLeagueField];
      toCountry.textContent = d[toCountryField];
      fee.textContent = `Fee: €${(Number(d[feeField])/ 1000000).toLocaleString()}M${d[loanField] !== loanTypeNo ? ', loan ' + d[loanField].toLowerCase() : ''}`;
    }
  }
}

const feeCircleOver = (e) => {
  if (e.target.dataset.index && selected !== e.target.dataset.index) {
    selected = e.target.dataset.index;
    const d = dataFeeState.find(t => t[transferIdField] === e.target.dataset.index);
    if (d) {

      setLeaguesOpacity(0.1);
      setMapOpacity(0.1);
      setLeaguesOpacityByTransfer(d);
      setMapOpacityByTransfer(d);

      transferInfo.style.display = 'flex';
      transferInfo.style.width = `380px`;
      transferInfo.style.left = `${Number(e.target.dataset.left) + 10}px`;
      transferInfo.style.bottom = `${780 - Number(e.target.dataset.top) - axisStepY * 5 - 6}px`
      transferInfo.style.top = `auto`;

      name.textContent = d[playerField];
      playerImage.src = players[d[playerField]].img;
      const ctx = playerImageBg.getContext("2d");
      const baseImage = new Image();
      baseImage.src = players[d[playerField]].img;
      baseImage.onload = function(){
        // playerImage.src = baseImage.src;
        ctx.drawImage(baseImage, 0, 0, 1, baseImage.naturalHeight, 0, 0, 30, 128);
        ctx.drawImage(baseImage, baseImage.naturalWidth - 1, 0, 1, baseImage.naturalHeight, 128 - 30, 0, 30, 128);
      }

      age.textContent = d[ageField];
      playerNationality.textContent = `${countries[d[nationalityField]]} ${d[nationalityField]}`;
      marketValue.textContent = (getMarketValue(d[marketValueField])/ 1000000).toLocaleString();
      fromCountry.textContent = d[fromCountryField];
      fromLeague.textContent = d[fromLeagueField];
      fromTeam.textContent = d[fromTeamField];
      toTeam.textContent = d[toTeamField];
      toLeague.textContent = d[toLeagueField];
      toCountry.textContent = d[toCountryField];
      if (d[feeField] === '?' || d[feeField] == 0) {
        if (d[loanField] !== loanTypeNo) {
          fee.textContent = `no fee, loan ${d[loanField].toLowerCase()}`;
        } else {
          fee.textContent = 'no fee';
        }
        
      } else {
        fee.textContent = `Fee: €${(Number(d[feeField])/ 1000000).toLocaleString()}M${d[loanField] !== loanTypeNo ? ', loan ' + d[loanField].toLowerCase() : ''}`;
      }
    }
  }
}

const circleOut = (e) => {
  transferInfo.style.display = 'none';
  playerImage.src = "";
  selected = '-1';
  const ctx = playerImageBg.getContext("2d");
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, 128, 128);

  setLeaguesOpacity(1);
  setMapOpacity(1);
}

const outD = 'M2 5L5 2M5 5L2 2';
const inD = 'M5 3.5H1.5M5 3.5L3.5 2M5 3.5L3.5 5';

const createPoints = (data) => {

  const maxFeePaid = data.reduce((acc, t) => acc + Number(t[feeField]), 0);
  const averageFee = maxFeePaid / data.length || 0;
  const averageFeeTitle = (averageFee / 1000000).toFixed(2)
  const averageFeeT = {
    [feeField]: averageFee
  };
  const averageFeeY = getY(averageFeeT)(averageFee) - axisStep / 4 - 3 - dy - 20;
  const averageFeeX = axis.x['100000000'](400000000);
  if (averageFee) {
    averageFeeTitleWrapper.style.display = 'block';
  } else {
    averageFeeTitleWrapper.style.display = 'none';
  }
  averageFeeTitleWrapper.style.top = `${averageFeeY - 14}px`;
  averageFeeTitleWrapper.style.left = `${averageFeeX - 110}px`;
  averageFeeTitleData.textContent = `${averageFeeTitle}M`;

  averageFee && svg.append('line')
    .attr("id", "averageFee")
    .attr('x1', paddingLeft - 3)
    .attr('y1', averageFeeY)
    .attr('x2', averageFeeX)
    .attr('y2', averageFeeY)
    .attr("stroke", "#00000020");

    
  const maxMarketPaid = data.reduce((acc, t) => acc + getMarketValue(t[marketValueField]), 0);
  const averageMarket = maxMarketPaid / data.length || 0;
  const averageMarketTitle = (averageMarket / 1000000).toFixed(2)
  const averageMarketT = {
    [marketValueField]: averageMarket.toString()
  };
  const averageMarketX = getX(averageMarketT)(averageMarket) + paddingLeft - 3;
  const averageFeeY2 = svgHeight - 36;
  if (averageMarket) {
    averageMarketTitleWrapper.style.display = 'block';
  } else {
    averageMarketTitleWrapper.style.display = 'none';
  }
  
  averageMarketTitleWrapper.style.top = `${averageFeeY2 - 14}px`;
  averageMarketTitleWrapper.style.left = `${averageMarketX + 4}px`;
  averageMarketTitleData.textContent = `${averageMarketTitle}M`;

  averageMarket && svg.append('line')
    .attr("id", "averageMarket")
    .attr('x1', averageMarketX)
    .attr('y1', 20)
    .attr('x2', averageMarketX)
    .attr('y2', averageFeeY2)
    .attr("stroke", "#00000020");

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
          return "#00000060";
          // if (d[fromRegionField] === region && d[toRegionField] === region) {
          //   return "#00000060";
          // } else {
          //   getToColor(d)
          // }
        })
        .attr("data-index", (d, i) => d[transferIdField])
        .attr("data-left", d => getX(d)(getMarketValue(d[marketValueField])) + paddingLeft - 3)
        .attr("data-top", d => {
          return getY(d)(d[feeField] === '?' ? 0 : d[feeField]) - axisStep / 4 - 3 - dy - 20;
        })
        // .select(function() { return this.parentNode; })
        //   .append("path")
        //   .attr("data-index", (d, i) => d[transferIdField])
        //   .attr("d", d => {
        //     if (d[typeField] === insideType || d[typeField] === inType) {
        //       return inD
        //     } else {
        //       return outD;
        //     }
        //   })
        //   .style("pointer-events", 'none')
        //   .attr('stroke', '#FFFFFF');
}

const addFeeAxisTitles = () => {
  const wrapper = d3.select('.feePointsWrapper');
  const title = wrapper.append('div')
    .attr("class", 'axisYFee')
    .attr("id", 'axisYFee')
    .text('Free transfers');
  title.append('span')
    .attr("id", 'axisYFeePercent')
    .text(` ${Math.round(
      100 / (counters.all / counters.fee)
      )}%`);
  wrapper.append('div')
    .attr("class", 'axisYFeeBorder')
    .attr("id", 'axisYFeeBorder');
}

const createFeePoints = (data, topFilter, maxFeeValue) => {
  // console.log('createFeePoints', data);
  const maxMarketPaid = data.reduce((acc, t) => acc + getMarketValue(t[marketValueField]), 0);
  const averageMarket = maxMarketPaid / data.length || 0;
  const averageMarketTitle = (averageMarket / 1000000).toFixed(2)
  const averageMarketT = {
    [marketValueField]: averageMarket.toString()
  };

  let feeSortedData = [...data];
  if (topFilter === inType) {
    feeSortedData.sort((t1, t2) => t1.fromOrder - t2.fromOrder);
  } else {
    feeSortedData.sort((t1, t2) => t1.toOrder - t2.toOrder);
  }
  const feeDataState = {};

  feeSortedData.forEach(t => {
    if (feeDataState[getMarketValue(t[marketValueField])]) {
      feeDataState[getMarketValue(t[marketValueField])].counter += 1;
    } else {
      feeDataState[getMarketValue(t[marketValueField])] = {};
      feeDataState[getMarketValue(t[marketValueField])].counter = 1;
    }
  });

  const maxFee = Math.max(...Object.values(feeDataState).map(v => v.counter));
  for (const fee in feeDataState) {
    if (maxFee > 30) {
      feeDataState[fee].n = 3;
    } else {
      feeDataState[fee].n = 6;
    }
  }

  const maxFeeH = maxFee * 3;
  const height = 270;

  const averageMarketX = getX(averageMarketT)(averageMarket) + paddingLeft - 3;
  const averageFeeY2 = height - 22 + 2;

  const hy = Math.round((270 - 24) / maxFeeValue);

  let svg = null;
  let averageFreeMarketTitleWrapper = null;
  let averageFreeMarketTitleData = null;
  if (!document.getElementById('feePoints')) {
    const wrapper = d3.select('#transfersPoints').append("div");
    wrapper.attr("class", 'feePointsWrapper');
    const axisX = wrapper.append("div");
    axisX
      .attr("class", 'axisX')
      .text("Player Market Value")

    addFeeAxisTitles();

    averageFreeMarketTitleWrapper = wrapper.append("span")
      .attr("class", 'averageFeeTitle')
      .attr("id", 'averageFreeMarketTitle')
      .text('Average for free transfers: ')
    averageFreeMarketTitleData = averageFreeMarketTitleWrapper.append("span")
      .attr("id", 'averageFreeMarketTitleData')
      .text('0M');
    


    svg = wrapper.append("svg")
      .attr("class", 'feePoints')
      .attr("id", 'feePoints')
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    Object.keys(axis.x).forEach(key => {
      if (Number(key) === axisData[axisData.length - 2]) {
        return;
      }
      svg.append("g")
        .attr("transform", `translate(${paddingLeft},${height - 18})`)
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

    const lineGroup = svg.append('g')
      .attr("id", 'lineX');
    
    const dy1Axis = height - 18 + 6;
    const dy2Axis = height - 18 + 18;
    for (let i = 0; i < 6; i++) {
      if (i === 0) {
        lineGroup.append('path')
          .attr("d", `
          M${0 + paddingLeft} ${dy1Axis}V${dy2Axis}
          `)
          .attr('stroke', '#E0E0E0');
      } else if (i === 1) {
        lineGroup.append('path')
          .attr("d", `
          M${stepXD + paddingLeft} ${dy1Axis}V${dy2Axis}
          `)
          .attr('stroke', '#E0E0E0');
      } else if (i === 2) {
        lineGroup.append('path')
          .attr("d", `
          M${stepXD + (stepXD * 4) * (i - 1) + paddingLeft} ${dy1Axis}V${dy2Axis}
          `)
          .attr('stroke', '#E0E0E0');
      } else if (i === 3) {
        lineGroup.append('path')
          .attr("d", `
          M${stepXD + (stepXD * 4) * (i - 1) + paddingLeft} ${dy1Axis}V${dy2Axis}
          `)
          .attr('stroke', '#E0E0E0');
      } else if (i === 4) {
        lineGroup.append('path')
          .attr("d", `
          M${stepXD + (stepXD * 4) * (i - 1) + paddingLeft} ${dy1Axis}V${dy2Axis}
          `)
          .attr('stroke', '#E0E0E0');
      } 
    }

  } else {
    svg = d3.select('#feePoints')
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);
    averageFreeMarketTitleWrapper = d3.select('#averageFreeMarketTitle');
    averageFreeMarketTitleData = d3.select('#averageFreeMarketTitleData');

    d3.select('#axisYFeePercent')
      .text(` ${Math.round(
        100 / (counters.all / counters.fee)
      )}%`);
  }

  if (averageMarket) {
    averageFreeMarketTitleWrapper.style("display", 'block');
  } else {
    averageFreeMarketTitleWrapper.style("display", 'none');
  }
  
  averageFreeMarketTitleWrapper.style("top", `${- 8}px`);
  averageFreeMarketTitleWrapper.style("left", `${averageMarketX + 4}px`);
  averageFreeMarketTitleData.text(`${averageMarketTitle}M`);

  averageMarket && svg.append('line')
    .attr("id", "averageFreeMarket")
    .attr('x1', averageMarketX)
    .attr('y1', 0)
    .attr('x2', averageMarketX)
    .attr('y2', averageFeeY2)
    .attr("stroke", "#00000020");

  const feeLineGroup = svg.append('g')
    .attr("id", 'feeLine');
  feeLineGroup.append('path')
    .attr("d", `M${axis.x['0'](0) + paddingLeft - 10} ${height - 22 + 2}H${axis.x['100000000'](400000000)}`)
    .attr('stroke', '#E0E0E0');
  const dy1Axis = height - 22 + 6;
  const dy2Axis = height - 22 - 2;
  for (let i = 0; i < 6; i++) {
    if (i === 0) {
      feeLineGroup.append('path')
        .attr("d", `M${0 + paddingLeft} ${dy1Axis}V${dy2Axis}`)
        .attr('stroke', '#E0E0E0');
    } else if (i === 1) {
      feeLineGroup.append('path')
        .attr("d", `M${stepXD + paddingLeft} ${dy1Axis}V${dy2Axis}`)
        .attr('stroke', '#E0E0E0');
    } else if (i === 2) {
      feeLineGroup.append('path')
        .attr("d", `M${stepXD + (stepXD * 4) * (i - 1) + paddingLeft} ${dy1Axis}V${dy2Axis}`)
        .attr('stroke', '#E0E0E0');
    } else if (i === 3) {
      feeLineGroup.append('path')
        .attr("d", `M${stepXD + (stepXD * 4) * (i - 1) + paddingLeft} ${dy1Axis}V${dy2Axis}`)
        .attr('stroke', '#E0E0E0');
    } else if (i === 4) {
      feeLineGroup.append('path')
        .attr("d", `M${stepXD + (stepXD * 4) * (i - 1) + paddingLeft} ${dy1Axis}V${dy2Axis}`)
        .attr('stroke', '#E0E0E0');
    } else if (i === 5) {
      feeLineGroup.append('path')
        .attr("d", `M${stepXD + (stepXD * 4) * (i - 1) + paddingLeft} ${dy1Axis}V${dy2Axis}`)
        .attr('stroke', '#E0E0E0');
    }
  }

  yState = {};
  yStatePL = {};

  svg.append("g")
    .attr("id", "group2")
    .selectAll()
    .data(feeSortedData)
    .join("g")
      .on('mouseover', feeCircleOver)
      .on('mouseout', circleOut)
      .style("cursor", "pointer")
      .attr("transform", d => {
        const x = getX(d)(getMarketValue(d[marketValueField])) + paddingLeft - 3;
        let y = 0;
        setState(d, yState);
        const n = yState[getMarketValue(d[marketValueField])];
        // const dy = feeDataState[getMarketValue(d[marketValueField])].n;
        // const axisDy = (dy === 3 ? 6 : 3);
        const dy = hy;
        const axisDy = 3;
        y = height - 24 + Number(d[feeField] === '?' ? 0 : d[feeField]) - n * dy - axisDy;
        return `
          translate(
            ${x},
            ${y})
        `;
        })
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
          return "#00000060";
          // if (d[fromRegionField] === region && d[toRegionField] === region) {
          //   return "#00000060";
          // } else {
          //   getToColor(d)
          // }
        })
      .attr("data-index", (d, i) => d[transferIdField])
      .attr("data-left", d => getX(d)(getMarketValue(d[marketValueField])) + paddingLeft - 3)
      .attr("data-top", d => {
        setState(d, yStatePL);
        const n = yStatePL[getMarketValue(d[marketValueField])];
        // const dy = feeDataState[getMarketValue(d[marketValueField])].n;
        // const axisDy = (dy === 3 ? 6 : 3);
        const dy = hy;
        const axisDy = 3;
        return height - 24 + Number(d[feeField] === '?' ? 0 : d[feeField]) - n * dy - axisDy;
      })
      // .select(function() { return this.parentNode; })
      //   .append("path")
      //   .attr("data-index", (d, i) => d[transferIdField])
      //   .attr("d", d => {
      //     if (d[typeField] === insideType || d[typeField] === inType) {
      //       return inD
      //     } else {
      //       return outD;
      //     }
      //   })
      //   .style("pointer-events", 'none')
      //   .attr('stroke', '#FFFFFF');
}

const clearGraph = () => {
  const group1 = document.querySelector('#group1');
  const group2 = document.querySelector('#group2');
  const line = document.querySelector('#feeLine');
  const averageFeeLine = document.querySelector('#averageFee');
  const averageMarketLine = document.querySelector('#averageMarket');
  const averageFreeMarketLine = document.querySelector('#averageFreeMarket');
  group1 && group1.remove();
  group2 && group2.remove();
  line && line.remove();
  averageFeeLine && averageFeeLine.remove();
  averageMarketLine && averageMarketLine.remove();
  averageFreeMarketLine && averageFreeMarketLine.remove();
}

export const setPointData = (data, topFilter, maxFeeValue) => {
  clearGraph();
  let filtered = [];
  allDataState = data;

  dataFeeState = data.filter(t => t[feeField] === '0' || t[feeField] === '?');
  filtered = data.filter(t => t[feeField] !== '0' && t[feeField] !== '?');
  // console.log({dataFeeState, filtered});

  counters.all = data.length;
  counters.normal = filtered.length;
  counters.fee = dataFeeState.length;

  axisYTopPercent.textContent = `${Math.round(
    100 / (counters.all / counters.normal)
    )}%`;

  dataState = filtered;
  dataState = dataState.map((d, i) => ({...d, i}));
  createPoints(filtered);
  createFeePoints(dataFeeState, topFilter, maxFeeValue);
}

export const setPointsOpacity = (v) => {
  d3.selectAll(`[data-index]`)
  .style("opacity", v);
}

export const setPointsOpacityByFiltered = (filtered) => {
  filtered.forEach((d) => {
    d3.selectAll(`[data-index="${d[transferIdField]}"]`)
    .style("opacity", 1)
  });
}