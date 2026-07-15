/* ============================================================
   NAMESAKES Project Page – Interactive Example Browser
   ============================================================ */

(function () {
  "use strict";

  let examples = [];
  let currentIdx = 0;

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function buildImageRow(images, label, extraCls) {
    const row = el("div", "gallery-row");
    row.appendChild(el("div", "gallery-row-label", label));
    const imgs = el("div", "gallery-row-images");
    images.forEach((src) => {
      const img = el("img", "gallery-img" + (extraCls ? " " + extraCls : ""));
      img.src = src;
      img.alt = label;
      imgs.appendChild(img);
    });
    row.appendChild(imgs);
    return row;
  }

  function render() {
    const ex = examples[currentIdx];
    const total = examples.length;

    document.getElementById("ex-index").textContent =
      `Example ${currentIdx + 1} of ${total}`;
    document.getElementById("btn-prev").disabled = currentIdx === 0;
    document.getElementById("btn-next").disabled = currentIdx >= total - 1;

    const display = document.getElementById("example-display");
    display.innerHTML = "";

    if (!ex) {
      display.textContent = "No examples available.";
      return;
    }

    const header = el("div", "gallery-header");
    const realLabel = el("span", "gallery-name gallery-name-real", ex.real_name);
    const vsLabel = el("span", "gallery-vs", " vs. ");
    const pertLabel = el("span", "gallery-name gallery-name-perturbed", ex.perturbed_name);
    header.appendChild(realLabel);
    header.appendChild(vsLabel);
    header.appendChild(pertLabel);
    const modelTag = el("span", "gallery-model-tag", ex.model);
    header.appendChild(modelTag);
    display.appendChild(header);

    display.appendChild(buildImageRow(ex.real_images, `"${ex.real_name}"`, "gallery-img-real"));
    display.appendChild(buildImageRow(ex.perturbed_images, `"${ex.perturbed_name}"`, "gallery-img-perturbed"));

    if (ex.note) {
      display.appendChild(el("p", "gallery-note", ex.note));
    }
  }

  async function init() {
    try {
      const resp = await fetch("data/examples.json");
      examples = await resp.json();
    } catch (e) {
      console.error("Failed to load example data:", e);
      const display = document.getElementById("example-display");
      if (display) display.textContent = "Error loading examples. Please ensure you are serving this page via a local server or open it directly in your browser.";
      return;
    }

    document.getElementById("btn-prev").addEventListener("click", () => {
      if (currentIdx > 0) { currentIdx--; render(); }
    });
    document.getElementById("btn-next").addEventListener("click", () => {
      if (currentIdx < examples.length - 1) { currentIdx++; render(); }
    });

    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
