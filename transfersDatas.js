import * as d3 from 'd3';
import {
  ageField,
  countries,
  fromLeagueField,
  fromRegionField,
  nationalityField,
  toLeagueField,
  toRegionField
} from "./fields";
import { colors } from './transfersPoints';

const ageDataContainer = document.getElementById('ageData');
const nationalityDataContainer = document.getElementById('nationalityData');

const ageWidth = ageDataContainer.clientWidth;
const width = nationalityDataContainer.clientWidth;


export const setDatas = (data, fullData) => {
  let ageDataElement = null;
  let ageDataSvg = null;
  let nationalityDataElement = null;
  let nationalityDataSvg = null;

  const ageData = {};
  const ageDataFiltered = {};
  const nationalityData = {};

  let flagDX = 12;
  // const nationalitySet = new Set();

  data.forEach(t => {
    if (nationalityData[t[nationalityField]]) {
      nationalityData[t[nationalityField]].count += 1;
    } else {
      nationalityData[t[nationalityField]] = {};
      nationalityData[t[nationalityField]].count = 1;
      // nationalitySet.add(t[nationalityField]);
    }
  });

  fullData.forEach(t => {
    if (ageData[t[ageField]]) {
      ageData[t[ageField]].count += 1;
    } else {
      ageData[t[ageField]] = {};
      ageData[t[ageField]].count = 1;
    }
  });

  data.forEach(t => {
    if (ageDataFiltered[t[ageField]]) {
      ageDataFiltered[t[ageField]].count += 1;
    } else {
      ageDataFiltered[t[ageField]] = {};
      ageDataFiltered[t[ageField]].count = 1;
    }
  });

  // const ageDataListSorted = Object.entries(ageData).sort((a, b) => b[1].count - a[1].count);
  const ageDataListSorted = Object.entries(ageDataFiltered).sort((a, b) => b[1].count - a[1].count);
  let maxAge = 0;
  if (ageDataListSorted.length === 0) {
    maxAge = 10;
  } else {
    maxAge = ageDataListSorted[0][1].count;
  }

  const nationalityDataList = Object.entries(nationalityData).sort((a, b) => b[1].count - a[1].count);
  let maxNationality = 0;
  if (nationalityDataList.length === 0) {
    maxNationality = 10;
  } else {
    maxNationality = nationalityDataList[0][1].count;
  }

  const wAgedY = ageDataListSorted.length> 15 ? 10 : 20;
  // const ageHeight = ageDataListSorted.length * wAgedY + 32;
  const ageHeight = 180;

  const wNationalitydY = nationalityDataList.length> 15 ? 10 : 20;
  const nationalityHeight = nationalityDataList.length * wNationalitydY + 32;

  const ageDataList = Object.entries(ageData);
  const ageFilteredDataList = Object.entries(ageDataFiltered);

  if (document.getElementById('ageDataSvg')) {
    d3.select("#ageDataSvg").remove();
    ageDataElement = d3.select("#ageData")
      .append("svg")
        .attr("id", 'ageDataSvg')
        .attr("width", ageWidth)
        .attr("height", ageHeight);
  } else {
    ageDataElement = d3.select("#ageData")
      .append("svg")
        .attr("id", 'ageDataSvg')
        .attr("width", ageWidth)
        .attr("height", ageHeight);
  }

  if (document.getElementById('nationalityDataSvg')) {
    d3.select("#nationalityDataSvg").remove();
    nationalityDataElement = d3.select("#nationalityData")
      .append("svg")
        .attr("id", 'nationalityDataSvg')
        .attr("width", width - flagDX * 2)
        .attr("height", nationalityHeight)
        .attr("transform", `translate(${flagDX}, ${0})`);
  } else {
    nationalityDataElement = d3.select("#nationalityData")
      .append("svg")
        .attr("id", 'nationalityDataSvg')
        .attr("width", width - flagDX * 2)
        .attr("height", nationalityHeight)
        .attr("transform", `translate(${flagDX}, ${0})`);
  }

  if (document.getElementById('ageDataWrapper')) {
    ageDataElement.select('#ageDataWrapper').remove();
    ageDataSvg = ageDataElement.append("g")
      .attr("transform", `translate(${0}, ${0})`)
      .attr("id", 'ageDataWrapper');
  } else {
    ageDataSvg = ageDataElement.append("g")
      .attr("transform", `translate(${0}, ${0})`)
      .attr("id", 'ageDataWrapper');
  }

  if (document.getElementById('nationalityDataWrapper')) {
    nationalityDataElement.select('#nationalityDataWrapper').remove();
    nationalityDataSvg = nationalityDataElement.append("g")
      .attr("transform", `translate(${2}, ${0})`)
      .attr("id", 'nationalityDataWrapper');
  } else {
    nationalityDataSvg = nationalityDataElement.append("g")
      .attr("transform", `translate(${2}, ${0})`)
      .attr("id", 'nationalityDataWrapper');
  }

  {
    const x = d3.scaleBand()
      .domain(ageDataList.map(d => d[0]))
      .range([0, ageWidth])
      .padding(0.1);
    const y = d3.scaleLinear()
      .domain([0, maxAge])
      .range([ageHeight - 24, 0]);

    ageDataSvg.append("g")
      .attr("fill", "#3470A4")
      .selectAll()
        .data(ageFilteredDataList)
        .join("rect")
          .attr("x", (d) => x(d[0]))
          .attr("y", (d) => y(d[1].count) + 12)
          .attr("height", (d) => {
            return y(0) - y(d[1].count);
          })
          .attr("width", x.bandwidth());
    ageDataSvg.append("g")
      .selectAll()
      .data(ageFilteredDataList)
      .join("text") 
      .text(d => d[1].count)
      .attr("class", `textX`)
      .attr("x", d => x(d[0]) + x.bandwidth() / 2)
      .attr("y", d => y(d[1].count) + 10)
      .attr("text-anchor", 'middle');

    ageDataSvg.append("g")
      .attr("class", `domainX`)
      .attr("transform", `translate(0,${ageHeight - 16})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .call(g => g.select(".domain").remove());

    ageDataSvg.selectAll('.domainX')
      .selectAll("line").remove();
  }
  {
    const ticks = [];
    const x = d3.scaleLinear()
      .domain([0, maxNationality])
      .range([0, width - 12 - flagDX * 2])
    nationalityDataSvg.append("g")
      .attr("transform", `translate(${0}, ${nationalityHeight - 22})`)
      .attr("class", `domainX`)
      // .call(d3.axisBottom(x))
      .call(d3.axisBottom(x).tickFormat((d, i) => {  
        const n = Math.floor(d);
        if (i === 0) {
          return n;
        } else {
          if (n < 1) {
            return '';
          } else {
            if (ticks.includes(n)) {
              return '';
            }
            ticks.push(n);
            return n;
          }
        }
      }))
      .call(g => g.select(".domain").remove());
  
    nationalityDataSvg.selectAll('.domainX')
      .selectAll("line").remove();
  
    const y = d3.scaleBand()
      .range([0, nationalityHeight - 22])
      .domain(nationalityDataList.map(d => d[0]))
      .padding(.1);
    nationalityDataSvg.selectAll("rect")
      .data(nationalityDataList)
      .enter()
      .append("rect")
      .attr("x", x(0) )
      .attr("y", d => y(d[0]))
      .attr("width", d => x(d[1].count))
      .attr("height", y.bandwidth() )
      .attr("fill", '#a6faa1');
  
    nationalityDataSvg.append("g")
      .attr("class", `domainY`)
      .attr("transform", `translate(${12}, 0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove());
    nationalityDataSvg.selectAll('.domainY')
      .selectAll("line").remove();
    nationalityDataSvg.selectAll('.domainY')
      .selectAll("text")
      .attr("text-anchor", 'start');

    const nodes = nationalityDataSvg
      .selectAll("rect")
      .nodes();
    const flags = document.querySelectorAll('[data-flag-nationality]');
    flags.forEach(f => f.remove());
    
    nodes.forEach((n, i) => {
      // console.log(fromData[i]);
      const y = Number(n.getAttribute('y'));
      const span = document.createElement('span');
      span.dataset.flagNationality = true;
      span.textContent = countries[nationalityDataList[i][0]];
      if (wNationalitydY === 20) {
        span.classList.add('flagLarge');
        span.style.left = '-4px';
      } else {
        span.classList.add('flag');
        span.style.left = '0px';
      }
      span.style.position = 'absolute';
      span.style.top = `${y}px`;
      nationalityDataContainer.append(span);
    });
  
  }

}