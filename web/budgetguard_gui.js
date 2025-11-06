/**
 * BudgetGuard Control Panel GUI
 * 
 * A draggable, expandable/collapsible control panel for BudgetGuard settings.
 * Appears when at least one BudgetGuard node is present in the graph.
 */

// ComfyUI extension - BudgetGuard GUI
// Note: ComfyUI provides 'app' globally, no import needed

class BudgetGuardGUI {
    constructor() {
        this.isVisible = false;
        this.isExpanded = true;
        this.position = { x: 20, y: 100 }; // Default position (left edge, 100px from top)
        this.side = 'left'; // 'left' or 'right'
        this.nodeCount = 0;
        
        // State management
        this.globalMode = 'MANUAL'; // 'MANUAL', 'LOWEST_PRICE', 'LOCAL'
        this.nodeStates = {}; // {nodeId: {provider: string, gpu_tier: string}}
        this.credentialsStatus = null; // null, true, or false
        
        // DOM elements
        this.container = null;
        this.collapsedIcon = null;
        this.expandedPanel = null;
        
        this.init();
    }
    
    init() {
        // Check for existing BudgetGuard nodes on load
        this.checkForNodes();
        
        // Listen for node creation/deletion
        app.graph.onNodeAdded = (node) => {
            if (node.type === 'BudgetGuardNode') {
                this.onNodeAdded(node);
            }
        };
        
        app.graph.onNodeRemoved = (node) => {
            if (node.type === 'BudgetGuardNode') {
                this.onNodeRemoved(node);
            }
        };
        
        // Check credential status on load
        this.checkCredentialStatus();
    }
    
    checkForNodes() {
        // Count existing BudgetGuard nodes
        const nodes = app.graph._nodes || [];
        this.nodeCount = nodes.filter(n => n.type === 'BudgetGuardNode').length;
        
        if (this.nodeCount > 0 && !this.isVisible) {
            this.show();
        } else if (this.nodeCount === 0 && this.isVisible) {
            this.hide();
        }
    }
    
    onNodeAdded(node) {
        this.nodeCount++;
        if (!this.isVisible) {
            this.show();
        }
        // Initialize node state
        this.nodeStates[node.id] = {
            provider: 'Local',
            gpu_tier: 'A10G'
        };
        this.saveState();
    }
    
    onNodeRemoved(node) {
        this.nodeCount--;
        delete this.nodeStates[node.id];
        if (this.nodeCount === 0) {
            this.hide();
        }
        this.saveState();
    }
    
    checkCredentialStatus() {
        // Check localStorage for credentials
        try {
            const config = localStorage.getItem('budgetguard_config');
            if (config) {
                const parsed = JSON.parse(config);
                this.credentialsStatus = parsed.credentials_status && 
                    (parsed.credentials_status.aws || 
                     parsed.credentials_status.azure || 
                     parsed.credentials_status.gcp || 
                     parsed.credentials_status.nvidia);
            } else {
                this.credentialsStatus = false;
            }
        } catch (e) {
            this.credentialsStatus = false;
        }
        this.updateCredentialStatus();
    }
    
    show() {
        if (this.container) return;
        
        this.isVisible = true;
        this.createGUI();
    }
    
    hide() {
        if (this.container) {
            this.container.remove();
            this.container = null;
            this.collapsedIcon = null;
            this.expandedPanel = null;
        }
        this.isVisible = false;
    }
    
    createGUI() {
        // Create main container (fixed to viewport, not graph)
        this.container = document.createElement('div');
        this.container.id = 'budgetguard-gui';
        this.container.style.cssText = `
            position: fixed;
            ${this.side}: ${this.position.x}px;
            top: ${this.position.y}px;
            z-index: 10000;
            font-family: Arial, sans-serif;
        `;
        
        document.body.appendChild(this.container);
        
        if (this.isExpanded) {
            this.createExpandedPanel();
        } else {
            this.createCollapsedIcon();
        }
    }
    
    createExpandedPanel() {
        this.container.innerHTML = '';
        
        const panel = document.createElement('div');
        panel.style.cssText = `
            background: #2d2d2d;
            border: 2px solid #555;
            border-radius: 8px;
            padding: 15px;
            min-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        // Title
        const title = document.createElement('div');
        title.textContent = 'BudgetGuard Settings';
        title.style.cssText = 'font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #fff;';
        panel.appendChild(title);
        
        // Credential Status
        const statusDiv = document.createElement('div');
        statusDiv.id = 'bg-credential-status';
        statusDiv.style.cssText = 'margin-bottom: 15px; padding: 8px; border-radius: 4px;';
        this.updateCredentialStatus();
        panel.appendChild(statusDiv);
        
        // Daily Spend Section
        const dailySpendDiv = document.createElement('div');
        dailySpendDiv.style.cssText = 'margin-bottom: 15px;';
        
        const dailySpendBtn = document.createElement('button');
        dailySpendBtn.textContent = 'DAILY SPEND';
        dailySpendBtn.style.cssText = 'padding: 8px 15px; margin-right: 10px; cursor: pointer;';
        dailySpendBtn.onclick = () => this.showDailySpendDialog();
        dailySpendDiv.appendChild(dailySpendBtn);
        
        const spentTodayDiv = document.createElement('div');
        spentTodayDiv.id = 'bg-spent-today';
        spentTodayDiv.style.cssText = `
            display: inline-block;
            padding: 8px 15px;
            border: 1px solid #555;
            border-radius: 4px;
            background: #1a1a1a;
            color: #fff;
        `;
        spentTodayDiv.textContent = 'SPENT TODAY: $0.00';
        dailySpendDiv.appendChild(spentTodayDiv);
        
        // Tooltip for SPENT TODAY
        const tooltip = document.createElement('span');
        tooltip.textContent = ' ?';
        tooltip.title = '$0.04/hour is an estimated average idle cost per container, not exact billing';
        tooltip.style.cssText = 'color: #888; cursor: help;';
        spentTodayDiv.appendChild(tooltip);
        
        panel.appendChild(dailySpendDiv);
        
        // Mode Toggle (Three-way: MANUAL / LOWEST PRICE / LOCAL)
        const modeDiv = document.createElement('div');
        modeDiv.style.cssText = 'margin-bottom: 15px;';
        
        const modeLabel = document.createElement('div');
        modeLabel.textContent = 'Mode:';
        modeLabel.style.cssText = 'margin-bottom: 5px; color: #ccc;';
        modeDiv.appendChild(modeLabel);
        
        const modeToggle = document.createElement('div');
        modeToggle.style.cssText = 'display: flex; gap: 5px;';
        
        ['MANUAL', 'LOWEST PRICE', 'LOCAL'].forEach(mode => {
            const btn = document.createElement('button');
            btn.textContent = mode;
            btn.style.cssText = `
                flex: 1;
                padding: 8px;
                border: 1px solid #555;
                background: ${this.globalMode === mode.toUpperCase().replace(' ', '_') ? '#4a9eff' : '#2d2d2d'};
                color: #fff;
                cursor: pointer;
            `;
            btn.onclick = () => this.setMode(mode);
            modeToggle.appendChild(btn);
        });
        
        modeDiv.appendChild(modeToggle);
        panel.appendChild(modeDiv);
        
        // Cloud Nodes Button
        const cloudNodesBtn = document.createElement('button');
        cloudNodesBtn.textContent = 'Cloud Nodes';
        cloudNodesBtn.style.cssText = 'width: 100%; padding: 10px; margin-bottom: 10px; cursor: pointer;';
        cloudNodesBtn.onclick = () => this.showCloudNodesDialog();
        panel.appendChild(cloudNodesBtn);
        
        // Collapse button
        const collapseBtn = document.createElement('button');
        collapseBtn.textContent = '−';
        collapseBtn.style.cssText = 'position: absolute; top: 5px; right: 5px; width: 25px; height: 25px;';
        collapseBtn.onclick = () => this.collapse();
        panel.appendChild(collapseBtn);
        
        // Make draggable
        this.makeDraggable(panel);
        
        this.container.appendChild(panel);
        this.expandedPanel = panel;
    }
    
    createCollapsedIcon() {
        this.container.innerHTML = '';
        
        const icon = document.createElement('div');
        icon.textContent = 'BG';
        icon.style.cssText = `
            width: 40px;
            height: 40px;
            background: #4a9eff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #fff;
            font-weight: bold;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        `;
        icon.onclick = () => this.expand();
        
        this.container.appendChild(icon);
        this.collapsedIcon = icon;
        
        // Make draggable
        this.makeDraggable(icon);
    }
    
    makeDraggable(element) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        
        element.style.cursor = 'move';
        
        element.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = element.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            // Update position
            this.position.x = startLeft + deltaX;
            this.position.y = startTop + deltaY;
            
            // Snap to left or right edge
            const viewportWidth = window.innerWidth;
            const centerX = this.position.x + (element.offsetWidth / 2);
            
            if (centerX < viewportWidth / 2) {
                this.side = 'left';
                this.position.x = 20;
            } else {
                this.side = 'right';
                this.position.x = viewportWidth - element.offsetWidth - 20;
            }
            
            // Update container position
            this.container.style.left = this.side === 'left' ? `${this.position.x}px` : 'auto';
            this.container.style.right = this.side === 'right' ? `${this.position.x}px` : 'auto';
            this.container.style.top = `${this.position.y}px`;
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
            this.savePosition();
        });
    }
    
    expand() {
        this.isExpanded = true;
        this.createExpandedPanel();
    }
    
    collapse() {
        this.isExpanded = false;
        this.createCollapsedIcon();
    }
    
    updateCredentialStatus() {
        if (!this.container) return;
        
        const statusDiv = document.getElementById('bg-credential-status');
        if (!statusDiv) return;
        
        if (this.credentialsStatus === true) {
            statusDiv.textContent = '✓ Server Credentials Found';
            statusDiv.style.background = '#1a4d1a';
            statusDiv.style.color = '#90ee90';
        } else {
            statusDiv.textContent = '⚠ Server Credentials Not Found - call your TechOps technician';
            statusDiv.style.background = '#4d3d1a';
            statusDiv.style.color = '#ffd700';
        }
    }
    
    setMode(mode) {
        const modeMap = {
            'MANUAL': 'MANUAL',
            'LOWEST PRICE': 'LOWEST_PRICE',
            'LOCAL': 'LOCAL'
        };
        this.globalMode = modeMap[mode];
        this.saveState();
        this.createExpandedPanel(); // Refresh UI
    }
    
    showDailySpendDialog() {
        // TODO: Implement detailed cost breakdown dialog
        alert('Daily Spend breakdown dialog - Coming in next phase');
    }
    
    showCloudNodesDialog() {
        // TODO: Implement Cloud Nodes popover
        alert('Cloud Nodes management dialog - Coming in next phase');
    }
    
    saveState() {
        try {
            const state = {
                globalMode: this.globalMode,
                nodeStates: this.nodeStates,
                position: this.position,
                side: this.side,
                isExpanded: this.isExpanded
            };
            localStorage.setItem('budgetguard_state', JSON.stringify(state));
        } catch (e) {
            console.error('Failed to save BudgetGuard state:', e);
        }
    }
    
    loadState() {
        try {
            const state = localStorage.getItem('budgetguard_state');
            if (state) {
                const parsed = JSON.parse(state);
                this.globalMode = parsed.globalMode || 'MANUAL';
                this.nodeStates = parsed.nodeStates || {};
                this.position = parsed.position || { x: 20, y: 100 };
                this.side = parsed.side || 'left';
                this.isExpanded = parsed.isExpanded !== false;
            }
        } catch (e) {
            console.error('Failed to load BudgetGuard state:', e);
        }
    }
    
    savePosition() {
        this.saveState();
    }
}

// Initialize GUI when ComfyUI loads
if (typeof app !== 'undefined') {
    app.registerExtension({
        name: "BudgetGuard.GUI",
        async setup() {
            const gui = new BudgetGuardGUI();
            gui.loadState();
        }
    });
} else {
    // Fallback for development/testing
    console.warn("BudgetGuard: ComfyUI app not found, GUI will not initialize");
}

