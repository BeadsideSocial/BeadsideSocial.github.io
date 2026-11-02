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
    const subject = `Party request: ${form.occasion.value}${form.date.value ? " on " + form.date.value : ""}`;
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

// ===== "Request this package" buttons preselect the package in the form =====
document.querySelectorAll("[data-package]").forEach((link) => {
  link.addEventListener("click", () => {
    const sel = document.getElementById("f-package");
    if (sel) sel.value = link.dataset.package;
  });
});
