/**
 * Fig2UI - Code Generator
 * Main JavaScript file for implementing UI functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  // Main app initialization
  const App = {
    // Store state
    state: {
      currentTool: 'connection', // Default tool
      isConnecting: false,
      connectionStart: null,
      connectionEnd: null,
      isDragging: false,
      dragTarget: null,
      dragOffset: { x: 0, y: 0 },
      connections: [
        { id: 'login-home', from: 'frame1-right', to: 'frame2-left', trigger: 'Button Click', animation: 'Slide Left' },
        { id: 'home-profile', from: 'frame2-right', to: 'frame3-left', trigger: 'Tab Selection', animation: 'Slide Left' },
        { id: 'home-settings', from: 'frame2-bottom', to: 'frame4-top', trigger: 'Menu Select', animation: 'Slide Up' }
      ],
      zoom: 1,
      canvasPan: { x: 0, y: 0 },
      selectedFrames: [],
      modalOpen: false
    },

    // DOM elements
    elements: {
      canvas: document.getElementById('canvas'),
      figmaFrames: document.querySelectorAll('.figma-frame'),
      connectionPoints: document.querySelectorAll('[data-connection]'),
      tools: {
        pan: document.getElementById('panTool'),
        connection: document.getElementById('connectionTool'),
        text: document.getElementById('textTool'),
        delete: document.getElementById('deleteButton')
      },
      zoom: {
        zoomIn: document.getElementById('zoomIn'),
        zoomOut: document.getElementById('zoomOut'),
        zoomFit: document.getElementById('zoomFit'),
        zoomLevel: document.getElementById('zoomLevel')
      },
      navigation: {
        panel: document.querySelector('.navigation-panel'),
        expandBtn: document.getElementById('expandNavPanel'),
        editBtns: document.querySelectorAll('.edit-connection'),
        addBtn: document.getElementById('addConnectionBtn')
      },
      generate: {
        button: document.getElementById('generateCodeBtn'),
        modal: document.getElementById('generateModal'),
        closeBtn: document.getElementById('closeModal'),
        cancelBtn: document.getElementById('cancelGenerate'),
        confirmBtn: document.getElementById('confirmGenerate'),
        platformOptions: document.querySelectorAll('.platform-option'),
        frameworkOptions: document.querySelectorAll('.framework-option')
      },
      svg: document.querySelector('svg')
    },

    // Initialize the application
    init() {
      this.initializeCanvas();
      this.setupTools();
      this.setupZoomControls();
      this.setupConnectionPoints();
      this.setupFrameDragging();
      this.setupNavigation();
      this.setupGenerateModal();
      this.setupArrowAnimations();

      // Set default tool active
      this.setActiveTool(this.state.currentTool);

      console.log('Fig2UI application initialized');
    },

    // Initialize canvas with pan and zoom functionality
    initializeCanvas() {
      const canvas = this.elements.canvas;

      // Setup canvas panning
      let isPanning = false;
      let startPoint = { x: 0, y: 0 };

      canvas.addEventListener('mousedown', (e) => {
        if (this.state.currentTool === 'pan' && !this.state.isDragging) {
          isPanning = true;
          startPoint = {
            x: e.clientX - this.state.canvasPan.x,
            y: e.clientY - this.state.canvasPan.y
          };
          canvas.style.cursor = 'grabbing';
        }
      });

      document.addEventListener('mousemove', (e) => {
        if (isPanning) {
          this.state.canvasPan = {
            x: e.clientX - startPoint.x,
            y: e.clientY - startPoint.y
          };
          this.updateCanvasTransform();
        }
      });

      document.addEventListener('mouseup', () => {
        if (isPanning) {
          isPanning = false;
          canvas.style.cursor = this.state.currentTool === 'pan' ? 'grab' : 'default';
        }
      });

      // Prevent context menu on right click
      canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
      });
    },

    // Apply canvas transform based on pan and zoom
    updateCanvasTransform() {
      this.elements.canvas.style.transform = `translate(${this.state.canvasPan.x}px, ${this.state.canvasPan.y}px) scale(${this.state.zoom})`;
      this.elements.zoomLevel.textContent = `${Math.round(this.state.zoom * 100)}%`;
    },

    // Setup tool selection
    setupTools() {
      // Pan tool
      this.elements.tools.pan.addEventListener('click', () => {
        this.setActiveTool('pan');
        this.elements.canvas.style.cursor = 'grab';
      });

      // Connection tool
      this.elements.tools.connection.addEventListener('click', () => {
        this.setActiveTool('connection');
        this.elements.canvas.style.cursor = 'default';
      });

      // Text tool
      this.elements.tools.text.addEventListener('click', () => {
        this.setActiveTool('text');
        this.elements.canvas.style.cursor = 'text';
      });

      // Delete tool
      this.elements.tools.delete.addEventListener('click', () => {
        this.deleteSelectedElements();
      });
    },

    // Set active tool and update UI
    setActiveTool(tool) {
      // Reset previous tool button
      const prevToolBtn = this.elements.tools[this.state.currentTool];
      if (prevToolBtn) {
        prevToolBtn.classList.remove('bg-primary', 'text-white');
        prevToolBtn.classList.add('hover:bg-slate-100', 'dark:hover:bg-slate-700');
      }

      // Set new tool
      this.state.currentTool = tool;
      const newToolBtn = this.elements.tools[tool];
      if (newToolBtn) {
        newToolBtn.classList.add('bg-primary', 'text-white');
        newToolBtn.classList.remove('hover:bg-slate-100', 'dark:hover:bg-slate-700');
      }

      // Update cursor
      switch (tool) {
        case 'pan':
          this.elements.canvas.style.cursor = 'grab';
          break;
        case 'text':
          this.elements.canvas.style.cursor = 'text';
          break;
        default:
          this.elements.canvas.style.cursor = 'default';
      }

      // Reset connection state if switching from connection tool
      if (tool !== 'connection') {
        this.state.isConnecting = false;
        this.state.connectionStart = null;
      }
    },

    // Setup zoom controls
    setupZoomControls() {
      // Zoom in
      this.elements.zoom.zoomIn.addEventListener('click', () => {
        this.state.zoom = Math.min(this.state.zoom * 1.2, 3);
        this.updateCanvasTransform();
      });

      // Zoom out
      this.elements.zoom.zoomOut.addEventListener('click', () => {
        this.state.zoom = Math.max(this.state.zoom / 1.2, 0.3);
        this.updateCanvasTransform();
      });

      // Zoom fit
      this.elements.zoom.zoomFit.addEventListener('click', () => {
        this.state.zoom = 1;
        this.state.canvasPan = { x: 0, y: 0 };
        this.updateCanvasTransform();
      });

      // Mouse wheel zoom
      this.elements.canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        
        // Get mouse position relative to canvas
        const rect = this.elements.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Calculate zoom around mouse position
        const newZoom = Math.min(Math.max(this.state.zoom * delta, 0.3), 3);
        
        // Adjust pan to keep mouse position fixed
        if (this.state.zoom !== newZoom) {
          const scaleFactor = newZoom / this.state.zoom;
          
          // Update state
          this.state.zoom = newZoom;
          this.state.canvasPan = {
            x: mouseX - (mouseX - this.state.canvasPan.x) * scaleFactor,
            y: mouseY - (mouseY - this.state.canvasPan.y) * scaleFactor
          };
          
          this.updateCanvasTransform();
        }
      }, { passive: false });
    },

    // Setup connection points for screen navigation
    setupConnectionPoints() {
      this.elements.connectionPoints.forEach(point => {
        point.addEventListener('mousedown', (e) => {
          if (this.state.currentTool === 'connection') {
            e.stopPropagation();
            
            if (!this.state.isConnecting) {
              // Start connection
              this.state.isConnecting = true;
              this.state.connectionStart = point.dataset.connection;
              this.createTemporaryConnection(e);
            } else {
              // Complete connection
              this.state.connectionEnd = point.dataset.connection;
              this.finalizeConnection();
            }
          }
        });
      });

      // Move temporary connection line
      document.addEventListener('mousemove', (e) => {
        if (this.state.isConnecting && this.state.connectionStart) {
          this.updateTemporaryConnection(e);
        }
      });

      // Cancel connection on right click
      document.addEventListener('contextmenu', (e) => {
        if (this.state.isConnecting) {
          e.preventDefault();
          this.cancelConnection();
        }
      });

      // Cancel connection if clicking on canvas
      this.elements.canvas.addEventListener('mousedown', (e) => {
        if (this.state.isConnecting && e.target === this.elements.canvas) {
          this.cancelConnection();
        }
      });
    },

    // Create temporary connection line
    createTemporaryConnection(e) {
      // Remove any existing temporary line
      const existingTemp = document.getElementById('temp-connection');
      if (existingTemp) {
        existingTemp.remove();
      }

      // Get starting point position
      const startPoint = document.querySelector(`[data-connection="${this.state.connectionStart}"]`);
      const startRect = startPoint.getBoundingClientRect();
      const startX = (startRect.left + startRect.right) / 2;
      const startY = (startRect.top + startRect.bottom) / 2;

      // Create temporary SVG path
      const tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      tempPath.setAttribute('id', 'temp-connection');
      tempPath.setAttribute('stroke', '#6366F1');
      tempPath.setAttribute('stroke-width', '2');
      tempPath.setAttribute('stroke-dasharray', '4');
      tempPath.setAttribute('fill', 'none');
      
      // Initial path from start point to cursor
      const canvasRect = this.elements.canvas.getBoundingClientRect();
      const cursorX = e.clientX - canvasRect.left;
      const cursorY = e.clientY - canvasRect.top;
      
      tempPath.setAttribute('d', `M${startX - canvasRect.left},${startY - canvasRect.top} L${cursorX},${cursorY}`);
      
      this.elements.svg.appendChild(tempPath);
    },

    // Update temporary connection line
    updateTemporaryConnection(e) {
      const tempPath = document.getElementById('temp-connection');
      if (!tempPath) return;

      // Get starting point position
      const startPoint = document.querySelector(`[data-connection="${this.state.connectionStart}"]`);
      const startRect = startPoint.getBoundingClientRect();
      const startX = (startRect.left + startRect.right) / 2;
      const startY = (startRect.top + startRect.bottom) / 2;

      // Update path to cursor position
      const canvasRect = this.elements.canvas.getBoundingClientRect();
      const cursorX = e.clientX - canvasRect.left;
      const cursorY = e.clientY - canvasRect.top;
      
      tempPath.setAttribute('d', `M${startX - canvasRect.left},${startY - canvasRect.top} L${cursorX},${cursorY}`);
    },

    // Finalize the connection between two points
    finalizeConnection() {
      // Remove temporary path
      const tempPath = document.getElementById('temp-connection');
      if (tempPath) {
        tempPath.remove();
      }

      // Check if trying to connect to self
      if (this.state.connectionStart === this.state.connectionEnd) {
        this.cancelConnection();
        return;
      }

      // Get source and target frame IDs
      const startFrame = this.state.connectionStart.split('-')[0];
      const endFrame = this.state.connectionEnd.split('-')[0];

      // Create connection ID
      const connectionId = `${startFrame}-${endFrame}`;

      // Check if connection already exists
      const existingConnection = this.state.connections.find(c => c.id === connectionId);
      if (existingConnection) {
        console.log('Connection already exists');
      } else {
        // Add new connection
        const newConnection = {
          id: connectionId,
          from: this.state.connectionStart,
          to: this.state.connectionEnd,
          trigger: 'Button Click', // Default
          animation: 'Slide Left' // Default
        };
        
        this.state.connections.push(newConnection);
        this.drawConnection(newConnection);
        this.updateNavigationPanel();
      }

      // Reset connection state
      this.state.isConnecting = false;
      this.state.connectionStart = null;
      this.state.connectionEnd = null;
    },

    // Cancel current connection attempt
    cancelConnection() {
      const tempPath = document.getElementById('temp-connection');
      if (tempPath) {
        tempPath.remove();
      }
      
      this.state.isConnecting = false;
      this.state.connectionStart = null;
      this.state.connectionEnd = null;
    },

    // Draw a connection between two points
    drawConnection(connection) {
      // Get start and end point positions
      const startPoint = document.querySelector(`[data-connection="${connection.from}"]`);
      const endPoint = document.querySelector(`[data-connection="${connection.to}"]`);
      
      if (!startPoint || !endPoint) return;
      
      const startRect = startPoint.getBoundingClientRect();
      const endRect = endPoint.getBoundingClientRect();
      const canvasRect = this.elements.canvas.getBoundingClientRect();
      
      const startX = (startRect.left + startRect.right) / 2 - canvasRect.left;
      const startY = (startRect.top + startRect.bottom) / 2 - canvasRect.top;
      const endX = (endRect.left + endRect.right) / 2 - canvasRect.left;
      const endY = (endRect.top + endRect.bottom) / 2 - canvasRect.top;

      // Create path
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('id', `connection-${connection.id}`);
      path.setAttribute('stroke', '#6366F1');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('fill', 'none');
      path.setAttribute('marker-end', 'url(#arrowhead)');
      path.classList.add('animated-path');
      
      // Create a bezier curve
      const dx = endX - startX;
      const dy = endY - startY;
      const controlX1 = startX + dx / 3;
      const controlY1 = startY;
      const controlX2 = endX - dx / 3;
      const controlY2 = endY;
      
      path.setAttribute('d', `M${startX},${startY} C${controlX1},${controlY1} ${controlX2},${controlY2} ${endX},${endY}`);
      
      this.elements.svg.appendChild(path);
    },

    // Setup frame dragging
    setupFrameDragging() {
      this.elements.figmaFrames.forEach(frame => {
        frame.addEventListener('mousedown', (e) => {
          // Ignore if clicking on connection point
          if (e.target.hasAttribute('data-connection')) return;
          
          // Only allow dragging with pan tool
          if (this.state.currentTool === 'pan') {
            e.stopPropagation();
            this.state.isDragging = true;
            this.state.dragTarget = frame;
            
            const rect = frame.getBoundingClientRect();
            this.state.dragOffset = {
              x: e.clientX - rect.left,
              y: e.clientY - rect.top
            };
            
            frame.style.zIndex = 10;
          }
        });
      });

      document.addEventListener('mousemove', (e) => {
        if (this.state.isDragging && this.state.dragTarget) {
          const x = e.clientX - this.state.dragOffset.x;
          const y = e.clientY - this.state.dragOffset.y;
          
          // Apply the transformation
          this.state.dragTarget.style.left = `${x}px`;
          this.state.dragTarget.style.top = `${y}px`;
          
          // Update all connections
          this.updateAllConnections();
        }
      });

      document.addEventListener('mouseup', () => {
        if (this.state.isDragging && this.state.dragTarget) {
          this.state.dragTarget.style.zIndex = '';
          this.state.isDragging = false;
          this.state.dragTarget = null;
        }
      });
    },

    // Update all connection paths when frames are moved
    updateAllConnections() {
      this.state.connections.forEach(connection => {
        const pathElement = document.getElementById(`connection-${connection.id}`);
        if (pathElement) {
          // Get start and end point positions
          const startPoint = document.querySelector(`[data-connection="${connection.from}"]`);
          const endPoint = document.querySelector(`[data-connection="${connection.to}"]`);
          
          if (!startPoint || !endPoint) return;
          
          const startRect = startPoint.getBoundingClientRect();
          const endRect = endPoint.getBoundingClientRect();
          const canvasRect = this.elements.canvas.getBoundingClientRect();
          
          const startX = (startRect.left + startRect.right) / 2 - canvasRect.left;
          const startY = (startRect.top + startRect.bottom) / 2 - canvasRect.top;
          const endX = (endRect.left + endRect.right) / 2 - canvasRect.left;
          const endY = (endRect.top + endRect.bottom) / 2 - canvasRect.top;

          // Update path with new bezier curve
          const dx = endX - startX;
          const dy = endY - startY;
          const controlX1 = startX + dx / 3;
          const controlY1 = startY;
          const controlX2 = endX - dx / 3;
          const controlY2 = endY;
          
          pathElement.setAttribute('d', `M${startX},${startY} C${controlX1},${controlY1} ${controlX2},${controlY2} ${endX},${endY}`);
        }
      });
    },

    // Setup navigation panel
    setupNavigation() {
      // Toggle navigation panel expansion
      if (this.elements.navigation.expandBtn) {
        this.elements.navigation.expandBtn.addEventListener('click', () => {
          const navPanel = this.elements.navigation.expandBtn.closest('.bg-white');
          if (navPanel) {
            if (navPanel.classList.contains('w-64')) {
              // Expand
              navPanel.classList.remove('w-64');
              navPanel.classList.add('w-96');
              this.elements.navigation.expandBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
            } else {
              // Collapse
              navPanel.classList.remove('w-96');
              navPanel.classList.add('w-64');
              this.elements.navigation.expandBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
            }
          }
        });
      }

      // Setup edit connection buttons
      this.elements.navigation.editBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const connectionId = btn.dataset.connection;
          this.editConnection(connectionId);
        });
      });

      // Add new connection button
      if (this.elements.navigation.addBtn) {
        this.elements.navigation.addBtn.addEventListener('click', () => {
          this.addNewConnection();
        });
      }
    },

    // Edit connection settings
    editConnection(connectionId) {
      // Find connection in state
      const connection = this.state.connections.find(c => c.id === connectionId);
      if (!connection) return;

      // Get connection element in the navigation panel
      const connectionElement = document.querySelector(`[data-connection="${connectionId}"]`).closest('.mb-3');
      if (!connectionElement) return;

      // Create a form to edit connection properties
      const oldContent = connectionElement.innerHTML;
      
      connectionElement.innerHTML = `
        <div class="bg-slate-50 dark:bg-slate-700/50 rounded p-3 text-xs">
          <div class="mb-2">
            <label class="block mb-1 font-medium">Trigger:</label>
            <select class="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" id="edit-trigger">
              <option ${connection.trigger === 'Button Click' ? 'selected' : ''}>Button Click</option>
              <option ${connection.trigger === 'Tab Selection' ? 'selected' : ''}>Tab Selection</option>
              <option ${connection.trigger === 'Menu Select' ? 'selected' : ''}>Menu Select</option>
              <option ${connection.trigger === 'Swipe' ? 'selected' : ''}>Swipe</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="block mb-1 font-medium">Animation:</label>
            <select class="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" id="edit-animation">
              <option ${connection.animation === 'Slide Left' ? 'selected' : ''}>Slide Left</option>
              <option ${connection.animation === 'Slide Right' ? 'selected' : ''}>Slide Right</option>
              <option ${connection.animation === 'Slide Up' ? 'selected' : ''}>Slide Up</option>
              <option ${connection.animation === 'Slide Down' ? 'selected' : ''}>Slide Down</option>
              <option ${connection.animation === 'Fade' ? 'selected' : ''}>Fade</option>
            </select>
          </div>
          <div class="flex justify-end gap-2">
            <button class="px-2 py-1 text-xs bg-slate-200 dark:bg-slate-600 rounded hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors" id="cancel-edit">Cancel</button>
            <button class="px-2 py-1 text-xs bg-primary text-white rounded hover:bg-primary/90 transition-colors" id="save-edit">Save</button>
          </div>
        </div>
      `;

      // Setup event listeners for form buttons
      const cancelBtn = connectionElement.querySelector('#cancel-edit');
      const saveBtn = connectionElement.querySelector('#save-edit');
      
      cancelBtn.addEventListener('click', () => {
        connectionElement.innerHTML = oldContent;
      });
      
      saveBtn.addEventListener('click', () => {
        const newTrigger = connectionElement.querySelector('#edit-trigger').value;
        const newAnimation = connectionElement.querySelector('#edit-animation').value;
        
        // Update connection in state
        connection.trigger = newTrigger;
        connection.animation = newAnimation;
        
        // Update UI
        this.updateNavigationPanel();
      });
    },

    // Add new connection UI
    addNewConnection() {
      // Create modal or dialog for new connection
      const container = document.createElement('div');
      container.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
      container.id = 'connection-dialog';
      
      container.innerHTML = `
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md p-5">
          <h3 class="text-lg font-bold mb-4">Add New Connection</h3>
          
          <div class="mb-3">
            <label class="block mb-1 text-sm font-medium">From Screen:</label>
            <select class="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" id="from-screen">
              <option value="frame1">Login Screen</option>
              <option value="frame2">Home Screen</option>
              <option value="frame3">Profile Screen</option>
              <option value="frame4">Settings Screen</option>
            </select>
          </div>
          
          <div class="mb-3">
            <label class="block mb-1 text-sm font-medium">To Screen:</label>
            <select class="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" id="to-screen">
              <option value="frame1">Login Screen</option>
              <option value="frame2" selected>Home Screen</option>
              <option value="frame3">Profile Screen</option>
              <option value="frame4">Settings Screen</option>
            </select>
          </div>
          
          <div class="mb-3">
            <label class="block mb-1 text-sm font-medium">Trigger:</label>
            <select class="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" id="new-trigger">
              <option>Button Click</option>
              <option>Tab Selection</option>
              <option>Menu Select</option>
              <option>Swipe</option>
            </select>
          </div>
          
          <div class="mb-5">
            <label class="block mb-1 text-sm font-medium">Animation:</label>
            <select class="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" id="new-animation">
              <option>Slide Left</option>
              <option>Slide Right</option>
              <option>Slide Up</option>
              <option>Slide Down</option>
              <option>Fade</option>
            </select>
          </div>
          
          <div class="flex justify-end gap-3">
            <button class="px-4 py-2 text-sm bg-slate-200 dark:bg-slate-600 rounded hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors" id="cancel-new">Cancel</button>
            <button class="px-4 py-2 text-sm bg-primary text-white rounded hover:bg-primary/90 transition-colors" id="add-new">Add Connection</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(container);
      
      // Setup event listeners
      document.getElementById('cancel-new').addEventListener('click', () => {
        container.remove();
      });
      
      document.getElementById('add-new').addEventListener('click', () => {
        const fromScreen = document.getElementById('from-screen').value;
        const toScreen = document.getElementById('to-screen').value;
        const trigger = document.getElementById('new-trigger').value;
        const animation = document.getElementById('new-animation').value;
        
        // Validate - can't connect to self
        if (fromScreen === toScreen) {
          alert('Cannot connect a screen to itself');
          return;
        }
        
        // Create connection ID
        const connectionId = `${fromScreen}-${toScreen}`;
        
        // Check if connection already exists
        const existingConnection = this.state.connections.find(c => c.id === connectionId);
        if (existingConnection) {
          alert('This connection already exists');
          return;
        }
        
        // Choose connection points based on screens
        let fromPoint, toPoint;
        
        // Determine connection points based on relative positions
        // This is a simplified logic - in a real app you'd calculate optimal points
        if (fromScreen === 'frame1' && toScreen === 'frame2') {
          fromPoint = 'frame1-right';
          toPoint = 'frame2-left';
        } else if (fromScreen === 'frame2' && toScreen === 'frame3') {
          fromPoint = 'frame2-right';
          toPoint = 'frame3-left';
        } else if (fromScreen === 'frame2' && toScreen === 'frame4') {
          fromPoint = 'frame2-bottom';
          toPoint = 'frame4-top';
        } else if (fromScreen === 'frame3' && toScreen === 'frame2') {
          fromPoint = 'frame3-left';
          toPoint = 'frame2-right';
        } else if (fromScreen === 'frame4' && toScreen === 'frame2') {
          fromPoint = 'frame4-top';
          toPoint = 'frame2-bottom';
        } else {
          // Default fallback
          fromPoint = `${fromScreen}-right`;
          toPoint = `${toScreen}-left`;
        }
        
        // Add new connection
        const newConnection = {
          id: connectionId,
          from: fromPoint,
          to: toPoint,
          trigger,
          animation
        };
        
        this.state.connections.push(newConnection);
        this.drawConnection(newConnection);
        this.updateNavigationPanel();
        
        // Close dialog
        container.remove();
      });
    }
}
})