
import { createOptimizedPicture } from '../../scripts/aem.js';
import { addToCart } from '../../scripts/cart.js';
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const categoryLink = li.querySelector('a');

    while (row.firstElementChild) {
      li.append(row.firstElementChild);
    }
    
    
    const cardContent = li.textContent.trim().toLowerCase();

    const categoryRoutes = {
      mobiles: '/mobiles',
      laptops: '/laptops',
      accessories: '/accessories',
      audio: '/audio',
    };

    const matchedCategory = Object.keys(categoryRoutes).find(
      (category) => cardContent.includes(category),
    );

    if (matchedCategory && !/₹\s?[\d,]+/.test(cardContent)) {
      li.classList.add('category-card');
      li.style.cursor = 'pointer';

      li.addEventListener('click', (event) => {
        if (event.target.closest('button, a')) return;
        window.location.href = categoryRoutes[matchedCategory];
      });
    }



    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else {
        div.className = 'cards-card-body';
      }
    });

    // Add button only to product cards containing a price
    const cardText = li.textContent;
    if (/₹\s?[\d,]+/.test(cardText)) {
      const button = document.createElement('button');
      button.className = 'add-to-cart';
      button.type = 'button';
      button.textContent = 'Add to Cart';
      button.addEventListener('click', () => {
      const cardText = li.textContent;
      const paragraphs = [...li.querySelectorAll('.cards-card-body p')];

      const productName = paragraphs
        .map((p) => p.textContent.trim())
      .find((text) => /^(NovaPhone|NovaBook|NovaCharge|NovaCable|NovaShield|NovaPower|NovaBuds|NovaSound|NovaBeat|NovaBass)/i.test(text));

      const priceText = paragraphs
        .map((p) => p.textContent.trim())
        .find((text) => /₹\s?[\d,]+/.test(text));

      if (!productName || !priceText) return;

      const price = Number(priceText.replace(/[₹,\s]/g, ''));

      const image = li.querySelector('.cards-card-image img');
      const imageSrc = image?.getAttribute('src') || image?.src;

      addToCart({
        name: productName,
        price,
        image: imageSrc,
      });

      button.textContent = 'Added!';
    });

      li.append(button);
    }

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
    );
  });

  block.replaceChildren(ul);
}
