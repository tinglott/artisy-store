"""
Purchase Order PDF generation
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib import colors
from datetime import datetime
import uuid
from typing import Dict, List

class POGenerator:
    def __init__(self, business_info: Dict):
        """
        business_info: {name, address, email, phone, ...}
        """
        self.business_info = business_info
    
    def generate_po_pdf(
        self, 
        po_items: List[Dict],
        po_total: float,
        vendor_name: str,
        output_path: str
    ) -> str:
        """
        Generate Purchase Order PDF
        Returns: output_path
        """
        
        po_number = f"PO-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        doc = SimpleDocTemplate(
            output_path,
            pagesize=letter,
            rightMargin=0.5*inch,
            leftMargin=0.5*inch,
            topMargin=0.5*inch,
            bottomMargin=0.5*inch
        )
        
        story = []
        styles = getSampleStyleSheet()
        
        # Header
        header_style = ParagraphStyle(
            'Header',
            parent=styles['Heading1'],
            fontSize=20,
            textColor=colors.HexColor('#1a3a52'),
            spaceAfter=10
        )
        
        story.append(Paragraph(f"PURCHASE ORDER", header_style))
        story.append(Paragraph(f"PO Number: {po_number}", styles['Normal']))
        story.append(Paragraph(f"Date: {datetime.now().strftime('%Y-%m-%d')}", styles['Normal']))
        story.append(Spacer(1, 0.2*inch))
        
        # Business Info
        business_block = [
            Paragraph(f"<b>From:</b> {self.business_info.get('name', 'Your Business')}", styles['Normal']),
            Paragraph(f"{self.business_info.get('address', '')}", styles['Normal']),
            Paragraph(f"Email: {self.business_info.get('email', '')}", styles['Normal']),
            Paragraph(f"Phone: {self.business_info.get('phone', '')}", styles['Normal'])
        ]
        
        for para in business_block:
            story.append(para)
        
        story.append(Spacer(1, 0.2*inch))
        
        # Vendor Info
        vendor_block = [
            Paragraph(f"<b>To (Vendor):</b> {vendor_name}", styles['Normal']),
            Paragraph(f"[Address to be filled]", styles['Normal'])
        ]
        
        for para in vendor_block:
            story.append(para)
        
        story.append(Spacer(1, 0.2*inch))
        
        # Items Table
        table_data = [['Item Name', 'SKU', 'Quantity', 'Unit Cost', 'Line Total']]
        
        for item in po_items:
            table_data.append([
                item.get('item_name', ''),
                item.get('sku', ''),
                str(item.get('quantity', 0)),
                f"${item.get('unit_cost', 0):.2f}",
                f"${item.get('line_total', 0):.2f}"
            ])
        
        # Total row
        table_data.append(['', '', '', '<b>TOTAL</b>', f'<b>${po_total:.2f}</b>'])
        
        table = Table(table_data, colWidths=[2.5*inch, 1*inch, 1*inch, 1*inch, 1*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a3a52')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, -1), (-1, -1), colors.lightgrey),
            ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ROWBACKGROUNDS', (0, 1), (-1, -2), [colors.white, colors.HexColor('#f0f0f0')])
        ]))
        
        story.append(table)
        story.append(Spacer(1, 0.3*inch))
        
        # Footer
        footer_text = [
            Paragraph("<b>Notes:</b> This PO was auto-generated based on invoice variance detection.", styles['Normal']),
            Paragraph("Please confirm receipt and expected delivery date.", styles['Normal']),
            Paragraph("Contact us if there are any discrepancies.", styles['Normal'])
        ]
        
        for para in footer_text:
            story.append(para)
        
        # Build PDF
        doc.build(story)
        
        return output_path, po_number
