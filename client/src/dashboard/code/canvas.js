// canvas.js

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  let selected = null;
  let dragOffset = { x: 0, y: 0 };
  let isDragging = false;
  let isCanvasPanning = false;
  let panStart = { x: 0, y: 0 };
  let canvasOffset = { x: 0, y: 0 };
  let resizeDir = null;

  // Add handles to each frame
  function addHandles(frame) {
    // Remove old handles
    frame.querySelectorAll('.canvas-handle').forEach(h => h.remove());

    // Move handle (top-left)
    const moveHandle = document.createElement('div');
    moveHandle.className = 'canvas-handle absolute top-1 left-1 w-4 h-4 bg-blue-400 rounded cursor-move z-20';
    moveHandle.title = "Move";
    moveHandle.style.border = "2px solid #fff";
    moveHandle.addEventListener('mousedown', e => {
      e.stopPropagation();
      selectFrame(frame);
      isDragging = true;
      resizeDir = null;
      const rect = frame.getBoundingClientRect();
      dragOffset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    });
    frame.appendChild(moveHandle);

    // Delete handle (top-right)
    const deleteHandle = document.createElement('div');
    deleteHandle.className = 'canvas-handle absolute top-1 right-1 w-4 h-4 bg-red-500 rounded cursor-pointer z-20 flex items-center justify-center';
    deleteHandle.title = "Delete";
    deleteHandle.innerHTML = '<i class="fa fa-times text-xs text-white"></i>';
    deleteHandle.style.border = "2px solid #fff";
    deleteHandle.addEventListener('mousedown', e => {
      e.stopPropagation();
      frame.remove();
      if (selected === frame) selected = null;
    });
    frame.appendChild(deleteHandle);

    // Resize handle (bottom-right)
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'canvas-handle absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded cursor-se-resize z-20';
    resizeHandle.title = "Resize";
    resizeHandle.style.border = "2px solid #fff";
    resizeHandle.addEventListener('mousedown', e => {
      e.stopPropagation();
      selectFrame(frame);
      isDragging = false;
      resizeDir = "se";
      dragOffset = {
        x: e.clientX,
        y: e.clientY,
        w: frame.offsetWidth,
        h: frame.offsetHeight
      };
    });
    frame.appendChild(resizeHandle);
  }

  // Selection logic
  function selectFrame(frame) {
    if (selected && selected !== frame) {
      selected.classList.remove("ring-4", "ring-primary");
      selected.querySelectorAll('.canvas-handle').forEach(h => h.remove());
    }
    selected = frame;
    selected.classList.add("ring-4", "ring-primary");
    addHandles(selected);
  }

  // Deselect on canvas click
  canvas.addEventListener("mousedown", e => {
    if (e.target === canvas) {
      if (selected) {
        selected.classList.remove("ring-4", "ring-primary");
        selected.querySelectorAll('.canvas-handle').forEach(h => h.remove());
        selected = null;
      }
      // Start panning
      isCanvasPanning = true;
      panStart = { x: e.clientX, y: e.clientY };
      canvasOffset.x = canvas.scrollLeft || 0;
      canvasOffset.y = canvas.scrollTop || 0;
    }
  });

  // Select on frame click
  canvas.querySelectorAll(".figma-frame").forEach(frame => {
    frame.addEventListener("mousedown", e => {
      if (e.target.classList.contains('canvas-handle')) return;
      selectFrame(frame);
      isDragging = true;
      resizeDir = null;
      const rect = frame.getBoundingClientRect();
      dragOffset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    });
  });

  // Drag or resize logic
  document.addEventListener("mousemove", e => {
    if (isDragging && selected) {
      // Move frame
      const canvasRect = canvas.getBoundingClientRect();
      let x = e.clientX - canvasRect.left - dragOffset.x;
      let y = e.clientY - canvasRect.top - dragOffset.y;
      // Snap to grid (optional)
      x = Math.round(x / 10) * 10;
      y = Math.round(y / 10) * 10;
      selected.style.left = x + "px";
      selected.style.top = y + "px";
    } else if (resizeDir && selected) {
      // Resize frame
      let w = dragOffset.w + (e.clientX - dragOffset.x);
      let h = dragOffset.h + (e.clientY - dragOffset.y);
      w = Math.max(80, w);
      h = Math.max(80, h);
      selected.style.width = w + "px";
      selected.style.height = h + "px";
    } else if (isCanvasPanning) {
      // Pan canvas
      canvas.parentElement.scrollLeft = canvasOffset.x - (e.clientX - panStart.x);
      canvas.parentElement.scrollTop = canvasOffset.y - (e.clientY - panStart.y);
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    resizeDir = null;
    isCanvasPanning = false;
  });

  // Keyboard delete
  document.addEventListener("keydown", e => {
    if (selected && (e.key === "Delete" || e.key === "Backspace")) {
      selected.remove();
      selected = null;
    }
  });

  // On load, add handles to selected (if any)
  if (canvas.querySelector(".figma-frame")) {
    selectFrame(canvas.querySelector(".figma-frame"));
  }
});
