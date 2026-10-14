document.addEventListener('DOMContentLoaded', function () {

    // Reemplaza las fotos pendientes (que aún no existen en /img/content)
    // por un bloque gris con una etiqueta que indica qué imagen va ahí.
    document.querySelectorAll('img[data-ph]').forEach(function (img) {
        img.addEventListener('error', function () {
            var thumb = img.closest('.thumb');
            if (thumb) {
                thumb.classList.add('thumb--empty');
                var label = document.createElement('span');
                label.className = 'thumb-label';
                label.textContent = img.dataset.ph;
                thumb.appendChild(label);
            }
            img.remove();
        }, { once: true });
    });

    // Filtro de categorías en "Últimos especiales"
    var filterPills = document.querySelectorAll('.filter-pill');
    var especialesCards = document.querySelectorAll('.especiales-grid .card');

    function applyFilter(category) {
        especialesCards.forEach(function (card) {
            var matches = !category || card.dataset.category === category;
            card.style.display = matches ? '' : 'none';
        });
    }

    filterPills.forEach(function (pill) {
        pill.addEventListener('click', function () {
            var wasActive = pill.classList.contains('active');
            filterPills.forEach(function (p) { p.classList.remove('active'); });
            if (wasActive) {
                applyFilter(null);
            } else {
                pill.classList.add('active');
                applyFilter(pill.dataset.filter);
            }
        });
    });

    // Carrusel de "Los reconocimientos"
    var awardsRow = document.querySelector('.awards-row');
    var awardsPrev = document.querySelector('.awards-prev');
    var awardsNext = document.querySelector('.awards-next');
    if (awardsRow && awardsNext) {
        awardsNext.addEventListener('click', function () {
            var step = awardsRow.clientWidth * 0.6;
            var atEnd = awardsRow.scrollLeft + awardsRow.clientWidth >= awardsRow.scrollWidth - 4;
            awardsRow.scrollTo({
                left: atEnd ? 0 : awardsRow.scrollLeft + step,
                behavior: 'smooth'
            });
        });
    }
    if (awardsRow && awardsPrev) {
        awardsPrev.addEventListener('click', function () {
            var step = awardsRow.clientWidth * 0.6;
            var atStart = awardsRow.scrollLeft <= 4;
            awardsRow.scrollTo({
                left: atStart ? awardsRow.scrollWidth : awardsRow.scrollLeft - step,
                behavior: 'smooth'
            });
        });
    }

    // Bullets del carrusel de "Los reconocimientos" (reemplazan las flechas en mobile)
    var awardsDots = document.querySelector('.awards-dots');
    if (awardsRow && awardsDots) {
        var awardItems = Array.prototype.slice.call(awardsRow.querySelectorAll('.award'));
        var dots = awardItems.map(function (award, index) {
            var dot = document.createElement('button');
            dot.type = 'button';
            dot.setAttribute('aria-label', 'Ir al reconocimiento ' + (index + 1));
            dot.addEventListener('click', function () {
                awardsRow.scrollTo({ left: award.offsetLeft, behavior: 'smooth' });
            });
            awardsDots.appendChild(dot);
            return dot;
        });

        if (dots.length) {
            dots[0].classList.add('active');
        }

        var scrollTimeout;
        awardsRow.addEventListener('scroll', function () {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function () {
                var current = awardItems.reduce(function (closest, award, index) {
                    var distance = Math.abs(award.offsetLeft - awardsRow.scrollLeft);
                    return distance < closest.distance ? { index: index, distance: distance } : closest;
                }, { index: 0, distance: Infinity }).index;

                dots.forEach(function (dot, index) {
                    dot.classList.toggle('active', index === current);
                });
            }, 100);
        });
    }

});
