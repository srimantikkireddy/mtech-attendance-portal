let currentSubject = null;
let attendance = {};
let saved = true;

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
}

window.addEventListener("beforeunload", function (e) {
  if (!saved) {
    e.preventDefault();
    e.returnValue = "You will lose unsaved attendance data!";
  }
});

const students = [
  { reg: "207225001", name: "ABHISHEK T K" },
  { reg: "207225002", name: "ADARSH DWIVEDI" },
  { reg: "207225003", name: "AHAMMED BADAR" },
  { reg: "207225004", name: "ARIGARASUDHAN M R" },
  { reg: "207225005", name: "ATUL KUMAR SINGH" },
  { reg: "207225006", name: "BANGARU BHAVANNARAYANA" },
  { reg: "207225007", name: "BOPPE POTANA KOTA PHANINDRA" },
  { reg: "207225008", name: "DODDI MEGHANA" },
  { reg: "207225009", name: "GADDE SRI HARAN RAJ" },
  { reg: "207225010", name: "GONATH CHAND G" },
  { reg: "207225011", name: "ISHWARYA S" },
  { reg: "207225012", name: "JAGAN BALAJI T" },
  { reg: "207225013", name: "KAILHASH S" },
  { reg: "207225014", name: "KONDAPALLI CHINNA" },
  { reg: "207225015", name: "KRANTHI KUMAR THUMMULURI" },
  { reg: "207225016", name: "KUMBHA NITHYA" },
  { reg: "207225017", name: "MALLEPALLY MADHUSUDHANREDDY" },
  { reg: "207225018", name: "MANKALI HARSHAVARDHAN" },
  { reg: "207225019", name: "NAVYA THILAK" },
  { reg: "207225020", name: "PABBITHI VENKATA SATYA SAI HARSHAVARDHAN" },
  { reg: "207225021", name: "PANUGOTHU VIGNANESHWAR" },
  { reg: "207225022", name: "PAVULURI AVANTHIKA" },
  { reg: "207225023", name: "PREETHAM G S" },
  { reg: "207225024", name: "PULICHERU HARSHA VARDHAN" },
  { reg: "207225025", name: "PYDI REVATHI VENKATA HARI PRASAD" },
  { reg: "207225026", name: "RUSHMITHAA S B" },
  { reg: "207225027", name: "SEEREDDI NEELIMA" },
  { reg: "207225028", name: "SRIMANNARAYANA RAO TIKKIREDDY" },
  { reg: "207225029", name: "SUBHADIP BERA" },
  { reg: "207225030", name: "SUNNY PINTO" },
  { reg: "207225031", name: "SWAPNADEEP CHAKRABORTY" },
  { reg: "207225032", name: "SWATI SONI" },
  { reg: "207225033", name: "VANAPARTHI SAI RAJ" }
];

function selectSubject(sub, prof) {
  currentSubject = sub;
  attendance = {};
  saved = false;

  document.getElementById("subjectTitle").innerText = sub + " — " + prof;
  
  document.getElementById("sidebar").classList.remove("open");

  const container = document.getElementById("studentsContainer");
  container.innerHTML = "";

  students.forEach((s, idx) => {
    const stu = document.createElement("div");
    stu.className = "student";
    stu.innerHTML = `
      <div class="circle" id="circle-${s.reg}" onclick="toggleAttendance('${s.reg}')"></div>
      <div class="roll"><b>${String(idx+1).padStart(2,"0")}</b> | ${s.reg}</div>
      <div class="name">${s.name}</div>
    `;
    container.appendChild(stu);
    attendance[s.reg] = "Present";
  });
}

function toggleAttendance(reg) {
  const circle = document.getElementById("circle-" + reg);
  if (circle.classList.contains("absent")) {
    circle.classList.remove("absent");
    attendance[reg] = "Present";
  } else {
    circle.classList.add("absent");
    attendance[reg] = "Absent";
  }
  saved = false;
}

function downloadCSV() {
  if (!currentSubject) {
    alert("Please select a subject first!");
    return;
  }
  const d = new Date();
  const today = `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
  let csv = `${currentSubject} Attendance, Date: ${today}\n`;
  csv += "S.No,Reg No,Name,Status\n";

  students.forEach((s, i) => {
    csv += `${i+1},${s.reg},${s.name},${attendance[s.reg]}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = currentSubject.replace(/\s+/g, "_") + "_Attendance.csv";
  a.click();
  saved = true;
}