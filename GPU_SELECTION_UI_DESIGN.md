# GPU Selection UI Design for Artists

## Overview

Artists need to select GPU tiers when using BudgetGuard nodes. GPU selection appears in two places:
1. **Individual BudgetGuard Node** - GPU dropdown (hidden if only one tier available)
2. **Cloud Nodes Popover** - GPU radio selector above checkbox grid

## BudgetGuard Node UI

### When Multiple GPU Tiers Available

```
┌─────────────────────────────┐
│ BudgetGuard Node             │
├─────────────────────────────┤
│ Provider: [AWS ▼]           │
│ GPU Tier:  [A10G ▼]        │
│                             │
│ Cost Est: $0.004/image      │
│ Time Est:  15-30s/image     │
│                             │
│ [Input] → [Output]          │
└─────────────────────────────┘
```

**GPU Tier Dropdown Options**:
- T4 (Cost-Effective) - $0.50/hr, 30-60s/image
- A10G (Recommended) - $1.00/hr, 15-30s/image ⭐
- A100 (Fastest) - $32.00/hr, 5-15s/image

### When Only One GPU Tier Available

```
┌─────────────────────────────┐
│ BudgetGuard Node             │
├─────────────────────────────┤
│ Provider: [AWS ▼]           │
│                             │
│ Cost Est: $0.004/image      │
│ Time Est:  15-30s/image     │
│                             │
│ [Input] → [Output]          │
└─────────────────────────────┘
```

**Note**: GPU dropdown is **hidden** (only one tier available, no choice needed)

## Cloud Nodes Popover UI

### GPU Selection Above Grid

```
┌─────────────────────────────────────────────────────────┐
│ Cloud Nodes - Container Status                           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ GPU Tier Selection (Radio Buttons):                     │
│  ○ T4 (Cost-Effective)   ○ A10G (Recommended) ⭐       │
│  ○ A100 (Fastest)                                        │
│                                                          │
│ ℹ️ Container Information:                                │
│ • Containers take ~60 seconds to start when toggled ON  │
│ • Cost: ~$0.04/hour when idle (running but not          │
│   processing)                                            │
│ • All containers (AWS, Azure, GCP) start OFF by default│
│ • GPU workloads require manual control                  │
│ • Turn containers OFF when done to save costs            │
│                                                          │
│ ┌──────────────────────────────────────────────────┐   │
│ │ Node          │ AWS  │ Azure │ GCP                │   │
│ ├──────────────────────────────────────────────────┤   │
│ │ FLUX Dev      │ ☑   │ ☐    │ ☐                  │   │
│ │ FLUX Canny    │ ☐   │ ☑    │ ☐                  │   │
│ │ FLUX Depth    │ ☐   │ ☐    │ ☐                  │   │
│ │ FLUX Kontext  │ ☐   │ ☐    │ ☐                  │   │
│ │ SDXL          │ ☐   │ ☐    │ ☑                  │   │
│ │ ...           │ ... │ ...  │ ...                │   │
│ └──────────────────────────────────────────────────┘   │
│                                                          │
│ Info: Grid shows containers for selected GPU tier.       │
│       Switch GPU tier to see/manage different tiers.     │
│                                                          │
│ [Apply Changes] [Refresh] [Close]                        │
└─────────────────────────────────────────────────────────┘
```

### Behavior

1. **GPU Tier Selection**: Radio buttons above grid
2. **Grid Filtering**: Grid shows only containers for selected GPU tier
3. **Switching Tiers**: When artist changes GPU tier, grid updates to show that tier's containers
4. **Toggle ON/OFF**: Checkboxes control containers for selected GPU tier only

### Example Workflow

1. Artist opens "Cloud Nodes" popover
2. Sees "A10G" selected by default (or last used)
3. Grid shows FLUX Dev (AWS A10G), FLUX Canny (Azure A10G), etc.
4. Artist switches to "T4" radio button
5. Grid updates to show FLUX Dev (AWS T4), FLUX Canny (Azure T4), etc.
6. Artist can toggle T4 containers ON/OFF
7. Switch back to "A10G" to manage A10G containers

### When Only One GPU Tier Available

```
┌─────────────────────────────────────────────────────────┐
│ Cloud Nodes - Container Status                           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ ℹ️ Container Information:                                │
│ • Containers take ~60 seconds to start when toggled ON  │
│ • Cost: ~$0.04/hour when idle                           │
│ • All containers (AWS, Azure, GCP) start OFF by default │
│                                                          │
│ ┌──────────────────────────────────────────────────┐   │
│ │ Node          │ AWS  │ Azure │ GCP                │   │
│ ├──────────────────────────────────────────────────┤   │
│ │ FLUX Dev      │ ☑   │ ☐    │ ☐                  │   │
│ │ FLUX Canny    │ ☐   │ ☑    │ ☐                  │   │
│ │ ...           │ ... │ ...  │ ...                │   │
│ └──────────────────────────────────────────────────┘   │
│                                                          │
│ [Apply Changes] [Refresh] [Close]                        │
└─────────────────────────────────────────────────────────┘
```

**Note**: GPU tier selector is **hidden** (only one tier available, no choice needed)

## Implementation Logic

### Detecting Available GPU Tiers

```javascript
// Check endpoint metadata for available GPU tiers
const availableTiers = getAvailableGPUTiers(nodeType, provider);
// Returns: ['t4', 'a10g', 'a100'] or ['a10g'] (single tier)

// Show GPU dropdown if multiple tiers
if (availableTiers.length > 1) {
    showGPU dropdown();
} else {
    hideGPU dropdown();
    // Use single available tier automatically
}
```

### Routing Logic

```javascript
// Artist selects: Provider=AWS, GPU=A10G
const endpoint = getEndpoint(nodeType, provider, gpuTier);
// Returns: "https://nim-flux-dev-a10g-aws.aws.com"

// Route request to endpoint
routeToEndpoint(endpoint);
```

### Cloud Nodes Popover Filtering

```javascript
// Artist selects GPU tier: "A10G"
const selectedTier = getSelectedGPUTier(); // "a10g"

// Filter containers to show only selected tier
const containers = getAllContainers().filter(container => 
    container.gpu_tier === selectedTier
);

// Update grid to show filtered containers
updateCheckboxGrid(containers);
```

## State Management

### Per-Node GPU Selection
- Store GPU tier selection per BudgetGuard node (in localStorage)
- Default to "A10G" if available, otherwise use only available tier
- Restore selection when node is loaded

### Cloud Nodes Popover GPU Selection
- Store selected GPU tier in localStorage (global, not per-node)
- Default to "A10G" if available
- Restore last selected tier when popover opens

### Provider + GPU Combination
- Track selected provider + GPU tier per node
- In LOWEST PRICE mode, calculate lowest cost across all provider + GPU combinations
- Example: Compare AWS T4 vs AWS A10G vs Azure A10G vs GCP A10G

## Cost Display Updates

### Node UI Cost Estimate
- Update when GPU tier changes
- Show cost based on selected GPU tier + provider
- Example: "A10G + AWS = $0.004/image"

### Cloud Nodes Popover
- Show cost per hour for selected GPU tier
- Update cost display when GPU tier changes
- Show total cost for all running containers of selected tier

## Summary

### TechOps GUI
- Radio button for GPU tier selection above checkbox grid
- Deploy each GPU tier separately (one deployment per GPU tier)
- Hide GPU selector when "Deploy Local Only" is checked

### Artist BudgetGuard Node
- GPU dropdown (hidden if only one tier available)
- Shows cost/performance based on selected GPU tier

### Artist Cloud Nodes Popover
- GPU tier radio selector above checkbox grid
- Grid filtered by selected GPU tier
- Hide GPU selector if only one tier available

