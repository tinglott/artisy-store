"""
Inventory matching: Match extracted invoice items against business inventory DB
Detects missing items and shortages
"""

from typing import List, Dict, Tuple
from difflib import SequenceMatcher
import json

class InventoryMatcher:
    def __init__(self, inventory_items: List[Dict]):
        """
        Initialize with business inventory
        inventory_items: [{sku, item_name, current_quantity, reorder_quantity}, ...]
        """
        self.inventory = {item['sku'].lower(): item for item in inventory_items}
        self.inventory_names = {item['item_name'].lower(): item for item in inventory_items}
    
    def fuzzy_match_item(self, extracted_name: str, extracted_sku: str = None) -> Tuple[Dict, float]:
        """
        Fuzzy match extracted item to inventory
        Returns: (matched_inventory_item, confidence_score)
        """
        confidence = 0.0
        matched_item = None
        
        # Strategy 1: Exact SKU match (highest priority)
        if extracted_sku:
            sku_lower = extracted_sku.lower().strip()
            if sku_lower in self.inventory:
                return self.inventory[sku_lower], 1.0
        
        # Strategy 2: Fuzzy name match
        extracted_lower = extracted_name.lower().strip()
        
        best_match_score = 0.0
        for inv_name, inv_item in self.inventory_names.items():
            score = SequenceMatcher(None, extracted_lower, inv_name).ratio()
            if score > best_match_score:
                best_match_score = score
                matched_item = inv_item
                confidence = score
        
        # Threshold: require 70% match
        if confidence >= 0.7:
            return matched_item, confidence
        
        return None, confidence
    
    def detect_missing_inventory(
        self, 
        extracted_items: List[Dict],
        invoiced_vendor: str = None
    ) -> Dict:
        """
        Match extracted invoice items against inventory
        Detect: 
        - Items not in inventory (missing SKU)
        - Quantity shortages (ordered > in_stock)
        
        Returns: {
            "matched": [...],
            "missing": [...],
            "shortages": [...]
        }
        """
        matched = []
        missing = []
        shortages = []
        
        for extracted in extracted_items:
            item_name = extracted.get('item_name', '')
            sku = extracted.get('sku', '')
            quantity_ordered = extracted.get('quantity', 0) or 0
            
            # Try to match
            inventory_match, confidence = self.fuzzy_match_item(item_name, sku)
            
            if inventory_match is None:
                # Item not found in inventory
                missing.append({
                    "extracted_name": item_name,
                    "extracted_sku": sku,
                    "quantity_ordered": quantity_ordered,
                    "unit_price": extracted.get('unit_price'),
                    "line_total": extracted.get('line_total'),
                    "action": "CREATE_NEW_SKU_AND_PO"
                })
            else:
                # Item found in inventory
                current_qty = inventory_match.get('current_quantity', 0)
                shortage = max(0, quantity_ordered - current_qty)
                
                match_record = {
                    "extracted_name": item_name,
                    "inventory_sku": inventory_match['sku'],
                    "inventory_name": inventory_match['item_name'],
                    "quantity_ordered": quantity_ordered,
                    "quantity_in_stock": current_qty,
                    "shortage": shortage,
                    "unit_cost": inventory_match.get('unit_cost'),
                    "match_confidence": confidence
                }
                
                if shortage > 0:
                    # Add to shortages list
                    match_record['action'] = "GENERATE_PO_FOR_SHORTAGE"
                    shortages.append(match_record)
                else:
                    # Sufficient stock
                    match_record['action'] = "IN_STOCK"
                    matched.append(match_record)
        
        return {
            "matched": matched,
            "missing": missing,
            "shortages": shortages,
            "total_missing_count": len(missing),
            "total_shortage_count": len(shortages),
            "requires_po": len(missing) + len(shortages) > 0
        }
    
    def generate_po_requirements(self, analysis: Dict, invoice_data: Dict) -> Dict:
        """
        Generate purchase order requirements from inventory analysis
        Combines: missing items + shortage items
        """
        po_items = []
        total_po_amount = 0.0
        
        # Process missing items (new SKUs)
        for missing_item in analysis.get('missing', []):
            po_items.append({
                "item_name": missing_item['extracted_name'],
                "sku": missing_item['extracted_sku'] or f"NEW-SKU-{len(po_items)+1}",
                "quantity": missing_item['quantity_ordered'],
                "unit_cost": missing_item.get('unit_price', 0),
                "line_total": missing_item.get('line_total', 0),
                "reason": "NOT_IN_INVENTORY"
            })
            total_po_amount += missing_item.get('line_total', 0)
        
        # Process shortage items (existing but low stock)
        for shortage_item in analysis.get('shortages', []):
            reorder_qty = shortage_item.get('shortage', 0)
            unit_cost = shortage_item.get('unit_cost', 0)
            line_total = reorder_qty * unit_cost
            
            po_items.append({
                "item_name": shortage_item['inventory_name'],
                "sku": shortage_item['inventory_sku'],
                "quantity": reorder_qty,
                "unit_cost": unit_cost,
                "line_total": line_total,
                "reason": "STOCK_SHORTAGE"
            })
            total_po_amount += line_total
        
        return {
            "po_items": po_items,
            "po_total": total_po_amount,
            "vendor_name": invoice_data.get('vendor_name', 'Unknown Vendor'),
            "triggered_by_invoice": invoice_data.get('invoice_number', 'Unknown'),
            "item_count": len(po_items)
        }
