
import {
  getCart,
  clearCart,
} from '../../scripts/cart.js';

export default function decorate(block) {
  block.replaceChildren();

  const layout = document.createElement('div');
  layout.className = 'checkout-layout';

  // Delivery form
  const form = document.createElement('form');
  form.className = 'checkout-form';

  const heading = document.createElement('h2');
  heading.textContent = 'Delivery Information';
  form.append(heading);

  const fields = [
    { label: 'Full Name', name: 'name', type: 'text', autocomplete: 'name' },
    { label: 'Email Address', name: 'email', type: 'email', autocomplete: 'email' },
    { label: 'Phone Number', name: 'phone', type: 'tel', autocomplete: 'tel' },
    { label: 'Address', name: 'address', type: 'text', autocomplete: 'street-address' },
    { label: 'City', name: 'city', type: 'text', autocomplete: 'address-level2' },
    { label: 'Postal Code', name: 'postalCode', type: 'text', autocomplete: 'postal-code' },
  ];

  fields.forEach((field) => {
    const label = document.createElement('label');
    label.htmlFor = `checkout-${field.name}`;
    label.textContent = field.label;

    const input = document.createElement('input');
    input.id = `checkout-${field.name}`;
    input.name = field.name;
    input.type = field.type;
    input.autocomplete = field.autocomplete;
    input.required = true;

    form.append(label, input);
  });

  const paymentLabel = document.createElement('label');
  paymentLabel.htmlFor = 'checkout-payment';
  paymentLabel.textContent = 'Payment Method';

  const payment = document.createElement('select');
  payment.id = 'checkout-payment';
  payment.name = 'payment';
  payment.required = true;

  [
    { value: '', text: 'Select payment method' },
    { value: 'cod', text: 'Cash on Delivery' },
    { value: 'upi-demo', text: 'UPI (Demo)' },
  ].forEach((data) => {
    const option = document.createElement('option');
    option.value = data.value;
    option.textContent = data.text;
    payment.append(option);
  });

  form.append(paymentLabel, payment);

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.textContent = 'Place Order';
  form.append(submit);

  // Order summary
  const summary = document.createElement('div');
  summary.className = 'checkout-summary';

  const summaryHeading = document.createElement('h2');
  summaryHeading.textContent = 'Order Summary';
  summary.append(summaryHeading);

  const productsContainer = document.createElement('div');
  productsContainer.className = 'checkout-products';
  summary.append(productsContainer);

  const subtotalText = document.createElement('p');
  const totalText = document.createElement('h3');
  summary.append(subtotalText, totalText);

  const formatPrice = (amount) => (
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount)
  );

  const renderSummary = () => {
    productsContainer.replaceChildren();

    const cart = getCart();
    let subtotal = 0;

    if (cart.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.textContent = 'Your cart is empty.';
      productsContainer.append(emptyMessage);
    }

    cart.forEach((item) => {
      const price = Number(String(item.price).replace(/[₹,\s]/g, '')) || 0;
      const quantity = Number(item.quantity) || 1;
      subtotal += price * quantity;

      const row = document.createElement('div');
      row.className = 'checkout-product';

      const name = document.createElement('span');
      name.textContent = `${item.name} × ${quantity}`;

      const priceText = document.createElement('span');
      priceText.textContent = formatPrice(price * quantity);

      row.append(name, priceText);
      productsContainer.append(row);
    });

    subtotalText.textContent = `Subtotal: ${formatPrice(subtotal)}`;
    totalText.textContent = `Total: ${formatPrice(subtotal)}`;

    submit.disabled = cart.length === 0;
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const cart = getCart();

    if (cart.length === 0) {
      alert('Your cart is empty. Please add products before placing an order.');
      return;
    }

    const order = {
  customerName: form.elements.name.value,
  email: form.elements.email.value,
  phone: form.elements.phone.value,
  address: form.elements.address.value,
  city: form.elements.city.value,
  postalCode: form.elements.postalCode.value,
  payment: payment.value,
  items: getCart(),
  total: totalText.textContent.replace('Total: ', ''),
};

sessionStorage.setItem('novamart-last-order', JSON.stringify(order));

clearCart();

window.location.href = '/order-confirmation';
  });

  layout.append(form, summary);
  block.append(layout);

  renderSummary();
  window.addEventListener('cart-updated', renderSummary);

  window.addEventListener('cart-updated', renderSummary);
}
