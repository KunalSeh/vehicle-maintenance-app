// ==================== UTILITIES ====================
const $ = (sel, root=document) => root.querySelector(sel);

function showToast(msg, type='ok') {
  const toast = $('#toast'); const txt = $('#toastText');
  if (!toast || !txt) return alert(msg); // fallback
  toast.classList.remove('ok','err'); toast.classList.add(type);
  txt.textContent = msg;
  toast.classList.add('show'); clearTimeout(showToast._t);
  showToast._t = setTimeout(()=>toast.classList.remove('show'), 1800);
}

const store = {
  get(key, fallback){
    try{ return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
  },
  set(key, value){
    localStorage.setItem(key, JSON.stringify(value));
    // Notify all tabs/pages in-app to update live
    window.dispatchEvent(new CustomEvent('dataUpdated', { detail: key }));
  },
  remove(key){ localStorage.removeItem(key) }
};

// ==================== THEME ====================
function applyTheme(mode) {
  if (mode === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.dataset.theme = prefersDark ? 'dark' : 'light';
  } else {
    document.documentElement.dataset.theme = mode;
  }
}
function setTheme(mode){
  store.set('theme', mode);
  applyTheme(mode);
  if ($('#themeSelect')) $('#themeSelect').value = mode;
}
document.addEventListener('DOMContentLoaded', () => {
  const saved = store.get('theme', 'auto'); applyTheme(saved);
  if ($('#themeSelect')) $('#themeSelect').value = saved;

  $('#toggleThemeBtn')?.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme;
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next); showToast(`Theme: ${next}`, 'ok');
  });
  $('#themeSelect')?.addEventListener('change', (e)=>{ setTheme(e.target.value); showToast('Theme updated','ok') });
});

// ==================== DASHBOARD (Vehicles + Fuel Chart + Services) ====================
function displayDashboard() {
  const vehicles = store.get('vehicles', []);
  const vbox = $('#dashboardVehicles');
  if (vbox) {
    if (vehicles.length === 0) {
      vbox.innerHTML = "<p class='subtext'>No vehicles added yet.</p>";
    } else {
     vbox.innerHTML = vehicles.map((v,i)=>`
  <div class="card" style="margin-bottom:12px">
    <h2><i class="fa-solid fa-car"></i> ${v.name} (${v.model || ''})</h2>
    <p class="subtext">${v.type} • ${v.year || ''}</p>
    <p><strong>Odometer:</strong> ${v.odometer || 0} km</p>
    <p><strong>Fuel Type:</strong> ${v.fuel || '—'}</p>
<p><strong>Plate:</strong> ${v.regNumber || '—'}</p>
    <p><strong>Insurance Expiry:</strong> ${v.insuranceExpiry || '—'}</p>
    <p><strong>Next Service:</strong> ${v.nextService || '—'}</p>
    <button class="btn danger" onclick="deleteVehicle(${i})"><i class="fa-solid fa-trash"></i> Delete</button>
  </div>
`).join('');

    }
  }

  const sbox = $('#dashboardServices');
  if (sbox) {
    const services = store.get('services', []);
    if (services.length === 0) {
      sbox.innerHTML = "<p class='subtext'>No service records yet.</p>";
    } else {
      sbox.innerHTML = "<ul style='margin:0; padding-left:18px'>" +
        services.slice(-5).reverse().map(s=>`<li>${s.date} – <strong>${s.vehicle}</strong>: ${s.description} (${s.cost})</li>`).join('') +
      "</ul>";
    }
  }

  const canvas = $('#fuelChart');
  if (canvas) renderFuelChart(canvas);
}

function deleteVehicle(index){
  const vehicles = store.get('vehicles', []);
  if (!vehicles[index]) return;
  if (!confirm(`Delete vehicle "${vehicles[index].name}"?`)) return;

  // Optionally cascade delete related records:
  const name = vehicles[index].name;
  let fuels = store.get('fuelRecords', []).filter(r => r.vehicle !== name);
  let services = store.get('services', []).filter(s => s.vehicle !== name);

  vehicles.splice(index,1);
  store.set('vehicles', vehicles);
  store.set('fuelRecords', fuels);
  store.set('services', services);

  showToast('🚗 Vehicle deleted', 'ok');
  displayDashboard();
}

// Fuel chart uses real data
function renderFuelChart(canvas){
  const ctx = canvas.getContext('2d');
  const records = store.get('fuelRecords', []);

  const grouped = {};
  records.forEach(r=>{
    if(!grouped[r.vehicle]) grouped[r.vehicle]=[];
    grouped[r.vehicle].push({ x: r.date, y: parseFloat(r.liters) });
  });

  const palette = ["#36A2EB","#FF6384","#4BC0C0","#FFCE56","#9966FF","#FF9F40"];
  const datasets = Object.keys(grouped).map((veh,i)=>({
    label: veh, data: grouped[veh],
    borderWidth: 2, tension: .3, fill: false, borderColor: palette[i%palette.length]
  }));

  if (window.fuelChartInstance) window.fuelChartInstance.destroy();
  window.fuelChartInstance = new Chart(ctx, {
    type: 'line',
    data: { datasets },
    options: {
      responsive: true, parsing: false,
      scales: {
        x: { type: 'time', time: { unit: 'month' }, title: { display: true, text: 'Date' } },
        y: { beginAtZero: true, title: { display: true, text: 'Fuel (Liters)' } }
      },
      plugins: { legend: { display: true } }
    }
  });
}

// Re-render dashboard on any data change
window.addEventListener('dataUpdated', displayDashboard);
document.addEventListener('DOMContentLoaded', displayDashboard);

// ==================== POPULATE SELECTS (Fuel/Service pages) ====================
function populateVehicleSelects() {
  const vehicles = store.get('vehicles', []);
  const selects = [$('#fuelVehicle'), $('#serviceVehicle')].filter(Boolean);
  selects.forEach(sel=>{
    const current = sel.value;
    sel.innerHTML = vehicles.length
      ? vehicles.map(v=>`<option value="${v.name}">${v.name}</option>`).join('')
      : '<option value="" disabled selected>No vehicles</option>';
    if (current && [...sel.options].some(o=>o.value===current)) sel.value = current;
  });
}
document.addEventListener('DOMContentLoaded', populateVehicleSelects);
window.addEventListener('dataUpdated', e=>{
  if (['vehicles'].includes(e.detail)) populateVehicleSelects();
});

// ==================== ADD VEHICLE PAGE ====================
const addVehicleForm = $('#addVehicleForm');
if (addVehicleForm) {
  addVehicleForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const vehicles = store.get('vehicles', []);
   const newVehicle = {
  name: $('#vehicleName').value.trim(),
  type: $('#vehicleType').value.trim(),
  model: $('#vehicleModel')?.value.trim() || '',
  year: $('#vehicleYear')?.value.trim() || '',
  odometer: $('#odometer').value.trim(),
  fuel: $('#fuelType')?.value || '',          // ✅ fixed
  regNumber: $('#regNumber')?.value.trim() || '', // ✅ plate/registration
  insuranceExpiry: $('#insuranceExpiry')?.value || '',
  nextService: $('#nextService')?.value || '',
  createdAt: new Date().toISOString()
};

    if (!newVehicle.name || !newVehicle.type) {
      showToast('Please fill required fields','err'); return;
    }
    vehicles.push(newVehicle);
    store.set('vehicles', vehicles);
    showToast('Vehicle added ✅','ok');
    addVehicleForm.reset();
  });
}


// ==================== FUEL RECORDS PAGE ====================
const fuelForm = $('#fuelForm');
if (fuelForm) {
  fuelForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const records = store.get('fuelRecords', []);
    const rec = {
      vehicle: $('#fuelVehicle').value,
      date: $('#fuelDate').value,
      liters: $('#fuelLiters').value,
      cost: $('#fuelCost').value
    };
    records.push(rec); store.set('fuelRecords', records);
    showToast('Fuel record saved ⛽','ok');
    fuelForm.reset(); displayFuelRecords();
  });
  displayFuelRecords();
}

function displayFuelRecords(){
  const records = store.get('fuelRecords', []);
  const tbody = $('#fuelHistory'); if (!tbody) return;
  tbody.innerHTML = records.map(r=>`
    <tr>
      <td>${r.date}</td><td>${r.vehicle}</td><td>${r.liters}</td><td>${r.cost}</td>
    </tr>`).join('');
}

// ==================== SERVICE HISTORY PAGE ====================
const serviceForm = $('#serviceForm');
if (serviceForm) {
  serviceForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const services = store.get('services', []);
    const rec = {
      vehicle: $('#serviceVehicle').value,
      date: $('#serviceDate').value,
      description: $('#serviceDescription').value || $('#serviceDesc')?.value || '',
      cost: $('#serviceCost').value
    };
    services.push(rec); store.set('services', services);
    showToast('Service added 🛠','ok');
    serviceForm.reset(); displayServices();
  });
  displayServices();
}

function displayServices(){
  const services = store.get('services', []);
  const tbody = $('#serviceHistory'); if (!tbody) return;
  tbody.innerHTML = services.map(s=>`
    <tr>
      <td>${s.date}</td><td>${s.vehicle}</td><td>${s.description}</td><td>${s.cost}</td>
    </tr>`).join('');
}

// ==================== AUTH (Signup + Login + Logout) ====================

// Get current user
function getCurrentUser() {
  return store.get("currentUser", null);
}

// Signup
function signup() {
  const username = $('#signupUsername').value.trim();
  const password = $('#signupPassword').value.trim();

  if (!username || !password) {
    showToast("Please enter username and password", "err");
    return;
  }

  let users = store.get("users", []);

  // Check if user exists
  if (users.find(u => u.username === username)) {
    showToast("⚠️ Username already exists", "err");
    return;
  }

  // Save user
  users.push({ username, password });
  store.set("users", users);

  // Auto login
  store.set("currentUser", { username });
  showToast("✅ Signup successful!", "ok");

  // Redirect to dashboard
  window.location.href = "dashboard.html";
}

// Login
function login() {
  const username = $('#loginUsername').value.trim();
  const password = $('#loginPassword').value.trim();

  let users = store.get("users", []);
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    showToast("❌ Invalid username or password", "err");
    return;
  }

  store.set("currentUser", { username });
  showToast("✅ Login successful", "ok");

  window.location.href = "dashboard.html";
}

// Logout
function logout() {
  store.remove("currentUser");
  showToast("👋 Logged out", "ok");
  window.location.href = "login.html";
}

// Toggle signup/login forms
function showSignup() {
  $('#loginForm').style.display = 'none';
  $('#signupForm').style.display = 'block';
}
function showLogin() {
  $('#signupForm').style.display = 'none';
  $('#loginForm').style.display = 'block';
}

// Protect private pages (call this on dashboard)
function protectPage() {
  if (!getCurrentUser()) {
    window.location.href = "login.html";
  }
}
