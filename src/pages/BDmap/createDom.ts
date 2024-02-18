export function createDom() {
  const div = document.createElement('div');
  div.style.position = 'relative';
  div.style.backgroundColor = '#fff';
  div.style.color = 'rgba(0,0,0,0.85)';
  div.style.whiteSpace = 'nowrap';
  div.style.padding = '5px 8px';
  div.style.lineHeight = '22px';
  div.style.fontSize = '14px';
  div.style.borderRadius = '2px'
  div.style.boxShadow = '0px 12px 48px 16px rgba(6,29,116,0.06), 0px 8px 28px 0px rgba(6,29,116,0.06), 0px 6px 16px -8px rgba(6,29,116,0.06);'

  const span = document.createElement('span');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  span.appendChild(document.createTextNode(this.properties.title));
  div.appendChild(span);

  const arrow = document.createElement('div');
  arrow.style.position = 'absolute';
  arrow.style.top = '32px';
  arrow.style.left = '50%';
  arrow.style.transform = 'translateX(-50%)';
  arrow.style.width = '0';
  arrow.style.height = '0';
  arrow.style.borderColor = 'white transparent transparent transparent';
  arrow.style.borderStyle = 'solid';
  arrow.style.borderWidth = '6px';
  arrow.style.overflow = 'hidden';
  div.appendChild(arrow);

  return div;
}