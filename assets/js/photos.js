(function () {
  var photos = window.__PHOTOS__;
  if (!photos || !photos.length) return;

  var GRID_SIZE = 11;
  var grid = document.getElementById("photo-grid");
  if (!grid) return;

  var lightbox = null;

  // Fisher-Yates shuffle
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  function getHashId() {
    var h = location.hash.replace(/^#/, "");
    return h || null;
  }

  function pickPhotos() {
    var hashId = getHashId();
    var shuffled = shuffle(photos);
    var selected = [];
    var hashPhoto = null;

    if (hashId) {
      hashPhoto = photos.find(function (p) { return p.id === hashId; });
    }

    // Pick GRID_SIZE photos, ensuring hashPhoto is included if it exists
    if (hashPhoto) {
      selected.push(hashPhoto);
      for (var i = 0; i < shuffled.length && selected.length < GRID_SIZE; i++) {
        if (shuffled[i].id !== hashPhoto.id) {
          selected.push(shuffled[i]);
        }
      }
      // Shuffle again so the hash photo isn't always first
      selected = shuffle(selected);
    } else {
      selected = shuffled.slice(0, GRID_SIZE);
    }

    return selected;
  }

  function buildDealCard() {
    return '<div class="column is-one-quarter-desktop is-one-third-tablet is-half-mobile">' +
      '<div class="deal-card" id="deal-card" role="button" tabindex="0" aria-label="Deal a new hand of photos">' +
        '<span class="icon is-large"><i class="fas fa-shuffle fa-2x"></i></span>' +
        '<span class="deal-card-text">Deal again</span>' +
      '</div>' +
    '</div>';
  }

  function buildGrid(selected) {
    var html = "";
    for (var i = 0; i < selected.length; i++) {
      var p = selected[i];
      html += '<div class="column is-one-quarter-desktop is-one-third-tablet is-half-mobile">' +
        '<div class="photo-grid-item">' +
          '<a href="' + p.lightboxHref + '" class="glightbox" data-glightbox="" data-photo-id="' + p.id + '">' +
            p.pictureHtml +
          '</a>' +
        '</div>' +
      '</div>';
    }
    html += buildDealCard();
    return html;
  }

  function render(selected, animate) {
    if (animate) {
      grid.style.opacity = "0";
      setTimeout(function () {
        grid.innerHTML = buildGrid(selected);
        initLightbox(selected);
        bindDealCard();
        grid.style.opacity = "1";
      }, 300);
    } else {
      grid.innerHTML = buildGrid(selected);
      initLightbox(selected);
      bindDealCard();
    }
  }

  function initLightbox(selected) {
    if (lightbox) {
      lightbox.destroy();
    }
    lightbox = GLightbox({
      selector: ".glightbox",
      touchNavigation: true,
      loop: true,
      closeOnOutsideClick: true
    });

    lightbox.on("slide_changed", function (data) {
      var el = data.current.slideNode.querySelector("img");
      if (!el) return;
      // Find the matching anchor to get the photo id
      var anchors = grid.querySelectorAll("a.glightbox");
      var idx = data.current.index;
      if (anchors[idx]) {
        var id = anchors[idx].getAttribute("data-photo-id");
        if (id) {
          history.replaceState(null, "", "#" + id);
        }
      }
    });

    lightbox.on("close", function () {
      history.replaceState(null, "", location.pathname);
    });

    // If there's a hash, open that photo in the lightbox
    var hashId = getHashId();
    if (hashId) {
      var anchors = grid.querySelectorAll("a.glightbox");
      for (var i = 0; i < anchors.length; i++) {
        if (anchors[i].getAttribute("data-photo-id") === hashId) {
          lightbox.openAt(i);
          break;
        }
      }
    }
  }

  function bindDealCard() {
    var card = document.getElementById("deal-card");
    if (!card) return;

    function deal() {
      history.replaceState(null, "", location.pathname);
      var selected = pickPhotos();
      render(selected, true);
      if (typeof plausible !== "undefined") {
        plausible("Photo Shuffle");
      }
    }

    card.addEventListener("click", deal);
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        deal();
      }
    });
  }

  // Initial render
  var selected = pickPhotos();
  render(selected, false);
})();
