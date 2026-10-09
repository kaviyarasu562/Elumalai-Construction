/* =========================================================
   EMPLOYEE MANAGEMENT SYSTEM
   CLEAN FRONTEND SCRIPT
========================================================= */


/* =========================================================
   API URLs
========================================================= */

const EMPLOYEE_API_URL = "/api/employees";
const ATTENDANCE_API_URL = "/api/attendance";
const PAYMENT_API_URL = "/api/payments";
const LEAVE_API_URL = "/api/leaves";
const ADVANCE_API_URL = "/api/advances";
const DASHBOARD_API_URL = "/api/dashboard";
const REPORT_API_URL = "/api/reports";


/* =========================================================
   GLOBAL DATA
========================================================= */

let employees = [];
let payments = [];
let attendanceRecords = [];
let leaves = [];
let advances = [];
let reportData = [];


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    setCurrentDate();
    setDefaultDates();

    loadEmployees();
    loadPayments();
    loadDashboard();
    loadFinancialAnalytics();

});


/* =========================================================
   NAVIGATION
========================================================= */

function showSection(sectionId) {

    document.querySelectorAll(".page-section")
        .forEach(section => {
            section.style.display = "none";
        });

    const selectedSection =
        document.getElementById(sectionId);

    if (!selectedSection) {
        return;
    }

    selectedSection.style.display = "block";


    switch (sectionId) {

        case "dashboardSection":
            loadDashboard();
            break;

        case "employeeSection":
            loadEmployees();
            break;

        case "attendanceSection":
            loadEmployees();
            break;

        case "leaveSection":
            loadEmployees();
            break;

        case "advanceSection":
            loadEmployees();
            break;

        case "paymentSection":
            loadEmployees();
            loadPayments();
            loadPayrollSummary();
            break;

        case "analyticsSection":
            loadFinancialAnalytics();
            break;

        default:
            break;
    }
}


/* =========================================================
   CURRENT DATE
========================================================= */

function getTodayString() {

    const today = new Date();

    const year = today.getFullYear();

    const month =
        String(today.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(today.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function setCurrentDate() {

    const element =
        document.getElementById("currentDate");

    if (!element) {
        return;
    }

    element.textContent =
        new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
}


/* =========================================================
   DEFAULT DATES
========================================================= */

function setDefaultDates() {

    const today = getTodayString();

    const simpleDateFields = [
        "dashboardDate",
        "attendanceDate",
        "advanceDate"
    ];

    simpleDateFields.forEach(id => {

        const element =
            document.getElementById(id);

        if (element) {
            element.value = today;
        }
    });


    const firstDay = new Date();

    firstDay.setDate(1);

    const firstDayString =
        formatDateInput(firstDay);


    const payrollStart =
        document.getElementById("payrollStartDate");

    const payrollEnd =
        document.getElementById("payrollEndDate");

    if (payrollStart) {
        payrollStart.value = firstDayString;
    }

    if (payrollEnd) {
        payrollEnd.value = today;
    }


    const reportStart =
        document.getElementById("reportStartDate");

    const reportEnd =
        document.getElementById("reportEndDate");

    if (reportStart) {
        reportStart.value = firstDayString;
    }

    if (reportEnd) {
        reportEnd.value = today;
    }
}


function formatDateInput(date) {

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(date.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;
}


/* =========================================================
   COMMON HELPERS
========================================================= */

function formatCurrency(value) {

    const number = Number(value || 0);

    return number.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR"
    });
}


function escapeHtml(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function setText(elementId, value) {

    const element =
        document.getElementById(elementId);

    if (element) {
        element.textContent = value;
    }
}


async function getJson(url, options = {}) {

    const response =
        await fetch(url, options);

    if (!response.ok) {

        let message =
            `Request failed: ${response.status}`;

        try {

            const text =
                await response.text();

            if (text) {
                message = text;
            }

        } catch (error) {
            console.error(
                "Unable to read error response:",
                error
            );
        }

        throw new Error(message);
    }

    const contentType =
        response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
        return response.json();
    }

    return null;
}


function findEmployee(employeeId) {

    return employees.find(
        employee =>
            Number(employee.employeeId) ===
            Number(employeeId)
    );
}


function findEmployeeName(employeeId) {

    const employee =
        findEmployee(employeeId);

    return employee?.name ??
        employee?.employeeName ??
        "Unknown";
}


/* =========================================================
   VALIDATION
========================================================= */

function validateAadhaar(aadhaar) {

    return /^\d{12}$/.test(
        String(aadhaar || "").trim()
    );
}


function validatePhone(phone) {

    return /^[6-9]\d{9}$/.test(
        String(phone || "").trim()
    );
}


function maskAadhaar(aadhaar) {

    if (!aadhaar) {
        return "Not available";
    }

    const value =
        String(aadhaar);

    return "XXXX-XXXX-" +
        value.slice(-4);
}


/* =========================================================
   EMPLOYEE VALIDATION
========================================================= */

function validateEmployeeForm() {

    const name =
        document.getElementById("employeeName")
            ?.value.trim();

    const aadhaar =
        document.getElementById("employeeAadhaar")
            ?.value.trim();

    const phone =
        document.getElementById("employeePhone")
            ?.value.trim();

    const address =
        document.getElementById("employeeAddress")
            ?.value.trim();

    const jobRole =
        document.getElementById("employeeJobRole")
            ?.value.trim();

    const dailyWage =
        Number(
            document.getElementById("employeeDailyWage")
                ?.value
        );


    if (!name) {
        alert("Employee name is required.");
        return false;
    }


    if (!validateAadhaar(aadhaar)) {
        alert("Aadhaar must contain exactly 12 digits.");
        return false;
    }


    if (!validatePhone(phone)) {
        alert(
            "Please enter a valid 10-digit Indian mobile number."
        );
        return false;
    }


    if (!address) {
        alert("Address is required.");
        return false;
    }


    if (!jobRole) {
        alert("Job role is required.");
        return false;
    }


    if (!Number.isFinite(dailyWage) || dailyWage <= 0) {
        alert("Daily wage must be greater than 0.");
        return false;
    }


    return true;
}


/* =========================================================
   EMPLOYEE MANAGEMENT
========================================================= */

async function loadEmployees() {

    try {

        employees =
            await getJson(EMPLOYEE_API_URL);

        if (!Array.isArray(employees)) {
            employees = [];
        }

        renderEmployees();
        populateEmployeeDropdowns();

    } catch (error) {

        console.error(
            "Employee loading error:",
            error
        );

        alert(
            "Unable to load employees.\n" +
            error.message
        );
    }
}


function renderEmployees() {

    const tbody =
        document.getElementById(
            "employeeTableBody"
        );

    if (!tbody) {
        return;
    }

    tbody.innerHTML = "";


    if (employees.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="7">
                    No employees found.
                </td>
            </tr>
        `;

        return;
    }


    employees.forEach(employee => {

        const id =
            employee.employeeId;

        const name =
            employee.name ??
            employee.employeeName ??
            "";

        const aadhaar =
            employee.aadhaarNumber ??
            "";

        const phone =
            employee.phone ??
            employee.phoneNumber ??
            "";

        const jobRole =
            employee.jobRole ??
            "";

        const wage =
            employee.dailyWage ??
            0;


        tbody.innerHTML += `

            <tr>

                <td>${escapeHtml(id)}</td>

                <td>${escapeHtml(name)}</td>

                <td>${escapeHtml(
                    maskAadhaar(aadhaar)
                )}</td>

                <td>${escapeHtml(phone)}</td>

                <td>${escapeHtml(jobRole)}</td>

                <td>${formatCurrency(wage)}</td>

                <td>

                    <button
                        type="button"
                        onclick="viewEmployeeDetails(${Number(id)})">
                        👁 View
                    </button>

                    <button
                        type="button"
                        onclick="editEmployee(${Number(id)})">
                        ✏ Edit
                    </button>
                    <button
                        type="button"
                        onclick="deleteEmployee(${Number(id)})">
                        🗑 Delete
                    </button>

                </td>

            </tr>

        `;
    });
}


function populateEmployeeDropdowns() {

    const dropdownIds = [

        "attendanceEmployee",
        "attendanceFilterEmployee",

        "leaveEmployee",
        "leaveFilterEmployee",
        "leaveSummaryEmployee",

        "advanceEmployee",
        "advanceFilterEmployee",

        "payrollEmployee",
        "paymentEmployeeFilter",

        "reportEmployee"

    ];


    dropdownIds.forEach(id => {

        const dropdown =
            document.getElementById(id);

        if (!dropdown) {
            return;
        }


        const currentValue =
            dropdown.value;


        const isFilter =
            id.includes("Filter") ||
            id === "reportEmployee";


        const firstOption =
            isFilter
                ? "All Employees"
                : "Select Employee";


        dropdown.innerHTML = `
            <option value="">
                ${firstOption}
            </option>
        `;


        employees.forEach(employee => {

            const employeeId =
                employee.employeeId;

            const employeeName =
                employee.name ??
                employee.employeeName ??
                "Unknown";


            dropdown.innerHTML += `
                <option value="${employeeId}">
                    ${escapeHtml(employeeName)}
                </option>
            `;
        });


        if (currentValue) {
            dropdown.value = currentValue;
        }

    });
}


async function saveEmployee(event) {

    event.preventDefault();


    if (!validateEmployeeForm()) {
        return;
    }


    const employee = {

        name:
            document
                .getElementById("employeeName")
                .value
                .trim(),

        aadhaarNumber:
            document
                .getElementById("employeeAadhaar")
                .value
                .trim(),

        phone:
            document
                .getElementById("employeePhone")
                .value
                .trim(),

        address:
            document
                .getElementById("employeeAddress")
                .value
                .trim(),

        jobRole:
            document
                .getElementById("employeeJobRole")
                .value
                .trim(),

        dailyWage:
            Number(
                document
                    .getElementById("employeeDailyWage")
                    .value
            ),

        joiningDate:
            document
                .getElementById("employeeJoiningDate")
                .value,

        status:
            document
                .getElementById("employeeStatus")
                .value,

        address:
            document
                .getElementById("employeeAddress")
                .value
                .trim()
    };


    try {

        await getJson(
            EMPLOYEE_API_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(employee)
            }
        );


        alert("Employee added successfully.");

        resetEmployeeForm();

        await loadEmployees();
        await loadDashboard();

    } catch (error) {

        console.error(
            "Save employee error:",
            error
        );

        alert(
            "Unable to save employee.\n" +
            error.message
        );
    }
}


function resetEmployeeForm() {

    const form =
        document.getElementById(
            "employeeForm"
        );

    if (form) {
        form.reset();
    }
}


function filterEmployees() {

    const search =
        document
            .getElementById("employeeSearch")
            ?.value
            .toLowerCase()
            .trim() || "";


    const tbody =
        document.getElementById(
            "employeeTableBody"
        );

    if (!tbody) {
        return;
    }


    const filtered =
        employees.filter(employee => {

            const name =
                String(
                    employee.name ??
                    employee.employeeName ??
                    ""
                ).toLowerCase();

            const phone =
                String(
                    employee.phone ??
                    employee.phoneNumber ??
                    ""
                ).toLowerCase();

            const jobRole =
                String(
                    employee.jobRole ??
                    ""
                ).toLowerCase();


            return (
                name.includes(search) ||
                phone.includes(search) ||
                jobRole.includes(search)
            );
        });


    tbody.innerHTML = "";


    if (filtered.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="7">
                    No matching employees found.
                </td>
            </tr>
        `;

        return;
    }


    filtered.forEach(employee => {

        const id =
            employee.employeeId;

        const name =
            employee.name ??
            employee.employeeName ??
            "";

        const aadhaar =
            employee.aadhaarNumber ??
            "";

        const phone =
            employee.phone ??
            employee.phoneNumber ??
            "";

        const jobRole =
            employee.jobRole ??
            "";

        const wage =
            employee.dailyWage ??
            0;


        tbody.innerHTML += `

            <tr>

                <td>${escapeHtml(id)}</td>

                <td>${escapeHtml(name)}</td>

                <td>${escapeHtml(
                    maskAadhaar(aadhaar)
                )}</td>

                <td>${escapeHtml(phone)}</td>

                <td>${escapeHtml(jobRole)}</td>

                <td>${formatCurrency(wage)}</td>

                <td>

                    <button
                        type="button"
                        onclick="viewEmployeeDetails(${Number(id)})">
                        👁 View
                    </button>

                    <button
                        type="button" 
                        onclick="editEmployee(${Number(id)})">
                        ✏ Edit
                    </button>

                </td>

            </tr>

        `;
    });
}


/* =========================================================
   EMPLOYEE DETAILS
========================================================= */

async function viewEmployeeDetails(employeeId) {

    try {

        const employee =
            await getJson(
                `${EMPLOYEE_API_URL}/${employeeId}`
            );


        const detailsSection =
            document.getElementById(
                "employeeDetailsSection"
            );

        const content =
            document.getElementById(
                "employeeDetailsContent"
            );


        if (!detailsSection || !content) {
            return;
        }


        detailsSection.style.display = "block";


        content.innerHTML = `

            <div class="details-grid">

                <p>
                    <strong>ID:</strong>
                    ${escapeHtml(employee.employeeId)}
                </p>

                <p>
                    <strong>Name:</strong>
                    ${escapeHtml(employee.name)}
                </p>

                <p>
                    <strong>Aadhaar:</strong>
                    ${escapeHtml(
                        maskAadhaar(
                            employee.aadhaarNumber
                        )
                    )}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${escapeHtml(employee.phone)}
                </p>

                <p>
                    <strong>Job Role:</strong>
                    ${escapeHtml(employee.jobRole)}
                </p>

                <p>
                    <strong>Daily Wage:</strong>
                    ${formatCurrency(employee.dailyWage)}
                </p>

                <p>
                    <strong>Address:</strong>
                    ${escapeHtml(employee.address)}
                </p>

            </div>
        `;


        await loadEmployeeAttendanceSummary(
            employeeId
        );

        await loadEmployeeSalaryLedger(
            employeeId
        );

    } catch (error) {

        console.error(
            "Employee details error:",
            error
        );

        alert(
            "Unable to load employee details.\n" +
            error.message
        );
    }
}
async function editEmployee(employeeId) {

    if (!employeeId) {
        alert("Employee ID is missing.");
        return;
    }

    try {

        const employee =
            await getJson(
                `${EMPLOYEE_API_URL}/${employeeId}`
            );

        document.getElementById("employeeName").value =
            employee.name ?? "";

        document.getElementById("employeeAadhaar").value =
            employee.aadhaarNumber ?? "";

        document.getElementById("employeePhone").value =
            employee.phone ?? "";

        document.getElementById("employeeAddress").value =
            employee.address ?? "";

        document.getElementById("employeeJobRole").value =
            employee.jobRole ?? "";

        document.getElementById("employeeDailyWage").value =
            employee.dailyWage ?? "";

        // Store employee ID for update
        const employeeIdField =
            document.getElementById("editingEmployeeId");

        if (employeeIdField) {
            employeeIdField.value = employeeId;
        }

        // Change form button text
        const submitButton =
            document.querySelector(
                "#employeeForm button[type='submit']"
            );

        if (submitButton) {
            submitButton.textContent =
                "Update Employee";
        }

        // Scroll to employee form
        const form =
            document.getElementById("employeeForm");

        if (form) {
            form.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

    } catch (error) {

        console.error(error);

        alert(
            "Unable to load employee for editing.\n" +
            error.message
        );
    }
}

function closeEmployeeDetails() {

    const section =
        document.getElementById(
            "employeeDetailsSection"
        );

    if (section) {
        section.style.display = "none";
    }
}


async function loadEmployeeAttendanceSummary(employeeId) {

    const container =
        document.getElementById(
            "employeeAttendanceSummary"
        );

    if (!container) {
        return;
    }


    try {

        const records =
            await getJson(
                `${ATTENDANCE_API_URL}/employee/${employeeId}`
            );


        let present = 0;
        let halfDay = 0;
        let absent = 0;


        if (Array.isArray(records)) {

            records.forEach(record => {

                if (record.status === "PRESENT") {
                    present++;
                }

                if (record.status === "HALF_DAY") {
                    halfDay++;
                }

                if (record.status === "ABSENT") {
                    absent++;
                }
            });
        }


        container.innerHTML = `

            <div class="panel">

                <h4>Attendance Summary</h4>

                <p>
                    Present:
                    <strong>${present}</strong>
                </p>

                <p>
                    Half Day:
                    <strong>${halfDay}</strong>
                </p>

                <p>
                    Absent:
                    <strong>${absent}</strong>
                </p>

            </div>
        `;

    } catch (error) {

        console.error(
            "Attendance summary error:",
            error
        );

        container.innerHTML =
            "<p>Unable to load attendance summary.</p>";
    }
}


async function loadEmployeeSalaryLedger(employeeId) {

    const container =
        document.getElementById(
            "employeeSalaryLedger"
        );

    if (!container) {
        return;
    }


    try {

        const records =
            await getJson(
                `${PAYMENT_API_URL}/employee/${employeeId}`
            );


        let html = `

            <div class="panel">

                <h4>Salary Ledger</h4>

                <div class="table-container">

                    <table>

                        <thead>

                            <tr>
                                <th>Period</th>
                                <th>Gross</th>
                                <th>Advance</th>
                                <th>Deduction</th>
                                <th>Net</th>
                                <th>Status</th>
                            </tr>

                        </thead>

                        <tbody>
        `;


        if (Array.isArray(records)) {

            records.forEach(payment => {

                if (payment.status === "CANCELLED") {
                    return;
                }


                html += `

                    <tr>

                        <td>
                            ${escapeHtml(
                                payment.startDate ?? ""
                            )}
                            -
                            ${escapeHtml(
                                payment.endDate ?? ""
                            )}
                        </td>

                        <td>
                            ${formatCurrency(
                                payment.grossAmount
                            )}
                        </td>

                        <td>
                            ${formatCurrency(
                                payment.advanceAmount
                            )}
                        </td>

                        <td>
                            ${formatCurrency(
                                payment.deductionAmount
                            )}
                        </td>

                        <td>
                            ${formatCurrency(
                                payment.netAmount
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                payment.status ?? ""
                            )}
                        </td>

                    </tr>
                `;
            });
        }


        html += `

                        </tbody>

                    </table>

                </div>

            </div>
        `;


        container.innerHTML = html;

    } catch (error) {

        console.error(
            "Salary ledger error:",
            error
        );

        container.innerHTML =
            "<p>Unable to load salary ledger.</p>";
    }
}


/* =========================================================
   ATTENDANCE
========================================================= */

function validateAttendanceDate() {

    const date =
        document
            .getElementById("attendanceDate")
            ?.value;


    if (!date) {

        alert("Attendance date is required.");

        return false;
    }


    if (date > getTodayString()) {

        alert(
            "Future attendance dates are not allowed."
        );

        return false;
    }


    return true;
}


function validateAttendanceForm() {

    const employeeId =
        document
            .getElementById("attendanceEmployee")
            ?.value;

    const date =
        document
            .getElementById("attendanceDate")
            ?.value;

    const status =
        document
            .getElementById("attendanceStatus")
            ?.value;


    if (!employeeId) {

        alert("Please select an employee.");

        return false;
    }


    if (!date) {

        alert("Attendance date is required.");

        return false;
    }


    if (!status) {

        alert("Please select attendance status.");

        return false;
    }


    return validateAttendanceDate();
}


async function isDuplicateAttendance(
    employeeId,
    attendanceDate,
    editingId = null
) {

    try {

        const list =
            await getJson(
                `${ATTENDANCE_API_URL}/employee/${employeeId}`
            );


        if (!Array.isArray(list)) {
            return false;
        }


        return list.some(attendance => {

            const sameDate =
                attendance.attendanceDate ===
                attendanceDate;


            const sameRecord =
                editingId === null ||
                Number(attendance.attendanceId) !==
                Number(editingId);


            return sameDate && sameRecord;
        });

    } catch (error) {

        console.error(
            "Duplicate attendance check error:",
            error
        );

        return false;
    }
}


async function saveAttendance(event) {

    event.preventDefault();


    if (!validateAttendanceForm()) {
        return;
    }


    const employeeId =
        document
            .getElementById("attendanceEmployee")
            .value;

    const date =
        document
            .getElementById("attendanceDate")
            .value;

    const status =
        document
            .getElementById("attendanceStatus")
            .value;


    const duplicate =
        await isDuplicateAttendance(
            employeeId,
            date
        );


    if (duplicate) {

        alert(
            "Attendance already exists for this employee on this date."
        );

        return;
    }


    const attendance = {

        attendanceDate: date,

        status: status,

        overtimeHours: 0,

        remarks: ""

    };


    try {

        await getJson(
            `${ATTENDANCE_API_URL}/employee/${employeeId}`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(attendance)
            }
        );


        alert(
            "Attendance saved successfully."
        );


        resetAttendanceForm();

        await loadAttendanceHistory();
        await loadDashboard();

    } catch (error) {

        console.error(
            "Save attendance error:",
            error
        );

        alert(
            "Unable to save attendance.\n" +
            error.message
        );
    }
}


function resetAttendanceForm() {

    const form =
        document.getElementById(
            "attendanceForm"
        );

    if (form) {
        form.reset();
    }


    const dateField =
        document.getElementById(
            "attendanceDate"
        );

    if (dateField) {
        dateField.value = getTodayString();
    }
}


async function loadAttendanceHistory() {

    const employeeId =
        document
            .getElementById(
                "attendanceFilterEmployee"
            )
            ?.value;


    const tbody =
        document.getElementById(
            "attendanceTableBody"
        );


    if (!tbody) {
        return;
    }


    if (!employeeId) {

        tbody.innerHTML = "";

        return;
    }


    try {

        attendanceRecords =
            await getJson(
                `${ATTENDANCE_API_URL}/employee/${employeeId}`
            );


        if (!Array.isArray(attendanceRecords)) {
            attendanceRecords = [];
        }


        tbody.innerHTML = "";


        attendanceRecords.forEach(record => {

            const employee =
                findEmployee(employeeId);


            tbody.innerHTML += `

                <tr>

                    <td>
                        ${escapeHtml(
                            record.attendanceId
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            employee?.name ??
                            "Unknown"
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            record.attendanceDate ??
                            ""
                        )}
                    </td>

                    <td>
                        ${getAttendanceBadge(
                            record.status
                        )}
                    </td>

                </tr>
            `;
        });


        if (attendanceRecords.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="4">
                        No attendance records found.
                    </td>
                </tr>
            `;
        }

    } catch (error) {

        console.error(
            "Attendance history error:",
            error
        );

        alert(
            "Unable to load attendance history."
        );
    }
}


function getAttendanceBadge(status) {

    switch (status) {

        case "PRESENT":
            return `
                <span class="badge present">
                    Present
                </span>
            `;

        case "HALF_DAY":
            return `
                <span class="badge half-day">
                    Half Day
                </span>
            `;

        case "ABSENT":
            return `
                <span class="badge absent">
                    Absent
                </span>
            `;

        default:
            return escapeHtml(status ?? "");
    }
}


async function loadEmployeeAttendance(employee) {

    if (!employee || !employee.employeeId) {

        console.error(
            "Invalid employee object:",
            employee
        );

        alert("Employee ID is missing.");

        return;
    }


    try {

        const data =
            await getJson(
                `${ATTENDANCE_API_URL}/employee/${employee.employeeId}`
            );

        console.log(
            "Attendance:",
            data
        );

    } catch (error) {

        console.error(
            "Attendance error:",
            error
        );
    }
}


/* =========================================================
   LEAVE MANAGEMENT
========================================================= */

async function saveLeave(event) {

    event.preventDefault();


    const employeeId =
        document
            .getElementById("leaveEmployee")
            ?.value;

    const startDate =
        document
            .getElementById("leaveStartDate")
            ?.value;

    const endDate =
        document
            .getElementById("leaveEndDate")
            ?.value;

    const leaveType =
        document
            .getElementById("leaveType")
            ?.value;

    const reason =
        document
            .getElementById("leaveReason")
            ?.value
            .trim();

    const status =
        document
            .getElementById("leaveStatus")
            ?.value;


    if (!employeeId) {

        alert("Please select an employee.");

        return;
    }


    if (!startDate || !endDate) {

        alert(
            "Start and end dates are required."
        );

        return;
    }


    if (startDate > endDate) {

        alert(
            "Start date cannot be after end date."
        );

        return;
    }


    if (!leaveType) {

        alert("Please select leave type.");

        return;
    }


    const leave = {

        startDate,
        endDate,
        leaveType,
        reason,
        status

    };


    try {

        await getJson(
            `${LEAVE_API_URL}/employee/${employeeId}`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(leave)
            }
        );


        alert(
            "Leave / holiday saved successfully."
        );


        resetLeaveForm();

        await loadLeaveHistory();

    } catch (error) {

        console.error(
            "Save leave error:",
            error
        );

        alert(
            "Unable to save leave.\n" +
            error.message
        );
    }
}


function resetLeaveForm() {

    const form =
        document.getElementById(
            "leaveForm"
        );

    if (form) {
        form.reset();
    }
}


async function loadLeaveHistory() {

    const employeeId =
        document
            .getElementById(
                "leaveFilterEmployee"
            )
            ?.value;


    const tbody =
        document.getElementById(
            "leaveTableBody"
        );


    if (!tbody) {
        return;
    }


    if (!employeeId) {

        tbody.innerHTML = "";

        return;
    }


    try {

        leaves =
            await getJson(
                `${LEAVE_API_URL}/employee/${employeeId}`
            );


        if (!Array.isArray(leaves)) {
            leaves = [];
        }


        tbody.innerHTML = "";


        leaves.forEach(leave => {

            const employee =
                findEmployee(employeeId);


            const leaveId =
                leave.leaveId ??
                leave.id;


            tbody.innerHTML += `

                <tr>

                    <td>
                        ${escapeHtml(leaveId)}
                    </td>

                    <td>
                        ${escapeHtml(
                            employee?.name ??
                            "Unknown"
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            leave.startDate ?? ""
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            leave.endDate ?? ""
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            leave.leaveType ?? ""
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            leave.status ?? ""
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            leave.reason ?? ""
                        )}
                    </td>

                    <td>

                        <button
                            type="button"
                            onclick="deleteLeave(${Number(leaveId)})">
                            🗑 Delete
                        </button>

                    </td>

                </tr>
            `;
        });


        if (leaves.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="8">
                        No leave records found.
                    </td>
                </tr>
            `;
        }

    } catch (error) {

        console.error(
            "Leave history error:",
            error
        );

        alert(
            "Unable to load leave history."
        );
    }
}


async function deleteLeave(leaveId) {

    if (
        !confirm(
            "Are you sure you want to delete this leave?"
        )
    ) {
        return;
    }


    try {

        await getJson(
            `${LEAVE_API_URL}/${leaveId}`,
            {
                method: "DELETE"
            }
        );


        alert(
            "Leave deleted successfully."
        );


        await loadLeaveHistory();

    } catch (error) {

        console.error(
            "Delete leave error:",
            error
        );

        alert(
            "Unable to delete leave.\n" +
            error.message
        );
    }
}


async function loadLeaveSummary() {

    const employeeId =
        document
            .getElementById(
                "leaveSummaryEmployee"
            )
            ?.value;

    const startDate =
        document
            .getElementById(
                "leaveSummaryStart"
            )
            ?.value;

    const endDate =
        document
            .getElementById(
                "leaveSummaryEnd"
            )
            ?.value;

    const result =
        document.getElementById(
            "leaveSummaryResult"
        );


    if (!result) {
        return;
    }


    if (!employeeId) {

        alert("Please select an employee.");

        return;
    }


    if (!startDate || !endDate) {

        alert(
            "Please select start and end dates."
        );

        return;
    }


    if (startDate > endDate) {

        alert(
            "Start date cannot be after end date."
        );

        return;
    }


    try {

        const summary =
            await getJson(
                `${LEAVE_API_URL}/employee/${employeeId}/summary` +
                `?startDate=${encodeURIComponent(startDate)}` +
                `&endDate=${encodeURIComponent(endDate)}`
            );


        result.innerHTML = `

            <div class="cards">

                <div class="card">
                    <h4>Paid Leave</h4>
                    <p>
                        ${summary?.paidLeaveDays ?? 0}
                    </p>
                </div>

                <div class="card">
                    <h4>Unpaid Leave</h4>
                    <p>
                        ${summary?.unpaidLeaveDays ?? 0}
                    </p>
                </div>

                <div class="card">
                    <h4>Holiday</h4>
                    <p>
                        ${summary?.holidayDays ?? 0}
                    </p>
                </div>

                <div class="card">
                    <h4>Total Leave</h4>
                    <p>
                        ${summary?.totalLeaveDays ?? 0}
                    </p>
                </div>

            </div>
        `;

    } catch (error) {

        console.error(
            "Leave summary error:",
            error
        );

        alert(
            "Unable to load leave summary."
        );
    }
}


/* =========================================================
   SALARY ADVANCES
========================================================= */

async function saveAdvance(event) {

    event.preventDefault();


    const employeeId =
        document
            .getElementById("advanceEmployee")
            ?.value;

    const advanceDate =
        document
            .getElementById("advanceDate")
            ?.value;

    const amount =
        Number(
            document
                .getElementById("advanceAmount")
                ?.value
        );

    const paymentMethod =
        document
            .getElementById(
                "advancePaymentMethod"
            )
            ?.value;

    const notes =
        document
            .getElementById("advanceNotes")
            ?.value
            .trim();


    if (!employeeId) {

        alert("Please select an employee.");

        return;
    }


    if (!advanceDate) {

        alert("Advance date is required.");

        return;
    }


    if (!Number.isFinite(amount) || amount <= 0) {

        alert(
            "Advance amount must be greater than 0."
        );

        return;
    }


    const advance = {

        advanceDate,
        amount,
        paymentMethod,
        notes,
        status: "ACTIVE"

    };


    try {

        await getJson(
            `${ADVANCE_API_URL}/employee/${employeeId}`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(advance)
            }
        );


        alert(
            "Salary advance saved successfully."
        );


        resetAdvanceForm();

        await loadAdvanceHistory();
        await loadFinancialAnalytics();

    } catch (error) {

        console.error(
            "Save advance error:",
            error
        );

        alert(
            "Unable to save advance.\n" +
            error.message
        );
    }
}


function resetAdvanceForm() {

    const form =
        document.getElementById(
            "advanceForm"
        );

    if (form) {
        form.reset();
    }


    const dateField =
        document.getElementById(
            "advanceDate"
        );

    if (dateField) {
        dateField.value = getTodayString();
    }
}


async function loadAdvanceHistory() {

    const employeeId =
        document
            .getElementById(
                "advanceFilterEmployee"
            )
            ?.value;


    const tbody =
        document.getElementById(
            "advanceTableBody"
        );


    if (!tbody) {
        return;
    }


    if (!employeeId) {

        tbody.innerHTML = "";

        return;
    }


    try {

        advances =
            await getJson(
                `${ADVANCE_API_URL}/employee/${employeeId}`
            );


        if (!Array.isArray(advances)) {
            advances = [];
        }


        tbody.innerHTML = "";


        advances.forEach(advance => {

            const employee =
                findEmployee(employeeId);


            const advanceId =
                advance.advanceId ??
                advance.id;


            const action =
                advance.status === "DEDUCTED"

                    ? `<span>🔒 Deducted</span>`

                    : `
                        <button
                            type="button"
                            onclick="deleteAdvance(${Number(advanceId)})">
                            🗑 Delete
                        </button>
                    `;


            tbody.innerHTML += `

                <tr>

                    <td>
                        ${escapeHtml(advanceId)}
                    </td>

                    <td>
                        ${escapeHtml(
                            employee?.name ??
                            "Unknown"
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            advance.advanceDate ?? ""
                        )}
                    </td>

                    <td>
                        ${formatCurrency(
                            advance.amount
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            advance.paymentMethod ?? ""
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            advance.status ?? ""
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            advance.notes ?? ""
                        )}
                    </td>

                    <td>
                        ${action}
                    </td>

                </tr>
            `;
        });


        if (advances.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="8">
                        No advance records found.
                    </td>
                </tr>
            `;
        }

    } catch (error) {

        console.error(
            "Advance history error:",
            error
        );

        alert(
            "Unable to load advance history."
        );
    }
}


async function deleteAdvance(advanceId) {

    if (
        !confirm(
            "Are you sure you want to delete this advance?"
        )
    ) {
        return;
    }


    try {

        await getJson(
            `${ADVANCE_API_URL}/${advanceId}`,
            {
                method: "DELETE"
            }
        );


        alert(
            "Advance deleted successfully."
        );


        await loadAdvanceHistory();
        await loadFinancialAnalytics();

    } catch (error) {

        console.error(
            "Delete advance error:",
            error
        );

        alert(
            "Unable to delete advance.\n" +
            error.message
        );
    }
}


/* =========================================================
   PAYROLL CALCULATION
========================================================= */

async function calculatePayroll(event) {

    event.preventDefault();


    const employeeId =
        document
            .getElementById("payrollEmployee")
            ?.value;

    const startDate =
        document
            .getElementById("payrollStartDate")
            ?.value;

    const endDate =
        document
            .getElementById("payrollEndDate")
            ?.value;

    const bonus =
        Number(
            document
                .getElementById("payrollBonus")
                ?.value || 0
        );

    const deduction =
        Number(
            document
                .getElementById("payrollDeduction")
                ?.value || 0
        );


    if (!employeeId) {

        alert("Please select an employee.");

        return;
    }


    if (!startDate || !endDate) {

        alert(
            "Start date and end date are required."
        );

        return;
    }


    if (startDate > endDate) {

        alert(
            "Start date cannot be after end date."
        );

        return;
    }


    if (bonus < 0 || deduction < 0) {

        alert(
            "Bonus and deduction cannot be negative."
        );

        return;
    }


    try {

        const url =
            `${PAYMENT_API_URL}/calculate` +
            `?employeeId=${encodeURIComponent(employeeId)}` +
            `&startDate=${encodeURIComponent(startDate)}` +
            `&endDate=${encodeURIComponent(endDate)}` +
            `&bonusAmount=${encodeURIComponent(bonus)}` +
            `&deductionAmount=${encodeURIComponent(deduction)}`;


        const payment =
            await getJson(
                url,
                {
                    method: "POST"
                }
            );


        alert(
            "Payroll calculated successfully.\n" +
            "Status: " +
            (payment?.status ?? "PENDING")
        );


        const form =
            document.getElementById(
                "payrollForm"
            );

        if (form) {
            form.reset();
        }


        await loadPayments();
        await loadPayrollSummary();
        await loadDashboard();
        await loadFinancialAnalytics();

    } catch (error) {

        console.error(
            "Payroll calculation error:",
            error
        );

        alert(
            "Payroll calculation failed.\n" +
            error.message
        );
    }
}


/* =========================================================
   LOAD PAYMENTS
========================================================= */

async function loadPayments() {

    try {

        const status =
            document
                .getElementById(
                    "paymentStatusFilter"
                )
                ?.value || "ALL";


        const employeeId =
            document
                .getElementById(
                    "paymentEmployeeFilter"
                )
                ?.value || "";


        if (
            status !== "ALL" &&
            employeeId
        ) {

            payments =
                await getJson(
                    `${PAYMENT_API_URL}/status/${encodeURIComponent(status)}`
                );


            if (Array.isArray(payments)) {

                payments =
                    payments.filter(payment => {

                        const paymentEmployeeId =
                            payment.employee?.employeeId ??
                            payment.employee?.id;

                        return Number(
                            paymentEmployeeId
                        ) === Number(employeeId);

                    });
            }

        }

        else if (status !== "ALL") {

            payments =
                await getJson(
                    `${PAYMENT_API_URL}/status/${encodeURIComponent(status)}`
                );

        }

        else if (employeeId) {

            payments =
                await getJson(
                    `${PAYMENT_API_URL}/employee/${encodeURIComponent(employeeId)}`
                );

        }

        else {

            payments =
                await getJson(
                    PAYMENT_API_URL
                );
        }


        if (!Array.isArray(payments)) {
            payments = [];
        }


        renderPayments();
        loadPayrollSummary();

    } catch (error) {

        console.error(
            "Payment loading error:",
            error
        );

        alert(
            "Unable to load payments.\n" +
            error.message
        );
    }
}


/* =========================================================
   RENDER PAYMENTS
========================================================= */

function renderPayments() {
    const tbody = document.getElementById("paymentTableBody");

    if (!tbody) return;

    if (!payments.length) {
        tbody.innerHTML = `
            <tr><td colspan="10">No payroll records found.</td></tr>
        `;
        return;
    }

    tbody.innerHTML = payments.map(payment => {
        const paymentId = payment.paymentId ?? payment.id;
        const employeeId = payment.employee?.employeeId ?? payment.employee?.id;
        const employeeName = payment.employee?.name ?? findEmployeeName(employeeId);
        const status = payment.status ?? payment.paymentStatus ?? "PENDING";
        const period = `${payment.startDate ?? payment.weekStartDate ?? "-"} to ${payment.endDate ?? payment.weekEndDate ?? "-"}`;
        let action = `<span class="locked">—</span>`;

        if (status === "PENDING") {
            action = `
                <button type="button" onclick="approvePayment(${Number(paymentId)})">✅ Approve</button>
                <button type="button" onclick="cancelPayment(${Number(paymentId)})">❌ Cancel</button>`;
        } else if (status === "APPROVED") {
            action = `
                <button type="button" onclick="markPaymentAsPaid(${Number(paymentId)})">💰 Mark Paid</button>
                <button type="button" onclick="cancelPayment(${Number(paymentId)})">❌ Cancel</button>`;
        } else if (status === "PAID") {
            action = `<span class="locked">🔒 Locked</span>`;
        } else if (status === "CANCELLED") {
            action = `<span class="cancelled">❌ Cancelled</span>`;
        }

        return `
            <tr>
                <td>${escapeHtml(paymentId)}</td>
                <td>${escapeHtml(employeeName)}</td>
                <td class="payroll-period">${escapeHtml(period)}</td>
                <td>${formatCurrency(payment.grossAmount)}</td>
                <td>${formatCurrency(payment.bonusAmount)}</td>
                <td>${formatCurrency(payment.advanceAmount)}</td>
                <td>${formatCurrency(payment.deductionAmount)}</td>
                <td><strong>${formatCurrency(payment.netAmount)}</strong></td>
                <td>${getPaymentStatusBadge(status)}</td>
                <td class="payroll-actions">${action}</td>
            </tr>`;
    }).join("");
}


function getPaymentStatusBadge(status) {

    switch (status) {

        case "PENDING":
            return `
                <span class="badge pending">
                    ⏳ Pending
                </span>
            `;

        case "APPROVED":
            return `
                <span class="badge approved">
                    ✅ Approved
                </span>
            `;

        case "PAID":
            return `
                <span class="badge paid">
                    💰 Paid
                </span>
            `;

        case "CANCELLED":
            return `
                <span class="badge cancelled">
                    ❌ Cancelled
                </span>
            `;

        default:
            return escapeHtml(status ?? "");
    }
}


/* =========================================================
   APPROVE PAYMENT
========================================================= */

async function approvePayment(paymentId) {

    const approvedBy =
        prompt(
            "Enter approver name:"
        );


    if (!approvedBy?.trim()) {

        alert(
            "Approved by is required."
        );

        return;
    }


    try {

        await getJson(
            `${PAYMENT_API_URL}/${paymentId}/approve` +
            `?approvedBy=${encodeURIComponent(
                approvedBy.trim()
            )}`,
            {
                method: "PUT"
            }
        );


        alert(
            "Payroll approved successfully."
        );


        await loadPayments();
        await loadPayrollSummary();
        await loadDashboard();

    } catch (error) {

        console.error(
            "Approval error:",
            error
        );

        alert(
            "Approval failed.\n" +
            error.message
        );
    }
}


/* =========================================================
   MARK PAYMENT AS PAID
========================================================= */

async function markPaymentAsPaid(paymentId) {

    const paymentMethod =
        prompt(
            "Payment method:\nCASH / UPI / BANK_TRANSFER",
            "CASH"
        );


    if (!paymentMethod) {
        return;
    }


    const method =
        paymentMethod
            .trim()
            .toUpperCase();


    const validMethods = [
        "CASH",
        "UPI",
        "BANK_TRANSFER"
    ];


    if (!validMethods.includes(method)) {

        alert(
            "Invalid payment method."
        );

        return;
    }


    const notes =
        prompt(
            "Payment notes (optional):",
            ""
        );


    if (
        !confirm(
            "Confirm that this payroll has been paid?"
        )
    ) {
        return;
    }


    try {

        await getJson(
            `${PAYMENT_API_URL}/${paymentId}/paid` +
            `?paymentMethod=${encodeURIComponent(method)}` +
            `&notes=${encodeURIComponent(notes || "")}`,
            {
                method: "PUT"
            }
        );


        alert(
            "Payment completed and payroll is now locked."
        );


        await loadPayments();
        await loadPayrollSummary();
        await loadDashboard();
        await loadFinancialAnalytics();

    } catch (error) {

        console.error(
            "Payment error:",
            error
        );

        alert(
            "Payment failed.\n" +
            error.message
        );
    }
}


/* =========================================================
   CANCEL PAYMENT
========================================================= */

async function cancelPayment(paymentId) {

    const cancelledBy =
        prompt(
            "Enter your name:"
        );


    if (!cancelledBy?.trim()) {

        alert(
            "Cancelled by is required."
        );

        return;
    }


    const reason =
        prompt(
            "Enter cancellation reason:"
        );


    if (!reason?.trim()) {

        alert(
            "Cancellation reason is required."
        );

        return;
    }


    if (
        !confirm(
            "Are you sure you want to cancel this payroll?"
        )
    ) {
        return;
    }


    try {

        await getJson(
            `${PAYMENT_API_URL}/${paymentId}/cancel` +
            `?cancelledBy=${encodeURIComponent(
                cancelledBy.trim()
            )}` +
            `&reason=${encodeURIComponent(
                reason.trim()
            )}`,
            {
                method: "PUT"
            }
        );


        alert(
            "Payroll cancelled successfully."
        );


        await loadPayments();
        await loadPayrollSummary();
        await loadDashboard();
        await loadFinancialAnalytics();

    } catch (error) {

        console.error(
            "Cancellation error:",
            error
        );

        alert(
            "Cancellation failed.\n" +
            error.message
        );
    }
}


/* =========================================================
   PAYROLL SUMMARY
========================================================= */

function loadPayrollSummary() {

    if (!Array.isArray(payments)) {
        return;
    }


    const pending =
        payments.filter(
            payment =>
                payment.status === "PENDING"
        ).length;


    const approved =
        payments.filter(
            payment =>
                payment.status === "APPROVED"
        ).length;


    const paid =
        payments.filter(
            payment =>
                payment.status === "PAID"
        ).length;


    const cancelled =
        payments.filter(
            payment =>
                payment.status === "CANCELLED"
        ).length;


    const total =
        payments.filter(
            payment =>
                payment.status !== "CANCELLED"
        ).length;


    setText(
        "payrollTotalCount",
        total
    );

    setText(
        "payrollPendingCount",
        pending
    );

    setText(
        "payrollApprovedCount",
        approved
    );

    setText(
        "payrollPaidCount",
        paid
    );

    setText(
        "payrollCancelledCount",
        cancelled
    );
}


/* =========================================================
   DASHBOARD
========================================================= */

async function loadDashboard() {

    const date =
        document
            .getElementById("dashboardDate")
            ?.value;


    if (!date) {
        return;
    }


    try {

        const dashboard =
            await getJson(
                `${DASHBOARD_API_URL}?date=${encodeURIComponent(date)}`
            );


        setText(
            "dashboardTotalWorkers",
            dashboard?.totalWorkers ??
            dashboard?.totalEmployees ??
            0
        );


        setText(
            "dashboardPresent",
            dashboard?.presentToday ?? 0
        );


        setText(
            "dashboardHalfDay",
            dashboard?.halfDayToday ?? 0
        );


        setText(
            "dashboardAbsent",
            dashboard?.absentToday ?? 0
        );


        const present =
            Number(
                dashboard?.presentToday ?? 0
            );


        const halfDay =
            Number(
                dashboard?.halfDayToday ?? 0
            );


        const absent =
            Number(
                dashboard?.absentToday ?? 0
            );


        const total =
            present +
            halfDay +
            absent;


        const attendancePercentage =
            total === 0

                ? 0

                : (
                    (
                        present +
                        halfDay * 0.5
                    ) / total
                ) * 100;


        setText(
            "dashboardAttendancePercentage",
            attendancePercentage.toFixed(1) + "%"
        );


        setText(
            "dashboardPaidSalary",
            formatCurrency(
                dashboard?.paidSalary ??
                dashboard?.totalPaidAmount ??
                0
            )
        );


        setText(
            "dashboardPendingSalary",
            formatCurrency(
                dashboard?.pendingSalary ??
                dashboard?.totalPendingAmount ??
                0
            )
        );


        updateDashboardPayrollCards();

    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );
    }
}


function updateDashboardPayrollCards() {

    if (!Array.isArray(payments)) {
        return;
    }


    const pending =
        payments.filter(
            payment =>
                payment.status === "PENDING"
        ).length;


    const approved =
        payments.filter(
            payment =>
                payment.status === "APPROVED"
        ).length;


    const paid =
        payments.filter(
            payment =>
                payment.status === "PAID"
        ).length;


    const cancelled =
        payments.filter(
            payment =>
                payment.status === "CANCELLED"
        ).length;


    const total =
        payments.filter(
            payment =>
                payment.status !== "CANCELLED"
        ).length;


    setText(
        "dashboardPayrollTotal",
        total
    );

    setText(
        "dashboardPayrollPending",
        pending
    );

    setText(
        "dashboardPayrollApproved",
        approved
    );

    setText(
        "dashboardPayrollPaid",
        paid
    );

    setText(
        "dashboardPayrollCancelled",
        cancelled
    );
}


/* =========================================================
   FINANCIAL ANALYTICS
========================================================= */

async function loadFinancialAnalytics() {

    try {

        const allPayments =
            await getJson(
                PAYMENT_API_URL
            );


        if (!Array.isArray(allPayments)) {
            renderFinancialAnalytics([]);
            return;
        }


        const validPayments =
            allPayments.filter(
                payment =>
                    payment.status !== "CANCELLED"
            );


        let totalGross = 0;
        let totalBonus = 0;
        let totalAdvance = 0;
        let totalDeduction = 0;
        let totalNet = 0;
        let totalPaid = 0;
        let totalPending = 0;


        const workerMap =
            new Map();


        validPayments.forEach(payment => {

            const gross =
                Number(
                    payment.grossAmount || 0
                );


            const bonus =
                Number(
                    payment.bonusAmount || 0
                );


            const advance =
                Number(
                    payment.advanceAmount || 0
                );


            const deduction =
                Number(
                    payment.deductionAmount || 0
                );


            const net =
                Number(
                    payment.netAmount || 0
                );


            totalGross += gross;
            totalBonus += bonus;
            totalAdvance += advance;
            totalDeduction += deduction;
            totalNet += net;


            if (payment.status === "PAID") {
                totalPaid += net;
            }


            if (
                payment.status === "PENDING" ||
                payment.status === "APPROVED"
            ) {
                totalPending += net;
            }


            const employeeId =
                payment.employee?.employeeId ??
                payment.employee?.id ??
                "unknown";


            const employeeName =
                payment.employee?.name ??
                findEmployeeName(employeeId);


            if (!workerMap.has(employeeId)) {

                workerMap.set(
                    employeeId,
                    {
                        employeeName,
                        gross: 0,
                        bonus: 0,
                        advance: 0,
                        deduction: 0,
                        net: 0,
                        paid: 0,
                        pending: 0
                    }
                );
            }


            const worker =
                workerMap.get(employeeId);


            worker.gross += gross;
            worker.bonus += bonus;
            worker.advance += advance;
            worker.deduction += deduction;
            worker.net += net;


            if (payment.status === "PAID") {
                worker.paid += net;
            }


            if (
                payment.status === "PENDING" ||
                payment.status === "APPROVED"
            ) {
                worker.pending += net;
            }
        });


        setText(
            "analyticsGross",
            formatCurrency(totalGross)
        );

        setText(
            "analyticsBonus",
            formatCurrency(totalBonus)
        );

        setText(
            "analyticsAdvance",
            formatCurrency(totalAdvance)
        );

        setText(
            "analyticsDeduction",
            formatCurrency(totalDeduction)
        );

        setText(
            "analyticsNet",
            formatCurrency(totalNet)
        );

        setText(
            "analyticsPaid",
            formatCurrency(totalPaid)
        );

        setText(
            "analyticsPending",
            formatCurrency(totalPending)
        );


        renderFinancialAnalytics(
            Array.from(workerMap.values())
        );

    } catch (error) {

        console.error(
            "Financial analytics error:",
            error
        );
    }
}


function renderFinancialAnalytics(workers) {

    const tbody =
        document.getElementById(
            "analyticsTableBody"
        );


    if (!tbody) {
        return;
    }


    tbody.innerHTML = "";


    if (!workers.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="8">
                    No financial data found.
                </td>
            </tr>
        `;

        return;
    }


    workers.forEach(worker => {

        tbody.innerHTML += `

            <tr>

                <td>
                    ${escapeHtml(
                        worker.employeeName
                    )}
                </td>

                <td>
                    ${formatCurrency(
                        worker.gross
                    )}
                </td>

                <td>
                    ${formatCurrency(
                        worker.bonus
                    )}
                </td>

                <td>
                    ${formatCurrency(
                        worker.advance
                    )}
                </td>

                <td>
                    ${formatCurrency(
                        worker.deduction
                    )}
                </td>

                <td>
                    <strong>
                        ${formatCurrency(
                            worker.net
                        )}
                    </strong>
                </td>

                <td>
                    ${formatCurrency(
                        worker.paid
                    )}
                </td>

                <td>
                    ${formatCurrency(
                        worker.pending
                    )}
                </td>

            </tr>
        `;
    });
}


/* =========================================================
   REPORTS
========================================================= */

async function generateReport() {

    const employeeId =
        document
            .getElementById(
                "reportEmployee"
            )
            ?.value;


    const startDate =
        document
            .getElementById(
                "reportStartDate"
            )
            ?.value;


    const endDate =
        document
            .getElementById(
                "reportEndDate"
            )
            ?.value;


    if (!startDate || !endDate) {

        alert(
            "Please select report dates."
        );

        return;
    }


    if (startDate > endDate) {

        alert(
            "Start date cannot be after end date."
        );

        return;
    }


    try {

        const query = new URLSearchParams({
            startDate,
            endDate
        });

        if (employeeId) {
            query.set("employeeId", employeeId);
        }

        const report = await getJson(
            `${REPORT_API_URL}?${query.toString()}`
        );

        reportData = Array.isArray(report?.rows)
            ? report.rows
            : [];

        renderReport();
        return;

        const selectedEmployees =
            employeeId

                ? employees.filter(
                    employee =>
                        Number(
                            employee.employeeId
                        ) ===
                        Number(employeeId)
                )

                : employees;


        reportData = [];


        for (
            const employee
            of selectedEmployees
        ) {

            const id =
                employee.employeeId;


            const attendance =
                await getJson(
                    `${ATTENDANCE_API_URL}/employee/${id}`
                );


            const leave =
                await getJson(
                    `${LEAVE_API_URL}/employee/${id}`
                );


            const paymentsForEmployee =
                await getJson(
                    `${PAYMENT_API_URL}/employee/${id}`
                );


            const attendanceRecordsForReport =
                Array.isArray(attendance)
                    ? attendance
                    : [];


            const leaveRecordsForReport =
                Array.isArray(leave)
                    ? leave
                    : [];


            const paymentRecordsForReport =
                Array.isArray(
                    paymentsForEmployee
                )
                    ? paymentsForEmployee
                    : [];


            /*
             * IMPORTANT:
             * Attendance entity uses attendanceDate,
             * not date.
             */
            const filteredAttendance =
                attendanceRecordsForReport.filter(
                    record =>
                        String(
                            record.attendanceDate ?? ""
                        ) >= startDate &&
                        String(
                            record.attendanceDate ?? ""
                        ) <= endDate
                );


            const filteredLeaves =
                leaveRecordsForReport.filter(
                    record =>
                        String(
                            record.startDate ?? ""
                        ) <= endDate &&
                        String(
                            record.endDate ?? ""
                        ) >= startDate
                );


            const filteredPayments =
                paymentRecordsForReport.filter(
                    payment =>
                        String(
                            payment.startDate ?? ""
                        ) <= endDate &&
                        String(
                            payment.endDate ?? ""
                        ) >= startDate &&
                        payment.status !==
                        "CANCELLED"
                );


            let present = 0;
            let halfDay = 0;
            let absent = 0;


            filteredAttendance.forEach(record => {

                if (record.status === "PRESENT") {
                    present++;
                }

                else if (
                    record.status === "HALF_DAY"
                ) {
                    halfDay++;
                }

                else if (
                    record.status === "ABSENT"
                ) {
                    absent++;
                }
            });


            let paidLeave = 0;
            let unpaidLeave = 0;
            let holiday = 0;


            filteredLeaves.forEach(record => {

                const days =
                    calculateInclusiveDays(
                        record.startDate,
                        record.endDate
                    );


                if (
                    record.leaveType ===
                    "PAID_LEAVE"
                ) {
                    paidLeave += days;
                }

                else if (
                    record.leaveType ===
                    "UNPAID_LEAVE"
                ) {
                    unpaidLeave += days;
                }

                else if (
                    record.leaveType ===
                    "HOLIDAY"
                ) {
                    holiday += days;
                }
            });


            let gross = 0;
            let paid = 0;
            let pending = 0;


            filteredPayments.forEach(payment => {

                gross +=
                    Number(
                        payment.grossAmount || 0
                    );


                if (
                    payment.status ===
                    "PAID"
                ) {

                    paid +=
                        Number(
                            payment.netAmount || 0
                        );
                }


                if (
                    payment.status ===
                    "PENDING" ||
                    payment.status ===
                    "APPROVED"
                ) {

                    pending +=
                        Number(
                            payment.netAmount || 0
                        );
                }
            });


            reportData.push({

                employeeName:
                    employee.name ??
                    employee.employeeName ??
                    "Unknown",

                present,
                halfDay,
                absent,

                paidLeave,
                unpaidLeave,
                holiday,

                gross,
                paid,
                pending

            });
        }


        renderReport();

    } catch (error) {

        console.error(
            "Report generation error:",
            error
        );

        alert(
            "Unable to generate report.\n" +
            error.message
        );
    }
}


function renderReport() {

    const tbody =
        document.getElementById(
            "reportTableBody"
        );


    if (!tbody) {
        return;
    }


    tbody.innerHTML = "";


    let totalGross = 0;
    let totalPaid = 0;
    let totalPending = 0;


    reportData.forEach(row => {

        totalGross += row.gross;
        totalPaid += row.paid;
        totalPending += row.pending;


        tbody.innerHTML += `

            <tr>

                <td>
                    ${escapeHtml(
                        row.employeeName
                    )}
                </td>

                <td>${row.present}</td>

                <td>${row.halfDay}</td>

                <td>${row.absent}</td>

                <td>${row.paidLeave}</td>

                <td>${row.unpaidLeave}</td>

                <td>${row.holiday}</td>

                <td>
                    ${formatCurrency(
                        row.gross
                    )}
                </td>

                <td>
                    ${formatCurrency(
                        row.paid
                    )}
                </td>

                <td>
                    ${formatCurrency(
                        row.pending
                    )}
                </td>

            </tr>
        `;
    });


    const summary =
        document.getElementById(
            "reportSummary"
        );


    if (!summary) {
        return;
    }


    summary.innerHTML = `

        <div class="cards">

            <div class="card">

                <h4>Total Workers</h4>

                <p>
                    ${reportData.length}
                </p>

            </div>


            <div class="card">

                <h4>Total Gross</h4>

                <p>
                    ${formatCurrency(
                        totalGross
                    )}
                </p>

            </div>


            <div class="card">

                <h4>Total Paid</h4>

                <p>
                    ${formatCurrency(
                        totalPaid
                    )}
                </p>

            </div>


            <div class="card">

                <h4>Total Pending</h4>

                <p>
                    ${formatCurrency(
                        totalPending
                    )}
                </p>

            </div>

        </div>
    `;
}


/* =========================================================
   EXPORT PDF
========================================================= */

function exportReportPDF() {

    if (!reportData.length) {

        alert(
            "Please generate a report first."
        );

        return;
    }


    if (!window.jspdf) {
        // Works even when the browser cannot load the online PDF library.
        // In the print dialog, choose "Save as PDF".
        printReport();
        return;
    }


    const {
        jsPDF
    } = window.jspdf;


    const doc =
        new jsPDF();


    doc.setFontSize(18);

    doc.text(
        "Employee Management Report",
        14,
        20
    );


    doc.setFontSize(10);


    let y = 35;


    reportData.forEach(row => {

        const line =
            `${row.employeeName} | ` +
            `Present: ${row.present} | ` +
            `Half: ${row.halfDay} | ` +
            `Absent: ${row.absent} | ` +
            `Gross: ${row.gross.toFixed(2)} | ` +
            `Paid: ${row.paid.toFixed(2)} | ` +
            `Pending: ${row.pending.toFixed(2)}`;


        doc.text(
            line,
            14,
            y
        );


        y += 8;


        if (y > 280) {

            doc.addPage();

            y = 20;
        }
    });


    doc.save(
        "employee-management-report.pdf"
    );
}


/* =========================================================
   EXPORT EXCEL
========================================================= */

function exportReportExcel() {

    if (!reportData.length) {

        alert(
            "Please generate a report first."
        );

        return;
    }


    if (
        typeof XLSX === "undefined"
    ) {

        alert(
            "Excel library is not loaded."
        );

        return;
    }


    const rows =
        reportData.map(row => ({

            Employee:
                row.employeeName,

            Present:
                row.present,

            "Half Day":
                row.halfDay,

            Absent:
                row.absent,

            "Paid Leave":
                row.paidLeave,

            "Unpaid Leave":
                row.unpaidLeave,

            Holiday:
                row.holiday,

            Gross:
                row.gross,

            Paid:
                row.paid,

            Pending:
                row.pending

        }));


    const worksheet =
        XLSX.utils.json_to_sheet(rows);


    const workbook =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Report"
    );


    XLSX.writeFile(
        workbook,
        "employee-management-report.xlsx"
    );
}


/* =========================================================
   PRINT REPORT
========================================================= */

function printReport() {

    if (!reportData.length) {

        alert(
            "Please generate a report first."
        );

        return;
    }


    const printWindow =
        window.open(
            "",
            "_blank"
        );


    if (!printWindow) {

        alert(
            "Please allow pop-ups to print the report."
        );

        return;
    }


    let html = `

        <!DOCTYPE html>

        <html>

        <head>

            <title>
                Employee Report
            </title>

            <style>

                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                }

                th,
                td {
                    border: 1px solid #333;
                    padding: 8px;
                    text-align: center;
                }

                th {
                    background: #eee;
                }

            </style>

        </head>

        <body>

            <h1>
                Employee Management Report
            </h1>

            <table>

                <thead>

                    <tr>

                        <th>Employee</th>
                        <th>Present</th>
                        <th>Half Day</th>
                        <th>Absent</th>
                        <th>Paid Leave</th>
                        <th>Unpaid Leave</th>
                        <th>Holiday</th>
                        <th>Gross</th>
                        <th>Paid</th>
                        <th>Pending</th>

                    </tr>

                </thead>

                <tbody>
    `;


    reportData.forEach(row => {

        html += `

            <tr>

                <td>
                    ${escapeHtml(
                        row.employeeName
                    )}
                </td>

                <td>${row.present}</td>

                <td>${row.halfDay}</td>

                <td>${row.absent}</td>

                <td>${row.paidLeave}</td>

                <td>${row.unpaidLeave}</td>

                <td>${row.holiday}</td>

                <td>
                    ${formatCurrency(
                        row.gross
                    )}
                </td>

                <td>
                    ${formatCurrency(
                        row.paid
                    )}
                </td>

                <td>
                    ${formatCurrency(
                        row.pending
                    )}
                </td>

            </tr>
        `;
    });


    html += `

                </tbody>

            </table>

        </body>

        </html>
    `;


    printWindow.document.write(html);

    printWindow.document.close();

    printWindow.focus();

    printWindow.print();
}


/* =========================================================
   UTILITY
========================================================= */

function calculateInclusiveDays(
    startDate,
    endDate
) {

    if (!startDate || !endDate) {
        return 0;
    }


    const start =
        new Date(`${startDate}T00:00:00`);

    const end =
        new Date(`${endDate}T00:00:00`);


    if (
        Number.isNaN(start.getTime()) ||
        Number.isNaN(end.getTime())
    ) {
        return 0;
    }


    const difference =
        end.getTime() -
        start.getTime();


    return (
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        ) + 1
    );
}


/* =========================================================
   END OF SCRIPT
========================================================= */
