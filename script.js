// Firebase SDK (Add this from Firebase Console)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Replace with your Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Variables
let prevTH = 0.0;
let prevChl = 0.0;
let prevAlk = 0.0;
let labNo = null; // Shared lab_no (e.g., "25/2025")
let fixedYear = null; // Year part of lab_no (e.g., "2025")

const thPrevInput = document.getElementById("th_prev_set");
const chlPrevInput = document.getElementById("chl_prev_set");
const alkPrevInput = document.getElementById("alk_prev_set");
const labStartInput = document.getElementById("lab_start");

// Validate lab_no format (x/yyyy, xx/yyyy, xxx/yyyy, xxxx/yyyy)
function validateLabNo(input) {
  const regex = /^\d{1,4}\/\d{4}$/;
  return regex.test(input);
}

// Parse lab_no to extract number and year
function parseLabNo(labNo) {
  const [number, year] = labNo.split("/");
  return { number: parseInt(number), year };
}

// Increment lab_no (e.g., "25/2025" -> "26/2025")
function incrementLabNo(currentLabNo) {
  const { number, year } = parseLabNo(currentLabNo);
  return `${number + 1}/${year}`;
}

function calcTH() {
  if (labNo === null) {
    const start = labStartInput.value;
    if (!validateLabNo(start)) {
      alert("Invalid Lab No format! Please use x/yyyy, xx/yyyy, xxx/yyyy, or xxxx/yyyy");
      return;
    }
    labNo = start;
    fixedYear = parseLabNo(start).year;
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

  // Append to TH table
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${labNo}</td>
    <td>${THv.toFixed(1)}</td>
    <td>${TH}</td>
    <td>${CaV.toFixed(1)}</td>
    <td>${Ca}</td>
    <td>${MgV.toFixed(1)}</td>
    <td>${Mg}</td>
  `;
  document.getElementById("th_table").appendChild(row);

  // Save to Firestore (merge to avoid overwriting other fields)
  setDoc(doc(db, "calculations", labNo), {
    lab_no: labNo,
    th_v: THv,
    th: TH,
    ca_v: CaV,
    ca: Ca,
    mg_v: MgV,
    mg: Mg
  }, { merge: true });

  prevTH = newVal;
  thPrevInput.placeholder = prevTH.toFixed(1);
  document.getElementById("th_new").value = "";
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
  if (labNo === null) {
    const start = labStartInput.value;
    if (!validateLabNo(start)) {
      alert("Invalid Lab No format! Please use x/yyyy, xx/yyyy, xxx/yyyy, or xxxx/yyyy");
      return;
    }
    labNo = start;
    fixedYear = parseLabNo(start).year;
  }

  const newVal = parseFloat(document.getElementById("chl_new").value);
  if (Number.isNaN(newVal)) return;

  let ChlV = newVal - prevChl;
  if (ChlV < 0) ChlV = 0;

  const Chl = ChlV * 40;

  // Append to Chloride table
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${labNo}</td>
    <td>${ChlV.toFixed(1)}</td>
    <td>${Chl.toFixed(1)}</td>
  `;
  document.getElementById("chl_table").appendChild(row);

  // Save to Firestore
  setDoc(doc(db, "calculations", labNo), {
    lab_no: labNo,
    chl_v: ChlV,
    chl: Chl
  }, { merge: true });

  prevChl = newVal;
  chlPrevInput.placeholder = prevChl.toFixed(1);
  document.getElementById("chl_new").value = "";
}

function setPrevChl() {
  const v = parseFloat(chlPrevInput.value);
  if (!Number.isNaN(v)) {
    prevChl = v < 0 ? 0 : v;
    chlPrevInput.value = "";
    chlPrevInput.placeholder = prevChl.toFixed(1);
  }
}

function calcAlk() {
  if (labNo === null) {
    const start = labStartInput.value;
    if (!validateLabNo(start)) {
      alert("Invalid Lab No format! Please use x/yyyy, xx/yyyy, xxx/yyyy, or xxxx/yyyy");
      return;
    }
    labNo = start;
    fixedYear = parseLabNo(start).year;
  }

  const newVal = parseFloat(document.getElementById("alk_new").value);
  if (Number.isNaN(newVal)) return;

  let AlkV = newVal - prevAlk;
  if (AlkV < 0) AlkV = 0;

  const Alk = AlkV * 200;

  // Append to Alkalinity table
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${labNo}</td>
    <td>${AlkV.toFixed(1)}</td>
    <td>${Alk.toFixed(1)}</td>
  `;
  document.getElementById("alk_table").appendChild(row);

  // Save to Firestore
  setDoc(doc(db, "calculations", labNo), {
    lab_no: labNo,
    alk_v: AlkV,
    alk: Alk
  }, { merge: true });

  prevAlk = newVal;
  alkPrevInput.placeholder = prevAlk.toFixed(1);
  document.getElementById("alk_new").value = "";
}

function setPrevAlk() {
  const v = parseFloat(alkPrevInput.value);
  if (!Number.isNaN(v)) {
    prevAlk = v < 0 ? 0 : v;
    alkPrevInput.value = "";
    alkPrevInput.placeholder = prevAlk.toFixed(1);
  }
}

async function calcTDS() {
  if (labNo === null) return;

  // Fetch data from Firestore to calculate TDS
  const docRef = doc(db, "calculations", labNo);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    const th = data.th || 0;
    const chl = data.chl || 0;
    const alk = data.alk || 0;
    const tds = th + chl + alk;

    // Append to TDS table
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${labNo}</td>
      <td>${tds.toFixed(1)}</td>
    `;
    document.getElementById("tds_table").appendChild(row);

    // Save TDS to Firestore
    setDoc(doc(db, "calculations", labNo), {
      lab_no: labNo,
      tds: tds
    }, { merge: true });
  }
}

async function fetchData() {
  const labNoInput = document.getElementById("fetch_lab_no").value;
  if (!validateLabNo(labNoInput)) {
    alert("Invalid Lab No format! Please use x/yyyy, xx/yyyy, xxx/yyyy, or xxxx/yyyy");
    return;
  }

  const docRef = doc(db, "calculations", labNoInput);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();

    // Clear existing tables
    document.getElementById("th_table").innerHTML = "";
    document.getElementById("chl_table").innerHTML = "";
    document.getElementById("alk_table").innerHTML = "";
    document.getElementById("tds_table").innerHTML = "";

    // Populate TH table if data exists
    if (data.th_v && data.th) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.lab_no}</td>
        <td>${data.th_v.toFixed(1)}</td>
        <td>${data.th}</td>
        <td>${data.ca_v.toFixed(1)}</td>
        <td>${data.ca}</td>
        <td>${data.mg_v.toFixed(1)}</td>
        <td>${data.mg}</td>
      `;
      document.getElementById("th_table").appendChild(row);
    }

    // Populate Chloride table if data exists
    if (data.chl_v && data.chl) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.lab_no}</td>
        <td>${data.chl_v.toFixed(1)}</td>
        <td>${data.chl.toFixed(1)}</td>
      `;
      document.getElementById("chl_table").appendChild(row);
    }

    // Populate Alkalinity table if data exists
    if (data.alk_v && data.alk) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.lab_no}</td>
        <td>${data.alk_v.toFixed(1)}</td>
        <td>${data.alk.toFixed(1)}</td>
      `;
      document.getElementById("alk_table").appendChild(row);
    }

    // Populate TDS table if data exists
    if (data.tds) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.lab_no}</td>
        <td>${data.tds.toFixed(1)}</td>
      `;
      document.getElementById("tds_table").appendChild(row);
    }
  } else {
    alert("No data found for Lab No: " + labNoInput);
  }
}

// Auto-calculate TDS after each calculator
function autoCalcTDS() {
  calcTDS();
  labNo = incrementLabNo(labNo); // Increment lab_no after all calculations
}

// Bind buttons
document.getElementById("btn-calc-th").addEventListener("click", () => { calcTH(); autoCalcTDS(); });
document.getElementById("btn-set-th").addEventListener("click", setPrevTH);
document.getElementById("btn-calc-chl").addEventListener("click", () => { calcChl(); autoCalcTDS(); });
document.getElementById("btn-set-chl").addEventListener("click", setPrevChl);
document.getElementById("btn-calc-alk").addEventListener("click", () => { calcAlk(); autoCalcTDS(); });
document.getElementById("btn-set-alk").addEventListener("click", setPrevAlk);
document.getElementById("btn-fetch-data").addEventListener("click", fetchData);
