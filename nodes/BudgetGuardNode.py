"""
BudgetGuard Node for ComfyUI

A transparent proxy node that sits between LoadNIM and NIM generation nodes,
providing cost estimation and multi-provider routing capabilities.
"""

import json
import logging
from typing import Dict, Any, Tuple

logger = logging.getLogger(__name__)


class BudgetGuardNode:
    """
    BudgetGuard custom node for ComfyUI
    
    This node acts as a transparent passthrough, forwarding all inputs to downstream
    NIM nodes while providing cost estimation and provider routing capabilities.
    """
    
    @classmethod
    def INPUT_TYPES(cls):
        """
        Define the input types for this node.
        This creates the UI inputs automatically in ComfyUI.
        """
        return {
            "required": {
                # Provider selection dropdown
                "provider": (
                    ["AWS", "Azure", "GCP", "Local", "NVIDIA-hosted"],
                    {
                        "default": "Local"
                    }
                ),
                # GPU tier selection dropdown (will be hidden if only one GPU available)
                "gpu_tier": (
                    ["T4", "A10G", "A100"],
                    {
                        "default": "A10G"
                    }
                ),
            },
            "optional": {
                # Passthrough inputs - these will be forwarded to downstream NIM nodes
                # The exact inputs depend on what NIM node comes after BudgetGuard
                # For now, we'll accept common NIM inputs
                "model": ("STRING", {"default": ""}),
                "prompt": ("STRING", {"multiline": True, "default": ""}),
                "negative_prompt": ("STRING", {"multiline": True, "default": ""}),
                "seed": ("INT", {"default": -1, "min": -1, "max": 0xffffffffffffffff}),
                "steps": ("INT", {"default": 20, "min": 1, "max": 1000}),
                "cfg_scale": ("FLOAT", {"default": 7.0, "min": 0.0, "max": 100.0}),
                "width": ("INT", {"default": 1024, "min": 64, "max": 8192}),
                "height": ("INT", {"default": 1024, "min": 64, "max": 8192}),
            }
        }
    
    RETURN_TYPES = ("STRING", "STRING", "STRING", "STRING", "INT", "INT", "FLOAT", "INT", "INT")
    RETURN_NAMES = ("model", "prompt", "negative_prompt", "seed", "steps", "cfg_scale", "width", "height")
    FUNCTION = "execute"
    CATEGORY = "BudgetGuard"
    
    def __init__(self):
        """Initialize the BudgetGuard node"""
        self.node_id = None  # Will be set by ComfyUI
        logger.info("BudgetGuard node initialized")
    
    def execute(self, provider: str, gpu_tier: str, model="", prompt="", negative_prompt="", 
                seed=-1, steps=20, cfg_scale=7.0, width=1024, height=1024):
        """
        Execute the BudgetGuard node - passthrough to downstream NIM nodes
        
        Args:
            provider: Selected cloud provider (AWS, Azure, GCP, Local, NVIDIA-hosted)
            gpu_tier: Selected GPU tier (T4, A10G, A100)
            model: Model identifier (passthrough)
            prompt: Generation prompt (passthrough)
            negative_prompt: Negative prompt (passthrough)
            seed: Random seed (passthrough)
            steps: Number of steps (passthrough)
            cfg_scale: CFG scale (passthrough)
            width: Image width (passthrough)
            height: Image height (passthrough)
            
        Returns:
            Tuple of outputs to pass to downstream nodes (passthrough)
        """
        logger.debug(f"BudgetGuard node executing - Provider: {provider}, GPU: {gpu_tier}")
        
        # TODO: In future phases, this will:
        # 1. Check credentials from localStorage/backend config
        # 2. Route to appropriate endpoint based on provider selection
        # 3. Estimate costs before execution
        # 4. Track costs after execution
        
        # For now, just passthrough all inputs unchanged
        # This allows the workflow to function immediately without any setup
        
        return (model, prompt, negative_prompt, seed, steps, cfg_scale, width, height)
    
    @classmethod
    def IS_CHANGED(cls, **kwargs):
        """
        Optional: Return a value that changes when the node should be re-executed.
        For passthrough, we can return a hash of inputs.
        """
        # For now, always re-execute (return True)
        # In future, we might cache based on provider/endpoint changes
        return True


# Node class mapping for ComfyUI
NODE_CLASS_MAPPINGS = {
    "BudgetGuardNode": BudgetGuardNode
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "BudgetGuardNode": "BudgetGuard"
}

