# BudgetGuard for Artists

ComfyUI custom node that provides cost estimation and budget management for NVIDIA NIM nodes across multiple cloud providers.

## ⚠️ Pre-Alpha Disclaimer

**BudgetGuard is currently in PRE-ALPHA status and has NOT been tested in production environments.**

- This software is provided "as-is" for demonstration and development purposes
- Many features are incomplete or non-functional (see [NOOP_ANALYSIS.md](./NOOP_ANALYSIS.md))
- Do NOT use in production workflows or with real cloud credentials until further notice
- The passthrough functionality works, but cost estimation, provider routing, and other advanced features are placeholders
- Use at your own risk - no warranties or guarantees are provided

**For developers and early testers only.**

## Overview

BudgetGuard is a ComfyUI node designed to help artists optimize costs when using NIM (NVIDIA Inference Microservices) nodes in their workflows. It allows you to compare pricing across AWS, Azure, GCP, and NVIDIA NIM, and automatically route to the lowest-cost provider.

**No technical knowledge required** - BudgetGuard handles all the complexity of cloud provider authentication and routing so you can focus on your creative work.

**Related Project**: This is the ComfyUI custom node for artists. For the backend deployment tool that TechOps teams use to deploy cloud infrastructure, see **[BudgetGuard TechOps](https://github.com/ajcampbell1333/BudgetGuard_TechOps)**.

## Quick Start

1. **Add BudgetGuard node** to your workflow (place it between LoadNIM and your generation node)
2. **Connect your workflow** - BudgetGuard works immediately as a passthrough
3. **Check credential status** - Open the BudgetGuard control panel to see if credentials are installed
4. **Choose your mode** (if credentials are installed):
   - **MANUAL**: Select your preferred provider for each node
   - **LOWEST PRICE**: Let BudgetGuard automatically choose the cheapest provider

## Features

### Cost Estimation
- See cost estimates before running your workflow
- Compare pricing across AWS, Azure, GCP, and NVIDIA NIM
- Make informed decisions about which provider to use

### Provider Selection
- **MANUAL Mode**: Choose your preferred provider for each node (AWS, Azure, GCP, or Local)
- **LOWEST PRICE Mode**: Automatically use the cheapest cloud provider
- **LOCAL Mode**: Route all NIM nodes to local containers (no cloud costs, uses local Docker)
- Switch between modes with one click

### Global Control Panel
- Draggable control panel that appears when you add BudgetGuard nodes
- Expand/collapse to save screen space
- Position it anywhere on screen - it stays accessible when you pan/zoom your graph

### Daily Spend Tracking
- **DAILY SPEND button**: View detailed cost breakdown for the day
- **SPENT TODAY display**: Real-time total showing:
  - Actual costs from running workflows (per-request costs from NIM API or provider APIs)
  - Estimated idle costs for containers currently running (~$0.04/hour per container)
  - Running total resets daily at midnight
- **Tooltip (? icon)**: Explains that $0.04/hour is an estimated average, not exact billing
- Helps artists track and manage their cloud spending
- **Note**: Cost tracking uses NIM API usage metrics when available, falls back to provider pricing APIs

## How It Works

### Workflow Setup

```
[LoadNIM Node] → [BudgetGuard Node] → [FLUX NIM Node] → [Output]
```

Simply place BudgetGuard between LoadNIM and your generation node. BudgetGuard acts as a transparent proxy - your workflow works exactly the same, but now you have cost control.

### Authentication Status

BudgetGuard automatically detects if credentials are installed. You'll see one of two status messages:

**✓ Server Credentials Found** (Green)
- Credentials are already installed and configured
- You can use all BudgetGuard features immediately
- No setup needed - just start using cost features!

**⚠ Server Credentials Not Found** (Yellow)
- Credentials need to be installed by your TechOps team
- Contact your TechOps technician to set up BudgetGuard
- BudgetGuard nodes still work as passthrough, but cost features are disabled

**Note**: BudgetGuard nodes work immediately as passthrough - you can build your entire workflow first. Cost features become available once TechOps installs credentials.

**For Small Studios Without TechOps:**
- You'll need to use the BudgetGuard TechOps Python tool yourself
- See [BudgetGuard TechOps](https://github.com/ajcampbell1333/BudgetGuard_TechOps) for instructions
- Run `install-credentials` command to set up your workstation

## Usage

### Setting Up Your Workflow

1. Add a BudgetGuard node to your workflow
2. Place it between LoadNIM and your generation node (FLUX NIM Node, etc.)
3. Connect all your inputs/outputs as normal
4. Your workflow works immediately - no setup required!

### Using Cost Features

1. **Click the BudgetGuard icon** (appears at the edge of your screen)
2. **Check credential status**:
   - If you see "✓ Server Credentials Found" (green) - you're ready to go!
   - If you see "⚠ Server Credentials Not Found" (yellow) - contact TechOps
3. **Monitor daily spending**:
   - View **SPENT TODAY** display for current day's total
   - Click **DAILY SPEND** button for detailed cost breakdown
   - Track costs from workflow executions and container idle time
4. **Choose your mode**:
   - **MANUAL**: Select providers manually from each node's dropdown (AWS, Azure, GCP, Local)
   - **LOWEST PRICE**: Automatically use cheapest cloud provider
   - **LOCAL**: Route all NIM nodes to local containers (no cloud costs)
5. **Manage Cloud Nodes** (if using cloud providers):
   - Click **"Cloud Nodes"** button in BudgetGuard Settings
   - View all deployed containers and their ON/OFF status
   - Toggle containers ON before running workflows (60 second startup for all providers)
   - Turn containers OFF when done to save costs (~$0.04/hour when idle)
   - **Important**: All cloud containers cost money while running, even when idle. Turn them off when not in use!
   - **Note**: GPU workloads require manual control (no auto-scale-to-zero available)
6. **View cost estimates** before running your workflow

### Switching Providers

- **In MANUAL mode**: Change the provider dropdown on any BudgetGuard node
- **In LOWEST PRICE mode**: BudgetGuard automatically selects the cheapest provider
- Switch back to MANUAL anytime to restore your manual selections

## Getting Started with Cloud Deployment

### Getting Started

**Local NIM (No Setup Needed)**:
- If you're using local NIM (InstallNIM/LoadNIM nodes), BudgetGuard works immediately
- No cloud setup required - just add the node and use it
- Cost features require TechOps credential installation

**Cloud NIM (Requires TechOps Setup)**:
1. **Ask your TechOps team** to:
   - Deploy NIM instances to cloud providers (AWS, Azure, GCP)
   - Install credentials on your workstation using BudgetGuard TechOps tool
2. **Check status in BudgetGuard**:
   - Open BudgetGuard control panel
   - Look for "✓ Server Credentials Found" (green) status
   - If you see "⚠ Server Credentials Not Found" (yellow), contact TechOps
3. **Start using**:
   - Once credentials are installed, you can switch between providers with one click
   - BudgetGuard automatically routes to the correct endpoint
   - No manual configuration needed - everything is handled automatically

**For Small Studios Without TechOps:**
- You'll need to use the BudgetGuard TechOps Python tool yourself
- Deploy NIM instances and install credentials using the TechOps tool
- See [BudgetGuard TechOps](https://github.com/ajcampbell1333/BudgetGuard_TechOps) for detailed instructions

### For TechOps Teams

See [BudgetGuard TechOps](https://github.com/ajcampbell1333/BudgetGuard_TechOps) for deployment automation tools.

## Development Plan

The Artists codebase is simpler than TechOps and can be developed more linearly. Here's the implementation roadmap:

**Note:** Many infrastructure components are provided by [BudgetGuard TechOps](https://github.com/ajcampbell1333/BudgetGuard_TechOps):
- ✅ **Credential installation** - TechOps installs credentials into ComfyUI backend config
- ✅ **Endpoint deployment** - TechOps deploys NIM containers to AWS, Azure, GCP
- ✅ **Endpoint export** - TechOps exports endpoint URLs in config format
- ✅ **Config file format** - TechOps defines and writes the config file structure

The Artists node primarily needs to **read** from the config file and **use** the endpoints that TechOps provides.

### Core Node & GUI ✅ SKELETAL IMPLEMENTATION COMPLETE
- [x] Create base ComfyUI custom node structure (Python)
- [x] Implement input/output passthrough to NIM nodes
- [x] Add provider dropdown (enum input) to each BudgetGuard node (AWS, Azure, GCP, Local)
- [x] Add GPU tier dropdown to each BudgetGuard node (T4, A10G, A100)
- [x] Create draggable GUI window component (JavaScript)
- [x] Implement expandable/collapsible GUI with edge snapping
- [x] Add node placement detection callbacks
- [x] Implement credential status detection (check localStorage for credentials)
- [x] Display status message: "✓ Server Credentials Found" or "⚠ Server Credentials Not Found"

### Mode Toggle & State Management ✅ PARTIALLY COMPLETE
- [x] Create simplified GUI with title "BudgetGuard Settings" (UI exists)
- [x] **Main GUI Layout:** (UI structure exists, needs logic)
  - [x] Title: "BudgetGuard Settings"
  - [x] DAILY SPEND button (UI placeholder exists)
  - [x] SPENT TODAY display (UI placeholder exists, shows "$0.00")
  - [x] Three-mode toggle: MANUAL / LOWEST PRICE / LOCAL (UI exists, buttons work visually)
  - [x] Cloud Nodes button (UI placeholder exists)
- [x] Implement data model to track all BudgetGuard nodes in graph (basic tracking exists)
- [x] Create per-node state storage (node ID → provider selection) (structure exists in GUI)
- [x] Add client-side state persistence (localStorage) (save/load functions exist)
- [ ] **Artists needs**: Implement MANUAL mode logic: Save and restore per-node provider selections (UI saves state, but doesn't sync to actual nodes)
- [ ] **Artists needs**: Implement LOWEST PRICE mode logic: Calculate and apply lowest-cost provider per node (requires cost estimation first)
- [ ] **Artists needs**: Implement mode switching logic (MANUAL ↔ LOWEST PRICE ↔ LOCAL) - currently only saves state, doesn't change behavior
- [ ] **Artists needs**: Add state restoration on graph load/workflow open (load function exists but may need refinement)

### Cost Estimation & API Integration
- [ ] Integrate AWS Pricing API (with authentication from localStorage)
- [ ] Integrate Azure Pricing API (with authentication from localStorage)
- [ ] Integrate GCP Pricing API (with authentication from localStorage)
- [ ] Integrate NVIDIA NIM pricing API (with authentication from localStorage)
- [ ] Parse downstream NIM node configuration
- [ ] Estimate compute requirements
- [ ] Implement cost calculation logic
- [ ] Display cost estimates in node UI
- [ ] Track actual costs per workflow execution
- [ ] Calculate idle costs for running containers (~$0.04/hour)
- [ ] Implement daily spend tracking (reset at midnight)
- [ ] Update SPENT TODAY display in real-time

### Provider Routing ✅ ENDPOINT INFRASTRUCTURE PROVIDED BY TECHOPS
- [x] **TechOps provides**: Endpoint deployment to AWS, Azure, GCP (via TechOps GUI)
- [x] **TechOps provides**: Endpoint export functionality (`export.py`)
- [x] **TechOps provides**: Endpoint URLs in config file format (`nim_endpoints` structure)
- [ ] **Artists needs**: Read endpoint URLs from ComfyUI backend config (`budgetguard_backend_config.json`)
- [ ] **Artists needs**: Implement endpoint routing based on provider selection
- [ ] **Artists needs**: Switch NIM endpoint URL based on selected provider (cloud or localhost)
- [ ] **Artists needs**: Route NIM API calls to configured endpoint
- [ ] **Artists needs**: Maintain NIM API compatibility regardless of provider choice
- [ ] **Artists needs**: Handle local routing (localhost Docker containers)

### Credential Reading ✅ INFRASTRUCTURE PROVIDED BY TECHOPS
- [x] **TechOps provides**: Credential installation tool (`install_credentials.py`) - writes to `ComfyUI/budgetguard/budgetguard_backend_config.json`
- [x] **TechOps provides**: Config file format defined (see [BudgetGuard TechOps](https://github.com/ajcampbell1333/BudgetGuard_TechOps))
- [x] **TechOps provides**: Credential encryption before writing to config
- [ ] **Artists needs**: Read credentials from ComfyUI backend config on startup (`budgetguard_backend_config.json`)
- [ ] **Artists needs**: Store credentials in localStorage (encrypted) after reading from config
- [ ] **Artists needs**: Validate credentials on startup
- [x] **Artists has**: Credential status display UI (placeholder exists)
- [ ] **Artists needs**: Implement credential status detection (check ComfyUI backend config for credentials)
  - Read `ComfyUI/budgetguard/budgetguard_backend_config.json` on startup
  - Detect if credentials exist and are valid
  - Update GUI status message: "✓ Server Credentials Found" or "⚠ Server Credentials Not Found"
  - Currently UI placeholder exists but reads from localStorage instead of actual config file

### Daily Spend Tracking (Main GUI Feature)
- [ ] Add DAILY SPEND button below title in **main BudgetGuard Settings GUI** (not in Cloud Nodes popover)
- [ ] Add SPENT TODAY bordered display div in **main GUI** showing daily cost total
- [ ] Add tooltip (? icon) next to SPENT TODAY explaining $0.04/hour is an estimate
- [ ] Implement cost tracking for workflow executions (per-request costs)
- [ ] Implement idle cost tracking for running containers (~$0.04/hour)
- [ ] Calculate and display real-time daily total
- [ ] Reset daily total at midnight (local time)
- [ ] Add color coding (green/yellow/red) based on budget limits (if configured)
- [ ] Create detailed cost breakdown dialog (opened by DAILY SPEND button)
- [ ] Show cost breakdown by provider, by workflow, by container
- [ ] **Note**: This is a main GUI feature, separate from Cloud Nodes popover

### Cloud Nodes Management (Container Toggle) ✅ INFRASTRUCTURE PROVIDED BY TECHOPS
- [x] **TechOps provides**: Container deployment to AWS (ECS on EC2), Azure (AKS), GCP (GKE)
- [x] **TechOps provides**: Container start/stop capability (via deployment scaling)
- [x] **TechOps provides**: Endpoint URLs for all deployed containers
- [x] **Artists has**: "Cloud Nodes" button in GUI (placeholder exists)
- [ ] **Artists needs**: Create popover dialog showing all deployed nodes with credentials
- [ ] **Artists needs**: Implement checkbox grid (Node × Provider × GPU Tier) showing ON/OFF status
- [ ] **Artists needs**: Show AWS, Azure, and GCP containers with ON/OFF toggle checkboxes
- [ ] **Artists needs**: Display cost information: ~$0.04/hour at idle, 60 second startup time
- [ ] **Artists needs**: Implement API calls to start/stop containers (AWS ECS/Azure AKS/GCP GKE APIs)
- [ ] **Artists needs**: Add status polling to update container state in real-time
- [ ] **Artists needs**: Show startup progress indicator (60 second countdown)
- [ ] **Artists needs**: Update SPENT TODAY when containers start/stop (idle cost tracking)

## Installation

BudgetGuard will be installed as a ComfyUI custom node. Installation instructions will be provided when available.

## Support

- **Technical questions**: See [BudgetGuard TechOps](https://github.com/ajcampbell1333/BudgetGuard_TechOps)
- **Usage questions**: Check this README or open an issue on GitHub

## License

(To be determined)

