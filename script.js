let prevTH = 0.0;
let prevChl = 0.0;
let labNoTH = null;
let labNoChl = null;

const thPrevInput = document.getElementById("th_prev_set");
const chlPrevInput = document.getElementById("chl_prev_set");

function calcTH() {
  if (labNoTH === null) {
    const start = parseInt(document.getElementById("lab_th_start").value);
    if (isNaN(start)) { alert("Please set starting Lab No first!"); return; }
    labNoTH = start;
  }

  const newVal = parseFloat(document.getElementById("th_new").value);
  if (Number.isNaN(newVal)) return;

  let THv = newVal - prevTH;
  if (THv < 0) THv = 0;

  let CaV = parseFloat((THv / 2).toFixed(1));
  let MgV = THv - CaV;
  if (MgV < 0) MgV = 0;

  const TH = Math.round(THv * 40);
  const Ca = Math.round(CaV * 16);
  const Mg = Math.round(MgV * 9.6);

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${labNoTH}</td>
    <td>${THv.toFixed(1)}</td>
    <td>${TH}</td>
    <td>${CaV.toFixed(1)}</td>
    <td>${Ca}</td>
    <td>${MgV.toFixed(1)}</td>
    <td>${Mg}</td>
  `;
  document.getElementById("th_table").appendChild(row);

  prevTH = newVal;
  thPrevInput.placeholder = prevTH.toFixed(1);
  document.getElementById("th_new").value = "";
  labNoTH++;
}

function setPrevTH() {
  const v = parseFloat(thPrevInput.value);
  if (!Number.isNaN(v)) {
    prevTH = v < 0 ? 0 : v;
    thPrevInput.value = "";
    thPrevInput.placeholder = prevTH.toFixed(1);
  }
}

function calcChl() {
  if (labNoChl === null) {
    const start = parseInt(document.getElementById("lab_chl_start").value);
    if (isNaN(start)) { alert("Please set starting Lab No first!"); return; }
    labNoChl = start;
  }

  const newVal = parseFloat(document.getElementById("chl_new").value);
  if (Number.isNaN(newVal)) return;

  let ChlV = newVal - prevChl;
  if (ChlV < 0) ChlV = 0;

  const Chl = ChlV * 40;

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${labNoChl}</td>
    <td>${ChlV.toFixed(1)}</td>
    <td>${Chl.toFixed(1)}</td>
  `;
  document.getElementById("chl_table").appendChild(row);

  prevChl = newVal;
  chlPrevInput.placeholder = prevChl.toFixed(1);
  document.getElementById("chl_new").value = "";
  labNoChl++;
}

function setPrevChl() {
  const v = parseFloat(chlPrevInput.value);
  if (!Number.isNaN(v)) {
    prevChl = v < 0 ? 0 : v;
    chlPrevInput.value = "";
    chlPrevInput.placeholder = prevChl.toFixed(1);
  }
}

// Bind buttons
document.getElementById("btn-calc-th").addEventListener("click", calcTH);
document.getElementById("btn-set-th").addEventListener("click", setPrevTH);
document.getElementById("btn-calc-chl").addEventListener("click", calcChl);
document.getElementById("btn-set-chl").addEventListener("click", setPrevChl);