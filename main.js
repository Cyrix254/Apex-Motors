// Bootstrap tooltips (optional)
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
tooltipTriggerList.map(el => new bootstrap.Tooltip(el));

// Back to Top button logic
(function(){
  const btn = document.getElementById('backToTop');
  if(!btn) return;
  window.addEventListener('scroll', () => {
    btn.style.display = window.scrollY > 400 ? 'block' : 'none';
  });
  btn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
})();

// Cars page filtering + modal population
(function(){
  const gallery = document.querySelector('#carsGallery');
  if(!gallery) return; // only on cars.html

  const searchInput = document.getElementById('carSearch');
  const categorySelect = document.getElementById('categoryFilter');
  const cards = Array.from(gallery.querySelectorAll('.car-card'));

  function applyFilters(){
    const q = (searchInput.value || '').toLowerCase();
    const cat = categorySelect.value;

    cards.forEach(card => {
      const name = card.dataset.name.toLowerCase();
      const category = card.dataset.category;
      const matchQ = !q || name.includes(q);
      const matchCat = cat === 'all' || category === cat;
      card.style.display = (matchQ && matchCat) ? '' : 'none';
    });
  }

  searchInput.addEventListener('input', applyFilters);
  categorySelect.addEventListener('change', applyFilters);

  // Prefilter via URL ?cat=suv
  const params = new URLSearchParams(window.location.search);
  const pre = params.get('cat');
  if(pre){
    categorySelect.value = pre.toLowerCase();
    applyFilters();
  }

  // Modal dynamic content
  const detailsModal = document.getElementById('carDetailsModal');
  const modalTitle = detailsModal?.querySelector('.modal-title');
  const modalImg = detailsModal?.querySelector('.modal-img');
  const modalDesc = detailsModal?.querySelector('.modal-desc');
  const modalSpecs = detailsModal?.querySelector('.modal-specs');

  gallery.addEventListener('click', (e)=>{
    const btn = e.target.closest('[data-role="view-details"]');
    if(!btn) return;
    const card = btn.closest('.car-card');
    const title = card.querySelector('.card-title')?.textContent.trim();
    const imgSrc = card.querySelector('img')?.getAttribute('src');
    const desc = card.querySelector('.card-text')?.textContent.trim();
    const specs = JSON.parse(card.dataset.specs || '{}');

    if(modalTitle) modalTitle.textContent = title || 'Car Details';
    if(modalImg) modalImg.setAttribute('src', imgSrc);
    if(modalDesc) modalDesc.textContent = desc || '';

    if(modalSpecs){
      modalSpecs.innerHTML = '';
      const entries = Object.entries(specs);
      if(entries.length === 0){
        modalSpecs.innerHTML = '<tr><td colspan="2">Specs coming soon.</td></tr>';
      } else {
        entries.forEach(([k, v]) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<th class="text-capitalize">${k.replace(/_/g, ' ')}</th><td>${v}</td>`;
            modalSpecs.appendChild(tr);
          });
      }
    }

    const modal = new bootstrap.Modal(detailsModal);
    modal.show();
  });
})();