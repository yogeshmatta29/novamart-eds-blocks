
export default function decorate(block) {
  const rows = [...block.children];

  const titleRow = rows[0];
  const descriptionRow = rows[1];
  const buttonRow = rows[2];

  const elements = [];

  const title = titleRow?.textContent.trim();
  if (title) {
    const heading = document.createElement('h2');
    heading.textContent = title;
    elements.push(heading);
  }

  const description = descriptionRow?.textContent.trim();
  if (description) {
    const paragraph = document.createElement('p');
    paragraph.textContent = description;
    elements.push(paragraph);
  }

  // Read the actual authored hyperlink
  const authoredLink = buttonRow?.querySelector('a');

  if (authoredLink) {
    const button = document.createElement('a');
    button.textContent = authoredLink.textContent.trim();
    button.href = authoredLink.href;
    button.className = 'announcement-button';
    elements.push(button);
  }

  block.replaceChildren(...elements);
}
