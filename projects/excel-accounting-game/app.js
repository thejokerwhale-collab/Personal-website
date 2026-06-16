const columns = ["A", "B", "C", "D", "E", "F", "G", "H"];

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const cell = (value, role = "data") => ({ value, role });
const currencyCell = (value) => ({ value: money.format(value), role: "currency" });
const numberCell = (value) => ({ value: String(value), role: "number" });

function buildTargets(refs, makeFormula, displays, help) {
  return refs.map((ref, index) => ({
    ref,
    display: displays[index],
    help,
    validate: (formula) => formula === makeFormula(ref, index),
  }));
}

const levels = [
  {
    tab: "Receipts",
    title: "Cash receipts control",
    scenario:
      "The controller needs a fast control total before posting the receipt batch. Use one SUM formula instead of adding the receipts manually.",
    skill: "SUM for control totals",
    coach:
      "Accountants use SUM constantly for tie-outs, roll-forwards, and quick control totals. Select the total cell and use one range reference.",
    shortcut: "Efficiency move: Alt + = inserts AutoSum in Excel when the range is directly above the active cell.",
    objectives: [
      "Select C12.",
      "Enter =SUM(C4:C10) in the formula bar.",
      "Check the answer and confirm the batch total.",
    ],
    hints: [
      "The receipts are in C4 through C10.",
      "The formula starts with =SUM(",
      "Use =SUM(C4:C10).",
    ],
    rows: 14,
    active: "C12",
    tags: ["SUM", "Control total", "Month-end close"],
    cells: {
      A1: cell("CLOSE", "title"),
      B1: cell("Receipts", "title"),
      A3: cell("Date", "header"),
      B3: cell("Customer", "header"),
      C3: cell("Receipt", "header"),
      D3: cell("Method", "header"),
      E3: cell("Invoice", "header"),
      A4: cell("6/3/2026"),
      B4: cell("Apex Health"),
      C4: currencyCell(4820),
      D4: cell("ACH"),
      E4: cell("INV-1048"),
      A5: cell("6/5/2026"),
      B5: cell("Ridge Labs"),
      C5: currencyCell(3110),
      D5: cell("Wire"),
      E5: cell("INV-1052"),
      A6: cell("6/7/2026"),
      B6: cell("Northstar"),
      C6: currencyCell(7250),
      D6: cell("ACH"),
      E6: cell("INV-1059"),
      A7: cell("6/10/2026"),
      B7: cell("Cedar Foods"),
      C7: currencyCell(1840),
      D7: cell("Check"),
      E7: cell("INV-1061"),
      A8: cell("6/11/2026"),
      B8: cell("Summit"),
      C8: currencyCell(5975),
      D8: cell("ACH"),
      E8: cell("INV-1065"),
      A9: cell("6/13/2026"),
      B9: cell("Lakeside LLC"),
      C9: currencyCell(1290),
      D9: cell("Card"),
      E9: cell("INV-1068"),
      A10: cell("6/15/2026"),
      B10: cell("Orchard"),
      C10: currencyCell(2000),
      D10: cell("Wire"),
      E10: cell("INV-1072"),
      B12: cell("Control total", "label"),
      F4: cell("Note", "header"),
      F5: cell("Bank tie-out.", "note"),
    },
    targets: [
      {
        ref: "C12",
        display: money.format(26285),
        help: "C12 should sum the receipt range C4:C10.",
        autoFormula: "=SUM(C4:C10)",
        validate: (formula) => formula === "=SUM(C4:C10)",
      },
    ],
  },
  {
    tab: "Recon",
    title: "Bank reconciliation lookup",
    scenario:
      "Book deposits and bank deposits are listed in different orders. Pull the matching bank amount beside each book deposit and expose anything missing.",
    skill: "XLOOKUP for reconciliation",
    coach:
      "XLOOKUP is faster and less brittle than hunting by eye. Lock lookup and return arrays with dollar signs, then fill the formula down.",
    shortcut: "Efficiency move: write the first formula once, then use Fill Down to copy the relative deposit ID through the column.",
    objectives: [
      "Select C4.",
      "Use XLOOKUP to find A4 in the bank deposit IDs.",
      "Fill the formula down through C9 and check for a missing deposit.",
    ],
    hints: [
      "Lookup value: A4. Lookup array: $E$4:$E$9. Return array: $F$4:$F$9.",
      "Use an if-not-found value of \"Missing\" so the exception is obvious.",
      "Use =XLOOKUP(A4,$E$4:$E$9,$F$4:$F$9,\"Missing\") and Fill Down.",
    ],
    rows: 12,
    active: "C4",
    tags: ["XLOOKUP", "Reconciliation", "Fill down"],
    cells: {
      A1: cell("BANK REC", "title"),
      B1: cell("Book vs. bank", "title"),
      A3: cell("Deposit ID", "header"),
      B3: cell("Book amt", "header"),
      C3: cell("Bank amt", "header"),
      E3: cell("Bank ID", "header"),
      F3: cell("Bank amt", "header"),
      A4: cell("DEP-101"),
      B4: currencyCell(4820),
      A5: cell("DEP-102"),
      B5: currencyCell(3110),
      A6: cell("DEP-103"),
      B6: currencyCell(7250),
      A7: cell("DEP-104"),
      B7: currencyCell(1840),
      A8: cell("DEP-105"),
      B8: currencyCell(5975),
      A9: cell("DEP-106"),
      B9: currencyCell(1290),
      E4: cell("DEP-101"),
      F4: currencyCell(4820),
      E5: cell("DEP-102"),
      F5: currencyCell(3110),
      E6: cell("DEP-104"),
      F6: currencyCell(1840),
      E7: cell("DEP-105"),
      F7: currencyCell(5975),
      E8: cell("DEP-106"),
      F8: currencyCell(1290),
      E9: cell("DEP-107"),
      F9: currencyCell(880),
    },
    targets: buildTargets(
      ["C4", "C5", "C6", "C7", "C8", "C9"],
      (ref) => {
        const row = ref.match(/\d+/)[0];
        return `=XLOOKUP(A${row},$E$4:$E$9,$F$4:$F$9,"MISSING")`;
      },
      [4820, 3110, "Missing", 1840, 5975, 1290].map((value) =>
        typeof value === "number" ? money.format(value) : value
      ),
      "Use XLOOKUP with locked bank ranges and a Missing exception."
    ),
  },
  {
    tab: "Aging",
    title: "A/R aging days",
    scenario:
      "Before building the aging buckets, calculate how many days each invoice has been open as of the reporting date.",
    skill: "Absolute references",
    coach:
      "The as-of date should stay fixed while each invoice date moves row by row. That is exactly when absolute references save time.",
    shortcut: "Efficiency move: use $H$2 once, fill down, and let only the invoice date row change.",
    objectives: [
      "Select D4.",
      "Subtract the invoice date from the fixed as-of date in H2.",
      "Fill the formula down through D9.",
    ],
    hints: [
      "The as-of date is in H2 and should not move when copied.",
      "The invoice date is in C4 and should move to C5, C6, and so on.",
      "Use =$H$2-C4 and Fill Down.",
    ],
    rows: 12,
    active: "D4",
    tags: ["Absolute refs", "A/R aging", "Fill down"],
    cells: {
      A1: cell("A/R AGING", "title"),
      H1: cell("As of", "header"),
      H2: cell("6/30/2026"),
      A3: cell("Customer", "header"),
      B3: cell("Invoice", "header"),
      C3: cell("Invoice date", "header"),
      D3: cell("Days open", "header"),
      E3: cell("Balance", "header"),
      A4: cell("Apex Health"),
      B4: cell("INV-1048"),
      C4: cell("5/2/2026"),
      E4: currencyCell(4820),
      A5: cell("Ridge Labs"),
      B5: cell("INV-1052"),
      C5: cell("6/11/2026"),
      E5: currencyCell(3110),
      A6: cell("Northstar"),
      B6: cell("INV-1032"),
      C6: cell("4/18/2026"),
      E6: currencyCell(7250),
      A7: cell("Cedar Foods"),
      B7: cell("INV-1057"),
      C7: cell("5/30/2026"),
      E7: currencyCell(1840),
      A8: cell("Summit"),
      B8: cell("INV-1019"),
      C8: cell("3/31/2026"),
      E8: currencyCell(5975),
      A9: cell("Lakeside LLC"),
      B9: cell("INV-1070"),
      C9: cell("6/25/2026"),
      E9: currencyCell(1290),
    },
    targets: buildTargets(
      ["D4", "D5", "D6", "D7", "D8", "D9"],
      (ref) => {
        const row = ref.match(/\d+/)[0];
        return `=$H$2-C${row}`;
      },
      ["59", "19", "73", "31", "91", "5"],
      "Keep H2 absolute and let the invoice date move by row."
    ),
  },
  {
    tab: "Variance",
    title: "Budget variance schedule",
    scenario:
      "Finance wants a clean variance column for the monthly close package. Build it from the actual and budget columns.",
    skill: "Variance formulas",
    coach:
      "Keep the sign meaningful: actual minus budget shows unfavorable overspend as positive for expense accounts in this schedule.",
    shortcut: "Efficiency move: formula first, formatting second. Get the variance logic right before styling the report.",
    objectives: [
      "Select D4.",
      "Calculate Actual minus Budget.",
      "Fill the formula down through D9.",
    ],
    hints: [
      "Budget is in column B and actual is in column C.",
      "For row 4, calculate C4 minus B4.",
      "Use =C4-B4 and Fill Down.",
    ],
    rows: 12,
    active: "D4",
    tags: ["Variance", "Actuals", "Budget"],
    cells: {
      A1: cell("VARIANCE", "title"),
      A3: cell("Account", "header"),
      B3: cell("Budget", "header"),
      C3: cell("Actual", "header"),
      D3: cell("Variance", "header"),
      A4: cell("Payroll"),
      B4: currencyCell(185000),
      C4: currencyCell(191250),
      A5: cell("Consulting"),
      B5: currencyCell(42000),
      C5: currencyCell(36500),
      A6: cell("Cloud"),
      B6: currencyCell(28500),
      C6: currencyCell(33100),
      A7: cell("Insurance"),
      B7: currencyCell(12500),
      C7: currencyCell(12500),
      A8: cell("Travel"),
      B8: currencyCell(18000),
      C8: currencyCell(24600),
      A9: cell("Supplies"),
      B9: currencyCell(9200),
      C9: currencyCell(8100),
      F4: cell("Rule", "header"),
      F5: cell("Positive = over.", "note"),
    },
    targets: buildTargets(
      ["D4", "D5", "D6", "D7", "D8", "D9"],
      (ref) => {
        const row = ref.match(/\d+/)[0];
        return `=C${row}-B${row}`;
      },
      [6250, -5500, 4600, 0, 6600, -1100].map((value) => money.format(value)),
      "Use Actual minus Budget so the sign tells the accounting story."
    ),
  },
  {
    tab: "Review",
    title: "Materiality review flags",
    scenario:
      "The manager only wants to review accounts over the materiality threshold. Use a logical formula so the review list is automatic.",
    skill: "IF with ABS",
    coach:
      "ABS turns both favorable and unfavorable variances into comparable magnitude. Pair it with IF to create fast review flags.",
    shortcut: "Efficiency move: lock the threshold cell, then fill down so every row uses the same materiality amount.",
    objectives: [
      "Select E4.",
      "Flag any absolute variance greater than the threshold in H2.",
      "Fill the formula down through E9.",
    ],
    hints: [
      "Use ABS because both positive and negative variances can matter.",
      "Lock H2 so the threshold does not move when copied.",
      "Use =IF(ABS(D4)>$H$2,\"Review\",\"OK\") and Fill Down.",
    ],
    rows: 12,
    active: "E4",
    tags: ["IF", "ABS", "Materiality"],
    cells: {
      A1: cell("REVIEW", "title"),
      H1: cell("Threshold", "header"),
      H2: currencyCell(5000),
      A3: cell("Account", "header"),
      B3: cell("Budget", "header"),
      C3: cell("Actual", "header"),
      D3: cell("Variance", "header"),
      E3: cell("Review flag", "header"),
      A4: cell("Payroll"),
      B4: currencyCell(185000),
      C4: currencyCell(191250),
      D4: currencyCell(6250),
      A5: cell("Consulting"),
      B5: currencyCell(42000),
      C5: currencyCell(36500),
      D5: currencyCell(-5500),
      A6: cell("Cloud"),
      B6: currencyCell(28500),
      C6: currencyCell(33100),
      D6: currencyCell(4600),
      A7: cell("Insurance"),
      B7: currencyCell(12500),
      C7: currencyCell(12500),
      D7: currencyCell(0),
      A8: cell("Travel"),
      B8: currencyCell(18000),
      C8: currencyCell(24600),
      D8: currencyCell(6600),
      A9: cell("Supplies"),
      B9: currencyCell(9200),
      C9: currencyCell(8100),
      D9: currencyCell(-1100),
    },
    targets: buildTargets(
      ["E4", "E5", "E6", "E7", "E8", "E9"],
      (ref) => {
        const row = ref.match(/\d+/)[0];
        return `=IF(ABS(D${row})>$H$2,"REVIEW","OK")`;
      },
      ["Review", "Review", "OK", "OK", "Review", "OK"],
      "Use ABS around the variance and lock the threshold."
    ),
  },
  {
    tab: "Depreciation",
    title: "Straight-line depreciation",
    scenario:
      "Build the annual depreciation amount for a new fixed asset schedule without hard-coding the answer.",
    skill: "Model drivers",
    coach:
      "Good accounting models point formulas back to driver cells. When cost, salvage, or useful life changes, the schedule should update automatically.",
    shortcut: "Efficiency move: put assumptions in driver cells, reference them absolutely, and avoid typing the same number into every period.",
    objectives: [
      "Select B10.",
      "Calculate cost less salvage divided by useful life.",
      "Fill the formula down through B14.",
    ],
    hints: [
      "Cost is in B4, salvage is in B5, and useful life is in B6.",
      "All three driver cells should stay fixed when copied.",
      "Use =($B$4-$B$5)/$B$6 and Fill Down.",
    ],
    rows: 16,
    active: "B10",
    tags: ["Depreciation", "Driver cells", "Absolute refs"],
    cells: {
      A1: cell("ASSETS", "title"),
      A3: cell("Asset", "header"),
      B3: cell("Equipment"),
      A4: cell("Cost", "label"),
      B4: currencyCell(135000),
      A5: cell("Salvage", "label"),
      B5: currencyCell(15000),
      A6: cell("Useful life", "label"),
      B6: numberCell(5),
      C6: cell("years"),
      A9: cell("Year", "header"),
      B9: cell("Dep. exp.", "header"),
      A10: numberCell(2026),
      A11: numberCell(2027),
      A12: numberCell(2028),
      A13: numberCell(2029),
      A14: numberCell(2030),
      E4: cell("Modeling note", "header"),
      E5: cell("No hard-coding.", "note"),
    },
    targets: buildTargets(
      ["B10", "B11", "B12", "B13", "B14"],
      () => "=($B$4-$B$5)/$B$6",
      [24000, 24000, 24000, 24000, 24000].map((value) => money.format(value)),
      "Reference the cost, salvage, and life assumptions as fixed model drivers."
    ),
  },
  {
    tab: "Accruals",
    title: "Unposted invoice accrual",
    scenario:
      "AP has a mixed invoice dump. Build an accrual total for one vendor using criteria instead of filtering and adding by hand.",
    skill: "SUMIFS for accruals",
    coach:
      "SUMIFS is one of the fastest ways to turn detail into accounting support. Lock the data ranges and point the criteria to the assumption cells.",
    shortcut: "Efficiency move: use criteria cells for the vendor and status so the accrual can be reviewed and changed without editing the formula.",
    objectives: [
      "Select H5.",
      "Sum the amount column for Atlas Supply only.",
      "Include only invoices with Unposted status.",
    ],
    hints: [
      "Amounts are in E4:E10, vendors are in A4:A10, and statuses are in D4:D10.",
      "The vendor criterion is in H2. The status criterion should be \"Unposted\".",
      "Use =SUMIFS($E$4:$E$10,$A$4:$A$10,$H$2,$D$4:$D$10,\"Unposted\").",
    ],
    rows: 12,
    active: "H5",
    tags: ["SUMIFS", "Accruals", "Criteria"],
    cells: {
      A1: cell("ACCRUALS", "title"),
      A3: cell("Vendor", "header"),
      B3: cell("Invoice", "header"),
      C3: cell("Service date", "header"),
      D3: cell("Status", "header"),
      E3: cell("Amount", "header"),
      A4: cell("Atlas Supply"),
      B4: cell("B-3301"),
      C4: cell("6/27/2026"),
      D4: cell("Unposted"),
      E4: currencyCell(1240),
      A5: cell("Metro Rent"),
      B5: cell("R-4480"),
      C5: cell("6/30/2026"),
      D5: cell("Posted"),
      E5: currencyCell(3200),
      A6: cell("Atlas Supply"),
      B6: cell("B-3294"),
      C6: cell("6/18/2026"),
      D6: cell("Posted"),
      E6: currencyCell(775),
      A7: cell("Nova Tel"),
      B7: cell("N-7719"),
      C7: cell("6/29/2026"),
      D7: cell("Unposted"),
      E7: currencyCell(680),
      A8: cell("Atlas Supply"),
      B8: cell("B-3315"),
      C8: cell("6/30/2026"),
      D8: cell("Unposted"),
      E8: currencyCell(980),
      A9: cell("Bright Clean"),
      B9: cell("C-1191"),
      C9: cell("6/26/2026"),
      D9: cell("Unposted"),
      E9: currencyCell(450),
      A10: cell("Atlas Supply"),
      B10: cell("B-3320"),
      C10: cell("7/1/2026"),
      D10: cell("Held"),
      E10: currencyCell(620),
      G1: cell("Criteria", "header"),
      G2: cell("Vendor", "label"),
      H2: cell("Atlas Supply"),
      G4: cell("Accrual", "label"),
    },
    targets: [
      {
        ref: "H5",
        display: money.format(2220),
        help: "H5 should sum only Atlas Supply rows with Unposted status.",
        validate: (formula) =>
          formula === '=SUMIFS($E$4:$E$10,$A$4:$A$10,$H$2,$D$4:$D$10,"UNPOSTED")',
      },
    ],
  },
  {
    tab: "Prepaids",
    title: "Prepaid amortization",
    scenario:
      "The prepaid schedule needs a monthly expense amount for each contract. Build the formula once and fill it down.",
    skill: "Monthly amortization",
    coach:
      "A clean prepaid schedule avoids hard-coded monthly expenses. Divide the total prepaid cost by the amortization months, then fill down.",
    shortcut: "Efficiency move: keep the formula row-relative here because each prepaid line has its own cost and month count.",
    objectives: [
      "Select D4.",
      "Divide prepaid cost by the number of months.",
      "Fill the formula down through D8.",
    ],
    hints: [
      "Cost is in column B and months are in column C.",
      "For row 4, calculate B4 divided by C4.",
      "Use =B4/C4 and Fill Down.",
    ],
    rows: 11,
    active: "D4",
    tags: ["Prepaids", "Amortization", "Fill down"],
    cells: {
      A1: cell("PREPAIDS", "title"),
      A3: cell("Item", "header"),
      B3: cell("Cost", "header"),
      C3: cell("Months", "header"),
      D3: cell("Monthly exp.", "header"),
      A4: cell("Insurance"),
      B4: currencyCell(24000),
      C4: numberCell(12),
      A5: cell("Software"),
      B5: currencyCell(18000),
      C5: numberCell(6),
      A6: cell("Rent"),
      B6: currencyCell(45000),
      C6: numberCell(9),
      A7: cell("Dues"),
      B7: currencyCell(7200),
      C7: numberCell(12),
      A8: cell("Service"),
      B8: currencyCell(9600),
      C8: numberCell(4),
    },
    targets: buildTargets(
      ["D4", "D5", "D6", "D7", "D8"],
      (ref) => {
        const row = ref.match(/\d+/)[0];
        return `=B${row}/C${row}`;
      },
      [2000, 3000, 5000, 600, 2400].map((value) => money.format(value)),
      "Divide each prepaid cost by its own amortization months."
    ),
  },
  {
    tab: "Commission",
    title: "Commission accrual",
    scenario:
      "Sales operations sent monthly sales totals. Calculate the commission accrual using the rate assumption in the model.",
    skill: "Absolute rate references",
    coach:
      "When one assumption drives every row, lock it. This keeps the model easy to audit and prevents copied formulas from drifting.",
    shortcut: "Efficiency move: keep the sales amount relative and the rate absolute, then fill down.",
    objectives: [
      "Select D4.",
      "Multiply sales by the commission rate in H2.",
      "Fill the formula down through D9.",
    ],
    hints: [
      "Sales are in column C.",
      "The commission rate is in H2 and should stay fixed.",
      "Use =C4*$H$2 and Fill Down.",
    ],
    rows: 12,
    active: "D4",
    tags: ["Accrual", "Absolute refs", "Driver cell"],
    cells: {
      A1: cell("COMMISSIONS", "title"),
      H1: cell("Rate", "header"),
      H2: cell("5%"),
      A3: cell("Rep", "header"),
      B3: cell("Region", "header"),
      C3: cell("Sales", "header"),
      D3: cell("Accrual", "header"),
      A4: cell("Lee"),
      B4: cell("Central"),
      C4: currencyCell(64000),
      A5: cell("Mason"),
      B5: cell("East"),
      C5: currencyCell(58800),
      A6: cell("Diaz"),
      B6: cell("West"),
      C6: currencyCell(71500),
      A7: cell("Patel"),
      B7: cell("South"),
      C7: currencyCell(43200),
      A8: cell("Ng"),
      B8: cell("North"),
      C8: currencyCell(82600),
      A9: cell("Reed"),
      B9: cell("Central"),
      C9: currencyCell(39100),
    },
    targets: buildTargets(
      ["D4", "D5", "D6", "D7", "D8", "D9"],
      (ref) => {
        const row = ref.match(/\d+/)[0];
        return `=C${row}*$H$2`;
      },
      [3200, 2940, 3575, 2160, 4130, 1955].map((value) => money.format(value)),
      "Multiply each row's sales by the fixed commission rate in H2."
    ),
  },
  {
    tab: "Duplicates",
    title: "Duplicate invoice check",
    scenario:
      "Before AP payment review, flag invoice numbers that appear more than once so the team can investigate duplicate payment risk.",
    skill: "COUNTIF duplicate flags",
    coach:
      "COUNTIF turns a manual scan into a repeatable control. Lock the invoice range and let the current row's invoice number move.",
    shortcut: "Efficiency move: use COUNTIF inside IF so the output is reviewer-friendly instead of just TRUE or FALSE.",
    objectives: [
      "Select D4.",
      "Use COUNTIF to count each invoice number in the full invoice list.",
      "Fill the flag formula down through D10.",
    ],
    hints: [
      "Invoice numbers are in A4:A10.",
      "Lock the full invoice list, but leave the current invoice cell relative.",
      "Use =IF(COUNTIF($A$4:$A$10,A4)>1,\"Duplicate\",\"OK\") and Fill Down.",
    ],
    rows: 13,
    active: "D4",
    tags: ["COUNTIF", "Duplicate risk", "AP controls"],
    cells: {
      A1: cell("AP REVIEW", "title"),
      A3: cell("Invoice", "header"),
      B3: cell("Vendor", "header"),
      C3: cell("Amount", "header"),
      D3: cell("Flag", "header"),
      A4: cell("INV-2201"),
      B4: cell("Atlas Supply"),
      C4: currencyCell(1240),
      A5: cell("INV-2202"),
      B5: cell("Metro Rent"),
      C5: currencyCell(3200),
      A6: cell("INV-2203"),
      B6: cell("Nova Tel"),
      C6: currencyCell(680),
      A7: cell("INV-2202"),
      B7: cell("Metro Rent"),
      C7: currencyCell(3200),
      A8: cell("INV-2204"),
      B8: cell("Bright Clean"),
      C8: currencyCell(450),
      A9: cell("INV-2205"),
      B9: cell("Cedar Foods"),
      C9: currencyCell(890),
      A10: cell("INV-2201"),
      B10: cell("Atlas Supply"),
      C10: currencyCell(1240),
    },
    targets: buildTargets(
      ["D4", "D5", "D6", "D7", "D8", "D9", "D10"],
      (ref) => {
        const row = ref.match(/\d+/)[0];
        return `=IF(COUNTIF($A$4:$A$10,A${row})>1,"DUPLICATE","OK")`;
      },
      ["Duplicate", "Duplicate", "OK", "Duplicate", "OK", "OK", "Duplicate"],
      "Lock the invoice range and count whether the current invoice appears more than once."
    ),
  },
  {
    tab: "TB Check",
    title: "Trial balance tie-out",
    scenario:
      "The close lead wants a quick out-of-balance check before the trial balance goes into the reporting package.",
    skill: "Debit-credit checks",
    coach:
      "A tie-out cell should make errors obvious. Sum debits, sum credits, and return the difference as a single control number.",
    shortcut: "Efficiency move: build a visible check cell at the bottom of the schedule instead of relying on mental math.",
    objectives: [
      "Select C12.",
      "Subtract total credits from total debits.",
      "Check that the trial balance difference is zero.",
    ],
    hints: [
      "Debits are in C4:C10 and credits are in D4:D10.",
      "The check should return zero when the trial balance is in balance.",
      "Use =SUM(C4:C10)-SUM(D4:D10).",
    ],
    rows: 14,
    active: "C12",
    tags: ["Trial balance", "Tie-out", "SUM"],
    cells: {
      A1: cell("TB CHECK", "title"),
      A3: cell("Account", "header"),
      B3: cell("Type", "header"),
      C3: cell("Debit", "header"),
      D3: cell("Credit", "header"),
      A4: cell("Cash"),
      B4: cell("Asset"),
      C4: currencyCell(44000),
      A5: cell("A/R"),
      B5: cell("Asset"),
      C5: currencyCell(28250),
      A6: cell("Inventory"),
      B6: cell("Asset"),
      C6: currencyCell(18750),
      A7: cell("A/P"),
      B7: cell("Liability"),
      D7: currencyCell(21000),
      A8: cell("Revenue"),
      B8: cell("Income"),
      D8: currencyCell(83000),
      A9: cell("COGS"),
      B9: cell("Expense"),
      C9: currencyCell(35000),
      A10: cell("Equity"),
      B10: cell("Equity"),
      D10: currencyCell(22000),
      B12: cell("Difference", "label"),
    },
    targets: [
      {
        ref: "C12",
        display: money.format(0),
        help: "C12 should return debits minus credits, which should equal zero.",
        validate: (formula) => formula === "=SUM(C4:C10)-SUM(D4:D10)",
      },
    ],
  },
  {
    tab: "Margin",
    title: "Gross margin analysis",
    scenario:
      "The CFO wants margin percentages by product line. Use a reusable ratio formula instead of calculating each percentage manually.",
    skill: "Ratio analysis",
    coach:
      "Accountants often move from close schedules into analysis. A good ratio formula uses the calculated profit and revenue already on the sheet.",
    shortcut: "Efficiency move: keep margin formulas simple and row-relative so new product lines can be added cleanly.",
    objectives: [
      "Select E4.",
      "Divide gross profit by revenue.",
      "Fill the formula down through E9.",
    ],
    hints: [
      "Revenue is in column B and gross profit is in column D.",
      "For row 4, divide D4 by B4.",
      "Use =D4/B4 and Fill Down.",
    ],
    rows: 12,
    active: "E4",
    tags: ["Margin", "Ratios", "Analysis"],
    cells: {
      A1: cell("MARGIN", "title"),
      A3: cell("Product", "header"),
      B3: cell("Revenue", "header"),
      C3: cell("COGS", "header"),
      D3: cell("Gross profit", "header"),
      E3: cell("GM %", "header"),
      A4: cell("Core"),
      B4: currencyCell(124000),
      C4: currencyCell(70680),
      D4: currencyCell(53320),
      A5: cell("Plus"),
      B5: currencyCell(98500),
      C5: currencyCell(62055),
      D5: currencyCell(36445),
      A6: cell("Pro"),
      B6: currencyCell(151000),
      C6: currencyCell(80030),
      D6: currencyCell(70970),
      A7: cell("Lite"),
      B7: currencyCell(76000),
      C7: currencyCell(51680),
      D7: currencyCell(24320),
      A8: cell("Service"),
      B8: currencyCell(112000),
      C8: currencyCell(61600),
      D8: currencyCell(50400),
      A9: cell("Add-on"),
      B9: currencyCell(89000),
      C9: currencyCell(57850),
      D9: currencyCell(31150),
    },
    targets: buildTargets(
      ["E4", "E5", "E6", "E7", "E8", "E9"],
      (ref) => {
        const row = ref.match(/\d+/)[0];
        return `=D${row}/B${row}`;
      },
      ["43%", "37%", "47%", "32%", "45%", "35%"],
      "Divide each row's gross profit by its revenue."
    ),
  },
];

const shortcutItems = [
  ["F2", "edit active target"],
  ["Alt+=", "AutoSum when available"],
  ["Ctrl/Cmd+D", "Fill Down"],
  ["Ctrl/Cmd+Enter", "check answer"],
  ["Tab", "move right"],
  ["Shift+Tab", "move left"],
  ["Ctrl/Cmd+Arrow", "jump edge"],
  ["Delete", "clear target"],
];

const guideLibrary = {
  Receipts: {
    title: "Build a control total",
    steps: [
      {
        label: "Start with the accounting control.",
        why: "A receipt batch should tie to a single total before posting, bank matching, or review.",
        excel: "Find the detail range that represents the population: C4:C10.",
        accounting: "This prevents missed receipts and creates a clean support number for the close file.",
      },
      {
        label: "Use the fastest reliable formula.",
        why: "Manual addition is slow and hard to review.",
        excel: "Select C12 and use Alt+= or enter =SUM(C4:C10).",
        accounting: "The formula documents exactly which receipts are included in the control total.",
      },
      {
        label: "Keep the total visible.",
        why: "Reviewers need to see the control without tracing every line.",
        excel: "Leave the formula in the total row rather than hard-coding the amount.",
        accounting: "If one receipt changes, the support updates automatically.",
      },
      {
        label: "Check before moving on.",
        why: "A fast close still needs evidence that the schedule ties.",
        excel: "Use Ctrl/Cmd+Enter to check the answer.",
        accounting: "You now have a bank-rec-ready batch total.",
      },
    ],
  },
  Recon: {
    title: "Match book to bank",
    steps: [
      {
        label: "Define the reconciliation question.",
        why: "The issue is not the total yet. First, each book deposit needs a matching bank deposit.",
        excel: "Use the book deposit ID in A4 as the lookup value.",
        accounting: "Matching by ID reduces false matches that happen when amounts repeat.",
      },
      {
        label: "Lock the bank data ranges.",
        why: "The lookup table should not move as the formula is filled down.",
        excel: "Use $E$4:$E$9 for IDs and $F$4:$F$9 for bank amounts.",
        accounting: "Locked ranges keep every row pointed at the same bank evidence.",
      },
      {
        label: "Expose exceptions directly.",
        why: "A reconciliation schedule should show missing items, not hide them as blanks.",
        excel: "Use XLOOKUP with \"Missing\" as the if-not-found result.",
        accounting: "The missing deposit becomes a review item instead of a silent error.",
      },
      {
        label: "Build once, fill down.",
        why: "Efficiency comes from writing a reusable pattern, not six separate formulas.",
        excel: "Write the C4 formula, then use Ctrl/Cmd+D.",
        accounting: "Every deposit is tested with the same matching logic.",
      },
    ],
  },
  Aging: {
    title: "Age receivables from one date",
    steps: [
      {
        label: "Set the reporting date.",
        why: "A/R aging depends on the as-of date, not today's date or a hard-coded number.",
        excel: "Use H2 as the single as-of date driver.",
        accounting: "One driver makes the schedule easy to roll forward next month.",
      },
      {
        label: "Subtract invoice date from as-of date.",
        why: "Days open is the base for aging buckets and collection priority.",
        excel: "In D4, subtract C4 from $H$2.",
        accounting: "This creates an auditable days-open calculation.",
      },
      {
        label: "Lock only the driver.",
        why: "The as-of date stays fixed, but each invoice date must move by row.",
        excel: "Use =$H$2-C4, then fill down.",
        accounting: "The copied formulas preserve the model logic for every invoice.",
      },
      {
        label: "Use the result for review.",
        why: "The number is not just math. It drives allowance, follow-up, and cash forecasting.",
        excel: "Scan for large day counts after filling the column.",
        accounting: "Older balances can become collection or reserve issues.",
      },
    ],
  },
  Variance: {
    title: "Create a variance schedule",
    steps: [
      {
        label: "Decide the sign convention.",
        why: "A variance is only useful if positive and negative mean something consistent.",
        excel: "This schedule uses Actual minus Budget.",
        accounting: "Positive expense variances show overspend for review.",
      },
      {
        label: "Build the row formula.",
        why: "Each account should compare its own actual and budget.",
        excel: "In D4, use =C4-B4.",
        accounting: "The result explains where actual activity differed from plan.",
      },
      {
        label: "Fill the pattern down.",
        why: "The same logic should apply to every account.",
        excel: "Use Ctrl/Cmd+D through D9.",
        accounting: "A consistent formula makes the review defensible.",
      },
      {
        label: "Interpret before reporting.",
        why: "Variance work is not finished when the formula is correct.",
        excel: "Look for the largest positive or negative amounts.",
        accounting: "Those accounts become the explanation targets in the close package.",
      },
    ],
  },
  Review: {
    title: "Turn materiality into flags",
    steps: [
      {
        label: "Use the threshold as a driver.",
        why: "Materiality should be visible and changeable by the reviewer.",
        excel: "Use H2 as the review threshold.",
        accounting: "This avoids burying a key review assumption inside a formula.",
      },
      {
        label: "Measure absolute size.",
        why: "Both favorable and unfavorable variances can matter.",
        excel: "Wrap the variance in ABS(D4).",
        accounting: "Magnitude matters even when the sign changes.",
      },
      {
        label: "Convert logic into review language.",
        why: "Reviewers need a clear action, not just TRUE or FALSE.",
        excel: "Use IF to return Review or OK.",
        accounting: "The output becomes a filtered review list.",
      },
      {
        label: "Fill and scan.",
        why: "Controls work best when exceptions are obvious.",
        excel: "Fill down and look for Review flags.",
        accounting: "Those rows need support, explanation, or adjustment.",
      },
    ],
  },
  Depreciation: {
    title: "Use model drivers",
    steps: [
      {
        label: "Identify the accounting estimate.",
        why: "Depreciation depends on cost, salvage value, and useful life.",
        excel: "Find those driver cells in B4:B6.",
        accounting: "Separating assumptions from output makes the estimate reviewable.",
      },
      {
        label: "Calculate the annual expense.",
        why: "Straight-line depreciation spreads depreciable cost evenly.",
        excel: "Use cost minus salvage, divided by useful life.",
        accounting: "This creates the recurring expense for each year.",
      },
      {
        label: "Lock all driver cells.",
        why: "Each schedule row should point back to the same assumptions.",
        excel: "Use =($B$4-$B$5)/$B$6.",
        accounting: "Changing a driver updates the full depreciation schedule.",
      },
      {
        label: "Avoid hard-coding the schedule.",
        why: "Hard-coded expense hides the estimate and breaks updates.",
        excel: "Fill the formula down through the years.",
        accounting: "The support remains tied to the fixed asset assumptions.",
      },
    ],
  },
  Accruals: {
    title: "Build a criteria-based accrual",
    steps: [
      {
        label: "Define the accrual population.",
        why: "Accruals should capture incurred costs that have not been posted.",
        excel: "Use Vendor and Status as criteria.",
        accounting: "The goal is to record expenses in the correct period.",
      },
      {
        label: "Point criteria to visible cells.",
        why: "Reviewers should see what the formula is selecting.",
        excel: "Use H2 for Atlas Supply and \"Unposted\" for status.",
        accounting: "Visible criteria make the support easier to challenge or update.",
      },
      {
        label: "Use SUMIFS over filtering.",
        why: "Filters are easy to forget or change accidentally.",
        excel: "Sum E4:E10 where A4:A10 and D4:D10 meet the criteria.",
        accounting: "The accrual amount remains reproducible.",
      },
      {
        label: "Tie the result to the journal entry.",
        why: "The formula total should become support for the accrual entry.",
        excel: "Leave the SUMIFS formula in H5.",
        accounting: "The reviewer can trace the journal entry back to invoice detail.",
      },
    ],
  },
  Prepaids: {
    title: "Amortize prepaid costs",
    steps: [
      {
        label: "Find the cost and coverage period.",
        why: "Prepaid expense recognition depends on how long the benefit lasts.",
        excel: "Use cost in column B and months in column C.",
        accounting: "This supports matching expense to the benefit period.",
      },
      {
        label: "Calculate monthly expense.",
        why: "The monthly amount is the basis for the recurring amortization entry.",
        excel: "In D4, use =B4/C4.",
        accounting: "Each row gets its own amortization rate from its own contract terms.",
      },
      {
        label: "Fill the schedule.",
        why: "The model should scale across all prepaid items.",
        excel: "Use Ctrl/Cmd+D through D8.",
        accounting: "The close team can book the monthly expense from the schedule.",
      },
      {
        label: "Review reasonableness.",
        why: "Formula accuracy still needs accounting judgment.",
        excel: "Compare high monthly amounts to the contract type.",
        accounting: "Large amortization amounts may need separate support.",
      },
    ],
  },
  Commission: {
    title: "Apply one rate assumption",
    steps: [
      {
        label: "Separate activity from assumption.",
        why: "Sales vary by row, but the commission rate is one model assumption.",
        excel: "Use sales in C4 and the rate in H2.",
        accounting: "This makes the accrual easy to update if the rate changes.",
      },
      {
        label: "Lock the rate.",
        why: "The rate should not move while filling down.",
        excel: "Use $H$2 in the formula.",
        accounting: "Every rep uses the same approved commission assumption.",
      },
      {
        label: "Calculate the accrual.",
        why: "The company owes commission based on sales activity.",
        excel: "Use =C4*$H$2, then fill down.",
        accounting: "This estimates the commission liability for the close.",
      },
      {
        label: "Review outliers.",
        why: "Large accruals need support before posting.",
        excel: "Scan the filled accrual column for the largest amounts.",
        accounting: "Those rows may need sales report backup.",
      },
    ],
  },
  Duplicates: {
    title: "Detect duplicate invoices",
    steps: [
      {
        label: "Start with the control risk.",
        why: "Duplicate invoice numbers can lead to duplicate payments.",
        excel: "Use the invoice number list in A4:A10.",
        accounting: "This is an AP control before payment approval.",
      },
      {
        label: "Count each invoice number.",
        why: "A duplicate exists when the same invoice number appears more than once.",
        excel: "Use COUNTIF with a locked invoice range.",
        accounting: "The test is consistent across the entire AP sample.",
      },
      {
        label: "Return action language.",
        why: "Reviewers need a clear flag.",
        excel: "Use IF to return Duplicate or OK.",
        accounting: "Duplicate rows should be investigated before payment.",
      },
      {
        label: "Fill and filter.",
        why: "The value of the control is the exception list.",
        excel: "Fill down and focus on Duplicate flags.",
        accounting: "The team can pause or validate those invoices.",
      },
    ],
  },
  "TB Check": {
    title: "Prove the trial balance ties",
    steps: [
      {
        label: "Define the check.",
        why: "A trial balance should have total debits equal total credits.",
        excel: "Use the debit range C4:C10 and credit range D4:D10.",
        accounting: "If the difference is not zero, reporting cannot proceed cleanly.",
      },
      {
        label: "Build one visible difference cell.",
        why: "A single check cell is faster to review than scanning totals manually.",
        excel: "Use =SUM(C4:C10)-SUM(D4:D10).",
        accounting: "The result should be zero.",
      },
      {
        label: "Keep it formula-based.",
        why: "Hard-coding zero proves nothing.",
        excel: "Leave the SUM formula visible in C12.",
        accounting: "The reviewer can trace the check back to the account rows.",
      },
      {
        label: "Investigate nonzero results.",
        why: "A difference points to missing, duplicated, or misclassified entries.",
        excel: "If the check fails, compare debit and credit totals.",
        accounting: "The close lead should resolve the imbalance before reporting.",
      },
    ],
  },
  Margin: {
    title: "Turn close data into analysis",
    steps: [
      {
        label: "Identify the business question.",
        why: "The CFO wants profitability by product line, not just total revenue.",
        excel: "Use revenue in B and gross profit in D.",
        accounting: "This connects the close schedule to management analysis.",
      },
      {
        label: "Calculate the ratio.",
        why: "Gross margin percent shows profit efficiency across different revenue sizes.",
        excel: "In E4, divide D4 by B4.",
        accounting: "Percentages make product lines comparable.",
      },
      {
        label: "Fill the same ratio down.",
        why: "Every product line should use identical logic.",
        excel: "Use Ctrl/Cmd+D through E9.",
        accounting: "Consistent formulas avoid misleading margin comparisons.",
      },
      {
        label: "Apply judgment.",
        why: "Analysis is useful only when it leads to questions.",
        excel: "Scan for low or unusual percentages.",
        accounting: "Those product lines may need pricing, cost, or classification review.",
      },
    ],
  },
};

const state = {
  levelIndex: 0,
  entries: {},
  status: {},
  completedTabs: new Set(),
  activeRef: levels[0].active,
  score: 0,
  streak: 0,
  attempts: 0,
  hintsUsed: 0,
  hintIndex: 0,
  fillDownUsed: false,
  autoSumUsed: false,
  efficiencyMoves: 0,
  levelEfficiencyMoves: 0,
  levelShortcutTypes: new Set(),
  guideMode: true,
  guideStepIndex: 0,
  completedSkills: [],
};

let focusFrame = 0;

const elements = {
  levelMetric: document.querySelector("#levelMetric"),
  scoreMetric: document.querySelector("#scoreMetric"),
  streakMetric: document.querySelector("#streakMetric"),
  efficiencyMetric: document.querySelector("#efficiencyMetric"),
  shortcutText: document.querySelector("#shortcutText"),
  sheetGrid: document.querySelector("#sheetGrid"),
  sheetScroll: document.querySelector("#sheetScroll"),
  sheetTabs: document.querySelector("#sheetTabs"),
  nameBox: document.querySelector("#nameBox"),
  formulaInput: document.querySelector("#formulaInput"),
  formulaHelp: document.querySelector("#formulaHelp"),
  missionTitle: document.querySelector("#missionTitle"),
  missionScenario: document.querySelector("#missionScenario"),
  objectivesList: document.querySelector("#objectivesList"),
  feedbackPanel: document.querySelector("#feedbackPanel"),
  feedbackText: document.querySelector("#feedbackText"),
  nextButton: document.querySelector("#nextButton"),
  guideModeButton: document.querySelector("#guideModeButton"),
  guidePanel: document.querySelector("#guidePanel"),
  guideTitle: document.querySelector("#guideTitle"),
  guideStepMetric: document.querySelector("#guideStepMetric"),
  guideSteps: document.querySelector("#guideSteps"),
  previousGuideButton: document.querySelector("#previousGuideButton"),
  nextGuideButton: document.querySelector("#nextGuideButton"),
  coachSkill: document.querySelector("#coachSkill"),
  coachText: document.querySelector("#coachText"),
  systemList: document.querySelector("#systemList"),
  shortcutGrid: document.querySelector("#shortcutGrid"),
  formulaTags: document.querySelector("#formulaTags"),
  progressBar: document.querySelector("#progressBar"),
  completionDialog: document.querySelector("#completionDialog"),
  completionText: document.querySelector("#completionText"),
};

document.querySelector("#checkButton").addEventListener("click", () => checkLevel());
document.querySelector("#fillDownButton").addEventListener("click", () => fillDown());
document.querySelector("#hintButton").addEventListener("click", showHint);
document.querySelector("#resetButton").addEventListener("click", resetLevel);
document.querySelector("#nextButton").addEventListener("click", nextLevel);
document.querySelector("#playAgainButton").addEventListener("click", restartGame);
elements.guideModeButton.addEventListener("click", toggleGuideMode);
elements.previousGuideButton.addEventListener("click", previousGuideStep);
elements.nextGuideButton.addEventListener("click", nextGuideStep);

elements.formulaInput.addEventListener("input", () => {
  const level = currentLevel();
  if (!isTarget(level, state.activeRef)) {
    return;
  }
  state.entries[state.activeRef] = elements.formulaInput.value;
  delete state.status[state.activeRef];
  updateCell(state.activeRef);
});

elements.formulaInput.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    event.preventDefault();
    checkLevel({ shortcut: true });
    return;
  }

  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "d") {
    event.preventDefault();
    fillDown({ shortcut: true });
    return;
  }

  if (event.altKey && event.key === "=") {
    event.preventDefault();
    autoSum();
    return;
  }

  if (event.key === "Enter") {
    event.preventDefault();
    checkLevel();
    return;
  }

  if (event.key === "Tab") {
    event.preventDefault();
    elements.formulaInput.blur();
    moveSelection(event.shiftKey ? "ArrowLeft" : "ArrowRight", { focus: true, shortcut: true });
    return;
  }

  if (event.key === "Escape") {
    event.preventDefault();
    syncFormulaBar();
    focusActiveCell();
  }
});

elements.nameBox.addEventListener("focus", () => elements.nameBox.select());
elements.nameBox.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    goToNameBoxRef();
  }

  if (event.key === "Escape") {
    event.preventDefault();
    elements.nameBox.value = state.activeRef;
    focusActiveCell();
  }
});

elements.nameBox.addEventListener("blur", () => {
  elements.nameBox.value = state.activeRef;
});

elements.sheetScroll.addEventListener("keydown", handleSheetKeydown);

function currentLevel() {
  return levels[state.levelIndex];
}

function handleSheetKeydown(event) {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    event.preventDefault();
    checkLevel({ shortcut: true });
    return;
  }

  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "d") {
    event.preventDefault();
    fillDown({ shortcut: true });
    return;
  }

  if (event.altKey && event.key === "=") {
    event.preventDefault();
    autoSum();
    return;
  }

  if (event.key === "F2") {
    event.preventDefault();
    editActiveCell({ shortcut: true });
    return;
  }

  if (event.key === "Delete" || event.key === "Backspace") {
    event.preventDefault();
    clearActiveCell({ shortcut: true });
    return;
  }

  if (event.key === "Tab") {
    event.preventDefault();
    moveSelection(event.shiftKey ? "ArrowLeft" : "ArrowRight", { focus: true, shortcut: true });
    return;
  }

  if (event.key === "Enter") {
    event.preventDefault();
    moveSelection(event.shiftKey ? "ArrowUp" : "ArrowDown", { focus: true, shortcut: true });
    return;
  }

  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
    event.preventDefault();
    moveSelection(event.key, {
      focus: true,
      jump: event.metaKey || event.ctrlKey,
      shortcut: event.metaKey || event.ctrlKey,
    });
    return;
  }

  if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && isTarget(currentLevel(), state.activeRef)) {
    event.preventDefault();
    state.entries[state.activeRef] = event.key;
    syncFormulaBar();
    updateCell(state.activeRef);
    editActiveCell();
  }
}

function normalizeFormula(value) {
  const trimmed = value.trim().replace(/[“”]/g, '"').replace(/\s+/g, "");
  if (!trimmed) {
    return "";
  }
  const formula = trimmed.startsWith("=") ? trimmed : `=${trimmed}`;
  return formula.toUpperCase();
}

function parseRef(ref) {
  const match = ref.match(/^([A-Z]+)(\d+)$/);
  return {
    col: match[1],
    row: Number(match[2]),
    colIndex: columns.indexOf(match[1]),
  };
}

function isValidRef(ref) {
  const match = ref.match(/^([A-Z]+)(\d+)$/);
  if (!match) {
    return false;
  }
  return columns.includes(match[1]) && Number(match[2]) >= 1 && Number(match[2]) <= currentLevel().rows;
}

function isTarget(level, ref) {
  return level.targets.some((target) => target.ref === ref);
}

function getTarget(level, ref) {
  return level.targets.find((target) => target.ref === ref);
}

function selectCell(ref, options = {}) {
  const previousRef = state.activeRef;
  state.activeRef = ref;
  syncFormulaBar();
  updateCells([previousRef, ref]);
  if (options.focus) {
    focusActiveCell();
  }
}

function focusActiveCell() {
  if (focusFrame) {
    cancelAnimationFrame(focusFrame);
  }

  focusFrame = requestAnimationFrame(() => {
    focusFrame = 0;
    const activeCell = elements.sheetGrid.querySelector(`[data-ref="${state.activeRef}"]`);
    if (!activeCell) {
      elements.sheetScroll.focus();
      return;
    }
    activeCell.focus({ preventScroll: true });
    activeCell.scrollIntoView({ block: "nearest", inline: "nearest" });
  });
}

function editActiveCell(options = {}) {
  if (!isTarget(currentLevel(), state.activeRef)) {
    elements.feedbackPanel.className = "feedback-panel error";
    elements.feedbackText.textContent = "F2 edits green target cells only. Source data is locked.";
    focusActiveCell();
    return;
  }

  if (options.shortcut) {
    recordEfficiency("edit", "F2 edit mode");
  }
  elements.formulaInput.disabled = false;
  elements.formulaInput.focus();
  elements.formulaInput.setSelectionRange(
    elements.formulaInput.value.length,
    elements.formulaInput.value.length
  );
}

function clearActiveCell(options = {}) {
  if (!isTarget(currentLevel(), state.activeRef)) {
    elements.feedbackPanel.className = "feedback-panel error";
    elements.feedbackText.textContent = "Only green target cells can be cleared.";
    return;
  }

  delete state.entries[state.activeRef];
  delete state.status[state.activeRef];
  if (options.shortcut) {
    recordEfficiency("clear", "Delete cleared the active target");
  }
  elements.feedbackPanel.className = "feedback-panel";
  elements.feedbackText.textContent = `${state.activeRef} cleared.`;
  syncFormulaBar();
  updateCell(state.activeRef);
  focusActiveCell();
}

function goToNameBoxRef() {
  const requested = elements.nameBox.value.trim().toUpperCase();
  if (!isValidRef(requested)) {
    elements.feedbackPanel.className = "feedback-panel error";
    elements.feedbackText.textContent = "Enter a valid cell reference inside the current worksheet.";
    elements.nameBox.value = state.activeRef;
    return;
  }

  recordEfficiency("name-box", "Name Box jump");
  selectCell(requested, { focus: true });
}

function syncFormulaBar() {
  const level = currentLevel();
  elements.nameBox.value = state.activeRef;

  if (isTarget(level, state.activeRef)) {
    elements.formulaInput.disabled = false;
    elements.formulaInput.value = state.entries[state.activeRef] || "";
    elements.formulaInput.placeholder = "Type a formula, for example =SUM(A1:A5)";
    elements.formulaHelp.textContent =
      "Target cell selected. Type in the formula bar, press Enter to check, or use Fill Down for repeated formulas.";
  } else {
    elements.formulaInput.disabled = true;
    elements.formulaInput.value = getDisplayValue(level, state.activeRef);
    elements.formulaInput.placeholder = "Select a green target cell";
    elements.formulaHelp.textContent =
      "This cell is locked workbook data. Select a green target cell to enter a formula.";
  }
}

function getDisplayValue(level, ref) {
  const target = getTarget(level, ref);
  if (target) {
    const entry = state.entries[ref] || "";
    const normalized = normalizeFormula(entry);
    if (normalized && target.validate(normalized)) {
      return target.display;
    }
    return entry ? "formula entered" : "enter formula";
  }

  return level.cells[ref]?.value || "";
}

function getRole(level, ref) {
  const target = getTarget(level, ref);
  if (target) {
    return "target";
  }
  return level.cells[ref]?.role || "";
}

function renderLevel() {
  const level = currentLevel();
  elements.levelMetric.textContent = `${state.levelIndex + 1} / ${levels.length}`;
  elements.scoreMetric.textContent = String(state.score);
  elements.streakMetric.textContent = String(state.streak);
  elements.efficiencyMetric.textContent = String(state.efficiencyMoves);
  elements.shortcutText.textContent = level.shortcut;
  elements.missionTitle.textContent = level.title;
  elements.missionScenario.textContent = level.scenario;
  elements.coachSkill.textContent = level.skill;
  elements.coachText.textContent = level.coach;
  elements.progressBar.style.width = `${((state.levelIndex + 1) / levels.length) * 100}%`;
  elements.objectivesList.innerHTML = level.objectives.map((item) => `<li>${item}</li>`).join("");
  elements.systemList.innerHTML = getSystemSteps(level).map((item) => `<li>${item}</li>`).join("");
  elements.shortcutGrid.innerHTML = shortcutItems
    .map(([keys, action]) => `<span><kbd>${keys}</kbd>${action}</span>`)
    .join("");
  elements.formulaTags.innerHTML = level.tags.map((tag) => `<span>${tag}</span>`).join("");
  renderGuide();
  elements.feedbackPanel.className = "feedback-panel";
  elements.feedbackText.textContent = "Your controller is waiting for the first formula.";
  elements.nextButton.hidden = true;
  state.activeRef = level.active;
  renderTabs();
  renderGrid();
  syncFormulaBar();
}

function renderGuide() {
  const guide = guideLibrary[currentLevel().tab];
  const stepCount = guide.steps.length;
  state.guideStepIndex = Math.max(0, Math.min(state.guideStepIndex, stepCount - 1));
  elements.guidePanel.hidden = !state.guideMode;
  elements.guideModeButton.setAttribute("aria-pressed", String(state.guideMode));
  elements.guideModeButton.textContent = state.guideMode ? "Hide Guide" : "Guide";
  elements.guideTitle.textContent = guide.title;
  elements.guideStepMetric.textContent = `${state.guideStepIndex + 1} / ${stepCount}`;
  elements.previousGuideButton.disabled = state.guideStepIndex === 0;
  elements.nextGuideButton.disabled = state.guideStepIndex === stepCount - 1;
  elements.guideSteps.innerHTML = guide.steps
    .map((step, index) => {
      const classes = ["guide-step"];
      if (index === state.guideStepIndex) {
        classes.push("active");
      }
      return `
        <article class="${classes.join(" ")}">
          <h3>${escapeHtml(step.label)}</h3>
          <p><strong>Why:</strong> ${escapeHtml(step.why)}</p>
          <p><strong>Excel move:</strong> ${escapeHtml(step.excel)}</p>
          <p><strong>Accounting use:</strong> ${escapeHtml(step.accounting)}</p>
        </article>
      `;
    })
    .join("");
}

function toggleGuideMode() {
  state.guideMode = !state.guideMode;
  renderGuide();
}

function previousGuideStep() {
  state.guideStepIndex = Math.max(0, state.guideStepIndex - 1);
  renderGuide();
}

function nextGuideStep() {
  const guide = guideLibrary[currentLevel().tab];
  state.guideStepIndex = Math.min(guide.steps.length - 1, state.guideStepIndex + 1);
  renderGuide();
}

function getSystemSteps(level) {
  if (level.targets.length > 1) {
    return [
      `Land on ${level.active} and build the first formula only.`,
      "Use fixed references where the driver or lookup range must not move.",
      "Use Ctrl/Cmd+D to Fill Down, then Ctrl/Cmd+Enter to check.",
    ];
  }

  if (level.targets.some((target) => target.autoFormula)) {
    return [
      `Land on ${level.active} at the control-total line.`,
      "Use Alt+= to insert the SUM pattern from the source data.",
      "Use Ctrl/Cmd+Enter to check the tie-out.",
    ];
  }

  return [
    `Land on ${level.active} and build one visible check formula.`,
    "Keep assumptions and criteria in cells when the schedule needs review.",
    "Use Ctrl/Cmd+Enter to check, then move to the next sheet.",
  ];
}

function renderGrid() {
  const level = currentLevel();
  const header = `<thead><tr><th class="corner-cell"></th>${columns
    .map((column) => `<th scope="col">${column}</th>`)
    .join("")}</tr></thead>`;

  const rows = Array.from({ length: level.rows }, (_, rowIndex) => {
    const rowNumber = rowIndex + 1;
    const cells = columns
      .map((column) => {
        const ref = `${column}${rowNumber}`;
        const display = getDisplayValue(level, ref);
        const classes = getCellClasses(level, ref);
        const safeDisplay = escapeHtml(display);
        return `<td><button class="${classes.join(" ")}" data-ref="${ref}" type="button" aria-label="${ref} ${safeDisplay}">${safeDisplay}</button></td>`;
      })
      .join("");
    return `<tr><th class="row-heading" scope="row">${rowNumber}</th>${cells}</tr>`;
  }).join("");

  elements.sheetGrid.innerHTML = `${header}<tbody>${rows}</tbody>`;
  elements.sheetGrid.querySelectorAll(".cell-button").forEach((button) => {
    button.addEventListener("click", () => selectCell(button.dataset.ref));
  });
}

function getCellClasses(level, ref) {
  const role = getRole(level, ref);
  const classes = ["cell-button"];

  if (role) {
    classes.push(role);
  }
  if (role === "target" && !state.entries[ref]) {
    classes.push("empty-target");
  }
  if (state.status[ref]) {
    classes.push(state.status[ref]);
  }
  if (state.activeRef === ref) {
    classes.push("active");
  }
  if (level.cells[ref]?.role === "currency") {
    classes.push("currency");
  }
  if (level.cells[ref]?.role === "number") {
    classes.push("number");
  }

  return classes;
}

function updateCells(refs) {
  [...new Set(refs.filter(Boolean))].forEach((ref) => updateCell(ref));
}

function updateCell(ref) {
  const button = elements.sheetGrid.querySelector(`[data-ref="${ref}"]`);
  if (!button) {
    return;
  }

  const level = currentLevel();
  const display = getDisplayValue(level, ref);
  button.className = getCellClasses(level, ref).join(" ");
  button.textContent = display;
  button.setAttribute("aria-label", `${ref} ${display}`);
}

function renderTabs() {
  elements.sheetTabs.innerHTML = levels
    .map((level, index) => {
      const classes = ["sheet-tab"];
      if (index === state.levelIndex) {
        classes.push("active");
      }
      if (state.completedTabs.has(index)) {
        classes.push("complete");
      }
      return `<button class="${classes.join(" ")}" type="button" data-level="${index}">${level.tab}</button>`;
    })
    .join("");

  elements.sheetTabs.querySelectorAll(".sheet-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const requested = Number(tab.dataset.level);
      if (requested <= state.levelIndex || state.completedTabs.has(requested)) {
        loadLevel(requested);
      }
    });
  });
}

function checkLevel(options = {}) {
  const level = currentLevel();
  if (options.shortcut) {
    recordEfficiency("check", "Ctrl/Cmd+Enter checked the worksheet");
  }
  state.attempts += 1;
  const wrongTargets = [];

  level.targets.forEach((target) => {
    const formula = normalizeFormula(state.entries[target.ref] || "");
    if (target.validate(formula)) {
      state.status[target.ref] = "correct";
    } else {
      state.status[target.ref] = "wrong";
      wrongTargets.push(target);
    }
  });

  if (wrongTargets.length === 0) {
    completeLevel();
  } else {
    state.streak = 0;
    const firstWrong = wrongTargets[0];
    elements.feedbackPanel.className = "feedback-panel error";
    elements.feedbackText.textContent = `${wrongTargets.length} cell${
      wrongTargets.length === 1 ? "" : "s"
    } still need work. ${firstWrong.help}`;
    elements.nextButton.hidden = true;
  }

  updateCells(level.targets.map((target) => target.ref));
  updateMetrics();
}

function completeLevel() {
  const level = currentLevel();
  const alreadyCompleted = state.completedTabs.has(state.levelIndex);
  const rangeBonus = level.targets.length > 1 && state.fillDownUsed ? 15 : 0;
  const autoSumBonus = state.autoSumUsed ? 10 : 0;
  const efficiencyBonus = Math.min(30, state.levelEfficiencyMoves * 5);
  const award = Math.max(
    25,
    90 + rangeBonus + autoSumBonus + efficiencyBonus - state.hintsUsed * 10 - (state.attempts - 1) * 12
  );

  if (!alreadyCompleted) {
    state.score += award;
    state.streak += 1;
    state.completedTabs.add(state.levelIndex);
    state.completedSkills.push(level.skill);
  }
  elements.feedbackPanel.className = "feedback-panel success";
  elements.feedbackText.textContent = alreadyCompleted
    ? `Signed off again. ${level.skill} is already counted in your score.`
    : `Signed off. You earned ${award} points, including ${efficiencyBonus + autoSumBonus} efficiency points.`;
  elements.nextButton.hidden = false;
  elements.nextButton.textContent =
    state.levelIndex === levels.length - 1 ? "Finish Close Package" : "Next Scenario";
}

function fillDown(options = {}) {
  const level = currentLevel();
  const activeTarget = getTarget(level, state.activeRef);
  const formula = state.entries[state.activeRef];

  if (!activeTarget || !formula) {
    elements.feedbackPanel.className = "feedback-panel error";
    elements.feedbackText.textContent =
      "Select a target cell with a formula first, then use Fill Down.";
    return;
  }

  const active = parseRef(state.activeRef);
  const sameColumnTargets = level.targets
    .filter((target) => parseRef(target.ref).col === active.col)
    .sort((a, b) => parseRef(a.ref).row - parseRef(b.ref).row);

  if (sameColumnTargets.length < 2) {
    elements.feedbackPanel.className = "feedback-panel";
    elements.feedbackText.textContent = "This scenario only needs one formula cell.";
    return;
  }

  sameColumnTargets.forEach((target) => {
    const targetRow = parseRef(target.ref).row;
    state.entries[target.ref] = shiftFormulaRows(formula, targetRow - active.row);
    delete state.status[target.ref];
  });

  state.fillDownUsed = true;
  if (options.shortcut) {
    recordEfficiency("fill-down", "Ctrl/Cmd+D filled the schedule");
  }
  elements.feedbackPanel.className = "feedback-panel";
  elements.feedbackText.textContent = `Filled ${sameColumnTargets.length} target cells in column ${active.col}.`;
  syncFormulaBar();
  updateCells(sameColumnTargets.map((target) => target.ref));
}

function autoSum() {
  const level = currentLevel();
  const target = getTarget(level, state.activeRef);

  if (!target?.autoFormula) {
    elements.feedbackPanel.className = "feedback-panel error";
    elements.feedbackText.textContent = "AutoSum is only available when the active target sits under a SUM range.";
    focusActiveCell();
    return;
  }

  state.entries[state.activeRef] = target.autoFormula;
  delete state.status[state.activeRef];
  state.autoSumUsed = true;
  recordEfficiency("autosum", "Alt+= inserted AutoSum");
  elements.feedbackPanel.className = "feedback-panel";
  elements.feedbackText.textContent = `AutoSum inserted ${target.autoFormula} in ${state.activeRef}.`;
  syncFormulaBar();
  updateCell(state.activeRef);
  focusActiveCell();
}

function shiftFormulaRows(formula, delta) {
  return formula.replace(/(\$?)([A-Z]+)(\$?)(\d+)/g, (match, colLock, col, rowLock, row) => {
    if (rowLock === "$") {
      return match;
    }
    return `${colLock}${col}${rowLock}${Number(row) + delta}`;
  });
}

function showHint() {
  const level = currentLevel();
  const hint = level.hints[Math.min(state.hintIndex, level.hints.length - 1)];
  state.hintIndex += 1;
  state.hintsUsed += 1;
  elements.feedbackPanel.className = "feedback-panel";
  elements.feedbackText.textContent = hint;
  updateMetrics();
}

function resetLevel() {
  state.entries = {};
  state.status = {};
  state.attempts = 0;
  state.hintsUsed = 0;
  state.hintIndex = 0;
  state.fillDownUsed = false;
  state.autoSumUsed = false;
  state.levelEfficiencyMoves = 0;
  state.levelShortcutTypes = new Set();
  state.guideStepIndex = 0;
  renderLevel();
}

function nextLevel() {
  if (state.levelIndex === levels.length - 1) {
    showCompletion();
    return;
  }

  loadLevel(state.levelIndex + 1);
}

function loadLevel(index) {
  state.levelIndex = index;
  state.entries = {};
  state.status = {};
  state.attempts = 0;
  state.hintsUsed = 0;
  state.hintIndex = 0;
  state.fillDownUsed = false;
  state.autoSumUsed = false;
  state.levelEfficiencyMoves = 0;
  state.levelShortcutTypes = new Set();
  state.guideStepIndex = 0;
  renderLevel();
}

function restartGame() {
  state.levelIndex = 0;
  state.entries = {};
  state.status = {};
  state.completedTabs = new Set();
  state.activeRef = levels[0].active;
  state.score = 0;
  state.streak = 0;
  state.attempts = 0;
  state.hintsUsed = 0;
  state.hintIndex = 0;
  state.fillDownUsed = false;
  state.autoSumUsed = false;
  state.efficiencyMoves = 0;
  state.levelEfficiencyMoves = 0;
  state.levelShortcutTypes = new Set();
  state.guideMode = true;
  state.guideStepIndex = 0;
  state.completedSkills = [];
  elements.completionDialog.close();
  renderLevel();
}

function showCompletion() {
  const uniqueSkills = [...new Set(state.completedSkills)].join(", ");
  elements.completionText.textContent = `Final score: ${state.score}. Efficiency moves logged: ${state.efficiencyMoves}. You practiced ${uniqueSkills}.`;
  elements.completionDialog.showModal();
}

function updateMetrics() {
  elements.scoreMetric.textContent = String(state.score);
  elements.streakMetric.textContent = String(state.streak);
  elements.efficiencyMetric.textContent = String(state.efficiencyMoves);
}

function recordEfficiency(type, label) {
  if (!state.levelShortcutTypes.has(type)) {
    state.levelShortcutTypes.add(type);
    state.levelEfficiencyMoves += 1;
    state.efficiencyMoves += 1;
  }
  elements.formulaHelp.textContent = `${label}. Efficiency move logged.`;
  updateMetrics();
}

function moveSelection(key, options = {}) {
  const current = parseRef(state.activeRef);
  let nextCol = current.colIndex;
  let nextRow = current.row;

  if (options.jump) {
    const jumpRef = getJumpRef(current, key);
    if (jumpRef) {
      if (options.shortcut) {
        recordEfficiency("jump", "Ctrl/Cmd+Arrow jumped through the sheet");
      }
      selectCell(jumpRef, { focus: options.focus });
      return;
    }
  }

  if (key === "ArrowLeft") nextCol -= 1;
  if (key === "ArrowRight") nextCol += 1;
  if (key === "ArrowUp") nextRow -= 1;
  if (key === "ArrowDown") nextRow += 1;

  nextCol = Math.max(0, Math.min(columns.length - 1, nextCol));
  nextRow = Math.max(1, Math.min(currentLevel().rows, nextRow));
  if (options.shortcut) {
    recordEfficiency("nav", key.includes("Left") || key.includes("Right") ? "Tab-style navigation" : "Enter-style navigation");
  }
  selectCell(`${columns[nextCol]}${nextRow}`, { focus: options.focus });
}

function getJumpRef(current, key) {
  const level = currentLevel();
  const occupied = new Set([...Object.keys(level.cells), ...level.targets.map((target) => target.ref)]);
  const edgeRow = key === "ArrowUp" ? 1 : level.rows;
  const edgeCol = key === "ArrowLeft" ? 0 : columns.length - 1;

  if (key === "ArrowUp" || key === "ArrowDown") {
    const step = key === "ArrowUp" ? -1 : 1;
    let row = current.row + step;
    let lastOccupied = null;
    while (row >= 1 && row <= level.rows) {
      const ref = `${current.col}${row}`;
      if (occupied.has(ref)) {
        lastOccupied = ref;
      }
      row += step;
    }
    return lastOccupied || `${current.col}${edgeRow}`;
  }

  if (key === "ArrowLeft" || key === "ArrowRight") {
    const step = key === "ArrowLeft" ? -1 : 1;
    let colIndex = current.colIndex + step;
    let lastOccupied = null;
    while (colIndex >= 0 && colIndex < columns.length) {
      const ref = `${columns[colIndex]}${current.row}`;
      if (occupied.has(ref)) {
        lastOccupied = ref;
      }
      colIndex += step;
    }
    return lastOccupied || `${columns[edgeCol]}${current.row}`;
  }

  return null;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

renderLevel();
