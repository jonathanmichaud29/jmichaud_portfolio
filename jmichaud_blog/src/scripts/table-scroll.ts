document.querySelectorAll<HTMLTableElement>('.prose table').forEach((table) => {
  // outer: non-scrolling positioning context for the fade overlays
  const outer = document.createElement('div');
  outer.className = 'table-scroll-outer';

  // inner: the actual scrollable container
  const inner = document.createElement('div');
  inner.className = 'table-scroll-inner';

  table.parentNode!.insertBefore(outer, table);
  outer.appendChild(inner);
  inner.appendChild(table);

  const update = () => {
    const atStart = inner.scrollLeft <= 2;
    const atEnd = inner.scrollLeft + inner.clientWidth >= inner.scrollWidth - 2;
    outer.classList.toggle('can-scroll-left', !atStart);
    outer.classList.toggle('can-scroll-right', !atEnd);
  };

  inner.addEventListener('scroll', update, { passive: true });
  new ResizeObserver(update).observe(inner);
  update();
});
