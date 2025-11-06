# BudgetGuard Artists - Skeletal Implementation

## Overview

This document describes the skeletal implementation of the BudgetGuard node for ComfyUI. This is a **pre-alpha** implementation that provides the core structure and passthrough functionality, allowing the node to be used in workflows immediately while cost estimation and routing features are developed.

## What's Implemented

### ✅ Python Node Backend (`nodes/BudgetGuardNode.py`)

- **ComfyUI Custom Node Structure**: Full node class with proper ComfyUI integration
- **Input Types**: 
  - Provider dropdown (AWS, Azure, GCP, Local, NVIDIA-hosted)
  - GPU tier dropdown (T4, A10G, A100)
  - Common NIM inputs (model, prompt, negative_prompt, seed, steps, cfg_scale, width, height)
- **Passthrough Functionality**: All inputs are passed through unchanged to downstream nodes
- **Node Registration**: Properly registered with ComfyUI's node system

### ✅ JavaScript GUI Frontend (`web/budgetguard_gui.js`)

- **Draggable Control Panel**: Fixed to viewport (not graph), can be dragged to left/right edges
- **Expandable/Collapsible**: Can collapse to small icon, expand to full panel
- **Node Detection**: Automatically appears when BudgetGuard nodes are added to graph
- **Credential Status**: Checks localStorage and displays status (✓ Found / ⚠ Not Found)
- **Mode Toggle**: Three-way toggle (MANUAL / LOWEST PRICE / LOCAL) - UI only, logic coming later
- **Daily Spend UI**: Button and "SPENT TODAY" display (placeholder, functionality coming later)
- **State Persistence**: Saves position, mode, and node states to localStorage
- **Edge Snapping**: Automatically snaps to left or right edge when dragged

### ✅ Package Structure

```
BudgetGuard_Artists/
├── __init__.py                 # Package init, registers nodes
├── nodes/
│   ├── __init__.py
│   └── BudgetGuardNode.py     # Main node implementation
├── web/
│   ├── __init__.js            # JavaScript entry point
│   └── budgetguard_gui.js     # GUI control panel
├── README.md                   # Updated with implementation status
├── INSTALLATION.md             # Installation instructions
├── requirements.txt            # Dependencies (currently empty)
└── SKELETAL_IMPLEMENTATION.md # This file
```

## What's NOT Implemented (Coming Soon)

### ❌ Cost Estimation
- API integration with AWS, Azure, GCP pricing APIs
- NVIDIA NIM pricing API integration
- Pre-run cost estimates
- Post-run cost tracking

### ❌ Provider Routing
- Endpoint URL switching based on provider selection
- Credential-based authentication
- Local Docker container routing

### ❌ Daily Spend Tracking
- Actual cost calculation
- Idle cost tracking
- Daily reset at midnight
- Detailed cost breakdown dialog

### ❌ Cloud Nodes Management
- Container ON/OFF toggling
- Status polling
- Startup progress indicators

### ❌ Mode Logic
- LOWEST PRICE mode calculation
- Automatic provider switching
- Manual mode state management

## Current Behavior

### Passthrough Mode
- **Works Immediately**: Node functions as transparent proxy
- **No Setup Required**: Can be used in workflows right away
- **No Authentication Needed**: Passthrough works without credentials

### GUI Behavior
- **Appears Automatically**: Shows when BudgetGuard nodes are in graph
- **Credential Status**: Shows warning if credentials not found (but node still works)
- **UI Placeholders**: Buttons and toggles are visible but show alerts for now

## Testing

### Manual Testing Steps

1. **Install in ComfyUI:**
   - Copy `BudgetGuard_Artists` to `ComfyUI/custom_nodes/`
   - Restart ComfyUI

2. **Verify Node Appears:**
   - Right-click in graph → Look for "BudgetGuard" category
   - Add a BudgetGuard node

3. **Test Passthrough:**
   - Connect BudgetGuard between LoadNIM and a generation node
   - Workflow should function normally

4. **Test GUI:**
   - GUI panel should appear when node is added
   - Should be draggable
   - Should expand/collapse
   - Credential status should display

## Known Limitations

1. **Fixed Input Types**: Currently hardcoded to common NIM inputs. Will need dynamic input detection in future.
2. **No Actual Routing**: Provider selection doesn't change endpoint (passthrough only)
3. **GUI Placeholders**: Daily Spend and Cloud Nodes buttons show alerts
4. **No Cost Calculation**: All cost features are placeholders
5. **State Management**: Basic localStorage only, no backend sync

## Next Steps

1. **Phase 1**: Implement credential reading from backend config
2. **Phase 2**: Add endpoint routing based on provider selection
3. **Phase 3**: Integrate pricing APIs for cost estimation
4. **Phase 4**: Implement daily spend tracking
5. **Phase 5**: Add Cloud Nodes management

## Notes for Developers

- The node is designed to be **non-breaking** - it works as passthrough even without full implementation
- All TODOs are marked in code for future implementation
- GUI uses vanilla JavaScript (no frameworks) for ComfyUI compatibility
- State persistence uses browser localStorage (client-side only)

