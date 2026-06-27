(function(){
  "use strict";

  var CALENDLY_URL = "https://calendly.com/glykeriapantazi/30min?hide_event_type_details=1&hide_gdpr_banner=1";
  var SCRIPT_URL = "https://assets.calendly.com/assets/external/widget.js";
  var modal;
  var widgetReady = false;

  function buildModal(){
    if(modal) return modal;

    modal = document.createElement("div");
    modal.className = "booking-modal";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML =
      '<div class="booking-modal__backdrop" data-booking-close></div>' +
      '<div class="booking-modal__panel" role="dialog" aria-modal="true" aria-labelledby="bookingTitle">' +
        '<div class="booking-modal__head">' +
          '<div><div class="booking-modal__title" id="bookingTitle">Κλείστε ραντεβού</div>' +
          '<div class="booking-modal__sub">Επιλέξτε διαθέσιμη ώρα μέσω Calendly</div></div>' +
          '<button class="booking-modal__close" type="button" aria-label="Κλείσιμο" data-booking-close>&times;</button>' +
        '</div>' +
        '<div class="booking-modal__body" id="bookingBody">' +
          '<div class="booking-modal__fallback">Φόρτωση ημερολογίου... Αν δεν εμφανιστεί, <a href="' + CALENDLY_URL + '" target="_blank" rel="noopener">ανοίξτε το Calendly σε νέο παράθυρο</a>.</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);

    modal.addEventListener("click", function(event){
      if(event.target && event.target.hasAttribute("data-booking-close")) closeModal();
    });

    document.addEventListener("keydown", function(event){
      if(event.key === "Escape" && modal.classList.contains("open")) closeModal();
    });

    return modal;
  }

  function loadCalendly(callback){
    if(window.Calendly){
      callback();
      return;
    }
    var existing = document.querySelector('script[src="' + SCRIPT_URL + '"]');
    if(existing){
      existing.addEventListener("load", callback, {once:true});
      return;
    }
    var script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = callback;
    document.head.appendChild(script);
  }

  function renderWidget(){
    var body = document.getElementById("bookingBody");
    if(!body || widgetReady) return;
    body.innerHTML = '<div class="calendly-inline-widget" data-url="' + CALENDLY_URL + '" style="min-width:320px;height:700px;"></div>';
    loadCalendly(function(){
      var target = body.querySelector(".calendly-inline-widget");
      if(window.Calendly && target){
        target.innerHTML = "";
        window.Calendly.initInlineWidget({
          url: CALENDLY_URL,
          parentElement: target
        });
      }
      widgetReady = true;
    });
  }

  function openModal(event){
    if(event) event.preventDefault();
    buildModal();
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("booking-open");
    renderWidget();
    var closeButton = modal.querySelector(".booking-modal__close");
    if(closeButton) closeButton.focus({preventScroll:true});
  }

  function closeModal(){
    if(!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("booking-open");
  }

  document.addEventListener("click", function(event){
    var trigger = event.target.closest("[data-booking]");
    if(trigger) openModal(event);
  });

  document.querySelectorAll('a[href*="calendly.com/glykeriapantazi"]').forEach(function(link){
    link.setAttribute("data-booking", "");
  });
})();
