
export default function decorate(block) {
  const rows = [...block.children].filter((row) => row.children.length > 0);

  if (!rows.length) return;

  const slides = rows.map((row, index) => {
    const cells = [...row.children];
    const slide = document.createElement('div');
    const image = cells[0]?.querySelector('picture');
    const heading = cells[1]?.querySelector('h1, h2, h3, h4');
    const description = cells[2]?.querySelector('p');
    const link = cells[3]?.querySelector('a');

    slide.className = 'hero-slide';
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `Slide ${index + 1} of ${rows.length}`);

    if (image) slide.append(image);

    const content = document.createElement('div');
    content.className = 'hero-slide-content';

    if (heading) content.append(heading);
    if (description) content.append(description);

    if (link) {
      link.classList.add('button');
      content.append(link);
    }

    slide.append(content);
    row.replaceWith(slide);

    return slide;
  });

  const controls = document.createElement('div');
  controls.className = 'hero-slider-controls';

  const previous = document.createElement('button');
  previous.type = 'button';
  previous.className = 'hero-slider-prev';
  previous.textContent = '‹';
  previous.setAttribute('aria-label', 'Previous slide');

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'hero-slider-next';
  next.textContent = '›';
  next.setAttribute('aria-label', 'Next slide');

  const dots = document.createElement('div');
  dots.className = 'hero-slider-dots';

  const dotButtons = slides.map((slide, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'hero-slider-dot';
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    dot.addEventListener('click', () => showSlide(index));
    dots.append(dot);
    return dot;
  });

  controls.append(previous, dots, next);
  block.append(controls);

  let current = 0;
  let timer;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      const active = i === current;
      slide.classList.toggle('active', active);
      slide.setAttribute('aria-hidden', String(!active));
      dotButtons[i].classList.toggle('active', active);

      if (active) {
        dotButtons[i].setAttribute('aria-current', 'true');
      } else {
        dotButtons[i].removeAttribute('aria-current');
      }
    });
  }

  function stopAutoPlay() {
    window.clearInterval(timer);
  }

  function startAutoPlay() {
    stopAutoPlay();

    if (
      slides.length > 1
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      timer = window.setInterval(() => showSlide(current + 1), 5000);
    }
  }

  previous.addEventListener('click', () => {
    showSlide(current - 1);
    startAutoPlay();
  });

  next.addEventListener('click', () => {
    showSlide(current + 1);
    startAutoPlay();
  });

  block.addEventListener('mouseenter', stopAutoPlay);
  block.addEventListener('mouseleave', startAutoPlay);
  block.addEventListener('focusin', stopAutoPlay);
  block.addEventListener('focusout', startAutoPlay);

  showSlide(0);
  startAutoPlay();
}
