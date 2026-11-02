// ===== Settings =====
// The address that receives booking requests. Change this to your business email.
const BOOKING_EMAIL = "silescgroupllc@gmail.com";

// ===== Bead strand in the hero =====
(function drawStrand() {
  const svg = document.getElementById("strand-svg");
  if (!svg) return;
  const NS = "http://www.w3.org/2000/svg";
  const colors = ["#f0a9bd", "#c99a2e", "#5fa596", "#a99ad6", "#34183f", "#f6d3dc", "#d8b86a", "#8cc7b8"];

  // Draped wire: a gentle curve between two pins
  const x0 = 30, x1 = 570, yTop = 40, sag = 150;
  const yAt = (x) => {
    const t = (x - x0) / (x1 - x0);
    return yTop + sag * 4 * t * (1 - t);
  };
  const wire = document.createElementNS(NS, "path");
  let d = `M ${x0} ${yTop}`;
  for (let x = x0; x <= x1; x += 6) d += ` L ${x} ${yAt(x).toFixed(1)}`;
  wire.setAttribute("d", d);
  wire.setAttribute("class", "wire");
  svg.appendChild(wire);

  // Pins at each end
  [x0, x1].forEach((x) => {
    const pin = document.createElementNS(NS, "circle");
    pin.setAttribute("cx", x); pin.setAttribute("cy", yTop); pin.setAttribute("r", 4);
    pin.setAttribute("fill", "#c99a2e");
    svg.appendChild(pin);
  });

  // Beads of varying size, packed along the wire
  const sizes = [9, 13, 7, 16, 9, 11, 20, 8, 12, 9, 14, 7, 18, 10, 8, 13, 9, 22, 9, 13, 8, 15, 10, 7, 12, 17, 9, 11, 8, 14];
  let x = x0 + 26, i = 0;
  while (x < x1 - 26) {
    const r = sizes[i % sizes.length];
    const cx = x + r;
    if (cx + r > x1 - 20) break;
    const g = document.createElementNS(NS, "g");
    g.setAttribute("class", "bead");
    g.style.setProperty("--i", i);

    const c = document.createElementNS(NS, "circle");
    c.setAttribute("cx", cx); c.setAttribute("cy", yAt(cx).toFixed(1)); c.setAttribute("r", r);
    c.setAttribute("fill", colors[(i * 5 + 3) % colors.length]);
    g.appendChild(c);

    // small highlight so beads read as glass
    const h = document.createElementNS(NS, "circle");
    h.setAttribute("cx", cx - r * 0.35); h.setAttribute("cy", (yAt(cx) - r * 0.35).toFixed(1)); h.setAttribute("r", Math.max(1.5, r * 0.22));
    h.setAttribute("fill", "#ffffff"); h.setAttribute("opacity", "0.55");
    g.appendChild(h);

    svg.appendChild(g);
    x = cx + r + 1.5;
    i++;
  }
})();

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
