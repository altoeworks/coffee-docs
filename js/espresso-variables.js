// ============================================================================
// ESPRESSO VARIABLES MINDMAP
// 
// Handles the interactive mindmap functionality:
// - Node creation and positioning
// - Click interactions and highlighting
// - Tooltip display
// - Layout switching (mobile/desktop)
// - Connection visualization
// ============================================================================

// ============================================================================
// GLOBAL STATE
// ============================================================================

let currentLayout = 'desktop';
let originalLayout = 'desktop';
let selectedNode = null;
let highlightedConnections = [];
let mindmapInitialized = false;
let currentView = 'default'; // 'default' | 'radial' | 'flow' | 'grid'

// ============================================================================
// DOM ELEMENTS
// ============================================================================

const DOM_ELEMENTS = {
    mindmapCanvas: null,
    tooltipContent: null,
    tooltipPanel: null,
    closeTooltipBtn: null,
    resetViewBtn: null,
    toggleLayoutBtn: null,
    backBtn: null,
    hamburgerMenuBtn: null,
    hamburgerMenu: null,
    closeMenuBtn: null,
    menuDarkModeToggle: null,
    backToTopBtn: null,
    progressBar: null
};

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener("DOMContentLoaded", function () {
    initializeElements();

    // Skip mindmap initialization on small screens (mobile)
    const isMobile = window.matchMedia && window.matchMedia('(max-width: 639px)').matches;
    if (!isMobile) {
    initializeMindmap();
    }
    // Initialize layout button label
    if (DOM_ELEMENTS.canvasLayoutToggleBtn) {
        DOM_ELEMENTS.canvasLayoutToggleBtn.innerHTML = `<i class="fa-solid fa-layer-group text-sm" aria-hidden="true"></i> Default`;
    }
    initializeEventListeners();
    initializeHamburgerMenu();
    initializeProgressBar();
    initializeBackToTop();
    loadDarkModePreference();
    updateLegendColors();
});

/**
 * Initialize all DOM element references
 */
function initializeElements() {
    DOM_ELEMENTS.mindmapCanvas = document.getElementById('mindmap-canvas');
    DOM_ELEMENTS.tooltipContent = document.getElementById('tooltip-content');
    DOM_ELEMENTS.tooltipPanel = document.getElementById('tooltip-panel');
    DOM_ELEMENTS.closeTooltipBtn = document.getElementById('close-tooltip-btn');
    DOM_ELEMENTS.resetViewBtn = document.getElementById('reset-view-btn');
    DOM_ELEMENTS.toggleLayoutBtn = document.getElementById('toggle-layout-btn');
    DOM_ELEMENTS.canvasLayoutToggleBtn = document.getElementById('layout-toggle-btn');
    DOM_ELEMENTS.backBtn = document.getElementById('back-btn');
    DOM_ELEMENTS.hamburgerMenuBtn = document.getElementById('hamburger-menu-btn');
    DOM_ELEMENTS.hamburgerMenu = document.getElementById('hamburger-menu');
    DOM_ELEMENTS.closeMenuBtn = document.getElementById('close-menu-btn');
    DOM_ELEMENTS.menuDarkModeToggle = document.getElementById('menu-dark-mode-toggle');
    DOM_ELEMENTS.backToTopBtn = document.getElementById('back-to-top-btn');
    DOM_ELEMENTS.progressBar = document.getElementById('progress-bar');
}

/**
 * Initialize the mindmap with nodes and connections
 */
function initializeMindmap() {
    // Prevent double initialization
    if (mindmapInitialized) return;
    mindmapInitialized = true;
    if (typeof espressoVariablesData === 'undefined' || 
        typeof desktopPositions === 'undefined' || 
        typeof mobilePositions === 'undefined' || 
        typeof connections === 'undefined') {
        console.error('Required data not loaded');
        return;
    }

    const container = DOM_ELEMENTS.mindmapCanvas;
    if (!container) {
        console.error('Mindmap canvas not found');
        return;
    }

    createNodes();

    setTimeout(() => {
        createConnections();
        setTimeout(() => {
            updateLayout();
            setTimeout(() => {
                updateConnectionPositions();
            }, 100);
        }, 100);
    }, 100);
}

/**
 * Set up all event listeners
 */
function initializeEventListeners() {
    DOM_ELEMENTS.resetViewBtn.addEventListener('click', resetView);
    if (DOM_ELEMENTS.toggleLayoutBtn) {
    DOM_ELEMENTS.toggleLayoutBtn.addEventListener('click', toggleLayout);
    }

    if (DOM_ELEMENTS.closeTooltipBtn) {
        DOM_ELEMENTS.closeTooltipBtn.addEventListener('click', () => {
            hideDetailedTooltip();
            clearSelection();
            clearConnectionHighlights();
        });
    }

    // Canvas layout toggle button
    if (DOM_ELEMENTS.canvasLayoutToggleBtn) {
        DOM_ELEMENTS.canvasLayoutToggleBtn.addEventListener('click', cycleCanvasLayout);
    }

    window.addEventListener('resize', debounce(() => {
        const isMobile = window.matchMedia && window.matchMedia('(max-width: 639px)').matches;
        if (isMobile) return;

        // If we were on mobile and switch to desktop, initialize mindmap once
        if (!mindmapInitialized) {
            initializeMindmap();
            return;
        }

        updateLayout();
    }, 250));

    if (DOM_ELEMENTS.mindmapCanvas) {
        DOM_ELEMENTS.mindmapCanvas.addEventListener('click', (e) => {
            if (e.target.closest('#reset-view-btn')) {
                return;
            }

            if (e.target === DOM_ELEMENTS.mindmapCanvas || e.target.classList.contains('connection-line')) {
                clearSelection();
                clearConnectionHighlights();
                hideDetailedTooltip();
            }
        });
    }
}

// ============================================================================
// NODE CREATION AND MANAGEMENT
// ============================================================================

/**
 * Create all nodes in the mindmap
 */
function createNodes() {
    const container = DOM_ELEMENTS.mindmapCanvas;
    if (!container) return;

    Object.keys(espressoVariablesData).forEach(nodeName => {
        const nodeData = espressoVariablesData[nodeName];
        const node = createNode(nodeName, nodeData);
        container.appendChild(node);
    });
}

/**
 * Create a single node element
 */
function createNode(name, data) {
    const node = document.createElement('div');
    const nodeClass = nodeTypes[data.type];
    node.className = `absolute cursor-pointer rounded-xl px-6 py-3 text-sm font-medium shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl z-10 ${nodeClass} backdrop-blur-sm border border-white/20 dark:border-darkborder/20`;
    node.dataset.nodeName = name;
    node.dataset.nodeType = data.type;

    node.innerHTML = `
        <div class="text-center">
            <div class="font-semibold tracking-wide">${name}</div>
        </div>
    `;

    // Apply inline styles to ensure colors are applied
    if (data.type === 'input') {
        node.style.backgroundColor = '#ff6b35';
        node.style.color = 'white';
    } else if (data.type === 'output') {
        const isDarkMode = document.documentElement.classList.contains('dark');
        const tertiaryColor = isDarkMode ? '#66BBD2' : '#005271';
        node.style.backgroundColor = tertiaryColor;
        node.style.color = 'white';
    }

    const positions = currentLayout === 'mobile' ? mobilePositions : desktopPositions;
    const pos = positions[name];
    if (pos) {
        node.style.left = `${pos.x}%`;
        node.style.top = `${pos.y}%`;
        node.style.transform = 'translate(-50%, -50%)';
    }

    node.addEventListener('click', (e) => {
        if (node.dataset.wasDragging === 'true') {
            return;
        }
        handleNodeClick(name, data);
    });

    makeNodeDraggable(node);

    node.addEventListener('mouseenter', () => {
        if (!selectedNode || selectedNode !== name) {
            node.style.transform = 'translate(-50%, -50%) scale(1.02)';
            node.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
        }
    });
    node.addEventListener('mouseleave', () => {
        if (!selectedNode || selectedNode !== name) {
            node.style.transform = 'translate(-50%, -50%) scale(1)';
            node.style.boxShadow = '';
        }
    });

    return node;
}

/**
 * Handle node click events
 */
function handleNodeClick(name, data) {
    clearSelection();
    selectNode(name);
    highlightConnections(name);
    showDetailedTooltip(name, data);

    setTimeout(() => {
        if (!window.isDragging) {
            updateConnectionPositions();
        }
    }, 50);
}

/**
 * Select a node and update its styling
 */
function selectNode(nodeName) {
    selectedNode = nodeName;
    const node = document.querySelector(`[data-node-name="${nodeName}"]`);
    if (node) {
        // Highlight the selected node with accent color
        node.style.backgroundColor = '#ff6b35';
        node.style.color = 'white';
        node.style.transform = 'translate(-50%, -50%) scale(1.05)';

        const outgoingConnections = connections.filter(conn => conn.from === nodeName);
        const affectedNodes = outgoingConnections.map(conn => conn.to);
        const incomingConnections = connections.filter(conn => conn.to === nodeName);
        const affectingNodes = incomingConnections.map(conn => conn.from);

        const allNodes = document.querySelectorAll('[data-node-name]');
        allNodes.forEach(otherNode => {
            const otherNodeName = otherNode.dataset.nodeName;

            if (otherNodeName === nodeName) {
                return;
            } else if (affectedNodes.includes(otherNodeName)) {
                otherNode.style.opacity = '1';
                otherNode.style.border = '2px solid #ff6b35';
            } else if (affectingNodes.includes(otherNodeName)) {
                otherNode.style.opacity = '1';
                otherNode.style.border = '';
            } else {
                otherNode.style.opacity = '0.3';
                otherNode.style.border = '';
            }
        });
    }
}

/**
 * Clear all node selections
 */
function clearSelection() {
    if (selectedNode) {
        const node = document.querySelector(`[data-node-name="${selectedNode}"]`);
        if (node) {
            const nodeData = espressoVariablesData[selectedNode];
            // Restore proper colors based on node type
            if (nodeData.type === 'input') {
                node.style.backgroundColor = '#ff6b35';
                node.style.color = 'white';
            } else if (nodeData.type === 'output') {
                const isDarkMode = document.documentElement.classList.contains('dark');
                const tertiaryColor = isDarkMode ? '#66BBD2' : '#005271';
                node.style.backgroundColor = tertiaryColor;
                node.style.color = 'white';
            }
            node.style.opacity = '1';
            node.style.border = '';
            node.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    }

    const allNodes = document.querySelectorAll('[data-node-name]');
    allNodes.forEach(node => {
        const nodeData = espressoVariablesData[node.dataset.nodeName];
        if (nodeData) {
            if (nodeData.type === 'input') {
                node.style.backgroundColor = '#ff6b35';
                node.style.color = 'white';
            } else if (nodeData.type === 'output') {
                const isDarkMode = document.documentElement.classList.contains('dark');
                const tertiaryColor = isDarkMode ? '#66BBD2' : '#005271';
                node.style.backgroundColor = tertiaryColor;
                node.style.color = 'white';
            }
        }
        node.style.opacity = '1';
        node.style.border = '';
    });

    selectedNode = null;
}

// ============================================================================
// CONNECTION MANAGEMENT
// ============================================================================

/**
 * Create connection lines between nodes
 */
function createConnections() {
    const container = DOM_ELEMENTS.mindmapCanvas;
    if (!container) return;

    connections.forEach(connection => {
        const line = createConnectionLine(connection);
        container.appendChild(line);
    });
}

/**
 * Create a single connection line
 */
function createConnectionLine(connection) {
    const line = document.createElement('div');
    line.className = 'absolute pointer-events-none transition-all duration-300';
    line.dataset.connection = `${connection.from}-${connection.to}`;
    line.dataset.from = connection.from;
    line.dataset.to = connection.to;
    line.dataset.type = connection.type;
    line.style.zIndex = '1';
    line.style.pointerEvents = 'none';
    // Make the overlay span the entire canvas
    line.style.top = '0';
    line.style.left = '0';
    line.style.width = '100%';
    line.style.height = '100%';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.zIndex = '1';
    svg.style.pointerEvents = 'none';

    const lineElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    lineElement.setAttribute('stroke', '#ff6b35');
    lineElement.setAttribute('stroke-width', '2.5');
    lineElement.setAttribute('stroke-dasharray', connection.type === 'reverse' ? '5,5' : 'none');
    lineElement.setAttribute('opacity', '0.4');
    lineElement.setAttribute('stroke-linecap', 'round');
    lineElement.classList.add('connection-line');

    svg.appendChild(lineElement);
    line.appendChild(svg);

    return line;
}

/**
 * Highlight connections for a selected node
 */
function highlightConnections(nodeName) {
    clearConnectionHighlights();

    const outgoingConnections = connections.filter(conn => conn.from === nodeName);
    const incomingConnections = connections.filter(conn => conn.to === nodeName);

    const allConnections = document.querySelectorAll('[data-connection]');
    allConnections.forEach(line => {
        const svg = line.querySelector('svg');
        const lineElement = svg.querySelector('line');
        if (lineElement) {
            lineElement.setAttribute('opacity', '0.1');
        }
    });

    outgoingConnections.forEach(connection => {
        const line = document.querySelector(`[data-connection="${connection.from}-${connection.to}"]`);
        if (line) {
            const svg = line.querySelector('svg');
            const lineElement = svg.querySelector('line');
            if (lineElement) {
                lineElement.setAttribute('stroke', '#ff6b35');
                lineElement.setAttribute('stroke-width', '4');
                lineElement.setAttribute('opacity', '0.8');
                lineElement.setAttribute('stroke-dasharray', 'none');
            }
            highlightedConnections.push(line);
        }
    });

    incomingConnections.forEach(connection => {
        const line = document.querySelector(`[data-connection="${connection.from}-${connection.to}"]`);
        if (line) {
            const svg = line.querySelector('svg');
            const lineElement = svg.querySelector('line');
            if (lineElement) {
                lineElement.setAttribute('stroke', '#ff6b35');
                lineElement.setAttribute('stroke-width', '3');
                lineElement.setAttribute('opacity', '0.6');
                lineElement.setAttribute('stroke-dasharray', '5,4');
            }
            highlightedConnections.push(line);
        }
    });
}

/**
 * Clear all connection highlights
 */
function clearConnectionHighlights() {
    highlightedConnections.forEach(line => {
        const svg = line.querySelector('svg');
        const lineElement = svg.querySelector('line');
        if (lineElement) {
            lineElement.setAttribute('stroke', '#ff6b35');
            lineElement.setAttribute('stroke-width', '2.5');
            lineElement.setAttribute('opacity', '0.4');
            lineElement.setAttribute('stroke-dasharray', 'none');
        }
    });

    const allConnections = document.querySelectorAll('[data-connection]');
    allConnections.forEach(line => {
        const svg = line.querySelector('svg');
        const lineElement = svg.querySelector('line');
        if (lineElement) {
            lineElement.setAttribute('opacity', '0.4');
            lineElement.setAttribute('stroke-dasharray', 'none');
        }
    });

    highlightedConnections = [];
}

// ============================================================================
// LAYOUT MANAGEMENT
// ============================================================================

/**
 * Update node positions based on current layout
 */
function updateLayout() {
    const positions = selectPositionsByView();
    const container = DOM_ELEMENTS.mindmapCanvas;

    Object.keys(positions).forEach(nodeName => {
        const node = document.querySelector(`[data-node-name="${nodeName}"]`);
        if (node) {
            const pos = positions[nodeName];
            node.style.left = `${pos.x}%`;
            node.style.top = `${pos.y}%`;
            node.style.transform = 'translate(-50%, -50%)';
        }
    });

    if (!window.isDragging) {
        updateConnectionPositions();
    }
}

function selectPositionsByView() {
    if (currentLayout === 'mobile') return mobilePositions;
    switch (currentView) {
        case 'radial':
            return typeof radialPositions !== 'undefined' ? radialPositions : desktopPositions;
        case 'flow':
            return typeof flowPositions !== 'undefined' ? flowPositions : desktopPositions;
        case 'grid':
            return typeof gridPositions !== 'undefined' ? gridPositions : desktopPositions;
        default:
            return desktopPositions;
    }
}

function cycleCanvasLayout() {
    const order = ['default', 'radial', 'flow', 'grid'];
    const idx = order.indexOf(currentView);
    currentView = order[(idx + 1) % order.length];
    // Update button label to reflect current view
    if (DOM_ELEMENTS.canvasLayoutToggleBtn) {
        const labels = {
            'default': 'Default',
            'radial': 'Radial',
            'flow': 'Flow',
            'grid': 'Grid',
            
        };
        DOM_ELEMENTS.canvasLayoutToggleBtn.innerHTML = `<i class="fa-solid fa-layer-group text-sm" aria-hidden="true"></i> ${labels[currentView]}`;
    }
    showLayoutHint(currentView);
    updateLayout();
    setTimeout(() => {
        if (!window.isDragging) updateConnectionPositions();
    }, 150);
}

function showLayoutHint(view) {
    const content = DOM_ELEMENTS.tooltipContent;
    if (!content) return;
    const messages = {
        'default': 'Default view: hierarchical layout showing inputs at top and results below.',
        'radial': 'Radial view: "Flavor Balance" in the center, all other variables around it.',
        'flow': 'Flow view: staged from controls ➜ diagnostics ➜ results ➜ sensory/outcome.',
        'grid': 'Grid view: compact 3-row grid to compare variables cleanly.',
    };
    content.innerHTML = `
        <div class="font-semibold text-lg text-main dark:text-background mb-2">Layout switched</div>
        <div class="text-sm text-main/80 dark:text-background/80">${messages[view] || ''}</div>
    `;
}

/**
 * Update connection line positions
 */
function updateConnectionPositions() {
    if (window.isDragging) return;

    const container = DOM_ELEMENTS.mindmapCanvas;

    if (window.connectionUpdateTimeout) {
        clearTimeout(window.connectionUpdateTimeout);
    }

    window.connectionUpdateTimeout = setTimeout(() => {
        if (window.isDragging) return;

        connections.forEach(connection => {
            const line = document.querySelector(`[data-connection="${connection.from}-${connection.to}"]`);
            if (!line) return;
                const fromNode = document.querySelector(`[data-node-name="${connection.from}"]`);
                const toNode = document.querySelector(`[data-node-name="${connection.to}"]`);
            if (!fromNode || !toNode) return;

            const containerRect = container.getBoundingClientRect();
                    const fromRect = fromNode.getBoundingClientRect();
                    const toRect = toNode.getBoundingClientRect();

                    const fromX = fromRect.left + fromRect.width / 2 - containerRect.left;
                    const fromY = fromRect.top + fromRect.height / 2 - containerRect.top;
                    const toX = toRect.left + toRect.width / 2 - containerRect.left;
                    const toY = toRect.top + toRect.height / 2 - containerRect.top;

            // Ensure overlay dimensions match the canvas
            line.style.width = `${containerRect.width}px`;
            line.style.height = `${containerRect.height}px`;

                    const svg = line.querySelector('svg');
                    const lineElement = svg.querySelector('line');
                    if (svg && lineElement) {
                        svg.setAttribute('width', containerRect.width);
                        svg.setAttribute('height', containerRect.height);
                        lineElement.setAttribute('x1', fromX);
                        lineElement.setAttribute('y1', fromY);
                        lineElement.setAttribute('x2', toX);
                        lineElement.setAttribute('y2', toY);
            }
        });

        window.connectionUpdateTimeout = null;
    }, 200);
}

/**
 * Toggle between mobile and desktop layouts
 */
function toggleLayout() {
    currentLayout = currentLayout === 'desktop' ? 'mobile' : 'desktop';

    const btn = DOM_ELEMENTS.toggleLayoutBtn;
    if (currentLayout === 'mobile') {
        btn.innerHTML = `<i class="fa-solid fa-desktop text-lg" aria-hidden="true"></i>Desktop Layout`;
    } else {
        btn.innerHTML = `<i class="fa-solid fa-mobile-alt text-lg" aria-hidden="true"></i>Mobile Layout`;
    }

    updateLayout();

    setTimeout(() => {
        if (!window.isDragging) {
            updateConnectionPositions();
        }
    }, 300);
}

// ============================================================================
// TOOLTIP MANAGEMENT
// ============================================================================

/**
 * Show detailed tooltip in the panel
 */
function showDetailedTooltip(nodeName, data) {
    const content = DOM_ELEMENTS.tooltipContent;

    let affectsText = '';
    if (data.affects && data.affects.length > 0) {
        const chips = data.affects.map(a => `<span class=\"px-2 py-0.5 rounded-full text-xs bg-accent/10 text-main/80 dark:bg-accent/20 dark:text-background/80 border border-accent/20 dark:border-accent/30\">${a}</span>`).join(' ');
        affectsText = `<div class=\"mt-4 mb-3\">
            <div class=\"font-semibold text-sm text-main dark:text-background mb-2\">Affects</div>
            <div class=\"flex flex-wrap gap-2\">${chips}</div>
        </div>`;
    }

    let problemsText = '';
    if (data.ifTooHigh || data.ifTooLow || data.ifTooFine || data.ifTooCoarse || data.ifTooLong || data.ifTooShort || data.ifTooThick || data.ifTooThin || data.ifTooBitter || data.ifTooSour || data.ifTooFast || data.ifTooSlow) {
        problemsText = `<div class="mt-5">
            <div class="font-semibold text-sm text-main dark:text-background mb-2">Common Issues:</div>
            <div class="text-sm text-main/80 dark:text-background/80 space-y-1.5 leading-relaxed">`;

        if (data.ifTooHigh) problemsText += `<div>• Too High: ${data.ifTooHigh}</div>`;
        if (data.ifTooLow) problemsText += `<div>• Too Low: ${data.ifTooLow}</div>`;
        if (data.ifTooFine) problemsText += `<div>• Too Fine: ${data.ifTooFine}</div>`;
        if (data.ifTooCoarse) problemsText += `<div>• Too Coarse: ${data.ifTooCoarse}</div>`;
        if (data.ifTooLong) problemsText += `<div>• Too Long: ${data.ifTooLong}</div>`;
        if (data.ifTooShort) problemsText += `<div>• Too Short: ${data.ifTooShort}</div>`;
        if (data.ifTooThick) problemsText += `<div>• Too Thick: ${data.ifTooThick}</div>`;
        if (data.ifTooThin) problemsText += `<div>• Too Thin: ${data.ifTooThin}</div>`;
        if (data.ifTooBitter) problemsText += `<div>• Too Bitter: ${data.ifTooBitter}</div>`;
        if (data.ifTooSour) problemsText += `<div>• Too Sour: ${data.ifTooSour}</div>`;
        if (data.ifTooFast) problemsText += `<div>• Too Fast: ${data.ifTooFast}</div>`;
        if (data.ifTooSlow) problemsText += `<div>• Too Slow: ${data.ifTooSlow}</div>`;

        problemsText += `</div></div>`;
    }

    const tooltipHTML = `
        <div class=\"font-semibold text-lg text-main dark:text-background mb-3\">${nodeName}</div>
        <div class=\"text-sm leading-relaxed text-main/80 dark:text-background/80 mb-4\">${data.definition}</div>
        ${affectsText}
        ${problemsText}
    `;

    content.innerHTML = tooltipHTML;
}

/**
 * Hide detailed tooltip panel
 */
function hideDetailedTooltip() {
    const content = DOM_ELEMENTS.tooltipContent;
    const defaultHTML = `
        <div class="text-center text-main/60 dark:text-background/60 py-8">
            <i class="fa-solid fa-mouse-pointer text-2xl mb-2"></i>
            <p>Click on a variable to see detailed information</p>
        </div>
    `;
    content.innerHTML = defaultHTML;
}

// ============================================================================
// VIEW MANAGEMENT
// ============================================================================

/**
 * Reset the view to initial state
 */
function resetView() {
    clearSelection();
    clearConnectionHighlights();
    hideDetailedTooltip();

    currentView = 'default';
    const positions = originalLayout === 'mobile' ? mobilePositions : desktopPositions;
    const allNodes = document.querySelectorAll('[data-node-name]');

    allNodes.forEach(node => {
        const nodeName = node.dataset.nodeName;
        if (positions[nodeName]) {
            const pos = positions[nodeName];
            node.style.left = `${pos.x}%`;
            node.style.top = `${pos.y}%`;
            node.style.transform = 'translate(-50%, -50%)';
            node.style.transition = '';
            node.style.cursor = 'pointer';
            node.style.zIndex = '10';
        }
    });

    currentLayout = originalLayout;

    const allConnections = document.querySelectorAll('[data-connection]');
    allConnections.forEach(line => {
        const svg = line.querySelector('svg');
        const lineElement = svg.querySelector('line');
        if (lineElement) {
            lineElement.setAttribute('stroke-dasharray', 'none');
            lineElement.setAttribute('stroke', '#ff6b35');
            lineElement.setAttribute('stroke-width', '2.5');
            lineElement.setAttribute('opacity', '0.4');
        }
    });

    setTimeout(() => {
        updateConnectionPositions();
    }, 100);

    // Update layout button label back to Default
    if (DOM_ELEMENTS.canvasLayoutToggleBtn) {
        DOM_ELEMENTS.canvasLayoutToggleBtn.innerHTML = `<i class="fa-solid fa-layer-group text-sm" aria-hidden="true"></i> Default`;
    }
}

/**
 * Update legend colors for dark mode
 */
function updateLegendColors() {
    const isDarkMode = document.documentElement.classList.contains('dark');
    const tertiaryColor = isDarkMode ? '#66BBD2' : '#005271';
    
    const legendLines = document.querySelectorAll('.tertiary-line');
    legendLines.forEach(line => {
        line.setAttribute('stroke', tertiaryColor);
    });
}

// ============================================================================
// DRAG AND DROP FUNCTIONALITY
// ============================================================================

/**
 * Make a node draggable
 */
function makeNodeDraggable(node) {
    let isDragging = false;
    let startX, startY, startLeft, startTop;
    let hasMoved = false;
    let dragStarted = false;

    node.addEventListener('mousedown', (e) => {
        if (e.target === node || node.contains(e.target)) {
            isDragging = true;
            hasMoved = false;
            dragStarted = false;
            node.dataset.isDragging = 'true';

            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseFloat(node.style.left) || 0;
            startTop = parseFloat(node.style.top) || 0;

            node.style.transition = 'none';
            node.style.cursor = 'grabbing';
            node.style.zIndex = '1000';

            freezeConnections();
            e.preventDefault();
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        const moveThreshold = 5;
        if (Math.abs(deltaX) > moveThreshold || Math.abs(deltaY) > moveThreshold) {
            hasMoved = true;
            dragStarted = true;
        }

        const container = DOM_ELEMENTS.mindmapCanvas;
        const containerRect = container.getBoundingClientRect();

        const deltaLeftPercent = (deltaX / containerRect.width) * 100;
        const deltaTopPercent = (deltaY / containerRect.height) * 100;

        const newLeftPercent = startLeft + deltaLeftPercent;
        const newTopPercent = startTop + deltaTopPercent;

        const constrainedLeft = Math.max(5, Math.min(95, newLeftPercent));
        const constrainedTop = Math.max(5, Math.min(95, newTopPercent));

        node.style.left = `${constrainedLeft}%`;
        node.style.top = `${constrainedTop}%`;
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            node.dataset.isDragging = 'false';

            node.style.transition = '';
            node.style.cursor = 'pointer';
            node.style.zIndex = '10';

            unfreezeConnections();

            if (dragStarted) {
                node.dataset.wasDragging = 'true';
                setTimeout(() => {
                    node.dataset.wasDragging = 'false';
                }, 100);
            }
        }
    });
}

/**
 * Freeze all connections during dragging
 */
function freezeConnections() {
    const allConnections = document.querySelectorAll('[data-connection]');
    allConnections.forEach(line => {
        const svg = line.querySelector('svg');
        const lineElement = svg.querySelector('line');
        if (lineElement) {
            lineElement.dataset.originalOpacity = lineElement.getAttribute('opacity');
            lineElement.dataset.originalStroke = lineElement.getAttribute('stroke');
            lineElement.setAttribute('opacity', '0.2');
            lineElement.setAttribute('stroke', '#9ca3af');
        }
    });

    window.isDragging = true;

    if (window.connectionUpdateTimeout) {
        clearTimeout(window.connectionUpdateTimeout);
        window.connectionUpdateTimeout = null;
    }
}

/**
 * Unfreeze connections and snap them to new positions
 */
function unfreezeConnections() {
    const allConnections = document.querySelectorAll('[data-connection]');
    allConnections.forEach(line => {
        const svg = line.querySelector('svg');
        const lineElement = svg.querySelector('line');
        if (lineElement) {
            const originalOpacity = lineElement.dataset.originalOpacity || '0.4';
            const originalStroke = lineElement.dataset.originalStroke || '#ff6b35';
            lineElement.setAttribute('opacity', originalOpacity);
            lineElement.setAttribute('stroke', originalStroke);
        }
    });

    window.isDragging = false;

    setTimeout(() => {
        updateConnectionPositions();
    }, 50);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Debounce function for performance
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================================================
// HAMBURGER MENU FUNCTIONALITY
// ============================================================================

function initializeHamburgerMenu() {
    const hamburgerBtn = document.getElementById('hamburger-menu-btn');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const menuDarkModeToggles = document.querySelectorAll('#menu-dark-mode-toggle, .menu-dark-mode-toggle');
    const backBtn = document.getElementById('back-btn');

    if (hamburgerBtn) {
        hamburgerBtn.style.opacity = '1';
        hamburgerBtn.style.pointerEvents = 'auto';
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerMenu.classList.remove('opacity-0', 'pointer-events-none');
            hamburgerMenu.querySelector('div').classList.remove('translate-x-full');
            // Lock body scroll
            lockBodyScroll();
        });
    }

    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', () => {
            hamburgerMenu.classList.add('opacity-0', 'pointer-events-none');
            hamburgerMenu.querySelector('div').classList.add('translate-x-full');
            // Unlock body scroll
            unlockBodyScroll();
        });
    }

    hamburgerMenu.addEventListener('click', (e) => {
        if (e.target === hamburgerMenu) {
            hamburgerMenu.classList.add('opacity-0', 'pointer-events-none');
            hamburgerMenu.querySelector('div').classList.add('translate-x-full');
            // Unlock body scroll
            unlockBodyScroll();
        }
    });

    if (menuDarkModeToggles && menuDarkModeToggles.length) {
        menuDarkModeToggles.forEach((btn) => {
            btn.addEventListener('click', () => {
                toggleDarkMode();
                hamburgerMenu.classList.add('opacity-0', 'pointer-events-none');
                hamburgerMenu.querySelector('div').classList.add('translate-x-full');
                unlockBodyScroll();
            });
        });
    }

    const menuLinks = hamburgerMenu?.querySelectorAll('a');
    if (menuLinks) {
        menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                hamburgerMenu.classList.add('opacity-0', 'pointer-events-none');
                hamburgerMenu.querySelector('div').classList.add('translate-x-full');

                if (link.href && link.href.includes('index.html')) {
                    e.preventDefault();
                    setTimeout(() => {
                        window.location.replace('index.html' + (link.hash || ''));
                    }, 100);
                }
            });
        });
    }

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.replace('index.html');
        });
    }
}

function toggleDarkMode() {
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');

    if (isDark) {
        root.classList.remove('dark');
        localStorage.setItem('darkMode', 'false');
    } else {
        root.classList.add('dark');
        localStorage.setItem('darkMode', 'true');
    }
    
    updateLegendColors();
}

function loadDarkModePreference() {
    const savedPreference = localStorage.getItem('darkMode');
    const shouldEnable = savedPreference === 'true';
    const root = document.documentElement;
    if (shouldEnable) root.classList.add('dark');
}

// ============================================================================
// PROGRESS BAR FUNCTIONALITY
// ============================================================================

function initializeProgressBar() {
    window.addEventListener('scroll', updateProgressBar);
}

function updateProgressBar() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    if (DOM_ELEMENTS.progressBar) {
        DOM_ELEMENTS.progressBar.style.width = scrollPercent + '%';
    }
}

// ============================================================================
// BACK TO TOP FUNCTIONALITY
// ============================================================================

function initializeBackToTop() {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            DOM_ELEMENTS.backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
        } else {
            DOM_ELEMENTS.backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
        }
    });

    DOM_ELEMENTS.backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
} 

// Scroll lock helpers
let __scrollLockY = 0;
function lockBodyScroll() {
    if (document.body.style.position === 'fixed') return;
    __scrollLockY = window.scrollY || window.pageYOffset || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${__scrollLockY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.documentElement.style.overscrollBehavior = 'none';
}
function unlockBodyScroll() {
    if (document.body.style.position !== 'fixed') return;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.documentElement.style.overscrollBehavior = '';
    window.scrollTo(0, __scrollLockY || 0);
} 