#!/usr/bin/env python3
"""
Quick test script for Invoice Variance API
"""

import requests
import json
from pathlib import Path

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("Testing /health endpoint...")
    r = requests.get(f"{BASE_URL}/health")
    print(f"Status: {r.status_code}")
    print(f"Response: {json.dumps(r.json(), indent=2)}")
    print()

def test_full_pipeline():
    """Test full pipeline with sample data"""
    print("Testing /api/full-pipeline...")
    
    # Sample inventory database
    inventory_db = [
        {
            "sku": "DESK-001",
            "item_name": "Office Desk",
            "current_quantity": 2,
            "unit_cost": 140
        },
        {
            "sku": "CHAIR-001",
            "item_name": "Office Chair",
            "current_quantity": 5,
            "unit_cost": 80
        }
    ]
    
    # Sample business info
    business_info = {
        "name": "Your Company Inc",
        "address": "123 Main Street, City, State 12345",
        "email": "contact@yourcompany.com",
        "phone": "(555) 123-4567"
    }
    
    # Find a PDF file (user should provide one)
    pdf_files = list(Path(".").glob("**/*.pdf"))
    if not pdf_files:
        print("⚠️  No PDF files found. Please provide a sample invoice PDF.")
        print("You can create one with Microsoft Word or Google Docs and export as PDF.")
        return
    
    pdf_file = pdf_files[0]
    print(f"Using PDF: {pdf_file}")
    
    with open(pdf_file, 'rb') as f:
        files = {'file': f}
        data = {
            'inventory_db': json.dumps(inventory_db),
            'business_info': json.dumps(business_info)
        }
        
        r = requests.post(f"{BASE_URL}/api/full-pipeline", files=files, data=data)
        print(f"Status: {r.status_code}")
        result = r.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if r.status_code == 200 and result.get('purchase_order'):
            print(f"\n✅ Purchase Order Generated!")
            print(f"PO Number: {result['purchase_order']['po_number']}")
            print(f"PO File: {result['purchase_order']['po_file']}")

def test_github_models_api():
    """Test GitHub Models API connectivity"""
    print("Testing GitHub Models API...")
    
    import os
    token = os.getenv("GITHUB_MODELS_API_KEY")
    
    if not token:
        print("⚠️  GITHUB_MODELS_API_KEY not set in environment")
        return
    
    headers = {"Authorization": f"Bearer {token}"}
    payload = {
        "model": "grok-3",
        "messages": [{"role": "user", "content": "Say 'API works!' only."}],
        "max_tokens": 10
    }
    
    r = requests.post(
        "https://models.inference.ai.azure.com/chat/completions",
        headers=headers,
        json=payload
    )
    
    print(f"Status: {r.status_code}")
    if r.status_code == 200:
        result = r.json()
        print(f"Response: {result['choices'][0]['message']['content']}")
    else:
        print(f"Error: {r.text}")

if __name__ == "__main__":
    print("=" * 60)
    print("Invoice Variance API — Test Suite")
    print("=" * 60)
    print()
    
    # Test health
    test_health()
    
    # Test GitHub Models API
    test_github_models_api()
    print()
    
    # Test full pipeline
    test_full_pipeline()
    
    print()
    print("=" * 60)
    print("Tests complete!")
    print("=" * 60)
