# BudgetGuard Artists - ComfyUI Custom Node Package

# Import and register the BudgetGuard node
from .nodes.BudgetGuardNode import NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS

# ComfyUI will automatically discover NODE_CLASS_MAPPINGS
__all__ = ['NODE_CLASS_MAPPINGS', 'NODE_DISPLAY_NAME_MAPPINGS']

