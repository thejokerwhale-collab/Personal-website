const STORAGE_KEY = "mizzou-campus-inventory-v3";
const SOUTHWEST_BOUNDS = [
  [38.9346, -92.3348],
  [38.9494, -92.3170]
];
const CLUSTER_ZOOM_LIMIT = 16;
const ZOOM_DETAIL_ONLY_NAMES = ["MizzouRec"];
const LOCATION_CLUSTERS = [
  {
    id: "southwest-village-cluster",
    name: "Southwest Village",
    code: "SWV",
    names: ["Southwest Village", "Brooks", "Bluford Hall", "North", "Center", "South"]
  },
  {
    id: "truman-central-cluster",
    name: "Truman Central",
    code: "TC",
    names: ["Johnston", "Wolpers", "Defoe-Graham", "Hawthorn", "Galena", "Dogwood"]
  },
  {
    id: "college-crossing-cluster",
    name: "College Crossing",
    code: "CC",
    names: [
      "College Ave",
      "Rollins Commons",
      "Hudson",
      "Gillett",
      "Hatch",
      "Bingham",
      "Schurz Hall",
      "Gateway",
      "Respect",
      "Responsibility",
      "Excellence",
      "Discovery"
    ]
  },
  {
    id: "park-view-cluster",
    name: "Park View",
    code: "PV",
    names: ["McDavid Hall", "Mark Twain", "Mizzou at U Centre"]
  }
];

const seedData = {
  schemaVersion: 2,
  selectedLocationId: "all",
  statusFilter: "all",
  mapLayers: {
    inventory: true,
    boundary: true,
    labels: true
  },
  clusterSettings: {},
  tasks: [],
  locations: [
    {
      id: "mcdavid-hall",
      name: "McDavid Hall",
      code: "MCD",
      lat: 38.94775,
      lng: -92.33245,
      notes: "Northwest border anchor for the first southwest-campus map focus."
    },
    {
      id: "tara-apartments",
      name: "Tara Apartments",
      code: "TARA",
      lat: 38.93605,
      lng: -92.31845,
      notes: "Southeast border anchor for the first southwest-campus map focus."
    },
    {
      id: "southwest-village",
      name: "Southwest Village",
      code: "SWV",
      lat: 38.94055,
      lng: -92.32615,
      notes: "Residence-life storage, checkout gear, and shared supplies."
    },
    {
      id: "mizzourec",
      name: "MizzouRec",
      code: "REC",
      lat: 38.94135,
      lng: -92.33115,
      notes: "Recreation equipment and facility operations inventory."
    },
    {
      id: "schurz-hall",
      name: "Schurz Hall",
      code: "SCH",
      lat: 38.9419,
      lng: -92.3238,
      notes: "Residence hall equipment, carts, and common-area inventory."
    },
    {
      id: "rollins-commons",
      name: "Rollins Commons",
      code: "ROL",
      lat: 38.9437,
      lng: -92.32875,
      notes: "Shared southwest-campus staging point."
    }
  ],
  items: [
    {
      id: "item-projector-cart",
      name: "Projector Cart",
      category: "AV",
      locationId: "rollins-commons",
      room: "Storage Closet B",
      quantity: 2,
      status: "available",
      condition: "Good",
      tags: ["events", "mobile"],
      notes: "Keep power strips and HDMI adapters on the lower shelf.",
      photos: [],
      updatedAt: new Date().toISOString()
    },
    {
      id: "item-maintenance-kits",
      name: "Apartment Maintenance Kits",
      category: "Facilities",
      locationId: "tara-apartments",
      room: "Office Storage",
      quantity: 8,
      status: "attention",
      condition: "Restock batteries and labels",
      tags: ["housing", "repair"],
      notes: "Check kit contents before move-in periods.",
      photos: [],
      updatedAt: new Date().toISOString()
    },
    {
      id: "item-tablet-bundle",
      name: "Tablet Checkout Bundle",
      category: "Technology",
      locationId: "southwest-village",
      room: "Service Desk",
      quantity: 12,
      status: "in-use",
      condition: "Good",
      tags: ["checkout", "charging"],
      notes: "Return chargers with each unit.",
      photos: [],
      updatedAt: new Date().toISOString()
    }
  ]
};

const projectData = window.RECOVERED_INVENTORY_DATA || seedData;

let state = loadState();
let shouldSaveInitialState = false;
if (!Array.isArray(state.locations) || state.locations.length === 0) {
  state = normalizeState(cloneData(projectData));
  shouldSaveInitialState = true;
}
let pendingPhotos = [];
let map = null;
let markerLayer = null;
let labelLayer = null;
let boundaryLayer = null;
let fallbackDropMode = false;

const elements = {
  totalItems: document.querySelector("#totalItems"),
  locationCount: document.querySelector("#locationCount"),
  attentionCount: document.querySelector("#attentionCount"),
  searchInput: document.querySelector("#searchInput"),
  topSearchInput: document.querySelector("#topSearchInput"),
  locationList: document.querySelector("#locationList"),
  campusMap: document.querySelector("#campusMap"),
  itemGrid: document.querySelector("#itemGrid"),
  locationDetail: document.querySelector("#locationDetail"),
  selectedLocationName: document.querySelector("#selectedLocationName"),
  selectedType: document.querySelector("#selectedType"),
  addItemButton: document.querySelector("#addItemButton"),
  addHereButton: document.querySelector("#addHereButton"),
  addLocationButton: document.querySelector("#addLocationButton"),
  exportButton: document.querySelector("#exportButton"),
  backupButton: document.querySelector("#backupButton"),
  restoreButton: document.querySelector("#restoreButton"),
  restoreFile: document.querySelector("#restoreFile"),
  saveStatus: document.querySelector("#saveStatus"),
  fitMapButton: document.querySelector("#fitMapButton"),
  dropLocationButton: document.querySelector("#dropLocationButton"),
  taskCount: document.querySelector("#taskCount"),
  taskInput: document.querySelector("#taskInput"),
  taskLocation: document.querySelector("#taskLocation"),
  addTaskButton: document.querySelector("#addTaskButton"),
  openTaskListButton: document.querySelector("#openTaskListButton"),
  taskDialog: document.querySelector("#taskDialog"),
  taskList: document.querySelector("#taskList"),
  itemDialog: document.querySelector("#itemDialog"),
  itemDialogTitle: document.querySelector("#itemDialogTitle"),
  itemForm: document.querySelector("#itemForm"),
  itemId: document.querySelector("#itemId"),
  itemName: document.querySelector("#itemName"),
  itemCategory: document.querySelector("#itemCategory"),
  itemLocation: document.querySelector("#itemLocation"),
  itemRoom: document.querySelector("#itemRoom"),
  itemQuantity: document.querySelector("#itemQuantity"),
  itemStatus: document.querySelector("#itemStatus"),
  itemCondition: document.querySelector("#itemCondition"),
  itemTags: document.querySelector("#itemTags"),
  itemNotes: document.querySelector("#itemNotes"),
  itemPhotos: document.querySelector("#itemPhotos"),
  photoPreview: document.querySelector("#photoPreview"),
  saveItemButton: document.querySelector("#saveItemButton"),
  deleteItemButton: document.querySelector("#deleteItemButton"),
  locationDialog: document.querySelector("#locationDialog"),
  locationDialogTitle: document.querySelector("#locationDialogTitle"),
  locationForm: document.querySelector("#locationForm"),
  locationId: document.querySelector("#locationId"),
  locationName: document.querySelector("#locationName"),
  locationCode: document.querySelector("#locationCode"),
  locationLat: document.querySelector("#locationLat"),
  locationLng: document.querySelector("#locationLng"),
  locationLocked: document.querySelector("#locationLocked"),
  locationNotes: document.querySelector("#locationNotes"),
  saveLocationButton: document.querySelector("#saveLocationButton")
};

const initialSearch = new URLSearchParams(window.location.search).get("q") || "";
if (initialSearch) {
  elements.searchInput.value = initialSearch;
  elements.topSearchInput.value = initialSearch;
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return normalizeState(cloneData(projectData));

  try {
    const parsed = JSON.parse(saved);
    return parsed.schemaVersion === 2 ? normalizeState(parsed) : normalizeState(cloneData(projectData));
  } catch {
    return normalizeState(cloneData(projectData));
  }
}

function normalizeState(value) {
  const hasLocations = Array.isArray(value.locations) && value.locations.length > 0;
  const hasItems = Array.isArray(value.items);
  if (!hasLocations) {
    value.locations = cloneData(projectData.locations);
    value.items = cloneData(projectData.items);
    value.selectedLocationId = "all";
  } else if (!hasItems) {
    value.items = [];
  }

  return {
    ...value,
    locations: value.locations.map((location) => ({
      locked: false,
      ...location
    })),
    mapLayers: {
      inventory: true,
      boundary: true,
      labels: true,
      ...(value.mapLayers || {})
    },
    clusterSettings: {
      ...(value.clusterSettings || {})
    },
    tasks: Array.isArray(value.tasks) ? value.tasks : []
  };
}

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function saveState() {
  try {
    state.savedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    updateSaveStatus();
  } catch {
    window.alert("This browser could not save the latest change. Try backing up your data, then remove a few large photos before adding more.");
  }
}

function updateSaveStatus() {
  if (!elements.saveStatus) return;
  const savedAt = state.savedAt ? new Date(state.savedAt) : null;
  elements.saveStatus.textContent = savedAt
    ? `Autosaved in this browser at ${savedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}.`
    : "Autosaved in this browser.";
}

function initMap() {
  if (!window.L) {
    renderFallbackMap();
    return;
  }

  try {
    elements.campusMap.innerHTML = "";
    map = L.map("campusMap", {
      maxBounds: [
        [38.9290, -92.3430],
        [38.9540, -92.3090]
      ],
      maxBoundsViscosity: 0.65
    });

    const streetLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 20,
      attribution: "&copy; OpenStreetMap contributors"
    });

    const satelliteLayer = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        maxZoom: 20,
        attribution: "Tiles &copy; Esri"
      }
    );

    streetLayer.addTo(map);

    boundaryLayer = L.rectangle(SOUTHWEST_BOUNDS, {
      color: "#a46b00",
      weight: 2,
      dashArray: "8 6",
      fillColor: "#f1b82d",
      fillOpacity: 0.08
    });

    markerLayer = L.layerGroup();
    labelLayer = L.layerGroup();
    addLayerChecklist(streetLayer, satelliteLayer);
    enableLocationDrop();
    applyMapLayerVisibility();
    map.fitBounds(SOUTHWEST_BOUNDS, { padding: [24, 24] });
    map.on("zoomend", renderMapMarkers);
  } catch {
    map = null;
    markerLayer = null;
    labelLayer = null;
    boundaryLayer = null;
    renderFallbackMap();
  }
}

function renderFallbackMap() {
  const [[south, west], [north, east]] = SOUTHWEST_BOUNDS;
  const markers = state.mapLayers.inventory ? state.locations.map((location) => {
    const x = Math.min(96, Math.max(4, ((location.lng - west) / (east - west)) * 100));
    const y = Math.min(92, Math.max(8, ((north - location.lat) / (north - south)) * 100));
    const count = countItems(location.id);
    const active = state.selectedLocationId === location.id ? "active" : "";
    const locked = Boolean(location.locked);
    return `
      <button
        class="fallback-marker ${active} ${locked ? "locked" : ""}"
        data-fallback-location="${location.id}"
        type="button"
        draggable="${locked ? "false" : "true"}"
        style="left: ${x}%; top: ${y}%"
        aria-label="${escapeHtml(location.name)}"
      >
        <span>${escapeHtml(getLocationLabel(location))}</span>
      </button>
    `;
  }).join("") : "";

  elements.campusMap.innerHTML = `
    <div class="fallback-map ${fallbackDropMode ? "drop-ready" : ""}">
      <div class="fallback-road fallback-road-east"></div>
      <div class="fallback-road fallback-road-west"></div>
      <div class="fallback-road fallback-road-north"></div>
      <div class="fallback-road fallback-road-south"></div>
      <div class="fallback-campus-zone">
        <strong>University of Missouri</strong>
        <span>Campus inventory map</span>
      </div>
      ${markers}
      <div class="fallback-layer-control">
        <strong>Show on map</strong>
        <label><input type="checkbox" data-fallback-layer="inventory" ${state.mapLayers.inventory ? "checked" : ""}> Inventory</label>
        <label><input type="checkbox" data-fallback-layer="boundary" ${state.mapLayers.boundary ? "checked" : ""}> Campus border</label>
      </div>
      ${state.mapLayers.boundary ? `<div class="fallback-boundary"></div>` : ""}
      <div class="fallback-map-note">${fallbackDropMode ? "Click the map to place a new location." : "Campus map view"}</div>
    </div>
  `;

  const fallbackMap = elements.campusMap.querySelector(".fallback-map");
  elements.campusMap.querySelectorAll("[data-fallback-location]").forEach((button) => {
    button.addEventListener("click", () => selectLocation(button.dataset.fallbackLocation));
    button.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("application/x-location-id", button.dataset.fallbackLocation);
      event.dataTransfer.effectAllowed = "move";
    });
  });
  elements.campusMap.querySelectorAll("[data-fallback-layer]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      state.mapLayers[checkbox.dataset.fallbackLayer] = checkbox.checked;
      saveState();
      renderFallbackMap();
    });
  });
  fallbackMap.addEventListener("dragover", (event) => {
    event.preventDefault();
    fallbackMap.classList.add("drop-ready");
  });
  fallbackMap.addEventListener("dragleave", () => {
    fallbackMap.classList.remove("drop-ready");
  });
  fallbackMap.addEventListener("drop", (event) => {
    event.preventDefault();
    fallbackMap.classList.remove("drop-ready");
    const locationId = event.dataTransfer.getData("application/x-location-id");
    const latLng = getFallbackLatLng(event, fallbackMap);
    if (locationId) {
      updateLocationPosition(locationId, latLng);
      return;
    }
    if (event.dataTransfer.getData("text/plain") === "new-location") {
      fallbackDropMode = false;
      openLocationDialog(latLng, "Dropped Location");
    }
  });
  fallbackMap.addEventListener("click", (event) => {
    if (!fallbackDropMode || event.target.closest("button, label, input")) return;
    fallbackDropMode = false;
    openLocationDialog(getFallbackLatLng(event, fallbackMap), "Dropped Location");
  });
}

function getFallbackLatLng(event, fallbackMap) {
  const [[south, west], [north, east]] = SOUTHWEST_BOUNDS;
  const rect = fallbackMap.getBoundingClientRect();
  const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
  const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
  return {
    lat: north - y * (north - south),
    lng: west + x * (east - west)
  };
}

function addLayerChecklist(streetLayer, satelliteLayer) {
  const control = L.control({ position: "topright" });

  control.onAdd = () => {
    const container = L.DomUtil.create("div", "map-layer-control");
    container.innerHTML = `
      <strong>Show on map</strong>
      <label><input type="checkbox" data-map-layer="inventory" ${state.mapLayers.inventory ? "checked" : ""}> Inventory</label>
      <label><input type="checkbox" data-map-layer="boundary" ${state.mapLayers.boundary ? "checked" : ""}> Campus border</label>
      <label><input type="checkbox" data-base-layer="satellite"> Satellite map</label>
    `;
    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.disableScrollPropagation(container);

    container.querySelectorAll("[data-map-layer]").forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        state.mapLayers[checkbox.dataset.mapLayer] = checkbox.checked;
        saveState();
        applyMapLayerVisibility();
      });
    });

    container.querySelector("[data-base-layer='satellite']").addEventListener("change", (event) => {
      if (event.target.checked) {
        map.removeLayer(streetLayer);
        satelliteLayer.addTo(map);
      } else {
        map.removeLayer(satelliteLayer);
        streetLayer.addTo(map);
      }
    });

    return container;
  };

  control.addTo(map);
}

function enableLocationDrop() {
  const container = map.getContainer();
  container.addEventListener("dragover", (event) => {
    event.preventDefault();
    elements.campusMap.classList.add("drop-ready");
  });
  container.addEventListener("dragleave", () => {
    elements.campusMap.classList.remove("drop-ready");
  });
  container.addEventListener("drop", (event) => {
    event.preventDefault();
    elements.campusMap.classList.remove("drop-ready");
    if (event.dataTransfer.getData("text/plain") !== "new-location") return;
    const latLng = map.mouseEventToLatLng(event);
    openLocationDialog(latLng, "Dropped Location");
  });
}

function applyMapLayerVisibility() {
  if (!map) return;
  setLayerVisibility(markerLayer, state.mapLayers.inventory);
  setLayerVisibility(labelLayer, false);
  setLayerVisibility(boundaryLayer, state.mapLayers.boundary);
}

function setLayerVisibility(layer, visible) {
  if (!layer) return;
  if (visible && !map.hasLayer(layer)) {
    layer.addTo(map);
  }
  if (!visible && map.hasLayer(layer)) {
    map.removeLayer(layer);
  }
}

function render() {
  const selectedLocation = getSelectedLocation();
  const visibleItems = getVisibleItems();
  const selectedItems = getItemsForSelectedLocation();
  const attentionItems = state.items.filter((item) => ["attention", "missing"].includes(item.status));

  elements.totalItems.textContent = state.items.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
  elements.locationCount.textContent = state.locations.length;
  elements.attentionCount.textContent = attentionItems.length;
  elements.selectedLocationName.textContent = selectedLocation ? selectedLocation.name : "All Campus Locations";
  elements.selectedType.textContent = selectedLocation ? selectedLocation.code : "Selected Location";

  renderLocationOptions();
  renderTaskLocationOptions();
  renderTasks();
  renderLocations();
  renderMapMarkers();
  if (!map && elements.campusMap.querySelector(".fallback-map")) {
    renderFallbackMap();
  }
  renderLocationDetail(selectedLocation, selectedItems);
  renderItems(visibleItems);
}

function renderLocationOptions() {
  elements.itemLocation.innerHTML = state.locations
    .map((location) => `<option value="${location.id}">${escapeHtml(location.name)}</option>`)
    .join("");
}

function renderTaskLocationOptions() {
  elements.taskLocation.innerHTML = [
    `<option value="">No location</option>`,
    ...state.locations.map((location) => `<option value="${location.id}">${escapeHtml(location.name)}</option>`)
  ].join("");
}

function renderTasks() {
  const openTasks = state.tasks.filter((task) => !task.done);
  elements.taskCount.textContent = `${openTasks.length} open`;

  if (!state.tasks.length) {
    elements.taskList.innerHTML = `<div class="task-empty">No tasks yet.</div>`;
    return;
  }

  elements.taskList.innerHTML = state.tasks.map((task) => {
    const location = state.locations.find((entry) => entry.id === task.locationId);
    return `
      <div class="task-row ${task.done ? "done" : ""}">
        <label>
          <input type="checkbox" data-toggle-task="${task.id}" ${task.done ? "checked" : ""} />
          <span>
            <strong>${escapeHtml(task.title)}</strong>
            ${location ? `<small>${escapeHtml(location.name)}</small>` : ""}
          </span>
        </label>
        <div class="task-row-actions">
          ${location ? `<button type="button" data-task-map="${location.id}">Map</button>` : ""}
          <button type="button" data-delete-task="${task.id}" aria-label="Delete task">x</button>
        </div>
      </div>
    `;
  }).join("");

  elements.taskList.querySelectorAll("[data-toggle-task]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => toggleTask(checkbox.dataset.toggleTask));
  });
  elements.taskList.querySelectorAll("[data-delete-task]").forEach((button) => {
    button.addEventListener("click", () => deleteTask(button.dataset.deleteTask));
  });
  elements.taskList.querySelectorAll("[data-task-map]").forEach((button) => {
    button.addEventListener("click", () => {
      selectLocation(button.dataset.taskMap);
      elements.taskDialog.close();
    });
  });
}

function addTask() {
  const title = elements.taskInput.value.trim();
  if (!title) return;

  state.tasks.unshift({
    id: `task-${Date.now()}`,
    title,
    locationId: elements.taskLocation.value,
    done: false,
    createdAt: new Date().toISOString()
  });
  elements.taskInput.value = "";
  elements.taskLocation.value = "";
  saveState();
  render();
}

function toggleTask(taskId) {
  const task = state.tasks.find((entry) => entry.id === taskId);
  if (!task) return;
  task.done = !task.done;
  saveState();
  render();
}

function deleteTask(taskId) {
  state.tasks = state.tasks.filter((task) => task.id !== taskId);
  saveState();
  render();
}

function renderLocations() {
  elements.locationList.innerHTML = [
    ...state.locations.map((location) => locationRowTemplate(location, countItems(location.id)))
  ].join("");

  elements.locationList.querySelectorAll("[data-select-location]").forEach((button) => {
    button.addEventListener("click", () => selectLocation(button.dataset.locationId));
  });
  elements.locationList.querySelectorAll("[data-toggle-lock]").forEach((button) => {
    button.addEventListener("click", () => toggleLocationLock(button.dataset.locationId));
  });
  elements.locationList.querySelectorAll("[data-edit-location]").forEach((button) => {
    button.addEventListener("click", () => openEditLocationDialog(button.dataset.locationId));
  });
  elements.locationList.querySelectorAll("[data-delete-location]").forEach((button) => {
    button.addEventListener("click", () => deleteLocation(button.dataset.locationId));
  });
}

function locationRowTemplate(location, count) {
  const active = state.selectedLocationId === location.id ? "active" : "";
  const label = count === 1 ? "1 item" : `${count} items`;
  const isAll = location.id === "all";
  const locked = Boolean(location.locked);
  const openTasks = getOpenTasksForLocation(location.id);
  return `
    <div class="location-row ${active} ${openTasks.length ? "has-task" : ""}" data-location-id="${location.id}">
      <button class="location-main" data-select-location data-location-id="${location.id}" type="button">
        <span class="location-code">${escapeHtml(location.code || "LOC")}${openTasks.length ? `<span class="task-signal">${openTasks.length}</span>` : ""}</span>
        <span>
          <strong>${escapeHtml(location.name)}</strong>
          <small>${label}${locked ? " - locked" : ""}${openTasks.length ? ` - ${openTasks.length} open task${openTasks.length === 1 ? "" : "s"}` : ""}</small>
          ${openTasks.length ? `<span class="location-task-preview">${escapeHtml(openTasks[0].title)}</span>` : ""}
        </span>
      </button>
      ${isAll ? `<span class="meta"></span>` : `
        <span class="location-actions">
          <button class="edit-location-button" data-edit-location data-location-id="${location.id}" type="button" aria-label="Edit label for ${escapeHtml(location.name)}">Edit</button>
          <button class="lock-button ${locked ? "locked" : ""}" data-toggle-lock data-location-id="${location.id}" type="button" aria-label="${locked ? "Unlock" : "Lock"} ${escapeHtml(location.name)}">${locked ? "Locked" : "Lock"}</button>
          <button class="delete-location-button" data-delete-location data-location-id="${location.id}" type="button" aria-label="Delete ${escapeHtml(location.name)}">Delete</button>
        </span>
      `}
    </div>
  `;
}

function toggleLocationLock(locationId) {
  const location = state.locations.find((entry) => entry.id === locationId);
  if (!location) return;
  location.locked = !location.locked;
  saveState();
  render();
}

function deleteLocation(locationId) {
  const location = state.locations.find((entry) => entry.id === locationId);
  if (!location) return;
  if (location.locked) {
    window.alert("Unlock this location before deleting it.");
    return;
  }

  const assignedItems = state.items.filter((item) => item.locationId === locationId);
  const itemText = assignedItems.length === 1 ? "1 inventory item" : `${assignedItems.length} inventory items`;
  const message = assignedItems.length
    ? `Delete ${location.name} and ${itemText} assigned to it?`
    : `Delete ${location.name}?`;

  if (!window.confirm(message)) return;

  state.locations = state.locations.filter((entry) => entry.id !== locationId);
  state.items = state.items.filter((item) => item.locationId !== locationId);
  if (state.selectedLocationId === locationId) {
    state.selectedLocationId = "all";
  }
  saveState();
  render();
}

function renderMapMarkers() {
  if (!map || !markerLayer || !labelLayer) return;

  markerLayer.clearLayers();
  labelLayer.clearLayers();

  const visibleClusters = getVisibleClusters();
  const clusteredIds = new Set(visibleClusters.flatMap((cluster) => cluster.locations.map((location) => location.id)));

  visibleClusters.forEach((cluster) => {
    const active = cluster.locations.some((location) => location.id === state.selectedLocationId);
    const count = cluster.locations.reduce((sum, location) => sum + countItems(location.id), 0);
    const locked = Boolean(cluster.locked);
    const marker = L.marker([cluster.lat, cluster.lng], {
      draggable: !locked,
      icon: L.divIcon({
        className: "",
        html: `<div class="inventory-marker cluster-marker ${active ? "active" : ""} ${locked ? "locked" : ""}">${escapeHtml(cluster.code)}</div>`,
        iconSize: [42, 42],
        iconAnchor: [21, 21]
      })
    });

    marker.bindPopup(`
      <div class="map-popup">
        <strong>${escapeHtml(cluster.name)}</strong>
        <span class="meta">${cluster.locations.length} locations grouped</span>
        <span class="meta">${count === 1 ? "1 item" : `${count} items`}</span>
        <span class="meta">${locked ? "Locked" : "Drag cluster to move"}</span>
        <div class="cluster-list">${cluster.locations.map((location) => `<span>${escapeHtml(getLocationLabel(location))} - ${escapeHtml(location.name)}</span>`).join("")}</div>
        <button type="button" data-popup-cluster="${cluster.id}">Zoom to halls</button>
        <button type="button" data-popup-cluster-lock="${cluster.id}">${locked ? "Unlock Cluster" : "Lock Cluster"}</button>
      </div>
    `);
    marker.on("dragend", () => updateClusterPosition(cluster.id, marker.getLatLng()));
    marker.on("popupopen", () => {
      document.querySelector(`[data-popup-cluster="${cluster.id}"]`)?.addEventListener("click", () => zoomToCluster(cluster));
      document.querySelector(`[data-popup-cluster-lock="${cluster.id}"]`)?.addEventListener("click", () => toggleClusterLock(cluster.id));
    });
    marker.addTo(markerLayer);
  });

  state.locations.forEach((location) => {
    if (clusteredIds.has(location.id)) return;
    if (isZoomDetailOnlyLocation(location)) return;
    const count = countItems(location.id);
    const active = state.selectedLocationId === location.id;
    const locked = Boolean(location.locked);
    const label = getLocationLabel(location);
    const openTasks = getOpenTasksForLocation(location.id);
    const marker = L.marker([location.lat, location.lng], {
      draggable: !locked,
      icon: L.divIcon({
        className: "",
        html: `<div class="inventory-marker ${active ? "active" : ""} ${locked ? "locked" : ""} ${openTasks.length ? "has-task" : ""}">${escapeHtml(label)}${openTasks.length ? `<span class="marker-task-signal">${openTasks.length}</span>` : ""}</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      })
    });

    marker.on("click", () => selectLocation(location.id));
    marker.bindPopup(`
      <div class="map-popup">
        <strong>${escapeHtml(location.name)}</strong>
        <span class="meta">Label: ${escapeHtml(label)}</span>
        <span class="meta">${count === 1 ? "1 item" : `${count} items`}</span>
        ${openTasks.length ? `<div class="popup-task-list">${openTasks.map((task) => `<span>${escapeHtml(task.title)}</span>`).join("")}</div>` : ""}
        <span class="meta">${locked ? "Locked" : "Drag marker to move"}</span>
        ${floorplanLinkTemplate(location, "popup-resource-link")}
        <button type="button" data-popup-location="${location.id}">View Inventory</button>
        <button type="button" data-popup-edit-location="${location.id}">Edit Label</button>
      </div>
    `);
    marker.on("dragend", () => updateLocationPosition(location.id, marker.getLatLng()));
    marker.on("popupopen", () => {
      document.querySelector(`[data-popup-location="${location.id}"]`)?.addEventListener("click", () => selectLocation(location.id));
      document.querySelector(`[data-popup-edit-location="${location.id}"]`)?.addEventListener("click", () => openEditLocationDialog(location.id));
    });
    marker.addTo(markerLayer);

  });
  applyMapLayerVisibility();
}

function updateLocationPosition(locationId, latLng) {
  const location = state.locations.find((entry) => entry.id === locationId);
  if (!location || location.locked) return;
  location.lat = Number(latLng.lat.toFixed(5));
  location.lng = Number(latLng.lng.toFixed(5));
  saveState();
  render();
}

function getVisibleClusters() {
  if (!map || map.getZoom() > CLUSTER_ZOOM_LIMIT) return [];

  return LOCATION_CLUSTERS.map((cluster) => {
    const locations = state.locations.filter((location) => {
      return cluster.names.some((name) => normalizeName(location.name) === normalizeName(name));
    });
    if (locations.length < 2) return null;

    const settings = state.clusterSettings?.[cluster.id] || {};
    const lat = Number(settings.lat) || locations.reduce((sum, location) => sum + Number(location.lat), 0) / locations.length;
    const lng = Number(settings.lng) || locations.reduce((sum, location) => sum + Number(location.lng), 0) / locations.length;
    return {
      ...cluster,
      locations,
      lat,
      lng,
      locked: Boolean(settings.locked)
    };
  }).filter(Boolean);
}

function isZoomDetailOnlyLocation(location) {
  if (!map || map.getZoom() > CLUSTER_ZOOM_LIMIT) return false;
  return ZOOM_DETAIL_ONLY_NAMES.some((name) => normalizeName(location.name) === normalizeName(name));
}

function ensureClusterSetting(clusterId) {
  state.clusterSettings = state.clusterSettings || {};
  state.clusterSettings[clusterId] = state.clusterSettings[clusterId] || {};
  return state.clusterSettings[clusterId];
}

function updateClusterPosition(clusterId, latLng) {
  const setting = ensureClusterSetting(clusterId);
  if (setting.locked) return;
  setting.lat = Number(latLng.lat.toFixed(5));
  setting.lng = Number(latLng.lng.toFixed(5));
  saveState();
  renderMapMarkers();
}

function toggleClusterLock(clusterId) {
  const setting = ensureClusterSetting(clusterId);
  setting.locked = !setting.locked;
  saveState();
  renderMapMarkers();
}

function zoomToCluster(cluster) {
  if (!map || !cluster?.locations?.length) return;
  const bounds = L.latLngBounds(cluster.locations.map((location) => [location.lat, location.lng]));
  map.fitBounds(bounds, {
    maxZoom: CLUSTER_ZOOM_LIMIT + 2,
    padding: [44, 44]
  });
}

function normalizeName(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(hall|halls|commons|apartments|apartment)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function renderLocationDetail(location, selectedItems) {
  const available = selectedItems.filter((item) => item.status === "available").length;
  const inMotion = selectedItems.filter((item) => ["in-use", "loaned"].includes(item.status)).length;
  const needsAttention = selectedItems.filter((item) => ["attention", "missing"].includes(item.status)).length;
  const floorplanLink = location ? floorplanLinkTemplate(location, "detail-resource-link") : "";
  const openTasks = location ? getOpenTasksForLocation(location.id) : [];
  const taskPanel = openTasks.length
    ? `<div class="detail-chip wide hall-task-panel"><strong>Open Tasks</strong>${openTasks.map((task) => `<label><input type="checkbox" data-detail-task="${task.id}" /><span>${escapeHtml(task.title)}</span></label>`).join("")}</div>`
    : "";

  elements.locationDetail.innerHTML = `
    <div class="detail-chip"><span>${selectedItems.length}</span><small>Records</small></div>
    <div class="detail-chip"><span>${available}</span><small>Available</small></div>
    <div class="detail-chip"><span>${inMotion}</span><small>In use or loaned</small></div>
    <div class="detail-chip"><span>${needsAttention}</span><small>Need attention</small></div>
    ${taskPanel}
    ${floorplanLink ? `<div class="detail-chip wide">${floorplanLink}</div>` : ""}
  `;

  elements.locationDetail.querySelectorAll("[data-detail-task]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => toggleTask(checkbox.dataset.detailTask));
  });
}

function floorplanLinkTemplate(location, className) {
  const name = `${location.name} Floorplans`;
  return `
    <a class="${className}" href="floorplans/blank-floorplans.pdf" target="_blank" download="${escapeHtml(name)}.pdf">
      ${escapeHtml(name)}
    </a>
  `;
}

function getOpenTasksForLocation(locationId) {
  return state.tasks.filter((task) => task.locationId === locationId && !task.done);
}

function renderItems(items) {
  if (!items.length) {
    elements.itemGrid.innerHTML = `<div class="empty-state">No inventory matches this view yet.</div>`;
    return;
  }

  elements.itemGrid.innerHTML = items.map((item) => {
    const location = state.locations.find((entry) => entry.id === item.locationId);
    const photo = item.photos?.[0];
    const tags = (item.tags || []).slice(0, 3).map((tag) => `<span class="badge">${escapeHtml(tag)}</span>`).join("");
    return `
      <article class="item-card">
        <button type="button" data-item-id="${item.id}">
          <div class="item-photo">${photo ? `<img src="${photo}" alt="">` : `<span>${escapeHtml(item.category || "Item")}</span>`}</div>
          <div class="item-body">
            <strong>${escapeHtml(item.name)}</strong>
            <div class="meta">${escapeHtml(location?.name || "No location")} ${item.room ? `- ${escapeHtml(item.room)}` : ""}</div>
            <div class="badges">
              <span class="badge ${item.status}">${formatStatus(item.status)}</span>
              <span class="badge">Qty ${Number(item.quantity || 1)}</span>
              ${tags}
            </div>
          </div>
        </button>
      </article>
    `;
  }).join("");

  elements.itemGrid.querySelectorAll("[data-item-id]").forEach((button) => {
    button.addEventListener("click", () => openItemDialog(button.dataset.itemId));
  });
}

function getSearchQuery() {
  return (elements.topSearchInput.value || elements.searchInput.value).trim().toLowerCase();
}

function updateSearch(value) {
  elements.searchInput.value = value;
  elements.topSearchInput.value = value;
  render();
}

function getVisibleItems() {
  const query = getSearchQuery();
  return getItemsForSelectedLocation().filter((item) => {
    const statusMatches =
      state.statusFilter === "all" ||
      item.status === state.statusFilter ||
      (state.statusFilter === "attention" && item.status === "missing");
    const searchBlob = [
      item.name,
      item.category,
      item.room,
      item.status,
      item.condition,
      item.notes,
      ...(item.tags || []),
      state.locations.find((location) => location.id === item.locationId)?.name
    ].join(" ").toLowerCase();
    return statusMatches && (!query || searchBlob.includes(query));
  });
}

function getItemsForSelectedLocation() {
  if (state.selectedLocationId === "all") return state.items;
  return state.items.filter((item) => item.locationId === state.selectedLocationId);
}

function getSelectedLocation() {
  return state.locations.find((location) => location.id === state.selectedLocationId);
}

function countItems(locationId) {
  return state.items.filter((item) => item.locationId === locationId).length;
}

function getLocationLabel(location) {
  const label = String(location?.code || location?.name || "LOC").trim();
  return label.slice(0, 10).toUpperCase();
}

function selectLocation(locationId) {
  state.selectedLocationId = locationId;
  saveState();
  render();

  const location = state.locations.find((entry) => entry.id === locationId);
  if (map && location) {
    map.flyTo([location.lat, location.lng], Math.max(map.getZoom(), 17), { duration: 0.35 });
  } else if (map) {
    map.fitBounds(SOUTHWEST_BOUNDS, { padding: [24, 24] });
  }
}

function openItemDialog(itemId = null) {
  pendingPhotos = [];
  elements.itemForm.reset();
  elements.photoPreview.innerHTML = "";
  elements.itemPhotos.value = "";

  const item = state.items.find((entry) => entry.id === itemId);
  elements.itemDialogTitle.textContent = item ? "Edit Item" : "Add Item";
  elements.deleteItemButton.hidden = !item;
  elements.itemId.value = item?.id || "";
  elements.itemName.value = item?.name || "";
  elements.itemCategory.value = item?.category || "";
  elements.itemLocation.value = item?.locationId || (state.selectedLocationId === "all" ? state.locations[0]?.id : state.selectedLocationId);
  elements.itemRoom.value = item?.room || "";
  elements.itemQuantity.value = item?.quantity || 1;
  elements.itemStatus.value = item?.status || "available";
  elements.itemCondition.value = item?.condition || "";
  elements.itemTags.value = (item?.tags || []).join(", ");
  elements.itemNotes.value = item?.notes || "";
  pendingPhotos = [...(item?.photos || [])];
  renderPhotoPreview();
  elements.itemDialog.showModal();
}

function saveItem() {
  if (!elements.itemForm.reportValidity()) return;

  const itemId = elements.itemId.value || `item-${Date.now()}`;
  const item = {
    id: itemId,
    name: elements.itemName.value.trim(),
    category: elements.itemCategory.value.trim(),
    locationId: elements.itemLocation.value,
    room: elements.itemRoom.value.trim(),
    quantity: Number(elements.itemQuantity.value || 1),
    status: elements.itemStatus.value,
    condition: elements.itemCondition.value.trim(),
    tags: elements.itemTags.value.split(",").map((tag) => tag.trim()).filter(Boolean),
    notes: elements.itemNotes.value.trim(),
    photos: pendingPhotos,
    updatedAt: new Date().toISOString()
  };

  const existingIndex = state.items.findIndex((entry) => entry.id === itemId);
  if (existingIndex >= 0) {
    state.items[existingIndex] = item;
  } else {
    state.items.unshift(item);
  }

  state.selectedLocationId = item.locationId;
  saveState();
  elements.itemDialog.close();
  render();
}

function deleteItem() {
  const itemId = elements.itemId.value;
  state.items = state.items.filter((item) => item.id !== itemId);
  saveState();
  elements.itemDialog.close();
  render();
}

function openLocationDialog(latLng = null, title = "Add Location") {
  const center = latLng || map?.getCenter();
  elements.locationForm.reset();
  elements.locationId.value = "";
  elements.locationDialogTitle.textContent = title;
  elements.locationLat.value = (center?.lat || 38.9421).toFixed(5);
  elements.locationLng.value = (center?.lng || -92.3279).toFixed(5);
  elements.locationLocked.checked = false;
  elements.locationDialog.showModal();
}

function openEditLocationDialog(locationId) {
  const location = state.locations.find((entry) => entry.id === locationId);
  if (!location) return;

  elements.locationForm.reset();
  elements.locationDialogTitle.textContent = "Edit Location Label";
  elements.locationId.value = location.id;
  elements.locationName.value = location.name || "";
  elements.locationCode.value = location.code || "";
  elements.locationLat.value = Number(location.lat || 38.9421).toFixed(5);
  elements.locationLng.value = Number(location.lng || -92.3279).toFixed(5);
  elements.locationNotes.value = location.notes || "";
  elements.locationLocked.checked = Boolean(location.locked);
  elements.locationDialog.showModal();
}

function saveLocation() {
  if (!elements.locationForm.reportValidity()) return;
  const locationId = elements.locationId.value;
  const name = elements.locationName.value.trim();
  const code = elements.locationCode.value.trim() || name.split(/\s+/).map((word) => word[0]).join("").slice(0, 5).toUpperCase();
  const location = {
    id: locationId || `location-${Date.now()}`,
    name,
    code,
    lat: Number(elements.locationLat.value),
    lng: Number(elements.locationLng.value),
    locked: elements.locationLocked.checked,
    notes: elements.locationNotes.value.trim()
  };

  const existingIndex = state.locations.findIndex((entry) => entry.id === locationId);
  if (existingIndex >= 0) {
    state.locations[existingIndex] = location;
  } else {
    state.locations.push(location);
  }

  saveState();
  selectLocation(location.id);
  elements.locationDialog.close();
}

async function handlePhotoFiles(files) {
  const readers = [...files].map((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  });
  pendingPhotos.push(...await Promise.all(readers));
  renderPhotoPreview();
}

function renderPhotoPreview() {
  elements.photoPreview.innerHTML = pendingPhotos
    .map((photo) => `<img src="${photo}" alt="Selected inventory upload">`)
    .join("");
}

function exportInventory() {
  const rows = state.items.map((item) => {
    const location = state.locations.find((entry) => entry.id === item.locationId);
    return {
      name: item.name,
      category: item.category,
      location: location?.name || "",
      latitude: location?.lat || "",
      longitude: location?.lng || "",
      room: item.room,
      quantity: item.quantity,
      status: formatStatus(item.status),
      condition: item.condition,
      tags: (item.tags || []).join("; "),
      notes: item.notes,
      updatedAt: item.updatedAt
    };
  });
  const csv = toCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "mizzou-campus-inventory.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function backupData() {
  const backup = {
    ...state,
    exportedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStamp = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `mizzou-campus-inventory-backup-${dateStamp}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function restoreData(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const restored = normalizeState(JSON.parse(reader.result));
      if (!Array.isArray(restored.locations) || !Array.isArray(restored.items)) {
        throw new Error("Missing inventory data");
      }
      state = restored;
      saveState();
      render();
      window.alert("Inventory data restored.");
    } catch {
      window.alert("That file does not look like a Mizzou inventory backup.");
    } finally {
      elements.restoreFile.value = "";
    }
  };
  reader.readAsText(file);
}

function toCsv(rows) {
  const headers = Object.keys(rows[0] || { name: "" });
  const body = rows.map((row) => headers.map((key) => csvCell(row[key])).join(","));
  return [headers.join(","), ...body].join("\n");
}

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function formatStatus(status) {
  const labels = {
    available: "Available",
    "in-use": "In use",
    loaned: "Loaned",
    attention: "Needs attention",
    missing: "Missing"
  };
  return labels[status] || status;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

elements.searchInput.addEventListener("input", (event) => updateSearch(event.target.value));
elements.topSearchInput.addEventListener("input", (event) => updateSearch(event.target.value));
elements.addItemButton.addEventListener("click", () => openItemDialog());
elements.addHereButton.addEventListener("click", () => openItemDialog());
elements.addLocationButton.addEventListener("click", () => openLocationDialog());
elements.exportButton.addEventListener("click", exportInventory);
elements.backupButton.addEventListener("click", backupData);
elements.restoreButton.addEventListener("click", () => elements.restoreFile.click());
elements.restoreFile.addEventListener("change", (event) => restoreData(event.target.files[0]));
elements.addTaskButton.addEventListener("click", addTask);
elements.openTaskListButton.addEventListener("click", () => {
  renderTasks();
  elements.taskDialog.showModal();
});
elements.taskInput.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  addTask();
});
elements.fitMapButton.addEventListener("click", () => {
  if (map) {
    map.fitBounds(SOUTHWEST_BOUNDS, { padding: [24, 24] });
  } else {
    fallbackDropMode = false;
    renderFallbackMap();
  }
});
elements.dropLocationButton.addEventListener("click", () => {
  if (map) {
    openLocationDialog(null, "Add Map Location");
    return;
  }
  fallbackDropMode = !fallbackDropMode;
  renderFallbackMap();
});
elements.dropLocationButton.addEventListener("dragstart", (event) => {
  event.dataTransfer.setData("text/plain", "new-location");
  event.dataTransfer.effectAllowed = "copy";
  elements.campusMap.classList.add("drop-ready");
});
elements.dropLocationButton.addEventListener("dragend", () => {
  elements.campusMap.classList.remove("drop-ready");
});
elements.saveItemButton.addEventListener("click", saveItem);
elements.deleteItemButton.addEventListener("click", deleteItem);
elements.saveLocationButton.addEventListener("click", saveLocation);
elements.itemPhotos.addEventListener("change", (event) => handlePhotoFiles(event.target.files));

document.querySelectorAll("[data-close-dialog]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(`#${button.dataset.closeDialog}`)?.close();
  });
});

initMap();
render();
if (shouldSaveInitialState) {
  saveState();
}
updateSaveStatus();
