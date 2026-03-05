/**
 * Lädt Projekt-Inhalt aus projects/{id}/project.json und rendert die Seite.
 * Alle Pfade in der JSON sind relativ zum Projektordner (z. B. projects/project_01/).
 * Ordnerstruktur: projects/project_01/project.json, mg/, mov/, …
 */
(function () {
  function getProjectId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id") || "";
  }

  function resolveUrl(basePath, path) {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("/")) return path;
    if (path.startsWith("../")) return path;
    var base = basePath.endsWith("/") ? basePath : basePath + "/";
    return base + path;
  }

  function videoType(src) {
    if (src.endsWith(".webm")) return "video/webm";
    if (src.endsWith(".mp4")) return "video/mp4";
    return "video/mp4";
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function buildPage(data, basePath) {
    const heroSrc = resolveUrl(basePath, data.heroVideo || "");
    const heroType = videoType(heroSrc);

    let metaHtml = `
      <div class="meta-block"><strong>Client</strong> ${escapeHtml(data.client || "")}</div>
      <div class="meta-block"><strong>Role</strong> ${escapeHtml(data.role || "")}</div>
      <div class="meta-block"><strong>Year</strong> ${escapeHtml(data.year || "")}</div>
      <div class="meta-block"><strong>Agency</strong> ${escapeHtml(data.agency || "")}</div>`;

    let descriptionHtml = "";
    if (Array.isArray(data.description)) {
      data.description.forEach(function (p) {
        descriptionHtml += '<p class="anim-text">' + escapeHtml(p) + "</p>";
      });
    }

    let creditsHtml = "";
    if (Array.isArray(data.credits) && data.credits.length > 0) {
      creditsHtml = '<div class="credits-list anim-text">';
      data.credits.forEach(function (c) {
        creditsHtml +=
          '<div class="credit-item"><span class="credit-role">' +
          escapeHtml(c.role) +
          "</span> " +
          escapeHtml(c.name) +
          "</div>";
      });
      creditsHtml += "</div>";
    }

    let galleryHtml = "";
    if (Array.isArray(data.gallery)) {
      data.gallery.forEach(function (item) {
        const src = resolveUrl(basePath, item.src);
        const caption = escapeHtml(item.caption || "");
        const styleAttr = item.width ? ' style="width:' + escapeHtml(item.width) + '"' : "";
        if (item.type === "video") {
          galleryHtml +=
            '<div class="gallery-item"' +
            styleAttr +
            '><video autoplay muted loop playsinline src="' +
            src +
            '"></video><div class="asset-caption">' +
            caption +
            "</div></div>";
        } else {
          galleryHtml +=
            '<div class="gallery-item"' +
            styleAttr +
            '><img src="' +
            src +
            '" alt="' +
            caption +
            '"><div class="asset-caption">' +
            caption +
            "</div></div>";
        }
      });
    }

    const nav = data.nav || {};
    const prevHref = nav.prevHref || "index.html#work";
    const nextHref = nav.nextHref || "index.html#work";
    const prevTitle = nav.prevTitle || "Overview";
    const nextTitle = nav.nextTitle || "";

    return (
      '<header class="hero-section">' +
      '<div class="video-loader" id="mainLoader"></div>' +
      '<video class="hero-video" id="mainVideo" autoplay muted loop playsinline>' +
      '<source src="' + heroSrc + '" type="' + heroType + '">' +
      "</video>" +
      '<div class="hero-title"><h1>' +
      escapeHtml(data.title || "") +
      "</h1></div>" +
      '<div class="scroll-hint-wrapper">' +
      '<div class="scroll-text">SCROLL</div>' +
      '<div class="scroll-hint-pill"><div class="scroll-dot"></div></div>' +
      "</div>" +
      '<div class="video-controls">' +
      '<button class="ctrl-btn" id="btnReplay" title="Wiederholen">' +
      '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>' +
      "</button>" +
      '<button class="ctrl-btn" id="btnPlayPause" title="Play/Pause">' +
      '<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>' +
      "</button>" +
      '<button class="ctrl-btn" id="btnMute" title="Ton">' +
      '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>' +
      "</button>" +
      '<button class="ctrl-btn" id="btnFit" title="Anpassen">' +
      '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>' +
      "</button>" +
      "</div>" +
      "</header>" +
      '<div class="info-wrapper">' +
      '<section class="info-section">' +
      '<div class="info-meta">' +
      metaHtml +
      "</div>" +
      '<div class="info-text">' +
      descriptionHtml +
      creditsHtml +
      "</div>" +
      "</section>" +
      "</div>" +
      '<section class="horizontal-scroll-container">' +
      '<div class="sticky-viewport" id="viewport">' +
      '<div class="horizontal-track" id="track">' +
      galleryHtml +
      "</div>" +
      "</div>" +
      "</section>" +
      '<footer class="footer-nav">' +
      '<div class="nav-block prev" onclick="window.location.href=\'' +
      prevHref.replace(/'/g, "\\'") +
      "'\">" +
      '<div class="nav-label">' +
      escapeHtml(nav.prevLabel || "Zurück") +
      "</div>" +
      '<div class="nav-title">' +
      escapeHtml(prevTitle) +
      "</div>" +
      "</div>" +
      '<div class="nav-block next" onclick="window.location.href=\'' +
      nextHref.replace(/'/g, "\\'") +
      "'\">" +
      '<div class="nav-label">' +
      escapeHtml(nav.nextLabel || "Nächstes Projekt") +
      "</div>" +
      '<div class="nav-title">' +
      escapeHtml(nextTitle) +
      "</div>" +
      "</div>" +
      "</footer>"
    );
  }

  function showError(message) {
    var root = document.getElementById("project-content");
    if (root) {
      root.innerHTML =
        '<div class="project-error" style="padding:4rem;text-align:center;font-family:sans-serif;">' +
        "<p>" +
        escapeHtml(message) +
        "</p>" +
        '<p><a href="index.html#work">Zurück zur Übersicht</a></p>' +
        "</div>";
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var id = getProjectId();
    if (!id) {
      showError("Kein Projekt angegeben. URL: project.html?id=project_01");
      return;
    }

    var basePath = "projects/" + id;
    var jsonUrl = basePath + "/project.json";
    var fallbackPath = "projekte/" + id;
    var fallbackJsonUrl = fallbackPath + "/projekt.json";

    function tryLoad(url, path) {
      console.log("Loading project:", url);
      return fetch(url)
        .then(function (r) {
          console.log("Fetch response:", r.status, r.statusText, url);
          if (!r.ok) throw new Error("HTTP " + r.status + ": " + r.statusText);
          return r.text().then(function (text) {
            return { text: text, path: path };
          });
        });
    }

    tryLoad(jsonUrl, basePath)
      .catch(function (err) {
        console.log("Primary path failed, trying fallback:", fallbackJsonUrl);
        return tryLoad(fallbackJsonUrl, fallbackPath);
      })
      .then(function (result) {
        if (!result) throw new Error("Beide Pfade fehlgeschlagen");
        basePath = result.path;
        console.log("JSON received, parsing...");
        try {
          var data = JSON.parse(result.text);
          console.log("Project data loaded:", data.title);
          document.title = (data.title || id) + " | Timo Böse";
          var root = document.getElementById("project-content");
          if (!root) {
            console.error("project-content element not found!");
            return;
          }
          root.innerHTML = buildPage(data, basePath);
          if (window.initProjectPage) window.initProjectPage();
        } catch (e) {
          console.error("JSON parse error:", e);
          console.error("JSON text:", result.text.substring(0, 500));
          throw new Error("JSON-Syntaxfehler: " + e.message);
        }
      })
      .catch(function (err) {
        console.error("Project load error:", err);
        showError("Projekt konnte nicht geladen werden: " + id + "<br><small>" + err.message + "</small>");
      });
  });
})();
