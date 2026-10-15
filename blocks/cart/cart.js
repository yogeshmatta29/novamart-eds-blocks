
import {
  getCart,
  updateCartQuantity,
  removeFromCart,
} from '../../scripts/cart.js';

export default function decorate(block) {
  const renderCart = () => {
    block.replaceChildren();

    const cart = getCart();

    const heading = document.createElement('h2');
    heading.textContent = 'Your Items';
    const layout = document.createElement('div');
    layout.className = 'cart-layout';

    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'cart-items';    
    block.append(heading, layout);
    layout.append(itemsContainer);

    if (!cart.length) {
      const empty = document.createElement('p');
      empty.textContent = 'Your cart is empty.';
      block.append(empty);
      return;
    }

    let total = 0;

    cart.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'cart-item';

      const image = document.createElement('img');
      image.className = 'cart-item-image';
      image.src = item.image;
      image.alt = item.name;
      image.loading = 'lazy';


      const name = document.createElement('h3');
      name.textContent = item.name;

      const price = document.createElement('p');
      price.textContent = `Price: ₹${item.price.toLocaleString('en-IN')}`;

      const quantity = document.createElement('span');
      quantity.textContent = `Quantity: ${item.quantity}`;

      const decrease = document.createElement('button');
      decrease.type = 'button';
      decrease.textContent = '−';
      decrease.setAttribute('aria-label', `Decrease ${item.name} quantity`);
      decrease.disabled = item.quantity <= 1;
      decrease.addEventListener('click', () => {
        updateCartQuantity(item.name, -1);
      });

      const increase = document.createElement('button');
      increase.type = 'button';
      increase.textContent = '+';
      increase.setAttribute('aria-label', `Increase ${item.name} quantity`);
      increase.addEventListener('click', () => {
        updateCartQuantity(item.name, 1);
      });

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = 'Remove';
      remove.addEventListener('click', () => {
        removeFromCart(item.name);
      });

      const controls = document.createElement('div');
      controls.className = 'cart-item-controls';
      controls.append(decrease, quantity, increase, remove);

      row.append(image, name, price, controls);
      itemsContainer.append(row);

      total += item.price * item.quantity;
    });

    const summary = document.createElement('div');
    summary.className = 'cart-summary';

    const summaryHeading = document.createElement('h2');
    summaryHeading.textContent = 'Order Summary';

    const subtotal = document.createElement('p');
    subtotal.textContent = `Subtotal: ₹${total.toLocaleString('en-IN')}`;

    const totalElement = document.createElement('h3');
    totalElement.textContent = `Total: ₹${total.toLocaleString('en-IN')}`;

    const checkoutButton = document.createElement('button');
    checkoutButton.type = 'button';
    checkoutButton.textContent = 'Proceed to Checkout';

    checkoutButton.addEventListener('click', () => {
    window.location.href = '/checkout';
    });

    summary.append(summaryHeading, subtotal, totalElement, checkoutButton);
    layout.append(summary);
  };

  renderCart();

  window.addEventListener('cart-updated', renderCart);
}
