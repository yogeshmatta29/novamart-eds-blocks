
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

      const categoryLink = document.createElement('a');
      categoryLink.className = 'category-card-link';
      categoryLink.href = categoryRoutes[matchedCategory];
      categoryLink.setAttribute('aria-label', `Browse ${matchedCategory}`);

      while (li.firstElementChild) {
        categoryLink.append(li.firstElementChild);
      }

      li.append(categoryLink);
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
  const picture = img.closest('picture');
  const cardText = img.closest('li')?.textContent
    .trim()
    .toLowerCase();

  let alt = img.alt?.trim();

  if (!alt) {
    if (cardText?.includes('mobile')) {
      alt = 'Mobile phones';
    } else if (cardText?.includes('laptop')) {
      alt = 'Laptops and computers';
    } else if (cardText?.includes('audio')) {
      alt = 'Headphones and audio devices';
    } else if (cardText?.includes('accessories')) {
      alt = 'Tech accessories';
    } else {
      alt = 'NovaMart product';
    }
  }

  picture.replaceWith(
    createOptimizedPicture(img.src, alt, false, [{ width: '750' }]),
  );
});


  block.replaceChildren(ul);
}
