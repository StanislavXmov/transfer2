import * as d3 from 'd3';
import { nationalityField, regionNatField } from './fields';
import { colors, setPointsOpacity, setPointsOpacityByFiltered } from './transfersPoints';

const treeMapNationalityContainer = document.getElementById('treeMapNationality');
const width = treeMapNationalityContainer.clientWidth;
const height = 220;

const filteredByNationality = (data, treeData) => {
  let filtered = data.filter(d => d[nationalityField] === treeData.name && d[regionNatField] === treeData.region);
  return filtered;
}

export const setTreeMap = (data) => {

  let svg = null;
  let nationalityDataSvg = null;

  const regions = {};
  data.forEach((t, i) => {
    if (regions[t[regionNatField]]) {
      if (regions[t[regionNatField]][t[nationalityField]]) {
        regions[t[regionNatField]][t[nationalityField]].count += 1;
      } else {
        regions[t[regionNatField]][t[nationalityField]] = {};
        regions[t[regionNatField]][t[nationalityField]].count = 1;
        regions[t[regionNatField]][t[nationalityField]].id = i;
      }
    } else {
      regions[t[regionNatField]] = {};
    }
  });

  const treeMapData = {
    name: 'Nationality',
    children: [],
  }
  Object.keys(regions).forEach(r => treeMapData.children.push({name: r, children: []}));
  treeMapData.children.forEach(r => {
    // console.log(regions[r.name]);
    Object.entries(regions[r.name]).forEach(([name, {count, id}]) => {
      r.children.push({name, value: count, region: r.name, id});
    });
  });

  if (document.getElementById('nationalityTreeMapSvg')) {
    d3.select("#nationalityTreeMapSvg").remove();
    svg = d3.select("#treeMapNationality")
      .append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("id", 'nationalityTreeMapSvg')
        .attr("width", width)
        .attr("height", height)
        .attr("transform", `translate(${0}, ${0})`);
  } else {
    svg = d3.select("#treeMapNationality")
      .append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("id", 'nationalityTreeMapSvg')
        .attr("width", width)
        .attr("height", height)
        .attr("transform", `translate(${0}, ${0})`);
  }
  if (treeMapData.children.length === 0) {
    return;
  }
  const root = d3.treemap()
    .tile(d3.treemapBinary)
    .size([width, height])
    .padding(1)
    .round(true)(d3.hierarchy(treeMapData).sum(d => d.value).sort((a, b) => b.value - a.value));
  
    const leaf = svg.selectAll("g")
      .data(root.leaves())
      .join("g")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);

    leaf.append("title")
      .text(d => {
        return `${d.data.region}, ${d.data.name}, ${d.data.value}`;
      });
    
    leaf.append("rect")
      .attr("id", d => (d.leafUid = `leaf${d.data.id}`))
      .attr("fill", d => {
        return colors[d.data.region];
      })
      // .attr("fill-opacity", 0.6)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .on('mouseover', (e, d) => {
        setPointsOpacity(0.1);
        const f = filteredByNationality(data, d.data);
        setPointsOpacityByFiltered(f);
      })
      .on('mouseout', (e, d) => {
        setPointsOpacity(1);
      });

    leaf.append("clipPath")
      .style("pointer-events", 'none')
      .attr("id", d => (d.clipUid = `clip${d.data.id}`))
      .append("use")
      .attr("xlink:href", d => `#${d.leafUid}`);
    
    leaf.append("text")
      .style("pointer-events", 'none')
      .attr("clip-path", d => `url(#${d.clipUid})`)
      .selectAll("tspan")
      .data(d => d.data.name.split(/(?=[A-Z][a-z])|\s+/g).concat(d.value))
      .join("tspan")
        .attr("x", 3)
        .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
        .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
        .text(d => d);
}