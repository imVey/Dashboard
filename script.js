let lineChart, doughnutChart;
let currentPeriod = "30d";

// Animation des particules
class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById("particles-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.particleCount = 80;

    this.resize();
    this.init();
    this.animate();

    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((particle) => {
      // Mouvement
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Rebonds sur les bords
      if (particle.x < 0 || particle.x > this.canvas.width)
        particle.speedX *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height)
        particle.speedY *= -1;

      // Garder dans les limites
      particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
      particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));

      // Dessiner la particule
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
      this.ctx.fill();

      // Effet de brillance
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size * 0.3, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity * 0.8})`;
      this.ctx.fill();
    });

    // Lignes de connexion entre particules proches
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = `rgba(255, 255, 255, ${
            0.1 * (1 - distance / 100)
          })`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Données simulées
const data = {
  stats: {
    visitors: { base: 20000, current: 24891, change: 12.5 },
    pageViews: { base: 70000, current: 89432, change: 8.3 },
    conversion: { base: 3, current: 3.42, change: -2.1 },
    revenue: { base: 10000, current: 12847, change: 15.7 },
  },
  pages: [
    { path: "/accueil", views: 15420, avgTime: "2m 34s", bounceRate: 32 },
    { path: "/produits", views: 9876, avgTime: "3m 12s", bounceRate: 28 },
    { path: "/contact", views: 7654, avgTime: "1m 45s", bounceRate: 45 },
    { path: "/blog", views: 5432, avgTime: "4m 23s", bounceRate: 22 },
    { path: "/a-propos", views: 3210, avgTime: "2m 56s", bounceRate: 38 },
  ],
};

// Initialisation
document.addEventListener("DOMContentLoaded", function () {
  new ParticleSystem();
  initCharts();
});

function updatePeriod(period, button) {
  currentPeriod = period;

  // Mettre à jour les boutons actifs
  document.querySelectorAll(".btn[data-period]").forEach((btn) => {
    btn.classList.remove("active");
  });
  button.classList.add("active");

  refreshData();
}

function refreshData() {
  updateStats();
  updateCharts();
  updateTable();
}

function updateStats() {
  // Simuler de nouvelles données
  const visitors = generateRandomValue(15000, 30000);
  const pageViews = generateRandomValue(60000, 120000);
  const conversion = (Math.random() * 3 + 2).toFixed(2);
  const revenue = generateRandomValue(8000, 20000);

  document.getElementById("visitors").textContent = visitors.toLocaleString();
  document.getElementById("pageViews").textContent = pageViews.toLocaleString();
  document.getElementById("conversion").textContent = conversion + "%";
  document.getElementById("revenue").textContent =
    "€" + revenue.toLocaleString();

  // Mettre à jour les changements
  updateChangePercent("visitorsChange", generateRandomChange());
  updateChangePercent("pageViewsChange", generateRandomChange());
  updateChangePercent("conversionChange", generateRandomChange());
  updateChangePercent("revenueChange", generateRandomChange());
}

function updateChangePercent(elementId, change) {
  const element = document.getElementById(elementId);
  const sign = change > 0 ? "+" : "";
  element.textContent = `${sign}${change.toFixed(1)}% vs période précédente`;
  element.className = `stat-change ${change > 0 ? "positive" : "negative"}`;
}

function updateTable() {
  const tbody = document.getElementById("pagesTable");
  const pages = data.pages.map((page) => ({
    ...page,
    views: generateRandomValue(2000, 20000),
    avgTime: generateRandomTime(),
    bounceRate: Math.floor(Math.random() * 40 + 20),
  }));

  tbody.innerHTML = pages
    .map(
      (page) => `
        <tr>
            <td>${page.path}</td>
            <td>${page.views.toLocaleString()}</td>
            <td>${page.avgTime}</td>
            <td>${page.bounceRate}%</td>
        </tr>
    `
    )
    .join("");
}

function generateRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function generateRandomChange() {
  return Math.random() * 30 - 15;
}

function generateRandomTime() {
  const minutes = Math.floor(Math.random() * 5 + 1);
  const seconds = Math.floor(Math.random() * 60);
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

function initCharts() {
  createLineChart();
  createDoughnutChart();
}

function createLineChart() {
  const ctx = document.getElementById("lineChart").getContext("2d");
  lineChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
      datasets: [
        {
          label: "Visiteurs",
          data: [1200, 1900, 3000, 2500, 2200, 3000, 2800],
          borderColor: "#4ade80",
          backgroundColor: "rgba(74, 222, 128, 0.1)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Pages vues",
          data: [2400, 3800, 6000, 5000, 4400, 6000, 5600],
          borderColor: "#60a5fa",
          backgroundColor: "rgba(96, 165, 250, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
      },
      plugins: {
        legend: {
          labels: {
            color: "white",
          },
        },
      },
      scales: {
        x: {
          ticks: { color: "white" },
          grid: { color: "rgba(255,255,255,0.1)" },
        },
        y: {
          ticks: { color: "white" },
          grid: { color: "rgba(255,255,255,0.1)" },
        },
      },
      onResize: function (chart, size) {
        chart.canvas.style.height = "300px";
      },
    },
  });
}

function createDoughnutChart() {
  const ctx = document.getElementById("doughnutChart").getContext("2d");
  doughnutChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Google", "Direct", "Réseaux sociaux", "Email", "Référence"],
      datasets: [
        {
          data: [45, 25, 15, 10, 5],
          backgroundColor: [
            "#4ade80",
            "#60a5fa",
            "#f472b6",
            "#fbbf24",
            "#a78bfa",
          ],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
      },
      plugins: {
        legend: {
          labels: {
            color: "white",
          },
        },
      },
      onResize: function (chart, size) {
        chart.canvas.style.height = "300px";
      },
    },
  });
}

function updateCharts() {
  // Mettre à jour le graphique linéaire
  const newLineData = Array.from({ length: 7 }, () =>
    Math.floor(Math.random() * 3000 + 1000)
  );
  const newPageData = newLineData.map(
    (val) => val * 2 + Math.floor(Math.random() * 500)
  );

  lineChart.data.datasets[0].data = newLineData;
  lineChart.data.datasets[1].data = newPageData;
  lineChart.update();

  // Mettre à jour le graphique en secteurs
  const newDoughnutData = Array.from({ length: 5 }, () =>
    Math.floor(Math.random() * 40 + 10)
  );
  doughnutChart.data.datasets[0].data = newDoughnutData;
  doughnutChart.update();
}

// Actualisation automatique toutes les 30 secondes
setInterval(refreshData, 30000);
