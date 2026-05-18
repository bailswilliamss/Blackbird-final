
const projects = window.BLACKBIRD_PROJECTS || [];
const lightbox = document.getElementById('lightbox');
const galleryImage = document.getElementById('gallery-image');
const galleryTitle = document.getElementById('gallery-title');
const gallerySubtitle = document.getElementById('gallery-subtitle');
const galleryCount = document.getElementById('gallery-count');
const thumbRow = document.getElementById('thumb-row');
let activeProject = null;
let activeIndex = 0;

function renderGallery(){
  if(!activeProject) return;
  const img = activeProject.images[activeIndex];
  galleryImage.src = img;
  galleryImage.alt = activeProject.title;
  galleryTitle.textContent = activeProject.title;
  gallerySubtitle.textContent = activeProject.subtitle;
  galleryCount.textContent = `${activeIndex + 1} / ${activeProject.images.length}`;
  thumbRow.innerHTML = '';
  activeProject.images.forEach((src, i) => {
    const t = document.createElement('img');
    t.src = src;
    t.alt = activeProject.title + ' thumbnail';
    if(i === activeIndex) t.classList.add('active');
    t.addEventListener('click', () => { activeIndex = i; renderGallery(); });
    thumbRow.appendChild(t);
  });
}

function openProject(slug){
  activeProject = projects.find(p => p.slug === slug);
  if(!activeProject) return;
  activeIndex = 0;
  renderGallery();
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}

function closeGallery(){
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}

function nextImage(step){
  if(!activeProject) return;
  activeIndex = (activeIndex + step + activeProject.images.length) % activeProject.images.length;
  renderGallery();
}

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => openProject(card.dataset.project));
  card.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') openProject(card.dataset.project);
  });
});

document.querySelector('.lightbox-close').addEventListener('click', closeGallery);
document.querySelector('.lightbox-prev').addEventListener('click', () => nextImage(-1));
document.querySelector('.lightbox-next').addEventListener('click', () => nextImage(1));
lightbox.addEventListener('click', e => { if(e.target === lightbox) closeGallery(); });
document.addEventListener('keydown', e => {
  if(!lightbox.classList.contains('open')) return;
  if(e.key === 'Escape') closeGallery();
  if(e.key === 'ArrowRight') nextImage(1);
  if(e.key === 'ArrowLeft') nextImage(-1);
});
