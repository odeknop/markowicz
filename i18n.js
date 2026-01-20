// i18n.js - Internalization script for language switching

(function() {
  'use strict';

  // Get current language from localStorage or default to French
  let currentLang = localStorage.getItem('lang') || 'fr';

  // Initialize on page load
  document.addEventListener('DOMContentLoaded', function() {
    // Check URL parameter for language
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');

    if (langParam === 'fr_BE' || langParam === 'fr') {
      currentLang = 'fr';
    } else if (langParam === 'en_GB' || langParam === 'en') {
      currentLang = 'en';
    }

    // Apply language
    setLanguage(currentLang);

    // Setup language switcher click events
    setupLanguageSwitcher();
  });

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);

    // Update HTML lang attribute
    document.documentElement.lang = lang === 'fr' ? 'fr' : 'en';

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(function(element) {
      const key = element.getAttribute('data-i18n');
      const translation = getNestedTranslation(translations[lang], key);

      if (translation) {
        if (element.hasAttribute('data-i18n-html')) {
          element.innerHTML = translation;
        } else {
          element.textContent = translation;
        }
      }
    });

    // Update elements with data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(element) {
      const key = element.getAttribute('data-i18n-placeholder');
      const translation = getNestedTranslation(translations[lang], key);
      if (translation) {
        element.placeholder = translation;
      }
    });

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && translations[lang].metaDescription) {
      metaDesc.content = translations[lang].metaDescription;
    }

    // Update podcast link href
    const podcastLink = document.getElementById('menopausePodcastLink');
    if (podcastLink && translations[lang].menopausePodcastUrl) {
      podcastLink.href = translations[lang].menopausePodcastUrl;
    }

    // Update appointment button href to include locale
    const appointmentBtn = document.getElementById('bookAppointmentBtn');
    if (appointmentBtn) {
      const locale = lang === 'fr' ? 'fr' : 'en';
      appointmentBtn.href = 'https://application.mikrono.com/?assoId=em-3b1457db-6999-4ca7-8b1b-08936172ea92&locale=' + locale;
    }

    // Update language switcher active state
    updateLanguageSwitcher(lang);
  }

  function getNestedTranslation(obj, key) {
    return key.split('.').reduce(function(o, k) {
      return o && o[k];
    }, obj);
  }

  function setupLanguageSwitcher() {
    const langLinks = document.querySelectorAll('.lang-selector a');

    langLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();

        const href = this.getAttribute('href');
        let lang = 'fr';

        if (href.includes('lang=en') || href.includes('EN')) {
          lang = 'en';
        } else if (href.includes('lang=fr') || href.includes('FR')) {
          lang = 'fr';
        }

        setLanguage(lang);
      });
    });
  }

  function updateLanguageSwitcher(lang) {
    const langItems = document.querySelectorAll('.lang-selector li');

    langItems.forEach(function(item) {
      item.classList.remove('active');
      const link = item.querySelector('a');

      if (link) {
        const href = link.getAttribute('href');
        if ((lang === 'fr' && (href.includes('lang=fr') || href.includes('FR'))) ||
            (lang === 'en' && (href.includes('lang=en') || href.includes('EN')))) {
          item.classList.add('active');
        }
      }
    });
  }

  // Expose setLanguage globally for external use if needed
  window.setLanguage = setLanguage;
})();
