// ===== Settings =====
// The address that receives booking requests. Change this to your business email.
const BOOKING_EMAIL = "silescgroupllc@gmail.com";

// ===== Footer year =====
document.getElementById("year").textContent = new Date().getFullYear();

// ===== Booking form: opens a pre-filled email =====
(function bookingForm() {
  const form = document.getElementById("book-form");
  const err = document.getElementById("form-error");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    err.hidden = true;
    const name = form.name.value.trim();
    const email = form.email.value.trim();

    form.name.setAttribute("aria-invalid", !name);
    form.email.setAttribute("aria-invalid", !form.email.checkValidity() || !email);
    if (!name || !email || !form.email.checkValidity()) {
      err.textContent = "Add your name and a valid email so we can reply.";
      err.hidden = false;
      return;
    }
    if (!BOOKING_EMAIL) {
      err.textContent = "Booking requests aren't set up yet. Please check back soon.";
      err.hidden = false;
      return;
    }

    const lines = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${form.phone.value.trim() || "-"}`,
      `Package: ${form.package.value}`,
      `Occasion: ${form.occasion.value}`,
      `Preferred date: ${form.date.value || "Flexible"}`,
      `Guests: ${form.guests.value || "Not sure yet"}`,
      "",
      form.notes.value.trim(),
    ];
    const subject = `${form.package.value.startsWith("Open social") ? "Seat request" : "Party request"}: ${form.occasion.value}${form.date.value ? " on " + form.date.value : ""}`;
    window.location.href = `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
  });
})();

// ===== Gallery lightbox =====
(function gallery() {
  const dlg = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  if (!dlg || typeof dlg.showModal !== "function") return;
  document.querySelectorAll(".g-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const thumb = btn.querySelector("img");
      img.src = btn.dataset.full;
      img.alt = thumb.alt;
      dlg.showModal();
    });
  });
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
})();

// ===== Open social nights =====
// Add each upcoming night here. date is YYYY-MM-DD; time is shown as written.
// Past dates hide themselves automatically. Example:
//   { date: "2026-12-12", time: "7:00–9:00 pm", title: "Holiday Sparkle Night", seats: 8 },
const SOCIAL_NIGHTS = [
];

(function socialNights() {
  const list = document.getElementById("night-list");
  const empty = document.getElementById("night-empty");
  if (!list) return;
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = SOCIAL_NIGHTS.filter((n) => n.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  if (!upcoming.length) return;
  empty.hidden = true;
  upcoming.forEach((n) => {
    const d = new Date(n.date + "T12:00:00");
    const li = document.createElement("li");
    li.className = "night";
    li.innerHTML =
      `<div class="night-date"><span class="m">${d.toLocaleDateString("en-US", { month: "short" })}</span><span class="d">${d.getDate()}</span></div>` +
      `<div class="night-info"><strong></strong><span></span></div>` +
      `<a class="btn btn-primary" href="#book">Save a seat</a>`;
    li.querySelector("strong").textContent = n.title;
    li.querySelector(".night-info span").textContent =
      `${d.toLocaleDateString("en-US", { weekday: "long" })}, ${n.time}` + (n.seats ? ` · ${n.seats}\u00a0seats` : "");
    const a = li.querySelector("a");
    a.dataset.package = "Open social night (single seats)";
    a.dataset.occasion = "Open social night";
    a.dataset.date = n.date;
    a.dataset.note = `Seat request for ${n.title} on ${n.date}`;
    list.appendChild(li);
  });
})();

// ===== Buttons that preselect the booking form =====
document.addEventListener("click", (e) => {
  const link = e.target.closest("[data-package]");
  if (!link) return;
  const form = document.getElementById("book-form");
  if (!form) return;
  form.package.value = link.dataset.package;
  if (link.dataset.occasion) form.occasion.value = link.dataset.occasion;
  if (link.dataset.date) form.date.value = link.dataset.date;
  if (link.dataset.note && !form.notes.value) form.notes.value = link.dataset.note;
});
