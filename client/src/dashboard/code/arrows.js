// arrows.js

// Store navigation flows as { from: frameId, to: frameId }
const navigationMap = [];

// Create SVG overlay for arrows
const canvas = document.getElementById('canvas');
let svg = document.getElementById('arrow-svg');
if (!svg) {
  svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute('id', 'arrow-svg');
  svg.style.position = 'absolute';
  svg.style.top = 0;
  svg.style.left = 0;
  svg.style.width = '100%';
  svg.style.height = '100%';
  svg.style.pointerEvents = 'none';
  canvas.parentElement.appendChild(svg);
}

// Helper: get center of a connection point
function getConnectionPointCenter(el) {
  const rect = el.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2 - canvasRect.left + canvas.scrollLeft,
    y: rect.top + rect.height / 2 - canvasRect.top + canvas.scrollTop
  };
}

// Helper: get frameId from connection point
function getFrameIdFromConnection(el) {
  const attr = el.getAttribute('data-connection');
  return attr ? attr.split('-')[0] : null;
}

// Arrow drawing state
let drawing = false;
let fromPoint = null;
let fromFrameId = null;
let tempArrow = null;

// Start drawing arrow
canvas.addEventListener('mousedown', function(e) {
  const target = e.target;
  if (target.hasAttribute('data-connection')) {
    drawing = true;
    fromPoint = target;
    fromFrameId = getFrameIdFromConnection(target);

    // Create temporary arrow
    const {x, y} = getConnectionPointCenter(target);
    tempArrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
    tempArrow.setAttribute('stroke', '#6366f1');
    tempArrow.setAttribute('stroke-width', '3');
    tempArrow.setAttribute('fill', 'none');
    tempArrow.setAttribute('marker-end', 'url(#arrowhead)');
    tempArrow.setAttribute('d', `M${x},${y} L${x},${y}`);
    tempArrow.classList.add('animated-path');
    svg.appendChild(tempArrow);
  }
});

// Move arrow with mouse
canvas.addEventListener('mousemove', function(e) {
  if (drawing && fromPoint && tempArrow) {
    const {x: x1, y: y1} = getConnectionPointCenter(fromPoint);
    const canvasRect = canvas.getBoundingClientRect();
    const x2 = e.clientX - canvasRect.left + canvas.scrollLeft;
    const y2 = e.clientY - canvasRect.top + canvas.scrollTop;
    tempArrow.setAttribute('d', `M${x1},${y1} L${x2},${y2}`);
  }
});

// Finish drawing arrow
canvas.addEventListener('mouseup', function(e) {
  if (drawing && fromPoint && tempArrow) {
    const target = e.target;
    if (
      target.hasAttribute('data-connection') &&
      target !== fromPoint
    ) {
      const toFrameId = getFrameIdFromConnection(target);
      // Draw final arrow
      const {x: x1, y: y1} = getConnectionPointCenter(fromPoint);
      const {x: x2, y: y2} = getConnectionPointCenter(target);
      tempArrow.setAttribute('d', `M${x1},${y1} L${x2},${y2}`);

      // Save to navigation map
      navigationMap.push({
        from: fromFrameId,
        to: toFrameId
      });

      // Optionally: add a class for permanent arrows
      tempArrow.classList.remove('animated-path');
      tempArrow = null;
    } else {
      // Remove temp arrow if not connected
      tempArrow.remove();
      tempArrow = null;
    }
    drawing = false;
    fromPoint = null;
    fromFrameId = null;
  }
});

// Draw arrowheads
function ensureArrowheadMarker() {
  if (!svg.querySelector('marker#arrowhead')) {
    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '7');
    marker.setAttribute('refX', '10');
    marker.setAttribute('refY', '3.5');
    marker.setAttribute('orient', 'auto');
    marker.setAttribute('markerUnits', 'strokeWidth');
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute('d', 'M0,0 L10,3.5 L0,7 Z');
    path.setAttribute('fill', '#6366f1');
    marker.appendChild(path);
    svg.appendChild(marker);
  }
}
ensureArrowheadMarker();

// Optional: Expose navigationMap for debugging
window.navigationMap = navigationMap;
