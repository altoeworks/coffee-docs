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
let originalLayout = 'desktop'; // Store the original layout for reset
let selectedNode = null;
let highlightedConnections = [];

// ============================================================================
// DOM ELEMENTS
// ============================================================================

const DOM_ELEMENTS = {
    mindmapCanvas: null,
    tooltip: null,
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
    console.log('DOM Content Loaded');
    initializeElements();
    initializeMindmap();
    initializeEventListeners();
    initializeHamburgerMenu();
    initializeProgressBar();
    initializeBackToTop();
    loadDarkModePreference();
    updateLegendColors(); // Initialize legend colors

    // Initialize tooltip panel state
    const tooltipPanel = DOM_ELEMENTS.tooltipPanel;
    // Tooltip panel is always visible now
});

/**
 * Initialize all DOM element references
 */
function initializeElements() {
    console.log('Initializing elements...');
    DOM_ELEMENTS.mindmapCanvas = document.getElementById('mindmap-canvas');
    DOM_ELEMENTS.tooltip = document.getElementById('tooltip');
    DOM_ELEMENTS.tooltipContent = document.getElementById('tooltip-content');
    DOM_ELEMENTS.tooltipPanel = document.getElementById('tooltip-panel');
    DOM_ELEMENTS.closeTooltipBtn = document.getElementById('close-tooltip-btn');
    DOM_ELEMENTS.resetViewBtn = document.getElementById('reset-view-btn');
    DOM_ELEMENTS.toggleLayoutBtn = document.getElementById('toggle-layout-btn');
    DOM_ELEMENTS.backBtn = document.getElementById('back-btn');
    DOM_ELEMENTS.hamburgerMenuBtn = document.getElementById('hamburger-menu-btn');
    DOM_ELEMENTS.hamburgerMenu = document.getElementById('hamburger-menu');
    DOM_ELEMENTS.closeMenuBtn = document.getElementById('close-menu-btn');
    DOM_ELEMENTS.menuDarkModeToggle = document.getElementById('menu-dark-mode-toggle');
    DOM_ELEMENTS.backToTopBtn = document.getElementById('back-to-top-btn');
    DOM_ELEMENTS.progressBar = document.getElementById('progress-bar');

    console.log('Mindmap canvas found:', !!DOM_ELEMENTS.mindmapCanvas);
    console.log('Tooltip panel found:', !!DOM_ELEMENTS.tooltipPanel);
}

/**
 * Initialize the mindmap with nodes and connections
 */
function initializeMindmap() {
    console.log('Initializing mindmap...');

    // Check if data is available
    if (typeof espressoVariablesData === 'undefined') {
        console.error('Espresso variables data not loaded');
        return;
    }

    // Check if positioning data is available
    if (typeof desktopPositions === 'undefined' || typeof mobilePositions === 'undefined') {
        console.error('Positioning data not loaded');
        return;
    }

    // Check if connections data is available
    if (typeof connections === 'undefined') {
        console.error('Connections data not loaded');
        return;
    }

    // Check if container exists and has proper dimensions
    const container = DOM_ELEMENTS.mindmapCanvas;
    if (!container) {
        console.error('Mindmap canvas not found');
        return;
    }

    console.log('Mindmap container dimensions:', container.offsetWidth, 'x', container.offsetHeight);
    console.log('Available data keys:', Object.keys(espressoVariablesData));
    console.log('Available connections:', connections.length);
    console.log('Desktop positions:', Object.keys(desktopPositions));
    console.log('Mobile positions:', Object.keys(mobilePositions));

    // Create nodes first
    createNodes();

    // Wait for nodes to be rendered, then create connections
    setTimeout(() => {
        createConnections();

        // Wait for connections to be created, then update layout
        setTimeout(() => {
            updateLayout();

            // Final connection position update
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
    // Reset view button
    DOM_ELEMENTS.resetViewBtn.addEventListener('click', resetView);

    // Toggle layout button
    DOM_ELEMENTS.toggleLayoutBtn.addEventListener('click', toggleLayout);

    // Back button
    DOM_ELEMENTS.backBtn.addEventListener('click', () => {
        window.history.back();
    });

    // Close tooltip button
    if (DOM_ELEMENTS.closeTooltipBtn) {
        DOM_ELEMENTS.closeTooltipBtn.addEventListener('click', () => {
            hideDetailedTooltip();
            clearSelection();
            clearConnectionHighlights();
        });
    }

    // Window resize
    window.addEventListener('resize', debounce(() => {
        updateLayout();
    }, 250));

    // Handle canvas clicks for deselection
    if (DOM_ELEMENTS.mindmapCanvas) {
        DOM_ELEMENTS.mindmapCanvas.addEventListener('click', (e) => {
            // Don't deselect if clicking on the reset button or its children
            if (e.target.closest('#reset-view-btn')) {
                return;
            }

            // Only deselect if clicking directly on the canvas (not on a node)
            if (e.target === DOM_ELEMENTS.mindmapCanvas || e.target.classList.contains('connection-line')) {
                console.log('Canvas clicked - deselecting all');
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

    if (!container) {
        console.error('Mindmap canvas not found');
        return;
    }

    console.log('Creating nodes, data:', espressoVariablesData);
    console.log('Node types:', nodeTypes);
    console.log('Container:', container);

    Object.keys(espressoVariablesData).forEach(nodeName => {
        const nodeData = espressoVariablesData[nodeName];
        const node = createNode(nodeName, nodeData);
        container.appendChild(node);

        // Verify node styling
        console.log(`Node ${nodeName} created and appended`);
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

    // Add node content
    node.innerHTML = `
        <div class="text-center">
            <div class="font-semibold tracking-wide">${name}</div>
        </div>
    `;

    // Set initial position
    const positions = currentLayout === 'mobile' ? mobilePositions : desktopPositions;
    const pos = positions[name];
    if (pos) {
        node.style.left = `${pos.x}%`;
        node.style.top = `${pos.y}%`;
        node.style.transform = 'translate(-50%, -50%)';
    } else {
        console.warn(`No position found for node: ${name}`);
    }

    // Ensure proper styling with inline styles as backup
    if (data.type === 'input') {
        node.style.backgroundColor = '#ff6b35';
        node.style.color = 'white';
        node.style.boxShadow = '0 4px 14px 0 rgba(255, 107, 53, 0.3)';
    } else if (data.type === 'output') {
        // Use tertiary color - check if dark mode is active
        const isDarkMode = document.documentElement.classList.contains('dark');
        const tertiaryColor = isDarkMode ? '#66BBD2' : '#005271';
        node.style.backgroundColor = tertiaryColor;
        node.style.color = 'white';
        node.style.boxShadow = `0 4px 14px 0 ${isDarkMode ? 'rgba(102, 187, 210, 0.3)' : 'rgba(0, 82, 113, 0.3)'}`;
    }

    // Add click event
    node.addEventListener('click', (e) => {
        // Don't trigger click if we were dragging
        if (node.dataset.wasDragging === 'true') {
            return;
        }
        console.log(`Click event triggered for node: ${name}`);
        handleNodeClick(name, data);
    });

    // Add drag functionality
    makeNodeDraggable(node);

    // Add hover events for visual feedback only
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

    console.log(`Created node: ${name} with type: ${data.type}, class: ${nodeClass}, final classes: ${node.className}`);

    return node;
}

/**
 * Handle node click events
 */
function handleNodeClick(name, data) {
    console.log(`Node clicked: ${name}`, data);

    // Clear previous selection
    clearSelection();

    // Select current node
    selectNode(name);

    // Highlight connections
    highlightConnections(name);

    // Show detailed tooltip in panel
    showDetailedTooltip(name, data);

    // Force a small delay then update connections (only if not dragging)
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
        console.log(`Selecting node: ${nodeName}`);
        // Add selected styling without changing position - NO BORDER for affector
        node.style.backgroundColor = '#ff6b35';
        node.style.opacity = '1';
        node.style.border = ''; // No border for the affector
        node.style.transform = 'translate(-50%, -50%) scale(1.05)';

        // Find nodes that this node affects (outgoing connections)
        const outgoingConnections = connections.filter(conn => conn.from === nodeName);
        const affectedNodes = outgoingConnections.map(conn => conn.to);

        // Find nodes that affect this node (incoming connections)
        const incomingConnections = connections.filter(conn => conn.to === nodeName);
        const affectingNodes = incomingConnections.map(conn => conn.from);

        // Update all nodes based on their relationship to the selected node
        const allNodes = document.querySelectorAll('[data-node-name]');
        allNodes.forEach(otherNode => {
            const otherNodeName = otherNode.dataset.nodeName;

            if (otherNodeName === nodeName) {
                // Selected node - already styled above
                return;
            } else if (affectedNodes.includes(otherNodeName)) {
                // Node that the selected affects - keep fully visible with border
                otherNode.style.opacity = '1';
                otherNode.style.border = '2px solid #ff6b35';
            } else if (affectingNodes.includes(otherNodeName)) {
                // Node that affects the selected - visible but NO BORDER for affector
                otherNode.style.opacity = '1';
                otherNode.style.border = ''; // No border for affector
            } else {
                // All other nodes - make transparent
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
            console.log(`Clearing selection for: ${selectedNode}`);
            const nodeData = espressoVariablesData[selectedNode];

            // Reset inline styles based on node type
            if (nodeData.type === 'input') {
                node.style.backgroundColor = '#ff6b35';
                node.style.color = 'white';
            } else if (nodeData.type === 'output') {
                // Use tertiary color - check if dark mode is active
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

    // Reset all nodes to normal state
    const allNodes = document.querySelectorAll('[data-node-name]');
    allNodes.forEach(node => {
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

    if (!container) {
        console.error('Mindmap canvas not found for connections');
        return;
    }

    console.log('Creating connections:', connections.length);

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
    line.style.zIndex = '1'; // Ensure connections are below nodes
    line.style.pointerEvents = 'none'; // Ensure clicks pass through

    // Create SVG line
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
    console.log(`Highlighting connections for: ${nodeName}`);

    // Clear previous highlights
    clearConnectionHighlights();

    // Find connections where this node is the FROM node (it affects others)
    const outgoingConnections = connections.filter(conn => conn.from === nodeName);
    console.log(`Found ${outgoingConnections.length} outgoing connections from ${nodeName}`);

    // Find connections where this node is the TO node (others affect it)
    const incomingConnections = connections.filter(conn => conn.to === nodeName);
    console.log(`Found ${incomingConnections.length} incoming connections to ${nodeName}`);

    // Make all connections more transparent first
    const allConnections = document.querySelectorAll('[data-connection]');
    allConnections.forEach(line => {
        const svg = line.querySelector('svg');
        const lineElement = svg.querySelector('line');
        if (lineElement) {
            lineElement.setAttribute('opacity', '0.1');
        }
    });

    // Highlight outgoing connections (this node affects others) - orange solid line
    outgoingConnections.forEach(connection => {
        const line = document.querySelector(`[data-connection="${connection.from}-${connection.to}"]`);
        if (line) {
            console.log(`Highlighting outgoing connection: ${connection.from} -> ${connection.to}`);
            const svg = line.querySelector('svg');
            const lineElement = svg.querySelector('line');
            if (lineElement) {
                lineElement.setAttribute('stroke', '#ff6b35');
                lineElement.setAttribute('stroke-width', '4');
                lineElement.setAttribute('opacity', '0.8');
                lineElement.setAttribute('stroke-dasharray', 'none'); // Solid line
            }
            highlightedConnections.push(line);
        } else {
            console.log(`Connection line not found: ${connection.from} -> ${connection.to}`);
        }
    });

    // Highlight incoming connections (others affect this node) - dark dashed line
    incomingConnections.forEach(connection => {
        const line = document.querySelector(`[data-connection="${connection.from}-${connection.to}"]`);
        if (line) {
            console.log(`Highlighting incoming connection: ${connection.from} -> ${connection.to}`);
            const svg = line.querySelector('svg');
            const lineElement = svg.querySelector('line');
            if (lineElement) {
                // Use tertiary color - check if dark mode is active
                const isDarkMode = document.documentElement.classList.contains('dark');
                const tertiaryColor = isDarkMode ? '#66BBD2' : '#005271';
                lineElement.setAttribute('stroke', tertiaryColor);
                lineElement.setAttribute('stroke-width', '3');
                lineElement.setAttribute('opacity', '0.6');
                lineElement.setAttribute('stroke-dasharray', '8,4'); // Dashed line
            }
            highlightedConnections.push(line);
        } else {
            console.log(`Connection line not found: ${connection.from} -> ${connection.to}`);
        }
    });
}

/**
 * Clear all connection highlights
 */
function clearConnectionHighlights() {
    console.log(`Clearing ${highlightedConnections.length} connection highlights`);
    highlightedConnections.forEach(line => {
        const svg = line.querySelector('svg');
        const lineElement = svg.querySelector('line');
        if (lineElement) {
            lineElement.setAttribute('stroke', '#ff6b35');
            lineElement.setAttribute('stroke-width', '2.5');
            lineElement.setAttribute('opacity', '0.4');
        }
    });

    // Reset all connections to normal opacity
    const allConnections = document.querySelectorAll('[data-connection]');
    allConnections.forEach(line => {
        const svg = line.querySelector('svg');
        const lineElement = svg.querySelector('line');
        if (lineElement) {
            lineElement.setAttribute('opacity', '0.4');
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
    const positions = currentLayout === 'mobile' ? mobilePositions : desktopPositions;
    const container = DOM_ELEMENTS.mindmapCanvas;
    const containerRect = container.getBoundingClientRect();

    // Update node positions
    Object.keys(positions).forEach(nodeName => {
        const node = document.querySelector(`[data-node-name="${nodeName}"]`);
        if (node) {
            const pos = positions[nodeName];
            node.style.left = `${pos.x}%`;
            node.style.top = `${pos.y}%`;
            node.style.transform = 'translate(-50%, -50%)';
        }
    });

    // Update connection positions (only if not dragging)
    if (!window.isDragging) {
        updateConnectionPositions();
    }
}

/**
 * Update connection line positions
 */
function updateConnectionPositions() {
    // Skip connection updates if we're currently dragging
    if (window.isDragging) {
        return;
    }

    const container = DOM_ELEMENTS.mindmapCanvas;

    // Clear any existing timeout
    if (window.connectionUpdateTimeout) {
        clearTimeout(window.connectionUpdateTimeout);
    }

    // Wait a bit for nodes to be positioned
    window.connectionUpdateTimeout = setTimeout(() => {
        // Double-check we're still not dragging
        if (window.isDragging) {
            return;
        }

        connections.forEach(connection => {
            const line = document.querySelector(`[data-connection="${connection.from}-${connection.to}"]`);
            if (line) {
                const fromNode = document.querySelector(`[data-node-name="${connection.from}"]`);
                const toNode = document.querySelector(`[data-node-name="${connection.to}"]`);

                if (fromNode && toNode) {
                    // Get the actual rendered positions of the nodes
                    const fromRect = fromNode.getBoundingClientRect();
                    const toRect = toNode.getBoundingClientRect();
                    const containerRect = container.getBoundingClientRect();

                    // Calculate center points relative to the container
                    const fromX = fromRect.left + fromRect.width / 2 - containerRect.left;
                    const fromY = fromRect.top + fromRect.height / 2 - containerRect.top;
                    const toX = toRect.left + toRect.width / 2 - containerRect.left;
                    const toY = toRect.top + toRect.height / 2 - containerRect.top;

                    const svg = line.querySelector('svg');
                    const lineElement = svg.querySelector('line');

                    if (svg && lineElement) {
                        // Update SVG dimensions to match container
                        svg.setAttribute('width', containerRect.width);
                        svg.setAttribute('height', containerRect.height);

                        // Update line coordinates
                        lineElement.setAttribute('x1', fromX);
                        lineElement.setAttribute('y1', fromY);
                        lineElement.setAttribute('x2', toX);
                        lineElement.setAttribute('y2', toY);

                        console.log(`Connection ${connection.from} -> ${connection.to}: (${fromX}, ${fromY}) -> (${toX}, ${toY})`);
                    }
                }
            }
        });

        // Clear the timeout reference
        window.connectionUpdateTimeout = null;
    }, 200); // Increased delay to ensure nodes are fully positioned
}

/**
 * Toggle between mobile and desktop layouts
 */
function toggleLayout() {
    console.log(`Toggling layout from ${currentLayout} to ${currentLayout === 'desktop' ? 'mobile' : 'desktop'}`);
    currentLayout = currentLayout === 'desktop' ? 'mobile' : 'desktop';

    // Update button text first
    const btn = DOM_ELEMENTS.toggleLayoutBtn;
    if (currentLayout === 'mobile') {
        btn.innerHTML = `<i class="fa-solid fa-desktop text-lg" aria-hidden="true"></i>Desktop Layout`;
    } else {
        btn.innerHTML = `<i class="fa-solid fa-mobile-alt text-lg" aria-hidden="true"></i>Mobile Layout`;
    }

    // Update layout
    updateLayout();

    // Tooltip panel is always visible now, no need to handle visibility

    // Force connection update after layout change (only if not dragging)
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
    console.log(`Showing detailed tooltip for: ${nodeName}`);
    const tooltipPanel = DOM_ELEMENTS.tooltipPanel;
    const content = DOM_ELEMENTS.tooltipContent;

    let affectsText = '';
    if (data.affects && data.affects.length > 0) {
        affectsText = `<div class="mt-4">
            <div class="font-semibold text-sm text-main dark:text-background mb-2">Affects:</div>
            <div class="text-sm text-main/80 dark:text-background/80">${data.affects.join(', ')}</div>
        </div>`;
    }

    let problemsText = '';
    if (data.ifTooHigh || data.ifTooLow || data.ifTooFine || data.ifTooCoarse || data.ifTooLong || data.ifTooShort || data.ifTooThick || data.ifTooThin || data.ifTooBitter || data.ifTooSour) {
        problemsText = `<div class="mt-4">
            <div class="font-semibold text-sm text-main dark:text-background mb-2">Common Issues:</div>
            <div class="text-sm text-main/80 dark:text-background/80 space-y-1">`;

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

        problemsText += `</div></div>`;
    }

    const tooltipHTML = `
        <div class="font-semibold text-lg text-main dark:text-background mb-3">${nodeName}</div>
        <div class="text-sm text-main/80 dark:text-background/80 mb-4">${data.definition}</div>
        ${affectsText}
        ${problemsText}
    `;

    content.innerHTML = tooltipHTML;
}

/**
 * Hide detailed tooltip panel
 */
function hideDetailedTooltip() {
    const tooltipPanel = DOM_ELEMENTS.tooltipPanel;
    const content = DOM_ELEMENTS.tooltipContent;

    // Reset to default state
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
    console.log('Resetting view');
    clearSelection();
    clearConnectionHighlights();
    hideDetailedTooltip();

    // Reset all nodes to their original positions (use original layout, not current)
    const positions = originalLayout === 'mobile' ? mobilePositions : desktopPositions;
    const allNodes = document.querySelectorAll('[data-node-name]');

    allNodes.forEach(node => {
        const nodeName = node.dataset.nodeName;
        if (positions[nodeName]) {
            const pos = positions[nodeName];
            // Reset position and transform
            node.style.left = `${pos.x}%`;
            node.style.top = `${pos.y}%`;
            node.style.transform = 'translate(-50%, -50%)';
            // Reset any transition effects
            node.style.transition = '';
            node.style.cursor = 'pointer';
            node.style.zIndex = '10';
        }
    });

    // Reset layout to original
    currentLayout = originalLayout;

    // Reset all connections to solid lines
    const allConnections = document.querySelectorAll('[data-connection]');
    allConnections.forEach(line => {
        const svg = line.querySelector('svg');
        const lineElement = svg.querySelector('line');
        if (lineElement) {
            lineElement.setAttribute('stroke-dasharray', 'none'); // Reset to solid lines
            lineElement.setAttribute('stroke', '#ff6b35');
            lineElement.setAttribute('stroke-width', '2.5');
            lineElement.setAttribute('opacity', '0.4');
        }
    });

    // Force a small delay then update connections to ensure they're properly reset
    setTimeout(() => {
        updateConnectionPositions();
    }, 100);
}

/**
 * Update legend colors for dark mode
 */
function updateLegendColors() {
    const isDarkMode = document.documentElement.classList.contains('dark');
    const tertiaryColor = isDarkMode ? '#66BBD2' : '#005271';
    
    // Update legend SVG lines
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
        // Don't start dragging if we're clicking on a node (let the click handler work)
        if (e.target === node || node.contains(e.target)) {
            isDragging = true;
            hasMoved = false;
            dragStarted = false; // Only set to true when we actually move
            node.dataset.isDragging = 'true';

            // Get initial positions
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseFloat(node.style.left) || 0;
            startTop = parseFloat(node.style.top) || 0;

            // Disable CSS transitions during drag for better performance
            node.style.transition = 'none';

            // Add dragging styles
            node.style.cursor = 'grabbing';
            node.style.zIndex = '1000';

            // Freeze and grey out all connections during drag
            freezeConnections();

            e.preventDefault();
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        // Calculate delta movement
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        // Check if we've moved enough to consider it a drag (not just a click)
        const moveThreshold = 5; // pixels
        if (Math.abs(deltaX) > moveThreshold || Math.abs(deltaY) > moveThreshold) {
            hasMoved = true;
            dragStarted = true; // Mark as drag operation when we actually move
        }

        const container = DOM_ELEMENTS.mindmapCanvas;
        const containerRect = container.getBoundingClientRect();

        // Convert delta to percentage
        const deltaLeftPercent = (deltaX / containerRect.width) * 100;
        const deltaTopPercent = (deltaY / containerRect.height) * 100;

        // Calculate new position
        const newLeftPercent = startLeft + deltaLeftPercent;
        const newTopPercent = startTop + deltaTopPercent;

        // Constrain to container bounds
        const constrainedLeft = Math.max(5, Math.min(95, newLeftPercent));
        const constrainedTop = Math.max(5, Math.min(95, newTopPercent));

        // Update position
        node.style.left = `${constrainedLeft}%`;
        node.style.top = `${constrainedTop}%`;

        // No connection updates during drag - they're frozen
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            node.dataset.isDragging = 'false';

            // Re-enable CSS transitions
            node.style.transition = '';

            // Reset styles
            node.style.cursor = 'pointer';
            node.style.zIndex = '10';

            // Unfreeze connections and snap them to new positions
            unfreezeConnections();

            // Prevent selection if we were dragging (not just clicking)
            if (dragStarted) {
                // Mark that we were dragging to prevent click
                node.dataset.wasDragging = 'true';
                // Clear the flag after a short delay to allow click event to check it
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
            // Store original opacity and stroke
            lineElement.dataset.originalOpacity = lineElement.getAttribute('opacity');
            lineElement.dataset.originalStroke = lineElement.getAttribute('stroke');
            // Make connections transparent and grey
            lineElement.setAttribute('opacity', '0.2');
            lineElement.setAttribute('stroke', '#9ca3af');
        }
    });

    // Disable connection updates during drag
    window.isDragging = true;

    // Disable any pending connection updates
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
            // Restore original opacity and stroke
            const originalOpacity = lineElement.dataset.originalOpacity || '0.4';
            const originalStroke = lineElement.dataset.originalStroke || '#ff6b35';
            lineElement.setAttribute('opacity', originalOpacity);
            lineElement.setAttribute('stroke', originalStroke);
        }
    });

    // Re-enable connection updates
    window.isDragging = false;

    // Update all connection positions to snap to new node positions
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
    const menuDarkModeToggle = document.getElementById('menu-dark-mode-toggle');
    const backBtn = document.getElementById('back-btn');

    // Show hamburger button immediately
    if (hamburgerBtn) {
        hamburgerBtn.style.opacity = '1';
        hamburgerBtn.style.pointerEvents = 'auto';
    }

    // Open menu
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerMenu.classList.remove('opacity-0', 'pointer-events-none');
            hamburgerMenu.querySelector('div').classList.remove('translate-x-full');
        });
    }

    // Close menu
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', () => {
            hamburgerMenu.classList.add('opacity-0', 'pointer-events-none');
            hamburgerMenu.querySelector('div').classList.add('translate-x-full');
        });
    }

    // Close menu when clicking outside
    hamburgerMenu.addEventListener('click', (e) => {
        if (e.target === hamburgerMenu) {
            hamburgerMenu.classList.add('opacity-0', 'pointer-events-none');
            hamburgerMenu.querySelector('div').classList.add('translate-x-full');
        }
    });

    // Menu dark mode toggle
    if (menuDarkModeToggle) {
        menuDarkModeToggle.addEventListener('click', () => {
            toggleDarkMode();
            hamburgerMenu.classList.add('opacity-0', 'pointer-events-none');
            hamburgerMenu.querySelector('div').classList.add('translate-x-full');
        });
    }

    // Close menu when any menu link is clicked
    const menuLinks = hamburgerMenu?.querySelectorAll('a');
    if (menuLinks) {
        menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Close menu first
                hamburgerMenu.classList.add('opacity-0', 'pointer-events-none');
                hamburgerMenu.querySelector('div').classList.add('translate-x-full');

                // For links to index.html, use replace for more reliable navigation
                if (link.href && link.href.includes('index.html')) {
                    e.preventDefault();
                    setTimeout(() => {
                        window.location.replace('index.html' + (link.hash || ''));
                    }, 100);
                }
            });
        });
    }

    // Back button functionality
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            // Use replace to avoid navigation issues and ensure clean loading
            window.location.replace('index.html');
        });
    }
}



function toggleDarkMode() {
    const body = document.body;
    const isDark = body.classList.contains('dark');

    if (isDark) {
        body.classList.remove('dark');
        localStorage.setItem('darkMode', 'false');
    } else {
        body.classList.add('dark');
        localStorage.setItem('darkMode', 'true');
    }
    
    // Update legend colors when dark mode changes
    updateLegendColors();
}

function loadDarkModePreference() {
    const savedPreference = localStorage.getItem('darkMode');
    if (savedPreference === 'true') {
        document.body.classList.add('dark');
    }
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