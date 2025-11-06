# BudgetGuard Artists Installation

## Installation for ComfyUI

BudgetGuard Artists is installed as a ComfyUI custom node.

### Method 1: Manual Installation

1. **Navigate to your ComfyUI custom nodes directory:**
   ```bash
   cd ComfyUI/custom_nodes
   ```

2. **Clone or copy BudgetGuard_Artists:**
   ```bash
   git clone <repository-url> BudgetGuard_Artists
   # OR copy the BudgetGuard_Artists directory here
   ```

3. **Restart ComfyUI**

4. **Verify installation:**
   - Open ComfyUI
   - Look for "BudgetGuard" in the node menu (under "BudgetGuard" category)
   - Add a BudgetGuard node to your workflow

### Method 2: Git Submodule (Recommended for Development)

```bash
cd ComfyUI/custom_nodes
git submodule add <repository-url> BudgetGuard_Artists
```

## File Structure

```
BudgetGuard_Artists/
├── __init__.py                 # Package initialization
├── nodes/
│   ├── __init__.py
│   └── BudgetGuardNode.py     # Python node implementation
├── web/
│   ├── __init__.js            # JavaScript entry point
│   └── budgetguard_gui.js     # GUI control panel
├── README.md                   # This file
└── INSTALLATION.md            # Installation instructions
```

## Verification

After installation:

1. **Check node appears in ComfyUI:**
   - Open ComfyUI
   - Right-click in the node graph
   - Look for "BudgetGuard" → "BudgetGuard" node

2. **Test passthrough:**
   - Add a BudgetGuard node to your workflow
   - Connect it between LoadNIM and a generation node
   - Your workflow should function normally (passthrough mode)

3. **Check GUI appears:**
   - When you add a BudgetGuard node, a control panel should appear
   - It should be draggable and expandable/collapsible
   - Credential status should be displayed

## Current Status

**Skeletal Implementation Complete:**
- ✅ Node structure and passthrough functionality
- ✅ Provider and GPU tier dropdowns
- ✅ Basic GUI control panel
- ✅ Credential status detection
- ✅ State persistence (localStorage)

**Coming Soon:**
- Cost estimation and API integration
- Provider routing
- Daily spend tracking
- Cloud Nodes management

## Troubleshooting

**Node doesn't appear:**
- Check that files are in `ComfyUI/custom_nodes/BudgetGuard_Artists/`
- Restart ComfyUI
- Check browser console for JavaScript errors

**GUI doesn't appear:**
- Check browser console for errors
- Verify `web/__init__.js` and `web/budgetguard_gui.js` exist
- Hard refresh browser (Ctrl+F5)

**Passthrough not working:**
- Verify node is connected correctly in workflow
- Check Python console for errors
- Ensure downstream NIM node is properly configured

