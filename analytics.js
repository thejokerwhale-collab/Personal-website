(function () {
  "use strict";

  var trackedHosts = ["gregorymstiles.com", "www.gregorymstiles.com"];

  if (!trackedHosts.includes(window.location.hostname)) {
    return;
  }

  var measurementId = "G-ER7B6LMW24";

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  var googleTag = document.createElement("script");
  googleTag.async = true;
  googleTag.src =
    "https://www.googletagmanager.com/gtag/js?id=" +
    encodeURIComponent(measurementId);
  document.head.appendChild(googleTag);

  document.addEventListener(
    "click",
    function (event) {
      var link = event.target.closest("a");

      if (!link) {
        return;
      }

      var href = link.getAttribute("href") || "";

      if (href.indexOf("mailto:") === 0) {
        window.gtag("event", "contact_click", {
          transport_type: "beacon",
        });
        return;
      }

      var destination;

      try {
        destination = new URL(link.href, window.location.href);
      } catch (error) {
        return;
      }

      if (
        window.location.pathname === "/" &&
        destination.origin === window.location.origin &&
        destination.pathname.indexOf("/projects/") === 0
      ) {
        var projectSlug = destination.pathname
          .replace(/^\/projects\//, "")
          .split("/")[0];

        window.gtag("event", "project_open", {
          project_name: projectSlug,
          transport_type: "beacon",
        });
      }

      if (/\/game\.html$/.test(destination.pathname)) {
        window.gtag("event", "experience_start", {
          experience_name: "close-sheet",
          transport_type: "beacon",
        });
      }
    },
    true
  );
})();
