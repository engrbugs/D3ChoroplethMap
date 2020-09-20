const tooltip = document.getElementById("tooltip");
const colorLength = 9;

async function run() {
  console.log('run');
  const eduResp = await fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json');
  const educations = await eduResp.json();
  
  const countiesResp =await fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json');
  const counties = await countiesResp.json();

  var width = $(window).width(),
    height = $(window).height(),
    xyrPadding = 40;

  const path = d3.geoPath();
  const data = topojson.feature(counties, counties.objects.counties).features;
  const steps = (d3.max(educations, edu => edu.bachelorsOrHigher)-d3.min(educations, edu => edu.bachelorsOrHigher))/(colorLength-1);

  const colorScale =  d3.scaleThreshold()
  .domain(d3.range(d3.min(educations, edu => edu.bachelorsOrHigher), 
  d3.max(educations, edu => edu.bachelorsOrHigher), 
  steps))
  .range(d3.schemeBlues[colorLength]);

  var colors = [];

  for (let i=d3.min(educations, edu => edu.bachelorsOrHigher); i<=d3.max(educations, edu => edu.bachelorsOrHigher); i+=steps) {
    colors.push(colorScale(i));
  }
  
  var svg = d3
    .select("#container")
    .append("svg")


    .classed("svg-container", true)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 960 600")
    .classed("svg-content-responsive", true)


    .attr("width", (height-180)*960/600)
    .attr("height", height-180);

  svg.append('g')
    .selectAll('path')  
    .data(data)
    .enter()
    .append('path')
    .attr('class', 'county')
    .attr('fill', d => colorScale(educations.find(edu => edu.fips === d.id).bachelorsOrHigher))
    .attr('data-fips', d => d.id)
    .attr('data-education', d => educations.find(edu => edu.fips === d.id).bachelorsOrHigher)
    .attr('d', path)
    .on("mousemove", (d, item) => {
      console.log(d, item,item.id);
      tooltip.style.left = d.pageX + (xyrPadding / 2) + "px";
      tooltip.style.top = d.pageY - xyrPadding + "px";
      const education = educations.find(edu => edu.fips === item.id);
      console.log(education.bachelorsOrHigher);
      tooltip.innerHTML = 
      `${education.area_name}, ${education.state} ${education.bachelorsOrHigher}%`;
      console.log(education);
      tooltip.setAttribute("data-education", education.bachelorsOrHigher);
    })
    .on("mouseover", () => (tooltip.style.visibility = "visible"))
    .on("mouseout", () => (tooltip.style.visibility = "hidden"));


    const legendWidth = 200;
    const legendHeight = 25;
  
    const legendRectWidth = legendWidth / colors.length;
    const legend = d3
      .select("body")
      .append("svg")
      .attr("id", "legend")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .selectAll("rect")
      .data(colors)
      .enter()
      .append("rect")
      .attr("x", (_, i) => i * legendRectWidth)
      .attr("y", 0)
      .attr("width", legendRectWidth)
      .attr("height", 25)
      .attr("fill", (c) => c);
};

run();