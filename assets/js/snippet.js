(function () {
  var photos = window.__PHOTOS__;
  if (!photos || !photos.length) return;

  var SNIPPET_SIZE = 3;
  var container = document.getElementById("photo-snippet");
  if (!container) return;

  // Fisher-Yates shuffle
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function getMonthWeighted(pool, count) {
    var currentMonth = (new Date().getMonth() + 1).toString().padStart(2, "0");
    var current = pool.filter(function (p) {
      return p.captureDate && p.captureDate.split("-")[1] === currentMonth;
    });
    var other = pool.filter(function (p) {
      return !p.captureDate || p.captureDate.split("-")[1] !== currentMonth;
    });
    var target = Math.ceil(count / 3);
    var fromCurrent = shuffle(current).slice(0, Math.min(target, current.length));
    var remainder = count - fromCurrent.length;
    var fromOther = shuffle(other).slice(0, remainder);
    // Backfill from current-month pool if other pool is exhausted
    if (fromOther.length < remainder) {
      var usedIds = fromCurrent.map(function (p) { return p.id; });
      var backfill = shuffle(current).filter(function (p) { return usedIds.indexOf(p.id) === -1; });
      fromOther = fromOther.concat(backfill.slice(0, remainder - fromOther.length));
    }
    return shuffle(fromCurrent.concat(fromOther));
  }

  function buildSnippet(selected) {
    var html = "";
    for (var i = 0; i < selected.length; i++) {
      var p = selected[i];
      // Link to the photos page with this photo's hash — opens it directly in the grid lightbox
      html += '<div class="column is-one-quarter-desktop is-one-third-tablet is-half-mobile">' +
        '<div class="photo-grid-item">' +
          '<a href="/photos/#' + p.id + '">' +
            p.pictureHtml +
          '</a>' +
        '</div>' +
      '</div>';
    }
    // Deal card
    html += '<div class="column is-one-quarter-desktop is-one-third-tablet is-half-mobile">' +
      '<div class="deal-card" id="snippet-deal-card" role="button" tabindex="0" aria-label="Deal a new set of photos">' +
        '<span class="icon is-large"><i class="fas fa-shuffle fa-2x"></i></span>' +
        '<span class="deal-card-text">Deal again</span>' +
      '</div>' +
    '</div>';
    return html;
  }

  function render(selected, animate) {
    if (animate) {
      container.style.opacity = "0";
      setTimeout(function () {
        container.innerHTML = buildSnippet(selected);
        bindDealCard();
        container.style.opacity = "1";
      }, 300);
    } else {
      container.innerHTML = buildSnippet(selected);
      bindDealCard();
    }
  }

  function bindDealCard() {
    var card = document.getElementById("snippet-deal-card");
    if (!card) return;

    function deal() {
      var selected = getMonthWeighted(photos, SNIPPET_SIZE);
      render(selected, true);
      if (typeof plausible !== "undefined") {
        plausible("Photo Snippet Shuffle");
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
  render(getMonthWeighted(photos, SNIPPET_SIZE), false);
})();
