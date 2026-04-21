/* =========================================================
   Bennett Online MBA — script.js  (v3 — bulletproof reset)
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* ── 1. Counter Animation ──────────────────────────── */
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const counter = entry.target;
            if (counter.classList.contains('started')) return;
            counter.classList.add('started');
            const target = +counter.getAttribute('data-target');
            const suffix = counter.getAttribute('data-suffix') || '';
            const increment = target / 60;
            let count = 0;
            const tick = () => {
                count = Math.min(count + increment, target);
                counter.innerText = Math.ceil(count).toLocaleString() + suffix;
                if (count < target) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            obs.unobserve(counter);
        });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));


    /* ── 2. Back-to-Top ────────────────────────────────── */
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => backToTop.classList.toggle('show', window.scrollY > 300));
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }


    /* ══════════════════════════════════════════════════════
       3. FORM — VALIDATION + SUBMIT + RESET
       ══════════════════════════════════════════════════════ */

    const form = document.getElementById('userFrm');
    if (!form) return;

    const nameField = form.querySelector('[name="fullname"]');
    const emailField = form.querySelector('[name="email"]');
    const mobileField = form.querySelector('[name="mobile"]');
    const cityField = form.querySelector('select[name="city"]');
    const ccSelect = form.querySelector('select[name="country_code"]');
    const submitBtn = form.querySelector('[type="submit"]');


    /* ── Error display helpers ── */
    function getErrEl(field) {
        const wrapper = field.closest('.phone-wrapper');
        const parent = wrapper ? wrapper.parentElement : field.parentElement;
        let el = parent.querySelector('.invalid-feedback');
        if (!el) {
            el = document.createElement('div');
            el.className = 'invalid-feedback';
            parent.appendChild(el);
        }
        return el;
    }

    function markInvalid(field, msg) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        const el = getErrEl(field);
        el.textContent = msg;
        el.style.display = 'block';
    }

    function markValid(field) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        const el = getErrEl(field);
        el.textContent = '';
        el.style.display = 'none';
    }


    /* ── Validation rules ── */
    function checkName() {
        const v = nameField.value;
        if (!v.trim()) return markInvalid(nameField, 'Full name is required.'), false;
        if (!/^[a-zA-Z\s]{2,}$/.test(v.trim())) return markInvalid(nameField, 'Letters only, min 2 characters.'), false;
        if (v.trim().length > 80) return markInvalid(nameField, 'Name cannot exceed 80 characters.'), false;
        markValid(nameField); return true;
    }

    function checkEmail() {
        const v = emailField.value;
        if (!v.trim()) return markInvalid(emailField, 'Email address is required.'), false;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return markInvalid(emailField, 'Please enter a valid email address.'), false;
        if (v.trim().length > 150) return markInvalid(emailField, 'Email cannot exceed 150 characters.'), false;
        markValid(emailField); return true;
    }

    function checkMobile() {
        const v = mobileField.value.trim();
        const cc = ccSelect ? ccSelect.value : '+91';
        if (!v) return markInvalid(mobileField, 'Mobile number is required.'), false;
        if (cc === '+91' && !/^[6-9][0-9]{9}$/.test(v))
            return markInvalid(mobileField, 'Enter valid 10-digit number starting with 6–9.'), false;
        if (cc !== '+91' && !/^[0-9]{7,15}$/.test(v))
            return markInvalid(mobileField, 'Enter a valid mobile number (7–15 digits).'), false;
        markValid(mobileField); return true;
    }

    function checkCity() {
        const v = cityField ? cityField.value : '';
        if (!v || v === 'Select City') return markInvalid(cityField, 'Please select your city.'), false;
        markValid(cityField); return true;
    }


    /* ── Live validation listeners ── */
    if (nameField) {
        nameField.addEventListener('blur', checkName);
        nameField.addEventListener('input', () => { if (nameField.classList.contains('is-invalid')) checkName(); });
    }
    if (emailField) {
        emailField.addEventListener('blur', checkEmail);
        emailField.addEventListener('input', () => { if (emailField.classList.contains('is-invalid')) checkEmail(); });
    }
    if (mobileField) {
        mobileField.addEventListener('input', function () {
            this.value = this.value.replace(/[^0-9]/g, '').slice(0, 15);
            if (this.classList.contains('is-invalid')) checkMobile();
        });
        mobileField.addEventListener('blur', checkMobile);
    }
    if (ccSelect) {
        ccSelect.addEventListener('change', () => { if (mobileField && mobileField.value.trim()) checkMobile(); });
    }
    if (cityField) {
        cityField.addEventListener('change', checkCity);
    }


    /* ── FULL form reset ── */
    function resetFormFully() {
        /* 1. Native browser reset (clears inputs, selects, checkboxes) */
        form.reset();

        /* 2. Remove every validation class from every input / select */
        form.querySelectorAll('input, select, textarea').forEach(function (el) {
            el.classList.remove('is-valid', 'is-invalid');
        });

        /* 3. Wipe all error messages */
        form.querySelectorAll('.invalid-feedback').forEach(function (el) {
            el.textContent = '';
            el.style.display = 'none';
        });

        /* 4. Restore submit button */
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Download Brochure';
        }

        /* 5. Hide AJAX error banner */
        const errBox = form.querySelector('.ajax-error-msg');
        if (errBox) errBox.style.display = 'none';

        /* 6. Force selects back — form.reset() handles value but not selectedIndex
              in all browsers reliably */
        if (cityField) cityField.selectedIndex = 0;
        if (ccSelect) ccSelect.value = '+91';

        /* 7. Re-check consent checkbox (default = checked) */
        const consent = form.querySelector('[name="marketing_consent"]');
        if (consent) consent.checked = true;
    }


    /* ── Utilities ── */
    const WA_NUMBER = '919963323226';

    function buildWAURL(data) {
        const msg = 'Hello! Enquiry for *' + data.program + '* at Bennett University.\n\n' +
            '*Name:* ' + data.name + '\n*Email:* ' + data.email + '\n*Phone:* ' + data.phone + '\n' +
            '*City:* ' + data.city + '\n*Specialization:* ' + data.spec + '\n*Ref:* ' + data.ref + '\n\nPlease contact me. Thank you!';
        return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
    }

    function triggerDownload(program) {
        var link = (program && program.indexOf('BBA') !== -1)
            ? './asset/BBA-Prospectus-Jan-2026.pdf'
            : './asset/MBA-Prospectus-Jan-2026.pdf';
        var a = document.createElement('a');
        a.href = link;
        a.download = link.split('/').pop();
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return link;
    }

    function showAjaxError(msg) {
        var errBox = form.querySelector('.ajax-error-msg');
        if (!errBox) {
            errBox = document.createElement('div');
            errBox.className = 'ajax-error-msg';
            form.insertBefore(errBox, form.firstChild);
        }
        errBox.textContent = msg;
        errBox.style.display = 'block';
        clearTimeout(errBox._t);
        errBox._t = setTimeout(function () { errBox.style.display = 'none'; }, 6000);
    }

    function showToast(ref, brochureLink, waURL) {
        var old = document.getElementById('bu-success-toast');
        if (old) old.remove();

        var toast = document.createElement('div');
        toast.id = 'bu-success-toast';
        toast.innerHTML =
            '<div class="bu-toast-inner">' +
            '  <div class="bu-toast-icon">&#10003;</div>' +
            '  <div class="bu-toast-body">' +
            '    <p class="bu-toast-title">Brochure Downloaded!</p>' +
            '    <p class="bu-toast-ref">Ref: <strong>' + ref + '</strong></p>' +
            '    <p class="bu-toast-msg">Form cleared — ready for the next enquiry.</p>' +
            '    <div class="bu-toast-links">' +
            '      <a href="' + brochureLink + '" target="_blank" class="bu-toast-dl">&#128196; Download again</a>' +
            '      <a href="' + waURL + '" target="_blank" rel="noopener" class="bu-toast-wa">&#128172; WhatsApp</a>' +
            '    </div>' +
            '  </div>' +
            '  <button class="bu-toast-close" aria-label="Close">&#10005;</button>' +
            '</div>' +
            '<div class="bu-toast-progress"></div>';

        document.body.appendChild(toast);

        // Double rAF ensures transition plays
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                toast.classList.add('bu-toast-show');
            });
        });

        function dismiss() {
            clearTimeout(toast._t);
            toast.classList.remove('bu-toast-show');
            toast.classList.add('bu-toast-hide');
            setTimeout(function () { if (toast.parentNode) toast.remove(); }, 400);
        }
        toast.querySelector('.bu-toast-close').addEventListener('click', dismiss);
        toast._t = setTimeout(dismiss, 7000);
    }


    /* ── Submit handler ── */
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Run all validations — use bitwise & so ALL run (not short-circuit)
        var ok = checkName() && checkEmail() && checkMobile() && checkCity();

        if (!ok) {
            var firstBad = form.querySelector('.is-invalid');
            if (firstBad) {
                firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(function () { firstBad.focus(); }, 400);
            }
            return;
        }

        // Honeypot
        var hp = form.querySelector('#hp_field');
        if (hp && hp.value !== '') { console.warn('Spam blocked.'); return; }

        // Snapshot form data BEFORE reset
        var formData = new FormData(form);
        var program = formData.get('program') || '';

        // Trigger brochure download immediately
        var brochureLink = triggerDownload(program);

        // Show spinner
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="bu-spinner"></span> Submitting\u2026';

        // POST to server
        fetch('process.php', { method: 'POST', body: formData })
            .then(function (r) {
                if (!r.ok) throw new Error('HTTP ' + r.status);
                return r.json();
            })
            .then(function (res) {
                console.log('Server response:', res);

                // Server-side failure
                if ('success' in res && !res.success) {
                    showAjaxError(res.error || 'Validation failed. Please check your input.');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Download Brochure';
                    return;
                }

                var body = res && res.api_response && res.api_response.body;
                var ref = (body && (body.referenceNumber || body.recordId)) || null;

                if (!ref) {
                    showAjaxError('Something went wrong. Please try again.');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Download Brochure';
                    return;
                }

                var leadData = {
                    name: formData.get('fullname') || '',
                    email: formData.get('email') || '',
                    phone: (formData.get('country_code') || '') + ' ' + (formData.get('mobile') || ''),
                    city: formData.get('city') || '',
                    program: program,
                    spec: formData.get('mba_specialization') || '',
                    ref: ref
                };

                // DataLayer
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    event: 'Thank-You', form_name: 'BU Lead Form',
                    program_name: leadData.program, specialisation: leadData.spec,
                    landing_page_url: window.location.href,
                    lead_source: new URLSearchParams(window.location.search).get('utm_source') || 'website',
                    reference_no: ref
                });

                // ✅ Reset form — all fields cleared, ready for next lead
                resetFormFully();

                // ✅ Show toast
                const waURL = buildWAURL(leadData);

// WhatsApp open
window.open(waURL, "_blank");

// Toast
showToast(ref, brochureLink, waURL);
            })
            .catch(function (err) {
                console.error('Fetch error:', err);
                showAjaxError('Network error. Please check your connection and try again.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Download Brochure';
            });
    });

}); /* end DOMContentLoaded */


/* ── 4. Sliders (jQuery — runs after jQuery loads) ───── */
$(document).ready(function () {

    if ($('.recruiter-slider').length) {
        $('.recruiter-slider').slick({
            slidesToShow: 6, slidesToScroll: 1, autoplay: true, autoplaySpeed: 2000,
            arrows: true, dots: false, infinite: true,
            responsive: [
                { breakpoint: 992, settings: { slidesToShow: 4 } },
                { breakpoint: 768, settings: { slidesToShow: 3 } },
                { breakpoint: 576, settings: { slidesToShow: 2 } }
            ]
        });
    }

    if ($('.faculty-slider').length) {
        $('.faculty-slider').slick({
            slidesToShow: 2, slidesToScroll: 1, autoplay: true, autoplaySpeed: 3000,
            arrows: true, dots: true, infinite: true,
            responsive: [
                { breakpoint: 992, settings: { slidesToShow: 2 } },
                { breakpoint: 768, settings: { slidesToShow: 1 } }
            ]
        });
    }

    if ($('.timeline').length) {
        $('.timeline').slick({
            slidesToShow: 3, slidesToScroll: 1, autoplay: false,
            arrows: true, dots: false, infinite: false,
            responsive: [
                { breakpoint: 992, settings: { slidesToShow: 2 } },
                { breakpoint: 768, settings: { slidesToShow: 1 } }
            ]
        });
    }

    if ($('.timeline-slider').length) {
        $('.timeline-slider').slick({
            slidesToShow: 3, centerMode: false, centerPadding: '0px',
            arrows: true, dots: false, infinite: false,
            responsive: [
                { breakpoint: 992, settings: { slidesToShow: 2 } },
                { breakpoint: 768, settings: { slidesToShow: 1 } }
            ]
        });
    }
});
