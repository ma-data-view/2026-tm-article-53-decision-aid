const LOCKS = {
  parking: {
    title: "The open garage can't be eliminated.",
    cite: "Zoning Bylaw § 6.1 · § 6.1.5 · Site Plan Review § 3.4.4",
    body:
      "§ 6.1 sets off-street parking requirements, and § 6.1.5 allows reductions only through a Transportation Demand Management plan and board review. Site plan review under § 3.4.4 also looks at safe circulation and the relationship between buildings, parking, and access. On a small Broadway parcel there is no rear yard for surface parking, so the open ground-floor garage under the upper floors may be the design that makes the project work. Eliminating it can kill the bonus design, not just move the parking.",
    pill: "Garage",
  },
  bike: {
    title: "Long-term bike parking must be enclosed.",
    cite: "Zoning Bylaw § 6.1.12",
    body:
      "§ 6.1.12 requires long-term bicycle parking inside the building, in a secure enclosed room. A 14-unit residential project plus a small commercial use needs roughly 21 long-term spaces and short-term racks. That room cannot be re-allocated to commercial without violating the bylaw.",
    pill: "Bike",
  },
  elevator: {
    title: "The elevator and accessibility are state law.",
    cite: "521 CMR (MA Architectural Access Board) · 780 CMR Ch. 11",
    body:
      "521 CMR and 780 CMR Chapter 11 require accessible entries, an accessible route, and an elevator for a five-story residential building of this size. The shaft, machine space, and accessible vestibule are non-negotiable, and that area can't be commercial use by definition.",
    pill: "Elevator",
  },
  lobby: {
    title: "Two means of egress and an accessible entry are required.",
    cite: "780 CMR Ch. 10 · 521 CMR · Site Plan Review § 3.4.4",
    body:
      "780 CMR Chapter 10 governs required means of egress, and the submitted five-story plan uses separate exit paths. 521 CMR requires accessible entries and accessible routes. The residential lobby is also the legal entry for upper-floor units. None of this footprint is an easy source of extra commercial space.",
    pill: "Lobby",
  },
  loading: {
    title: "Trash, transformers, and utilities must stay.",
    cite: "Zoning Bylaw § 6.1.6 · Site Plan Review § 3.4.4",
    body:
      "§ 6.1.6 applies off-street loading and unloading rules to nonresidential uses, with possible board reductions. Site plan review under § 3.4.4 also considers utilities, refuse, screening, access, and service functions. Transformers, water service, gas service, trash and recycling, and fire department connections are functional requirements of the building, not optional trim.",
    pill: "Trash",
  },
};

const TARGETS = ["parking", "bike", "elevator", "lobby", "loading"];

const checked = new Set();

const els = {
  panel: document.getElementById("cite-panel"),
  kicker: document.getElementById("cite-kicker"),
  title: document.getElementById("cite-title"),
  body: document.getElementById("cite-body"),
  cite: document.getElementById("cite-cite"),
  progress: document.getElementById("cite-progress"),
  pills: document.getElementById("progress-pills"),
  verdict: document.getElementById("verdict"),
};

const DEFAULT_STATE = {
  kicker: "Interactive test",
  title: "Can you find the missing 574 sf?",
  body: "Click the spaces on the floor plan: garage, bike room, elevator, lobby, and trash/utilities. Each click shows why that space is not a realistic source for the extra 574 sf.",
  cite: "",
};

const ALL_LOCKED_STATE = {
  kicker: "All five spaces tested",
  title: "There is nowhere for the required commercial space to go.",
  body: "Every space behind the storefront is held in place by a zoning bylaw, a building code, or a state accessibility rule. On this podium-garage Broadway lot, the Cullinane amendment is unlikely to deliver the commercial space it demands. Without qualifying commercial, the bonus doesn't apply, the project shrinks, redesigns, or doesn't get built.",
  cite: "See verdict below ↓",
};

function setPanel({ kicker, title, body, cite }) {
  els.kicker.textContent = kicker;
  els.title.textContent = title;
  els.body.textContent = body;
  els.cite.textContent = cite || "";
}

function updateProgress() {
  const n = checked.size;
  els.progress.textContent = `${n} of 5 spaces tested`;

  if (n === 0) {
    els.panel.classList.remove("locked-state");
  } else if (n < TARGETS.length) {
    els.panel.classList.add("locked-state");
  } else {
    els.panel.classList.add("locked-state");
  }

  if (els.verdict) {
    const allLocked = n === TARGETS.length;
    els.verdict.hidden = !allLocked;
    if (allLocked) {
      requestAnimationFrame(() => {
        els.verdict.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    }
  }
}

function lockTarget(target) {
  const lock = LOCKS[target];
  if (!lock) return;

  checked.add(target);

  const cta = document.querySelector(".plan-cta");
  if (cta) cta.classList.add("dismissed");

  const planZone = document.querySelector(`.plan-zone[data-target="${target}"]`);
  if (planZone) planZone.classList.add("locked");

  const pill = document.querySelector(`#progress-pills li[data-target="${target}"]`);
  if (pill) pill.classList.add("checked");

  if (checked.size === TARGETS.length) {
    setPanel(ALL_LOCKED_STATE);
  } else {
    setPanel({
      kicker: "Space tested",
      title: lock.title,
      body: lock.body,
      cite: lock.cite,
    });
  }

  updateProgress();
}

function showCitation(target) {
  const lock = LOCKS[target];
  if (!lock) return;
  setPanel({
    kicker: checked.has(target) ? "Space tested" : "Click to test this space",
    title: lock.title,
    body: lock.body,
    cite: lock.cite,
  });
}

function resetGame() {
  checked.clear();
  const cta = document.querySelector(".plan-cta");
  if (cta) cta.classList.remove("dismissed");
  for (const target of TARGETS) {
    const planZone = document.querySelector(`.plan-zone[data-target="${target}"]`);
    if (planZone) planZone.classList.remove("locked");
    const pill = document.querySelector(`#progress-pills li[data-target="${target}"]`);
    if (pill) pill.classList.remove("checked");
  }
  setPanel(DEFAULT_STATE);
  updateProgress();
}

function handleZoneActivate(target) {
  if (!checked.has(target)) {
    lockTarget(target);
  } else {
    showCitation(target);
  }
}

document.querySelectorAll(".plan-zone").forEach((zone) => {
  const target = zone.dataset.target;
  zone.addEventListener("click", () => handleZoneActivate(target));
  zone.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleZoneActivate(target);
    }
  });
});

document.querySelectorAll("#progress-pills li").forEach((pill) => {
  const target = pill.dataset.target;
  pill.addEventListener("click", () => handleZoneActivate(target));
  pill.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleZoneActivate(target);
    }
  });
});

const resetButton = document.getElementById("reset-game");
if (resetButton) resetButton.addEventListener("click", resetGame);

setPanel(DEFAULT_STATE);
updateProgress();
