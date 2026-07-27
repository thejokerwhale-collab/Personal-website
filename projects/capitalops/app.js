const exceptions = [
  {
    id: "EX-01",
    category: "accounting",
    severity: "high",
    title: "Duplicate restoration invoice",
    location: "Juniper Hall",
    amount: 42800,
    summary:
      "Invoice CR-8841 was posted twice from separate upload batches, overstating repairs expense and accounts payable.",
    evidence: [
      ["Source", "AP invoice detail"],
      ["Matching key", "Vendor + invoice + amount"],
      ["Financial effect", "$42,800 overstatement"],
    ],
    analysis:
      "The two postings share the same vendor, invoice number, service date, and amount. One liability and the related repairs expense should be reversed. The duplicate was not identified because the second upload bypassed the batch duplicate check.",
    control:
      "Block duplicate vendor-invoice combinations at upload and require AP review of overridden matches.",
    entry: [
      { account: "Accounts payable", debit: 42800, credit: 0 },
      { account: "Repairs and maintenance expense", debit: 0, credit: 42800 },
    ],
    incomeImpact: 42800,
    assetImpact: 0,
  },
  {
    id: "EX-02",
    category: "accounting",
    severity: "high",
    title: "Qualifying improvement expensed",
    location: "Maple Court",
    amount: 64500,
    summary:
      "A building-access system that increased service capacity was charged to repairs expense instead of building improvements.",
    evidence: [
      ["Source", "Invoice + project scope"],
      ["Policy threshold", "$5,000"],
      ["Useful life", "10 years"],
    ],
    analysis:
      "The access system exceeds the capitalization threshold and adds functionality across the property. It meets the case policy for a building improvement. Reclassify the cost and begin straight-line depreciation when placed in service.",
    control:
      "Route invoices above $5,000 with improvement-related descriptions to a monthly capitalization review.",
    entry: [
      { account: "Building improvements", debit: 64500, credit: 0 },
      { account: "Repairs and maintenance expense", debit: 0, credit: 64500 },
    ],
    incomeImpact: 64500,
    assetImpact: 64500,
  },
  {
    id: "EX-03",
    category: "accounting",
    severity: "high",
    title: "Disposed equipment remains active",
    location: "Summit House",
    amount: 18600,
    summary:
      "Laundry equipment removed on April 8 remains in the asset register with a $70,000 cost and $18,600 net book value.",
    evidence: [
      ["Source", "Disposal ticket DS-219"],
      ["Asset cost", "$70,000"],
      ["Accum. depreciation", "$51,400"],
    ],
    analysis:
      "The disposal ticket and replacement installation confirm that control of the equipment ended on April 8. Remove the asset and accumulated depreciation from the ledger and recognize the remaining net book value as a loss.",
    control:
      "Require facilities to send completed disposal tickets to accounting before the monthly fixed-asset close.",
    entry: [
      { account: "Accumulated depreciation", debit: 51400, credit: 0 },
      { account: "Loss on asset disposal", debit: 18600, credit: 0 },
      { account: "Equipment", debit: 0, credit: 70000 },
    ],
    incomeImpact: -18600,
    assetImpact: -18600,
  },
  {
    id: "EX-04",
    category: "accounting",
    severity: "medium",
    title: "April depreciation omitted",
    location: "Portfolio-wide",
    amount: 21300,
    summary:
      "The final April depreciation batch excluded 34 assets placed in service during March.",
    evidence: [
      ["Source", "Depreciation roll-forward"],
      ["Assets affected", "34"],
      ["April shortfall", "$21,300"],
    ],
    analysis:
      "The assets were available for use before April 1 and should be included in the monthly depreciation run. The omission understates accumulated depreciation and April operating expense.",
    control:
      "Reconcile placed-in-service additions to the depreciation batch population before posting.",
    entry: [
      { account: "Depreciation expense", debit: 21300, credit: 0 },
      { account: "Accumulated depreciation", debit: 0, credit: 21300 },
    ],
    incomeImpact: -21300,
    assetImpact: -21300,
  },
  {
    id: "EX-05",
    category: "accounting",
    severity: "medium",
    title: "Useful life mapping error",
    location: "Riverbend Flats",
    amount: 7350,
    summary:
      "Security equipment was assigned a 15-year building-improvement life rather than the approved 5-year equipment life.",
    evidence: [
      ["Source", "Asset class mapping"],
      ["Recorded life", "15 years"],
      ["Approved life", "5 years"],
    ],
    analysis:
      "The assets are removable security equipment and belong to the five-year equipment class. Correcting the useful life results in $7,350 of catch-up depreciation through April.",
    control:
      "Limit manual useful-life overrides and require controller approval for asset-class changes.",
    entry: [
      { account: "Depreciation expense", debit: 7350, credit: 0 },
      { account: "Accumulated depreciation", debit: 0, credit: 7350 },
    ],
    incomeImpact: -7350,
    assetImpact: -7350,
  },
  {
    id: "EX-06",
    category: "control",
    severity: "low",
    title: "Capital commitment lacks approval",
    location: "Oakline Commons",
    amount: 1280000,
    summary:
      "A roof replacement commitment above $1 million has operations approval but no attached finance or executive approval.",
    evidence: [
      ["Source", "Capital request CAP-117"],
      ["Commitment", "$1.28 million"],
      ["Missing", "Finance + executive"],
    ],
    analysis:
      "No April journal entry is required because construction has not started and no invoice has been received. However, the commitment violates the approval matrix and exposes the organization to unauthorized capital spending.",
    control:
      "Prevent purchase-order release for commitments above $1 million until finance and executive approvals are attached.",
    entry: [],
    incomeImpact: 0,
    assetImpact: 0,
  },
];

const budgetProjects = [
  { name: "Oakline roof", budget: 1280, forecast: 1280 },
  { name: "Juniper restoration", budget: 920, forecast: 1015 },
  { name: "Maple access", budget: 680, forecast: 664 },
  { name: "Summit laundry", budget: 540, forecast: 518 },
  { name: "Riverbend security", budget: 410, forecast: 438 },
  { name: "Portfolio signage", budget: 550, forecast: 465 },
];

const assetRecords = [
  ["FA-10482", "Building access system", "Maple Court", "04/18/2026", 64500, 64500, "Review"],
  ["FA-09317", "Laundry equipment", "Summit House", "08/01/2022", 70000, 18600, "Review"],
  ["FA-10121", "Security camera array", "Riverbend Flats", "01/12/2026", 88200, 83300, "Review"],
  ["FA-10122", "Door controller package", "Riverbend Flats", "01/12/2026", 44100, 41650, "Review"],
  ["FA-09744", "Boiler replacement", "Juniper Hall", "10/02/2024", 318400, 290540, "Active"],
  ["FA-08908", "Passenger elevator modernization", "Oakline Commons", "06/14/2021", 624000, 503100, "Active"],
  ["FA-09881", "Common-area furniture", "Cedar House", "05/20/2025", 93600, 78000, "Active"],
  ["FA-09402", "Fire alarm control panel", "Willow Hall", "03/08/2023", 126500, 107525, "Active"],
  ["FA-10004", "Network access equipment", "Aspen Place", "10/16/2025", 73600, 62560, "Active"],
  ["FA-08774", "HVAC chiller", "Stonebridge Hall", "07/01/2020", 448000, 336000, "Active"],
  ["FA-09944", "Fitness center equipment", "Parkview House", "08/22/2025", 112400, 89920, "Active"],
  ["FA-09610", "Emergency generator", "Linden Hall", "01/10/2024", 184000, 162533, "Active"],
];

const state = {
  clearedIds: new Set(),
  selectedId: exceptions[0].id,
  filter: "all",
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

function escapeCsv(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function downloadCsv(filename, rows) {
  const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function renderBudgetChart() {
  const chart = document.querySelector("#budgetChart");
  const maxValue = Math.max(...budgetProjects.flatMap((project) => [project.budget, project.forecast]));

  chart.innerHTML = budgetProjects
    .map((project) => {
      const budgetWidth = (project.budget / maxValue) * 100;
      const forecastWidth = (project.forecast / maxValue) * 100;
      const isOver = project.forecast > project.budget;
      return `
        <div class="budget-row">
          <span class="budget-label" title="${project.name}">${project.name}</span>
          <div class="budget-bars" aria-label="${project.name}: ${formatCurrency(project.budget * 1000)} budget, ${formatCurrency(project.forecast * 1000)} forecast">
            <span class="budget-bar" style="width:${budgetWidth}%"></span>
            <span class="forecast-bar ${isOver ? "over" : ""}" style="width:${forecastWidth}%"></span>
          </div>
          <span class="budget-value">${isOver ? "+" : ""}${formatCurrency((project.forecast - project.budget) * 1000)}</span>
        </div>
      `;
    })
    .join("");
}

function filteredExceptions() {
  if (state.filter === "all") return exceptions;
  return exceptions.filter((item) => item.category === state.filter);
}

function renderExceptionList() {
  const list = document.querySelector("#exceptionList");
  const items = filteredExceptions();

  if (!items.some((item) => item.id === state.selectedId)) {
    state.selectedId = items[0]?.id ?? exceptions[0].id;
  }

  list.innerHTML = items
    .map(
      (item) => `
        <button
          class="exception-item ${state.selectedId === item.id ? "active" : ""} ${state.clearedIds.has(item.id) ? "cleared" : ""}"
          data-exception-id="${item.id}"
          type="button"
        >
          <span class="exception-number">${item.id.slice(-2)}</span>
          <span class="exception-item-copy">
            <strong>${item.title}</strong>
            <span>${item.location} · ${formatCurrency(item.amount)}</span>
          </span>
          <span class="severity-badge ${item.severity}">${state.clearedIds.has(item.id) ? "Cleared" : item.severity}</span>
        </button>
      `,
    )
    .join("");

  list.querySelectorAll("[data-exception-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedId = button.dataset.exceptionId;
      renderExceptionList();
      renderExceptionDetail();
    });
  });
}

function renderEntryPreview(entry) {
  if (!entry.length) {
    return `<p>No April entry proposed. Treat as a control deficiency and block the commitment.</p>`;
  }

  return `
    <div class="entry-preview">
      ${entry
        .map(
          (line) => `
            <p>
              <span>${line.account}</span>
              <span class="debit">${line.debit ? `Dr ${formatCurrency(line.debit)}` : ""}</span>
              <span class="credit">${line.credit ? `Cr ${formatCurrency(line.credit)}` : ""}</span>
            </p>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderExceptionDetail() {
  const detail = document.querySelector("#exceptionDetail");
  const item = exceptions.find((exception) => exception.id === state.selectedId) ?? exceptions[0];
  const isCleared = state.clearedIds.has(item.id);

  detail.innerHTML = `
    <div class="detail-topline">
      <span class="detail-id">${item.id} · ${item.category} workpaper</span>
      <span class="detail-status ${isCleared ? "cleared" : ""}">${isCleared ? "Cleared" : "Open review"}</span>
    </div>
    <h3>${item.title}</h3>
    <p class="detail-lede">${item.summary}</p>
    <div class="evidence-grid">
      ${item.evidence
        .map(
          ([label, value]) => `
            <div>
              <span>${label}</span>
              <strong>${value}</strong>
            </div>
          `,
        )
        .join("")}
    </div>
    <div class="analysis-block">
      <span class="detail-section-label">Accounting analysis</span>
      <p>${item.analysis}</p>
    </div>
    <div class="analysis-block">
      <span class="detail-section-label">Proposed treatment</span>
      ${renderEntryPreview(item.entry)}
    </div>
    <div class="analysis-block">
      <span class="detail-section-label">Preventive control</span>
      <p>${item.control}</p>
    </div>
    <div class="detail-actions">
      <p>Reviewer action updates the close progress and controller memo.</p>
      <button class="clear-button ${isCleared ? "cleared" : ""}" id="clearExceptionButton" type="button">
        ${isCleared ? "Reopen exception" : item.entry.length ? "Approve proposed treatment" : "Acknowledge control issue"}
      </button>
    </div>
  `;

  document.querySelector("#clearExceptionButton").addEventListener("click", () => {
    if (state.clearedIds.has(item.id)) {
      state.clearedIds.delete(item.id);
    } else {
      state.clearedIds.add(item.id);
    }
    renderExceptionList();
    renderExceptionDetail();
    updateDashboard();
  });
}

function updateDashboard() {
  const openItems = exceptions.filter((item) => !state.clearedIds.has(item.id));
  const openAccounting = openItems.filter((item) => item.category === "accounting");
  const openControl = openItems.filter((item) => item.category === "control");
  const clearedAccounting = exceptions.filter(
    (item) => item.category === "accounting" && state.clearedIds.has(item.id),
  );

  const grossCorrections = openAccounting.reduce((sum, item) => sum + item.amount, 0);
  const incomeImpact = openAccounting.reduce((sum, item) => sum + item.incomeImpact, 0);
  const progress = 50 + Math.round((state.clearedIds.size / exceptions.length) * 50);

  document.querySelector("#openExceptionMetric").textContent = openItems.length;
  document.querySelector("#tabExceptionCount").textContent = openItems.length;
  document.querySelector("#riskRingCount").textContent = openItems.length;
  document.querySelector("#riskRing").setAttribute("aria-label", `${openItems.length} open exceptions`);
  document.querySelector("#riskRing").style.setProperty("--progress", `${(openItems.length / exceptions.length) * 100}%`);
  document.querySelector("#openExceptionCaption").textContent =
    `${openAccounting.length} accounting · ${openControl.length} control`;
  document.querySelector("#grossCorrectionMetric").textContent =
    grossCorrections ? `$${(grossCorrections / 1000).toFixed(1)}K` : "$0";
  document.querySelector("#incomeImpactMetric").textContent =
    incomeImpact >= 0
      ? `+$${(incomeImpact / 1000).toFixed(1)}K`
      : `-$${(Math.abs(incomeImpact) / 1000).toFixed(1)}K`;
  document.querySelector("#highRiskCount").textContent = openItems.filter((item) => item.severity === "high").length;
  document.querySelector("#mediumRiskCount").textContent = openItems.filter((item) => item.severity === "medium").length;
  document.querySelector("#lowRiskCount").textContent = openItems.filter((item) => item.severity === "low").length;
  document.querySelector("#workflowPercent").textContent = `${progress}%`;
  document.querySelector("#workflowProgressBar").style.width = `${progress}%`;

  const reviewStep = document.querySelector("#workflowReviewStep");
  const postStep = document.querySelector("#workflowPostStep");
  reviewStep.classList.toggle("complete", openItems.length === 0);
  postStep.classList.toggle("complete", openItems.length === 0);

  const closeStatus = document.querySelector(".close-status");
  const closeStatusText = document.querySelector("#closeStatusText");
  const metricState = document.querySelector("#openMetricState");
  if (openItems.length === 0) {
    closeStatus.classList.add("complete");
    closeStatusText.textContent = "Close review complete";
    metricState.textContent = "Cleared";
    metricState.className = "metric-state good";
  } else {
    closeStatus.classList.remove("complete");
    closeStatusText.textContent = "Close review in progress";
    metricState.textContent = "Review";
    metricState.className = "metric-state warning";
  }

  const clearedImpact = clearedAccounting.reduce((sum, item) => sum + item.incomeImpact, 0);
  document.querySelector("#memoConclusion").textContent =
    openItems.length === 0
      ? "All six identified items have been reviewed. The five accounting corrections are ready for posting, and the $1.28 million capital commitment should remain blocked until required approvals are attached."
      : `${openItems.length} of six identified items remain open. Approved accounting treatments currently represent ${formatCurrency(clearedImpact)} of the final $60,050 pre-tax income improvement.`;
  document.querySelector("#memoNextAction").textContent =
    openItems.length === 0
      ? "Post the five entries, obtain the missing capital approvals, and retain the completed exception log with the April close binder."
      : `Complete review of the remaining ${openItems.length} item${openItems.length === 1 ? "" : "s"} before releasing the April financial package.`;
}

function renderAssetTable(query = "") {
  const body = document.querySelector("#assetTableBody");
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = assetRecords.filter((record) =>
    record.some((value) => String(value).toLowerCase().includes(normalizedQuery)),
  );

  body.innerHTML = filtered.length
    ? filtered
        .map(
          ([id, description, property, serviceDate, cost, nbv, status]) => `
            <tr>
              <td>${id}</td>
              <td>${description}</td>
              <td>${property}</td>
              <td>${serviceDate}</td>
              <td>${formatCurrency(cost)}</td>
              <td>${formatCurrency(nbv)}</td>
              <td><span class="table-status ${status === "Review" ? "review" : ""}">${status}</span></td>
            </tr>
          `,
        )
        .join("")
    : `<tr><td colspan="7">No assets match that search.</td></tr>`;
}

function renderJournalEntries() {
  const journalList = document.querySelector("#journalList");
  const accountingExceptions = exceptions.filter((item) => item.entry.length);

  journalList.innerHTML = accountingExceptions
    .map((item, index) => {
      const totalDebit = item.entry.reduce((sum, line) => sum + line.debit, 0);
      const totalCredit = item.entry.reduce((sum, line) => sum + line.credit, 0);
      return `
        <article class="journal-card">
          <div class="journal-ref">AJE-${String(index + 1).padStart(2, "0")}<br>${item.id}</div>
          <div class="journal-copy">
            <strong>${item.title}</strong>
            <span>${item.location} · ${item.control}</span>
          </div>
          <div class="journal-amounts">
            <p><span>Total debits</span><strong>${formatCurrency(totalDebit)}</strong></p>
            <p><span>Total credits</span><strong>${formatCurrency(totalCredit)}</strong></p>
          </div>
        </article>
      `;
    })
    .join("");
}

function openPanel(panelId) {
  document.querySelectorAll(".dashboard-panel").forEach((panel) => {
    const isActive = panel.id === panelId;
    panel.classList.toggle("active", isActive);
    panel.hidden = !isActive;
  });

  document.querySelectorAll(".tab-button").forEach((button) => {
    const isActive = button.dataset.panel === panelId;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
}

document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", () => openPanel(button.dataset.panel));
});

document.querySelectorAll("[data-open-panel]").forEach((button) => {
  button.addEventListener("click", () => openPanel(button.dataset.openPanel));
});

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    state.filter = button.dataset.filter;
    document.querySelectorAll(".filter-button").forEach((filterButton) => {
      filterButton.classList.toggle("active", filterButton === button);
    });
    renderExceptionList();
    renderExceptionDetail();
  });
});

document.querySelector("#assetSearch").addEventListener("input", (event) => {
  renderAssetTable(event.target.value);
});

document.querySelector("#resetCaseButton").addEventListener("click", () => {
  state.clearedIds.clear();
  state.selectedId = exceptions[0].id;
  state.filter = "all";
  document.querySelectorAll(".filter-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === "all");
  });
  renderExceptionList();
  renderExceptionDetail();
  updateDashboard();
  openPanel("overviewPanel");
});

const memoDialog = document.querySelector("#memoDialog");
document.querySelector("#memoButton").addEventListener("click", () => memoDialog.showModal());
document.querySelector("#closeMemoButton").addEventListener("click", () => memoDialog.close());
memoDialog.addEventListener("click", (event) => {
  if (event.target === memoDialog) memoDialog.close();
});

document.querySelector("#downloadCaseButton").addEventListener("click", () => {
  const rows = [
    ["Exception ID", "Category", "Severity", "Title", "Location", "Amount", "Status", "Accounting analysis", "Control recommendation"],
    ...exceptions.map((item) => [
      item.id,
      item.category,
      item.severity,
      item.title,
      item.location,
      item.amount,
      state.clearedIds.has(item.id) ? "Cleared" : "Open",
      item.analysis,
      item.control,
    ]),
  ];
  downloadCsv("capitalops-april-2026-exception-log.csv", rows);
});

document.querySelector("#downloadEntriesButton").addEventListener("click", () => {
  const rows = [["Entry", "Exception", "Account", "Debit", "Credit", "Memo"]];
  exceptions
    .filter((item) => item.entry.length)
    .forEach((item, index) => {
      item.entry.forEach((line) => {
        rows.push([
          `AJE-${String(index + 1).padStart(2, "0")}`,
          item.id,
          line.account,
          line.debit || "",
          line.credit || "",
          item.title,
        ]);
      });
    });
  downloadCsv("capitalops-april-2026-adjusting-entries.csv", rows);
});

renderBudgetChart();
renderExceptionList();
renderExceptionDetail();
renderAssetTable();
renderJournalEntries();
updateDashboard();
