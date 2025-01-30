const TIMETABLE = {
    "Monday": ["GD111", "CH231 HTO", "CH274 MTO-1", "CH191 FPP", "ECE202"],
    "Tuesday": ["CH231 HTO", "CH251 CRE-1", "ECE202", "CH394 CPT-1", "CH212", "CH274 MTO-1"],
    "Wednesday": ["CH231L", "CH281 PRE", "CH274 MTO-1", "PC101", "CH394 CPT-1", "CH251-Tut", "GD111"],
    "Thursday": ["CH251L", "CH281 PRE", "CH231 HTO", "PC101", "CH212", "CH251 CRE-1"],
    "Friday": ["CH231L", "GD111", "ECE202", "CH212", "CH231-Tut", "PC101-Tut", "CH274-Tut", "CH251L"]
};

// List of Indian Holidays (2025 Sample)
const HOLIDAYS = {
    "2025-01-26": "Republic Day",
    "2025-08-15": "Independence Day",
    "2025-10-02": "Gandhi Jayanti",
    "2025-11-04": "Diwali"
};

let attendanceRecords = JSON.parse(localStorage.getItem("attendance")) || [];

function updateSubjects() {
    let date = document.getElementById("date").value;
    let day = new Date(date).toLocaleDateString("en-US", { weekday: "long" });

    let subjectsDiv = document.getElementById("subjects");
    subjectsDiv.innerHTML = ""; // Clear previous subjects

    if (HOLIDAYS[date]) {
        document.getElementById("holiday-info").innerText = `Today is ${HOLIDAYS[date]}. No classes!`;
        return;
    } else {
        document.getElementById("holiday-info").innerText = "";
    }

    let subjects = TIMETABLE[day] || [];
    subjects.forEach(subject => {
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = subject;
        checkbox.id = subject;

        let label = document.createElement("label");
        label.htmlFor = subject;
        label.innerText = subject;

        subjectsDiv.appendChild(checkbox);
        subjectsDiv.appendChild(label);
        subjectsDiv.appendChild(document.createElement("br"));
    });
}

function saveAttendance() {
    let date = document.getElementById("date").value;
    if (!date) {
        alert("Please select a date.");
        return;
    }

    if (HOLIDAYS[date]) {
        alert("Today is a holiday! No need to mark attendance.");
        return;
    }

    let day = new Date(date).toLocaleDateString("en-US", { weekday: "long" });
    let subjects = TIMETABLE[day] || [];

    let attendanceData = {
        date: date,
        present: subjects.filter(subject => document.getElementById(subject)?.checked).length,
        total: subjects.length
    };

    attendanceRecords.push(attendanceData);
    localStorage.setItem("attendance", JSON.stringify(attendanceRecords));

    calculatePercentage();
    alert("Attendance Saved!");
}

function calculatePercentage() {
    let totalDays = attendanceRecords.length;
    let totalClasses = attendanceRecords.reduce((sum, record) => sum + record.total, 0);
    let attendedClasses = attendanceRecords.reduce((sum, record) => sum + record.present, 0);

    let percentage = totalClasses ? ((attendedClasses / totalClasses) * 100).toFixed(2) : 0;
    document.getElementById("percentage").innerText = percentage + "%";
}

// Event Listener for Date Change
document.getElementById("date").addEventListener("change", updateSubjects);

