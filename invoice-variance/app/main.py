"""
Invoice Variance B2B SaaS — FastAPI Backend
Main application entry point
"""

import os
import json
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import tempfile
from typing import Optional
import uuid

from app.extractor import InvoiceExtractor
from app.matcher import InventoryMatcher
from app.po_generator import POGenerator

# Initialize FastAPI
app = FastAPI(
    title="Invoice Variance B2B SaaS",
    description="AI-powered invoice extraction + inventory matching + PO generation",
    version="0.1.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load GitHub Models API key
GITHUB_API_KEY = os.getenv("GITHUB_MODELS_API_KEY", "")

# Initialize extractors
extractor = InvoiceExtractor(GITHUB_API_KEY)

# Temp storage
UPLOAD_DIR = Path(tempfile.gettempdir()) / "invoice_variance_uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# ============================================================================
# ENDPOINTS
# ============================================================================

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Invoice Variance B2B SaaS",
        "version": "0.1.0"
    }

@app.post("/api/upload-invoice")
async def upload_invoice(
    file: UploadFile = File(...),
    business_id: Optional[str] = None
):
    """
    Upload invoice PDF for processing
    Returns: extracted invoice data
    """
    try:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files supported")
        
        # Save uploaded file
        temp_path = UPLOAD_DIR / f"{uuid.uuid4().hex}_{file.filename}"
        contents = await file.read()
        
        with open(temp_path, 'wb') as f:
            f.write(contents)
        
        # Extract invoice data
        extraction_result = extractor.extract_complete(str(temp_path))
        
        return {
            "status": "success",
            "file_id": temp_path.stem,
            "filename": file.filename,
            "extraction": extraction_result
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")

@app.post("/api/match-inventory")
async def match_inventory(
    extracted_items: list,
    inventory_db: list,
    vendor_name: Optional[str] = None
):
    """
    Match extracted invoice items against business inventory
    Detect missing items and shortages
    """
    try:
        matcher = InventoryMatcher(inventory_db)
        analysis = matcher.detect_missing_inventory(extracted_items, vendor_name)
        
        return {
            "status": "success",
            "analysis": analysis
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Matching failed: {str(e)}")

@app.post("/api/generate-po")
async def generate_po(
    po_data: dict,
    business_info: dict,
    output_format: str = "pdf"
):
    """
    Generate Purchase Order PDF from matched items
    """
    try:
        po_gen = POGenerator(business_info)
        
        output_path = UPLOAD_DIR / f"PO_{uuid.uuid4().hex}.pdf"
        po_file, po_number = po_gen.generate_po_pdf(
            po_items=po_data.get('po_items', []),
            po_total=po_data.get('po_total', 0),
            vendor_name=po_data.get('vendor_name', 'Unknown'),
            output_path=str(output_path)
        )
        
        return {
            "status": "success",
            "po_number": po_number,
            "po_file": str(po_file),
            "file_ready_for_download": True
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PO generation failed: {str(e)}")

@app.get("/api/download-po/{po_id}")
async def download_po(po_id: str):
    """Download generated PO PDF"""
    try:
        # Find file matching po_id
        po_files = list(UPLOAD_DIR.glob(f"*{po_id}*"))
        if not po_files:
            raise HTTPException(status_code=404, detail="PO not found")
        
        po_file = po_files[0]
        return FileResponse(
            path=po_file,
            filename=po_file.name,
            media_type="application/pdf"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/full-pipeline")
async def full_pipeline(
    file: UploadFile = File(...),
    inventory_db: str = None,  # JSON string of inventory
    business_info: str = None   # JSON string of business info
):
    """
    Full end-to-end pipeline:
    1. Upload invoice
    2. Extract items (OCR + gpt-4o)
    3. Match against inventory
    4. Generate PO if needed
    """
    try:
        # Step 1: Upload and extract
        temp_path = UPLOAD_DIR / f"{uuid.uuid4().hex}_{file.filename}"
        contents = await file.read()
        with open(temp_path, 'wb') as f:
            f.write(contents)
        
        extraction = extractor.extract_complete(str(temp_path))
        parsed_data = extraction.get('parsed_structured', {})
        
        # Step 2: Match inventory
        inventory_list = json.loads(inventory_db) if inventory_db else []
        matcher = InventoryMatcher(inventory_list)
        
        extracted_items = parsed_data.get('items', [])
        analysis = matcher.detect_missing_inventory(
            extracted_items,
            parsed_data.get('vendor_name')
        )
        
        # Step 3: Generate PO if needed
        po_result = None
        if analysis.get('requires_po'):
            business_dict = json.loads(business_info) if business_info else {}
            po_requirements = matcher.generate_po_requirements(analysis, parsed_data)
            
            po_gen = POGenerator(business_dict)
            po_path = UPLOAD_DIR / f"PO_{uuid.uuid4().hex}.pdf"
            po_file, po_number = po_gen.generate_po_pdf(
                po_items=po_requirements['po_items'],
                po_total=po_requirements['po_total'],
                vendor_name=po_requirements['vendor_name'],
                output_path=str(po_path)
            )
            
            po_result = {
                "po_number": po_number,
                "po_file": str(po_path),
                "po_items_count": len(po_requirements['po_items']),
                "po_total": po_requirements['po_total']
            }
        
        return {
            "status": "success",
            "invoice": parsed_data,
            "inventory_analysis": analysis,
            "purchase_order": po_result
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline failed: {str(e)}")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "Invoice Variance B2B SaaS API",
        "version": "0.1.0",
        "endpoints": {
            "health": "/health",
            "upload": "/api/upload-invoice",
            "match": "/api/match-inventory",
            "generate_po": "/api/generate-po",
            "download_po": "/api/download-po/{po_id}",
            "full_pipeline": "/api/full-pipeline"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
