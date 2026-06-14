const locationData = [{"locationCode":2,"zip":"71971","city":"Wickes","state":"AR","lat":34.3,"lng":-94.34,"employeeCount":247,"ratingCount":17633,"averageRating":3.4},{"locationCode":4,"zip":"65350","city":"Smithton","state":"MO","lat":38.68,"lng":-93.09,"employeeCount":393,"ratingCount":28553,"averageRating":3.24},{"locationCode":5,"zip":"52561","city":"Fremont","state":"IA","lat":41.21,"lng":-92.43,"employeeCount":410,"ratingCount":30072,"averageRating":3.07},{"locationCode":7,"zip":"72110","city":"Morrilton","state":"AR","lat":35.15,"lng":-92.74,"employeeCount":371,"ratingCount":30695,"averageRating":2.81},{"locationCode":8,"zip":"72847","city":"London","state":"AR","lat":35.32,"lng":-93.25,"employeeCount":190,"ratingCount":13209,"averageRating":3.46},{"locationCode":9,"zip":"74932","city":"Cameron","state":"OK","lat":35.14,"lng":-94.54,"employeeCount":5,"ratingCount":315,"averageRating":3.58},{"locationCode":12,"zip":"75961","city":"Nacogdoches","state":"TX","lat":31.6,"lng":-94.65,"employeeCount":161,"ratingCount":11130,"averageRating":3.39},{"locationCode":13,"zip":"79013","city":"Cactus","state":"TX","lat":36.05,"lng":-102,"employeeCount":276,"ratingCount":20118,"averageRating":3.52},{"locationCode":15,"zip":"42066","city":"Mayfield","state":"KY","lat":36.74,"lng":-88.64,"employeeCount":130,"ratingCount":9807,"averageRating":3.34},{"locationCode":16,"zip":"30536","city":"Ellijay","state":"GA","lat":34.69,"lng":-84.48,"employeeCount":0,"ratingCount":0,"averageRating":0},{"locationCode":17,"zip":"26836","city":"Moorefield","state":"WV","lat":39.06,"lng":-78.97,"employeeCount":25,"ratingCount":1666,"averageRating":3.23},{"locationCode":18,"zip":"71832","city":"De Queen","state":"AR","lat":34.04,"lng":-94.34,"employeeCount":53,"ratingCount":3402,"averageRating":3.4},{"locationCode":19,"zip":"60661","city":"Chicago","state":"IL","lat":41.88,"lng":-87.64,"employeeCount":105,"ratingCount":6482,"averageRating":3.54},{"locationCode":20,"zip":"00705","city":"Aibonito","state":"PR","lat":18.14,"lng":-66.26,"employeeCount":277,"ratingCount":21203,"averageRating":3.37},{"locationCode":21,"zip":"30501","city":"Gainesville","state":"GA","lat":34.3,"lng":-83.82,"employeeCount":288,"ratingCount":23044,"averageRating":3.38},{"locationCode":22,"zip":"26836","city":"Moorefield","state":"WV","lat":39.06,"lng":-78.97,"employeeCount":247,"ratingCount":16744,"averageRating":3.27},{"locationCode":23,"zip":"75901","city":"Lufkin","state":"TX","lat":31.34,"lng":-94.73,"employeeCount":270,"ratingCount":18949,"averageRating":3.33},{"locationCode":24,"zip":"35976","city":"Guntersville","state":"AL","lat":34.36,"lng":-86.3,"employeeCount":153,"ratingCount":13188,"averageRating":3.3},{"locationCode":25,"zip":"80631","city":"Greeley","state":"CO","lat":40.42,"lng":-104.71,"employeeCount":41,"ratingCount":2625,"averageRating":3.43},{"locationCode":26,"zip":"71019","city":"Coushatta","state":"LA","lat":32.01,"lng":-93.34,"employeeCount":79,"ratingCount":5411,"averageRating":3.59},{"locationCode":27,"zip":"75455","city":"Mount Pleasant","state":"TX","lat":33.16,"lng":-94.97,"employeeCount":87,"ratingCount":5460,"averageRating":3.66},{"locationCode":28,"zip":"32060","city":"Live Oak","state":"FL","lat":30.29,"lng":-82.98,"employeeCount":133,"ratingCount":8988,"averageRating":3.68},{"locationCode":29,"zip":"75686","city":"Pittsburg","state":"TX","lat":32.99,"lng":-94.97,"employeeCount":98,"ratingCount":6265,"averageRating":3.74},{"locationCode":30,"zip":"30114","city":"Canton","state":"GA","lat":34.24,"lng":-84.49,"employeeCount":96,"ratingCount":6496,"averageRating":3.72},{"locationCode":31,"zip":"30501","city":"Gainesville","state":"GA","lat":34.3,"lng":-83.82,"employeeCount":168,"ratingCount":12964,"averageRating":3.44},{"locationCode":32,"zip":"31533","city":"Douglas","state":"GA","lat":31.51,"lng":-82.85,"employeeCount":119,"ratingCount":8645,"averageRating":3.65},{"locationCode":33,"zip":"54612","city":"Arcadia","state":"WI","lat":44.25,"lng":-91.49,"employeeCount":132,"ratingCount":9184,"averageRating":3.7},{"locationCode":34,"zip":"76701","city":"Waco","state":"TX","lat":31.55,"lng":-97.15,"employeeCount":20,"ratingCount":1232,"averageRating":3.43},{"locationCode":35,"zip":"30601","city":"Athens","state":"GA","lat":33.96,"lng":-83.38,"employeeCount":109,"ratingCount":7972,"averageRating":3.42},{"locationCode":36,"zip":"75961","city":"Nacogdoches","state":"TX","lat":31.6,"lng":-94.65,"employeeCount":114,"ratingCount":8638,"averageRating":3.46},{"locationCode":37,"zip":"30117","city":"Carrollton","state":"GA","lat":33.58,"lng":-85.08,"employeeCount":141,"ratingCount":10248,"averageRating":3.5},{"locationCode":39,"zip":"92101","city":"San Diego","state":"CA","lat":32.72,"lng":-117.16,"employeeCount":70,"ratingCount":4606,"averageRating":3.37},{"locationCode":40,"zip":"35653","city":"Russellville","state":"AL","lat":34.51,"lng":-87.73,"employeeCount":89,"ratingCount":6006,"averageRating":3.72},{"locationCode":41,"zip":"56320","city":"Cold Spring","state":"MN","lat":45.46,"lng":-94.43,"employeeCount":142,"ratingCount":9611,"averageRating":3.58},{"locationCode":42,"zip":"27330","city":"Sanford","state":"NC","lat":35.48,"lng":-79.18,"employeeCount":80,"ratingCount":5663,"averageRating":3.48},{"locationCode":43,"zip":"36330","city":"Enterprise","state":"AL","lat":31.32,"lng":-85.85,"employeeCount":52,"ratingCount":3654,"averageRating":3.61},{"locationCode":44,"zip":"37401","city":"Chattanooga","state":"TN","lat":35.05,"lng":-85.31,"employeeCount":134,"ratingCount":10171,"averageRating":3.24},{"locationCode":45,"zip":"28103","city":"Marshville","state":"NC","lat":34.99,"lng":-80.37,"employeeCount":261,"ratingCount":17857,"averageRating":3.6},{"locationCode":46,"zip":"72801","city":"Russellville","state":"AR","lat":35.28,"lng":-93.13,"employeeCount":94,"ratingCount":6342,"averageRating":3.57},{"locationCode":47,"zip":"79022","city":"Dalhart","state":"TX","lat":36.06,"lng":-102.51,"employeeCount":461,"ratingCount":37093,"averageRating":3.63},{"locationCode":48,"zip":"40202","city":"Louisville","state":"KY","lat":38.25,"lng":-85.75,"employeeCount":117,"ratingCount":8526,"averageRating":3.57},{"locationCode":49,"zip":"52501","city":"Ottumwa","state":"IA","lat":41.02,"lng":-92.41,"employeeCount":77,"ratingCount":5222,"averageRating":3.51},{"locationCode":50,"zip":"62618","city":"Beardstown","state":"IL","lat":40.02,"lng":-90.42,"employeeCount":143,"ratingCount":9716,"averageRating":3.39},{"locationCode":51,"zip":"50158","city":"Marshalltown","state":"IA","lat":42.05,"lng":-92.91,"employeeCount":67,"ratingCount":4907,"averageRating":3.69},{"locationCode":52,"zip":"56187","city":"Worthington","state":"MN","lat":43.62,"lng":-95.6,"employeeCount":68,"ratingCount":5348,"averageRating":3.42},{"locationCode":53,"zip":"29150","city":"Sumter","state":"SC","lat":33.92,"lng":-80.34,"employeeCount":19,"ratingCount":1246,"averageRating":2.96},{"locationCode":54,"zip":"92501","city":"Riverside","state":"CA","lat":33.98,"lng":-117.37,"employeeCount":106,"ratingCount":7098,"averageRating":3.94},{"locationCode":55,"zip":"28645","city":"Lenoir","state":"NC","lat":35.91,"lng":-81.54,"employeeCount":58,"ratingCount":4277,"averageRating":3.42},{"locationCode":57,"zip":"80631","city":"Greeley","state":"CO","lat":40.42,"lng":-104.71,"employeeCount":140,"ratingCount":9464,"averageRating":3.62},{"locationCode":58,"zip":"49080","city":"Plainwell","state":"MI","lat":42.44,"lng":-85.65,"employeeCount":6,"ratingCount":371,"averageRating":3.35},{"locationCode":59,"zip":"85353","city":"Tolleson","state":"AZ","lat":33.42,"lng":-112.26,"employeeCount":20,"ratingCount":1253,"averageRating":3.43},{"locationCode":60,"zip":"54229","city":"New Franken","state":"WI","lat":44.53,"lng":-87.84,"employeeCount":35,"ratingCount":3108,"averageRating":3.42},{"locationCode":61,"zip":"18964","city":"Souderton","state":"PA","lat":40.31,"lng":-75.33,"employeeCount":3,"ratingCount":308,"averageRating":3.66},{"locationCode":62,"zip":"68102","city":"Omaha","state":"NE","lat":41.26,"lng":-95.94,"employeeCount":1,"ratingCount":77,"averageRating":3.75},{"locationCode":64,"zip":"84319","city":"Hyrum","state":"UT","lat":41.63,"lng":-111.85,"employeeCount":2,"ratingCount":119,"averageRating":3.28},{"locationCode":65,"zip":"80631","city":"Greeley","state":"CO","lat":40.42,"lng":-104.71,"employeeCount":1,"ratingCount":56,"averageRating":3.5},{"locationCode":66,"zip":"80634","city":"Greeley","state":"CO","lat":40.41,"lng":-104.78,"employeeCount":2,"ratingCount":112,"averageRating":3.5},{"locationCode":67,"zip":"68801","city":"Grand Island","state":"NE","lat":40.92,"lng":-98.34,"employeeCount":3,"ratingCount":182,"averageRating":3.74},{"locationCode":68,"zip":"79013","city":"Cactus","state":"TX","lat":36.05,"lng":-102,"employeeCount":2,"ratingCount":119,"averageRating":3.63},{"locationCode":70,"zip":"T1R-0A1","city":"Brooks","state":"AB","lat":50.57,"lng":-111.9,"employeeCount":1,"ratingCount":63,"averageRating":3.68}];

const markers = document.querySelector("#mapMarkers");
const lowLocationList = document.querySelector("#lowLocationList");
const selectedTitle = document.querySelector("#selectedTitle");
const selectedRating = document.querySelector("#selectedRating");
const selectedEmployees = document.querySelector("#selectedEmployees");
const selectedZip = document.querySelector("#selectedZip");
const selectedRatings = document.querySelector("#selectedRatings");
const mapStage = document.querySelector(".map-stage");
const usMap = document.querySelector(".us-map");

const formatNumber = new Intl.NumberFormat("en-US");
const ratedLocations = locationData.filter((location) => location.ratingCount > 0);
const lowestLocations = [...ratedLocations]
  .sort((left, right) => left.averageRating - right.averageRating)
  .slice(0, 6);
const markerElements = new Map();

function projectLocation(location) {
  if (location.state === "PR") {
    const stageRect = mapStage.getBoundingClientRect();
    return { x: stageRect.width * 0.91, y: stageRect.height * 0.86 };
  }

  if (location.state === "AB") {
    const stageRect = mapStage.getBoundingClientRect();
    return { x: stageRect.width * 0.09, y: stageRect.height * 0.1 };
  }

  const minLng = -124;
  const maxLng = -66;
  const minLat = 24;
  const maxLat = 50;
  const viewBoxWidth = 1000;
  const viewBoxHeight = 620;
  const stageRect = mapStage.getBoundingClientRect();
  const mapRect = usMap.getBoundingClientRect();
  const projectedX = ((location.lng - minLng) / (maxLng - minLng)) * 840 + 80;
  const projectedY = (1 - (location.lat - minLat) / (maxLat - minLat)) * 440 + 85;
  const x = mapRect.left - stageRect.left + (projectedX / viewBoxWidth) * mapRect.width;
  const y = mapRect.top - stageRect.top + (projectedY / viewBoxHeight) * mapRect.height;

  return {
    x: Math.max(0, Math.min(stageRect.width, x)),
    y: Math.max(0, Math.min(stageRect.height, y)),
  };
}

function markerColor(location) {
  if (location.averageRating < 3.3) {
    return "#050505";
  }

  if (location.averageRating < 3.55) {
    return "#77776f";
  }

  return "#d9d9cc";
}

function markerSize(location) {
  const size = 10 + Math.sqrt(Math.max(location.employeeCount, 1)) * 1.35;
  return Math.max(12, Math.min(42, size));
}

function selectLocation(locationCode) {
  const location = locationData.find((item) => item.locationCode === locationCode);

  if (!location) {
    return;
  }

  selectedTitle.textContent = `Location ${location.locationCode} · ${location.city}, ${location.state}`;
  selectedRating.textContent = location.averageRating ? location.averageRating.toFixed(2) : "—";
  selectedEmployees.textContent = formatNumber.format(location.employeeCount);
  selectedZip.textContent = location.zip;
  selectedRatings.textContent = formatNumber.format(location.ratingCount);

  document.querySelectorAll(".marker, .low-button").forEach((element) => {
    element.classList.toggle("active", Number(element.dataset.locationCode) === locationCode);
  });
}

function positionMarkers() {
  locationData.forEach((location) => {
    const marker = markerElements.get(location.locationCode);

    if (!marker) {
      return;
    }

    const position = projectLocation(location);
    marker.style.left = `${position.x}px`;
    marker.style.top = `${position.y}px`;
  });
}

locationData.forEach((location) => {
  const button = document.createElement("button");
  button.className = "marker";
  button.type = "button";
  button.dataset.locationCode = location.locationCode;
  button.style.setProperty("--size", `${markerSize(location)}px`);
  button.style.setProperty("--marker-color", markerColor(location));
  button.setAttribute(
    "aria-label",
    `Location ${location.locationCode}, ${location.city}, ${location.state}, average rating ${location.averageRating}`
  );
  button.addEventListener("click", () => selectLocation(location.locationCode));
  markers.append(button);
  markerElements.set(location.locationCode, button);
});

lowestLocations.forEach((location) => {
  const button = document.createElement("button");
  button.className = "low-button";
  button.type = "button";
  button.dataset.locationCode = location.locationCode;
  button.innerHTML = `
    <span>
      <strong>Location ${location.locationCode} · ${location.city}, ${location.state}</strong>
      <small>${location.zip} · ${formatNumber.format(location.employeeCount)} employees</small>
    </span>
    <b>${location.averageRating.toFixed(2)}</b>
  `;
  button.addEventListener("click", () => selectLocation(location.locationCode));
  lowLocationList.append(button);
});

if (usMap.complete) {
  positionMarkers();
} else {
  usMap.addEventListener("load", positionMarkers, { once: true });
}

window.addEventListener("resize", positionMarkers);
selectLocation(7);
