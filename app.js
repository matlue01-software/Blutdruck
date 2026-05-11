
const STORAGE_KEY = "bloodpressure_entries";

function getEntries() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function saveEntry() {
  const sys = document.getElementById("sys").value;
  const dia = document.getElementById("dia").value;
  const pulse = document.getElementById("pulse").value;

  if (!sys || !dia || !pulse) {
    alert("Bitte alle Felder ausfüllen.");
    return;
  }

  const entries = getEntries();

  entries.unshift({
    date: new Date().toLocaleString("de-DE"),
    sys,
    dia,
    pulse
  });

  saveEntries(entries);

  document.getElementById("sys").value = "";
  document.getElementById("dia").value = "";
  document.getElementById("pulse").value = "";

  renderEntries();
  renderChart();
}

function renderEntries() {
  const tbody = document.getElementById("entries");
  const entries = getEntries();

  tbody.innerHTML = "";

  entries.forEach(entry => {
    const row = `
      <tr>
        <td>${entry.date}</td>
        <td>${entry.sys}</td>
        <td>${entry.dia}</td>
        <td>${entry.pulse}</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

let chart;

function renderChart() {
  const entries = getEntries().slice().reverse();

  const labels = entries.map(e => e.date);
  const sysData = entries.map(e => e.sys);
  const diaData = entries.map(e => e.dia);

  const ctx = document.getElementById("chart");

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Systolisch",
          data: sysData
        },
        {
          label: "Diastolisch",
          data: diaData
        }
      ]
    }
  });
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

renderEntries();
renderChart();
