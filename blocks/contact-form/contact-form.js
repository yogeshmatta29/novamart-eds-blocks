
export default function decorate(block) {
  const rows = [...block.children];

  const getText = (index) =>
    rows[index]?.textContent.trim() || '';

  const title = getText(0);
  const description = getText(1);

  // Read field definitions from DA.live
  const fieldRows = rows.slice(2);
  let submitText = 'Submit';

  const container = document.createElement('div');
  container.className = 'contact-form-content';

  if (title) {
    const heading = document.createElement('h2');
    heading.textContent = title;
    container.append(heading);
  }

  if (description) {
    const intro = document.createElement('p');
    intro.className = 'contact-form-intro';
    intro.textContent = description;
    container.append(intro);
  }

  const form = document.createElement('form');
  form.className = 'contact-form-fields';

  fieldRows.forEach((row) => {
    const rowText = row.textContent.trim();

    if (rowText.toLowerCase().startsWith('submit')) {
      submitText = rowText
        .replace(/^submit\s*[-|:]\s*/i, '')
        .trim() || 'Submit';
      return;
    }
    const parts = row.textContent
      .trim()
      .split(/\s*-\s*/);

    const [kind, labelText, fieldType, requirement] = parts;

    if (kind?.toLowerCase() !== 'field' || !labelText || !fieldType) {
      return;
    }

    const type = fieldType.toLowerCase();
    const required = requirement?.toLowerCase() === 'required';

    const name = labelText
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const label = document.createElement('label');
    const id = `contact-${name}`;

    label.htmlFor = id;
    label.append(document.createTextNode(labelText));

    const input = type === 'textarea'
      ? document.createElement('textarea')
      : document.createElement('input');

    input.id = id;
    input.name = name;
    input.required = required;

    if (type === 'textarea') {
      input.rows = 4;
    } else {
      input.type = type;
    }

    label.append(input);
    form.append(label);
  });

  const button = document.createElement('button');
  button.type = 'submit';
  button.textContent = submitText;
  form.append(button);

  const status = document.createElement('p');
  status.className = 'contact-form-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  form.append(status);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    button.disabled = true;
    button.textContent = 'Submitting...';
    status.textContent = '';

    window.setTimeout(() => {
      status.textContent =
        'Demo successful! No data was sent or saved.';

      form.reset();
      button.disabled = false;
      button.textContent = submitText;
    }, 800);
  });

  container.append(form);
  block.replaceChildren(container);
}
