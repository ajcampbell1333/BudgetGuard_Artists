# Cloud Nodes Management Feature

## Overview

The Cloud Nodes feature allows artists to control which cloud containers are running, saving costs by turning off idle containers.

## User Interface

### Access Point
- **Location**: BudgetGuard Settings GUI → "Cloud Nodes" button
- **Appears**: Below the DAILY SPEND button and SPENT TODAY display (in main GUI)
- **Visibility**: Only shown when credentials are installed

**Note**: DAILY SPEND and SPENT TODAY are in the **main BudgetGuard Settings GUI**, not in this popover dialog.

### Popover Dialog

When the artist clicks "Cloud Nodes", a popover dialog appears with:

#### Title
**"Cloud Nodes - Container Status"**

#### GPU Tier Selection (If Multiple Tiers Available)
```
GPU Tier Selection (Radio Buttons):
 ○ T4 (Cost-Effective)   ○ A10G (Recommended) ⭐   ○ A100 (Fastest)
```

**Behavior**:
- **Visible**: Only if multiple GPU tiers are available for deployed containers
- **Hidden**: If only one GPU tier is available (no choice needed)
- **Grid Filtering**: Checkbox grid shows only containers for selected GPU tier
- **Switching**: When artist changes GPU tier, grid updates to show that tier's containers

#### Information Banner
```
ℹ️ Container Information:
• Containers take ~60 seconds to start when toggled ON
• Cost: ~$0.04/hour when idle (running but not processing)
• All containers (AWS, Azure, GCP) start OFF by default
• GPU workloads require manual control (no auto-scale-to-zero)
• Turn containers OFF when done to save costs
```

#### Checkbox Grid

**Header Row:**
- Column 1: "Node" (node type name)
- Column 2: "AWS" (checkbox column)
- Column 3: "Azure" (checkbox column)
- Column 4: "GCP" (checkbox column)

**Note**: Grid shows containers for the **selected GPU tier only**. Switch GPU tier to see/manage different tiers.

**Data Rows:**
- One row per node type that has deployed containers
- Each row shows:
  - Node type name (e.g., "FLUX Dev")
  - AWS checkbox: ✅ checked = ON, ☐ unchecked = OFF
  - Azure checkbox: ✅ checked = ON, ☐ unchecked = OFF
  - GCP checkbox: ✅ checked = ON, ☐ unchecked = OFF
  - **Note**: All cloud providers require manual toggle (GPU workloads need manual control)

#### Status Indicators

**Checkbox States:**
- ✅ **Checked**: Container is ON (running)
- ☐ **Unchecked**: Container is OFF (stopped)
- ⏳ **Loading**: Container is starting (60 second countdown)
- ❌ **Error**: Failed to start/stop

**All Providers:**
- All cloud containers (AWS, Azure, GCP) require manual toggle
- GPU workloads need manual control (no auto-scale-to-zero available)
- Cost: ~$0.04/hour when idle for all providers

#### Buttons

- **"Apply Changes"**: Starts/stops selected containers
- **"Refresh Status"**: Updates all container states
- **"Close"**: Closes the dialog

#### Real-time Updates

- Status polling every 5 seconds when dialog is open
- Shows startup progress (countdown timer when starting)
- Updates checkbox states as containers start/stop

## Technical Implementation

### Data Model

```javascript
{
  "cloud_nodes": {
    "FLUX Dev": {
      "t4": {
        "aws": {
          "instance_name": "flux-dev-t4-aws-1234567890",
          "endpoint": "http://...",
          "status": "stopped",
          "region": "us-east-1",
          "gpu_tier": "t4"
        },
        "azure": { ... },
        "gcp": { ... }
      },
      "a10g": {
        "aws": {
          "instance_name": "flux-dev-a10g-aws-1234567890",
          "endpoint": "http://...",
          "status": "stopped",
          "region": "us-east-1",
          "gpu_tier": "a10g"
        },
        "azure": { ... },
        "gcp": { ... }
      },
      "a100": {
        "aws": {
          "instance_name": "flux-dev-a100-aws-1234567890",
          "endpoint": "http://...",
          "status": "stopped",
          "region": "us-east-1",
          "gpu_tier": "a100"
        },
        "azure": { ... },
        "gcp": { ... }
      }
    },
      "azure": {
        "instance_name": "nim-flux-dev-1234567890",
        "endpoint": "http://...",
        "status": "stopped",
        "region": "eastus"
      },
      "gcp": {
        "instance_name": "nim-flux-dev-1234567890",
        "endpoint": "http://...",
        "status": "running", // Always "running" (auto-scales to zero)
        "region": "us-central1"
      }
    },
    // ... more nodes
  }
}
```

### API Calls

#### Get Container Status
```javascript
// Read from localStorage (populated by TechOps credential installation)
const cloudNodes = JSON.parse(localStorage.getItem('budgetguard_cloud_nodes'));

// Or fetch from backend API
fetch('/budgetguard/api/cloud-nodes/status')
  .then(res => res.json())
  .then(data => updateUI(data));
```

#### Cost Tracking
```javascript
// Get cost estimates before workflow execution
// NIM API provides usage metrics (GPU hours, tokens, etc.)
fetch('/budgetguard/api/cost-estimate', {
  method: 'POST',
  body: JSON.stringify({ node_type: 'FLUX Dev', provider: 'aws', params: {...} })
})
  .then(res => res.json())
  .then(estimate => {
    // Show estimated cost before run
    displayEstimate(estimate);
  });

// Get actual costs after workflow execution
// NIM API provides actual usage metrics
fetch('/budgetguard/api/cost-actual', {
  method: 'POST',
  body: JSON.stringify({ workflow_id: '...', node_type: 'FLUX Dev', provider: 'aws' })
})
  .then(res => res.json())
  .then(actual => {
    // Update daily spend with actual cost
    updateDailySpend(actual.cost);
  });
```

#### Start Container (AWS/Azure)
```javascript
fetch('/budgetguard/api/cloud-nodes/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    provider: 'aws', // or 'azure'
    instance_name: 'nim-flux-dev-1234567890'
  })
});
```

#### Stop Container (AWS/Azure)
```javascript
fetch('/budgetguard/api/cloud-nodes/stop', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    provider: 'aws', // or 'azure'
    instance_name: 'nim-flux-dev-1234567890'
  })
});
```

### Backend Endpoints (Python)

#### GET /budgetguard/api/cloud-nodes/status
Returns current status of all containers.

#### POST /budgetguard/api/cloud-nodes/start
Starts a container (AWS/Azure only).

#### POST /budgetguard/api/cloud-nodes/stop
Stops a container (AWS/Azure only).

### Startup Flow

1. Artist clicks checkbox to turn container ON
2. UI shows ⏳ loading state
3. Backend API call to start container
4. Polling begins (every 2 seconds)
5. Show countdown timer (60 seconds)
6. When container is ready, checkbox shows ✅ checked
7. Status updates to "running"

### Cost Savings & Daily Spend Tracking

**Scenario: Artist uses FLUX Dev 1 hour/day**

- **Without manually stopping**: Container runs 24/7 = $0.96/day = $29/month
- **With manual stop after use**: Container runs 1 hour = $0.04/day = $1.20/month
- **Savings**: $27.80/month per container

**Daily Spend Tracking:**
- Artists see real-time cost accumulation in "SPENT TODAY" display
- Includes both workflow execution costs and container idle costs
- Helps artists understand impact of leaving containers running
- Encourages responsible cost management through visibility

## User Experience Notes

### When to Turn Containers ON
- Before starting a workflow that uses that node
- Allow 60 seconds for startup
- Containers stay ON until manually turned off

### When to Turn Containers OFF
- After finishing a workflow session
- When taking a break
- To save costs during idle periods

### GCP Containers
- No action needed - they auto-scale to zero
- Show as "Always On" but actually scale down when idle
- No cost when idle (scaled to zero)

## Error Handling

- **Network errors**: Show retry button
- **Authentication errors**: Redirect to credential status check
- **Startup timeout**: Show error, allow retry
- **Stop failures**: Show warning but allow retry

## Future Enhancements

- Auto-start containers when workflow begins (if not already running)
- Auto-stop containers after X minutes of inactivity
- Cost calculator showing estimated cost for current selections
- Batch operations (start all, stop all)

