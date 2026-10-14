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

    // Filtro de categorías (pills en desktop, select en mobile) + paginación (12 en 12)
    var filterPills = document.querySelectorAll('.filter-pill');
    var filterSelect = document.querySelector('.filter-select');
    var especialesCards = Array.prototype.slice.call(document.querySelectorAll('.especiales-grid .card'));
    var verMasBtn = document.getElementById('especiales-ver-mas');
    var PAGE_SIZE = 12;
    var currentCategory = null;
    var visibleCount = PAGE_SIZE;

    function render() {
        var eligible = especialesCards.filter(function (card) {
            return !currentCategory || card.dataset.category === currentCategory;
        });

        eligible.forEach(function (card, index) {
            card.style.display = index < visibleCount ? '' : 'none';
        });
        especialesCards.forEach(function (card) {
            if (eligible.indexOf(card) === -1) {
                card.style.display = 'none';
            }
        });

        if (verMasBtn) {
            verMasBtn.hidden = visibleCount >= eligible.length;
        }
    }

    function setCategory(filterValue) {
        currentCategory = filterValue === 'todos' ? null : filterValue;
        visibleCount = PAGE_SIZE;

        filterPills.forEach(function (p) {
            p.classList.toggle('active', p.dataset.filter === filterValue);
        });
        if (filterSelect) {
            filterSelect.value = filterValue;
        }

        render();
    }

    filterPills.forEach(function (pill) {
        pill.addEventListener('click', function () {
            setCategory(pill.dataset.filter);
        });
    });

    if (filterSelect) {
        filterSelect.addEventListener('change', function () {
            setCategory(filterSelect.value);
        });
    }

    if (verMasBtn) {
        verMasBtn.addEventListener('click', function () {
            visibleCount += PAGE_SIZE;
            render();
        });
    }

    render();

    // Carrusel reutilizable: conecta una fila con scroll horizontal a sus flechas prev/next
    function initCarousel(row, prevBtn, nextBtn) {
        if (!row) return;
        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                var step = row.clientWidth * 0.6;
                var atEnd = row.scrollLeft + row.clientWidth >= row.scrollWidth - 4;
                row.scrollTo({
                    left: atEnd ? 0 : row.scrollLeft + step,
                    behavior: 'smooth'
                });
            });
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                var step = row.clientWidth * 0.6;
                var atStart = row.scrollLeft <= 4;
                row.scrollTo({
                    left: atStart ? row.scrollWidth : row.scrollLeft - step,
                    behavior: 'smooth'
                });
            });
        }
    }

    // Carrusel de "Los reconocimientos"
    var awardsRow = document.querySelector('.awards-row');
    initCarousel(awardsRow, document.querySelector('.awards-prev'), document.querySelector('.awards-next'));

    // Carrusel de "Infodraws"
    initCarousel(document.querySelector('.infodraws-row'), document.querySelector('.infodraws-prev'), document.querySelector('.infodraws-next'));

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
