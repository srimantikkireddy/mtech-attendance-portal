(() => {
  let currentSubject = null;
  let attendance = {};
  let saved = true;

  let sidebar, toggleBtn, studentsContainer, subjectTitleEl, downloadBtn;

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

  function slugKeyForSubject(sub) {
    if (!sub) return null;
    const short = sub.split("|")[0].trim();
    return "attendance_" + short.replace(/\s+/g, "_");
  }

  function renderStudents(attObj = {}) {
    if (!studentsContainer) return;
    if (!currentSubject) {
      studentsContainer.innerHTML = "";
      return;
    }

    studentsContainer.innerHTML = students
      .map((s, i) => {
        const isAbsent = attObj[s.reg] === "Absent";
        return `
          <div class="student">
            <div class="circle ${isAbsent ? "absent" : ""}"
                 id="circle-${s.reg}"
                 data-reg="${s.reg}"
                 role="button"
                 tabindex="0"
                 aria-pressed="${isAbsent ? "true" : "false"}"></div>
            <div class="roll"><b>${String(i + 1).padStart(2, "0")}</b> | ${s.reg}</div>
            <div class="name">${s.name}</div>
          </div>
        `;
      })
      .join("");
  }

  function init() {
    sidebar = document.getElementById("sidebar");
    toggleBtn = document.querySelector(".toggle-btn");
    studentsContainer = document.getElementById("studentsContainer");
    subjectTitleEl = document.getElementById("subjectTitle");
    downloadBtn = document.querySelector(".download-btn");

    if (toggleBtn) {
      const fresh = toggleBtn.cloneNode(true);
      toggleBtn.parentNode.replaceChild(fresh, toggleBtn);
      toggleBtn = fresh;
      toggleBtn.type = "button";
      toggleBtn.setAttribute("aria-controls", "sidebar");
      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.style.zIndex = "2000";
      toggleBtn.addEventListener("click", (ev) => {
        ev.preventDefault();
        window.toggleSidebar();
      }, { passive: false });
      toggleBtn.addEventListener("touchstart", (ev) => {
        ev.preventDefault();
        window.toggleSidebar();
      }, { passive: false });
    }

    window.toggleSidebar = function () {
      if (!sidebar) return;
      const isActive = sidebar.classList.toggle("active");
      if (toggleBtn) toggleBtn.setAttribute("aria-expanded", String(isActive));
    };

    document.addEventListener("click", (e) => {
      if (!sidebar) return;
      if (
        sidebar.classList.contains("active") &&
        !sidebar.contains(e.target) &&
        !(toggleBtn && toggleBtn.contains(e.target))
      ) {
        sidebar.classList.remove("active");
        if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
      }
    });
    document.querySelectorAll(".sidebar li").forEach((li) => {
      if (!li.hasAttribute("role")) li.setAttribute("role", "button");
      if (!li.hasAttribute("tabindex")) li.setAttribute("tabindex", "0");

      li.addEventListener("click", () => {
        const ds = li.getAttribute("data-sub");
        const dp = li.getAttribute("data-prof") || (li.querySelector("small") ? li.querySelector("small").textContent.trim() : "");
        if (ds) {
          window.selectSubject(ds, dp);
        } else {
          const small = li.querySelector("small");
          const profText = small ? small.textContent.trim() : "";
          let subj = "";
          for (const node of li.childNodes) {
            if (node.nodeType === 3) subj += node.nodeValue;
          }
          subj = (subj || li.textContent || "").replace(/\s+/g, " ").trim();
          if (subj) window.selectSubject(subj, profText);
        }
        setTimeout(() => sidebar && sidebar.classList.remove("active"), 0);
      });

      li.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          li.click();
        }
      });
    });

    if (studentsContainer) {
      studentsContainer.addEventListener("click", (e) => {
        const circle = e.target.closest(".circle");
        if (!circle) return;
        const reg = circle.dataset.reg;
        const isNowAbsent = circle.classList.toggle("absent");
        circle.setAttribute("aria-pressed", String(isNowAbsent));
        attendance[reg] = isNowAbsent ? "Absent" : "Present";
        saved = false;

        if (currentSubject) {
          const key = slugKeyForSubject(currentSubject);
          try {
            localStorage.setItem(key, JSON.stringify({ attendance, ts: Date.now() }));
          } catch (err) {
          }
        }
      });

      studentsContainer.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          const circle = e.target.closest(".circle");
          if (circle) {
            e.preventDefault();
            circle.click();
          }
        }
      });
    }
    window.addEventListener("beforeunload", (e) => {
      if (!saved) {
        e.preventDefault();
        e.returnValue = "You will lose unsaved attendance data!";
      }
    });

    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => {
        window.downloadCSV();
      });
    }
    renderStudents();
  }

  window.selectSubject = function (sub, prof) {
    currentSubject = sub;
    attendance = {};
    saved = false;
    if (subjectTitleEl) subjectTitleEl.innerText = `${sub} — ${prof || ""}`;

    if (sidebar) sidebar.classList.remove("active");

    const key = slugKeyForSubject(sub);
    let restored = false;
    if (key) {
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.attendance) {
            const restore = confirm("Saved attendance found for this subject on this device.\nPress OK to restore it, or Cancel to start fresh.");
            if (restore) {
              attendance = parsed.attendance;
              restored = true;
            }
          }
        }
      } catch (err) {
      }
    }

    if (!restored) {
      students.forEach((s) => (attendance[s.reg] = "Present"));
    }

    renderStudents(attendance);
  };

  window.downloadCSV = function () {
    if (!currentSubject) {
      alert("Please select a subject first!");
      return;
    }

    const d = new Date();
    const today = `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;

    let csv = `${currentSubject} Attendance, Date: ${today}\n`;
    csv += "S.No,Reg No,Name,Status\n";

    students.forEach((s, i) => {
      const status = attendance[s.reg] || "Present";
      const nameSafe = `"${String(s.name).replace(/"/g, '""')}"`;
      csv += `${i + 1},${s.reg},${nameSafe},${status}\n`;
    });

    try {
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const fileName = `${currentSubject.split("|")[0].trim()}_${today}.csv`.replace(/\s+/g, "_");
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed: " + err.message);
      return;
    }

    saved = true;
    const key = slugKeyForSubject(currentSubject);
    try {
      if (key) localStorage.removeItem(key);
    } catch (err) {
    }
  };

  window.clearSavedDataFor = function (sub) {
    const k = slugKeyForSubject(sub);
    if (!k) return false;
    try {
      localStorage.removeItem(k);
      return true;
    } catch (err) {
      return false;
    }
  };

  window.clearAllAttendanceBackups = function () {
    try {
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith("attendance_")) localStorage.removeItem(k);
      });
      return true;
    } catch (err) {
      return false;
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
