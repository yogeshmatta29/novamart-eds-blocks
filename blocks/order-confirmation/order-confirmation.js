
export default function decorate(block) {
  block.replaceChildren();

  const container = document.createElement('div');
  container.className = 'order-confirmation-container';

  const order = (() => {
    try {
      return JSON.parse(sessionStorage.getItem('novamart-last-order'));
    } catch {
      return null;
    }
  })();

  const successIcon = document.createElement('div');
  successIcon.className = 'order-success-icon';
  successIcon.textContent = '✓';
  successIcon.setAttribute('aria-hidden', 'true');

  const heading = document.createElement('h1');
  heading.textContent = 'Thank You for Your Order!';

  const message = document.createElement('p');
  message.className = 'order-success-message';
  message.textContent = 'Your demo order has been placed successfully.';

  const reference = document.createElement('p');
  reference.className = 'order-number';

  if (order) {
    if (!order.orderReference) {
      order.orderReference = `NM-${Date.now().toString().slice(-8)}`;
      sessionStorage.setItem('novamart-last-order', JSON.stringify(order));
    }
    reference.textContent = `Order Reference: ${order.orderReference}`;
  } else {
    reference.textContent = 'No recent order details found.';
  }

  const detailsHeading = document.createElement('h2');
  detailsHeading.textContent = 'Order Details';

  container.append(successIcon, heading, message, reference, detailsHeading);

  if (order) {
    const customer = document.createElement('p');
    customer.textContent = `Customer: ${order.customerName}`;

    const address = document.createElement('p');
    address.textContent = `Delivery Address: ${order.address}, ${order.city} - ${order.postalCode}`;

    const payment = document.createElement('p');
    payment.textContent = `Payment Method: ${
      order.payment === 'cod' ? 'Cash on Delivery' : 'UPI (Demo)'
    }`;

    container.append(customer, address, payment);

    const itemsHeading = document.createElement('h3');
    itemsHeading.textContent = 'Products';
    container.append(itemsHeading);

    const itemsList = document.createElement('div');
    itemsList.className = 'confirmation-items';

    const formatPrice = (amount) => new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);

    order.items.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'confirmation-item';

      const name = document.createElement('span');
      name.textContent = `${item.name} × ${Number(item.quantity) || 1}`;

      const price = Number(String(item.price).replace(/[₹,\s]/g, '')) || 0;
      const quantity = Number(item.quantity) || 1;

      const amount = document.createElement('span');
      amount.textContent = formatPrice(price * quantity);

      row.append(name, amount);
      itemsList.append(row);
    });

    container.append(itemsList);

    const total = document.createElement('h3');
    total.className = 'confirmation-total';
    total.textContent = `Order Total: ${order.total}`;
    container.append(total);
  }

  const homeLink = document.createElement('a');
  homeLink.href = '/';
  homeLink.className = 'order-home-link';
  homeLink.textContent = 'Continue Shopping';

  container.append(homeLink);
  block.append(container);
}
