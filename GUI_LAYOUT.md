# BudgetGuard Settings GUI Layout

## Main GUI Structure

The BudgetGuard Settings GUI appears when at least one BudgetGuard node is placed in the graph.

```
┌─────────────────────────────────────────┐
│  BudgetGuard Settings                   │
├─────────────────────────────────────────┤
│  [DAILY SPEND]  ┌──────────────┐       │
│                 │ SPENT TODAY   │       │
│                 │ $X.XX    [?]  │       │
│                 └──────────────┘       │
├─────────────────────────────────────────┤
│  ○ MANUAL  ○ LOWEST PRICE  ○ LOCAL     │
├─────────────────────────────────────────┤
│  [Cloud Nodes]                          │
├─────────────────────────────────────────┤
│  ✓ Server Credentials Found            │
│  (or: ⚠ Server Credentials Not Found)  │
└─────────────────────────────────────────┘
```

## Component Details

### 1. Title
**"BudgetGuard Settings"**
- Always visible at top of GUI

### 2. DAILY SPEND Button
- **Location**: Main GUI, below title
- **Action**: Opens detailed cost breakdown dialog
- **Not in**: Cloud Nodes popover

### 3. SPENT TODAY Display
- **Location**: Main GUI, next to or below DAILY SPEND button
- **Format**: Bordered div showing `$X.XX` or `$X.XX / $Y.YY`
- **Tooltip**: ? icon with explanation about $0.04/hour being an estimate
- **Updates**: Real-time as workflows execute and containers run
- **Not in**: Cloud Nodes popover

### 4. Mode Toggle
- **Location**: Main GUI, below SPENT TODAY
- **Options**: MANUAL / LOWEST PRICE / LOCAL (three-way toggle)

### 5. Cloud Nodes Button
- **Location**: Main GUI, below mode toggle
- **Action**: Opens Cloud Nodes popover dialog
- **Visibility**: Only shown when credentials are installed

### 6. Credential Status
- **Location**: Main GUI, at bottom
- **Shows**: 
  - "✓ Server Credentials Found" (green) - when credentials installed
  - "⚠ Server Credentials Not Found" (yellow) - when credentials missing

## Cloud Nodes Popover Dialog

**Separate from main GUI**, opened by clicking "Cloud Nodes" button:

```
┌─────────────────────────────────────────┐
│  Cloud Nodes - Container Status         │
├─────────────────────────────────────────┤
│  ℹ️ Container Information:              │
│  • Containers take ~60 seconds to start│
│  • Cost: ~$0.04/hour when idle          │
│  ...                                    │
├─────────────────────────────────────────┤
│  Node          AWS  Azure  GCP          │
│  FLUX Dev      ☐    ☐     ☐           │
│  FLUX Canny    ☐    ☐     ☐           │
│  ...                                    │
├─────────────────────────────────────────┤
│  [Apply Changes] [Refresh] [Close]      │
└─────────────────────────────────────────┘
```

## Key Points

- **DAILY SPEND** and **SPENT TODAY** are in the **main GUI**, always visible
- **Cloud Nodes** is a **popover dialog**, opened separately
- Main GUI is always visible when BudgetGuard nodes are in graph
- Popover is modal, opens on top of main GUI

