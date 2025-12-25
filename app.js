function getColors(count) {
  const palette = [
    "#38bdf8", // blue
    "#22c55e", // green
    "#facc15", // yellow
    "#fb7185", // pink
    "#a78bfa", // purple
    "#fb923c", // orange
    "#14b8a6", // teal
    "#e879f9"  // magenta
  ];

  return palette.slice(0, count);
}
  const dateInput = document.getElementById('date');
  
// Set default date to today, but still allow manual selection
if (!dateInput.value) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.value = `${yyyy}-${mm}-${dd}`;
}

  let expenses = [];

  const ctx = document.getElementById('pieChart').getContext('2d');
const chart = new Chart(ctx,  {
  type: 'pie',
  data: {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      hoverOffset: 10
    }]
  },
  options: {
    plugins: {
      legend: {
        labels: { color: '#e5e7eb' }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const data = context.dataset.data;
            const total = data.reduce((sum, value) => sum + value, 0);
            const value = context.raw;
            const percentage = ((value / total) * 100).toFixed(1);

            return `${context.label}: Rs ${value} (${percentage}%)`;
          }
        }
      }
    }
  }
});

 
function addExpense() {
  const date = document.getElementById("date").value;
  const amount = Number(document.getElementById("amount").value);
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;
  const type = document.getElementById("type").value;

  if (!date || !amount) {
    alert("Please fill all required fields");
    return;
  }

  // ✅ Save expense
  expenses.push({
    date,
    category,
    amount,
    type,
    description
  });

  // ✅ Update UI
  renderHistory();
  updateChart();
  updateSummary(amount, type);

  // ✅ Reset inputs
  document.getElementById("amount").value = "";
  document.getElementById("description").value = "";
}


  
function renderHistory() {
  const tbody = document.getElementById("history");
  tbody.innerHTML = "";

  expenses.forEach(e => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${e.date}</td>
      <td>${e.category}</td>
      <td>${e.description || "-"}</td>
      <td style="color:${e.type === "income" ? "#22c55e" : "#ef4444"}">
        ${e.type === "income" ? "+" : "-"} Rs ${e.amount}
      </td>
    `;

    tbody.appendChild(row);
  });
}

  
function updateChart() {
  const totals = {};

  expenses
    .filter(e => e.type === "expense")
    .forEach(e => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    });

  const labels = Object.keys(totals);
  const data = Object.values(totals);

  chart.data.labels = labels;
  chart.data.datasets[0].data = data;
  chart.data.datasets[0].backgroundColor = getColors(labels.length);

  chart.update();
}

let totalIncome = 0;
let totalExpense = 0;

function updateSummary(amount, type) {
    amount = Number(amount);

    if (type === "income") {
        totalIncome += amount;
    } else {
        totalExpense += amount;
    }

    document.getElementById("income").innerText = totalIncome;
    document.getElementById("expenses").innerText = totalExpense;
    document.getElementById("balance").innerText = totalIncome - totalExpense;
}


function toggleMenu() {
    document.getElementById("sideMenu").classList.toggle("open");
}

function toggleAbout() {
    const about = document.getElementById("aboutDetails");
    about.style.display = about.style.display === "block" ? "none" : "block";
}

function toggleContact() {
    const contact = document.getElementById("contactDetails");
    contact.style.display =
        contact.style.display === "block" ? "none" : "block";
}