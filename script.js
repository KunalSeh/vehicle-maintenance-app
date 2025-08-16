// ==================== FUEL CHART (Dashboard) ====================
let canvasElement = document.getElementById("fuelChart");

if (canvasElement) {
    let drawingArea = canvasElement.getContext("2d");

    let fuelChart = new Chart(drawingArea, {
        type: "line",
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
            datasets: [
                {
                    label: "Vehicle 1",
                    data: [120, 135, 110, 145, 160, 150, 170],
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false
                },
                {
                    label: "Vehicle 2",
                    data: [90, 105, 100, 115, 130, 125, 140],
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false
                },
                {
                    label: "Vehicle 3",
                    data: [150, 145, 160, 155, 165, 170, 175],
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false
                },
                {
                    label: "Vehicle 4",
                    data: [110, 115, 105, 120, 125, 130, 140],
                    borderColor: "rgba(255, 206, 86, 1)",
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: true } },
            scales: {
                y: { beginAtZero: true, title: { display: true, text: "Fuel (Liters)" } },
                x: { title: { display: true, text: "Month" } }
            }
        }
    });
}

// ==================== LOGIN / SIGNUP ====================
function showSignup() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("signupForm").style.display = "block";
}

function showLogin() {
    document.getElementById("signupForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
}

function signup() {
    let username = document.getElementById("signupUsername").value.trim();
    let password = document.getElementById("signupPassword").value.trim();

    if (username && password) {
        localStorage.setItem(username, password);
        alert("✅ Account created! Please log in.");
        showLogin();
    } else {
        alert("⚠️ Please fill all fields.");
    }
}

function login() {
    let username = document.getElementById("loginUsername").value.trim();
    let password = document.getElementById("loginPassword").value.trim();

    let storedPassword = localStorage.getItem(username);

    if (storedPassword && storedPassword === password) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("currentUser", username);
        window.location.href = "dashboard.html";
    } else {
        alert("❌ Invalid username or password!");
    }
}

function logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

// ==================== ADD VEHICLE ====================
let addVehicleForm = document.getElementById("addVehicleForm");
if (addVehicleForm) {
    addVehicleForm.addEventListener("submit", function (e) {
        e.preventDefault();

        let vehicles = JSON.parse(localStorage.getItem("vehicles")) || [];

        let newVehicle = {
            name: document.getElementById("vehicleName").value,
            type: document.getElementById("vehicleType").value,
            odometer: document.getElementById("odometer").value,
            lastService: document.getElementById("lastService").value
        };

        vehicles.push(newVehicle);
        localStorage.setItem("vehicles", JSON.stringify(vehicles));

        alert("🚗 Vehicle added successfully!");
        addVehicleForm.reset();
    });
}

// ==================== FUEL RECORDS ====================
let fuelForm = document.getElementById("fuelForm");
let fuelTableBody = document.getElementById("fuelTableBody");

if (fuelForm) {
    fuelForm.addEventListener("submit", function (e) {
        e.preventDefault();

        let records = JSON.parse(localStorage.getItem("fuelRecords")) || [];

        let newRecord = {
            vehicle: document.getElementById("fuelVehicle").value,
            date: document.getElementById("fuelDate").value,
            liters: document.getElementById("fuelLiters").value,
            cost: document.getElementById("fuelCost").value
        };

        records.push(newRecord);
        localStorage.setItem("fuelRecords", JSON.stringify(records));

        displayFuelRecords();
        fuelForm.reset();
    });

    displayFuelRecords();
}

function displayFuelRecords() {
    let records = JSON.parse(localStorage.getItem("fuelRecords")) || [];
    if (fuelTableBody) {
        fuelTableBody.innerHTML = "";
        records.forEach(r => {
            fuelTableBody.innerHTML += `
                <tr>
                    <td>${r.vehicle}</td>
                    <td>${r.date}</td>
                    <td>${r.liters}</td>
                    <td>${r.cost}</td>
                </tr>`;
        });
    }
}

// ==================== SERVICE HISTORY ====================
let serviceForm = document.getElementById("serviceForm");
let serviceTableBody = document.getElementById("serviceTableBody");

if (serviceForm) {
    serviceForm.addEventListener("submit", function (e) {
        e.preventDefault();

        let services = JSON.parse(localStorage.getItem("services")) || [];

        let newService = {
            vehicle: document.getElementById("serviceVehicle").value,
            date: document.getElementById("serviceDate").value,
            description: document.getElementById("serviceDescription").value,
            cost: document.getElementById("serviceCost").value
        };

        services.push(newService);
        localStorage.setItem("services", JSON.stringify(services));

        displayServices();
        serviceForm.reset();
    });

    displayServices();
}

function displayServices() {
    let services = JSON.parse(localStorage.getItem("services")) || [];
    if (serviceTableBody) {
        serviceTableBody.innerHTML = "";
        services.forEach(s => {
            serviceTableBody.innerHTML += `
                <tr>
                    <td>${s.vehicle}</td>
                    <td>${s.date}</td>
                    <td>${s.description}</td>
                    <td>${s.cost}</td>
                </tr>`;
        });
    }
}

// ==================== SETTINGS ====================
let profileForm = document.getElementById("profileForm");
if (profileForm) {
    let currentUser = localStorage.getItem("currentUser");
    document.getElementById("settingsUsername").value = currentUser;

    profileForm.addEventListener("submit", function (e) {
        e.preventDefault();

        let oldPass = document.getElementById("oldPassword").value.trim();
        let newPass = document.getElementById("newPassword").value.trim();
        let storedPassword = localStorage.getItem(currentUser);

        if (oldPass !== storedPassword) {
            alert("❌ Old password is incorrect!");
            return;
        }

        if (newPass) {
            localStorage.setItem(currentUser, newPass);
            alert("🔑 Password updated successfully!");
            profileForm.reset();
        } else {
            alert("⚠️ Enter a new password.");
        }
    });
}

// ==================== APP PREFERENCES ====================
function savePreferences() {
    let theme = document.getElementById("themeSelect").value;
    let notifications = document.getElementById("notificationsSelect").value;

    localStorage.setItem("theme", theme);
    localStorage.setItem("notifications", notifications);

    applyTheme();

    alert("✅ Preferences saved!");
}

function applyTheme() {
    let theme = localStorage.getItem("theme") || "light";
    if (theme === "dark") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }
}

document.addEventListener("DOMContentLoaded", applyTheme);
