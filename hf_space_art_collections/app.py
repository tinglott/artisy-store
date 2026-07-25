#!/usr/bin/env python3
"""
HuggingFace Space: Art Collections Storefront
Streamlit app showcasing 4 art collections with Stripe checkout
"""

import streamlit as st

st.set_page_config(
    page_title="Artisty Art Collections",
    page_icon="🎨",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS
st.markdown("""
<style>
body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
.collection-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    padding: 24px;
    color: white;
    text-align: center;
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
}
.collection-card:hover { transform: translateY(-4px); }
.price { font-size: 32px; font-weight: bold; margin: 16px 0; }
.btn-stripe { 
    background: #635bff;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: bold;
    display: inline-block;
    margin-top: 12px;
}
.btn-stripe:hover { background: #4c47d6; opacity: 0.9; }
</style>
""", unsafe_allow_html=True)

# Collections data
collections = {
    "Coastal Collection": {
        "id": "nvvwo",
        "price": "$12.99",
        "description": "9 serene coastal and beach-inspired artworks perfect for relaxation spaces",
        "stripe_link": "https://checkout.stripe.com/pay/price_1Twnb1PHKHqdKWZzt33O13eH"
    },
    "Urban Landscape": {
        "id": "tqynd",
        "price": "$12.99",
        "description": "9 stunning city skylines and urban scenes from around the world",
        "stripe_link": "https://checkout.stripe.com/pay/price_1Twnb1PHKHqdKWZzp00px4Fe"
    },
    "Botanical Art": {
        "id": "mwujt",
        "price": "$12.99",
        "description": "9 beautiful botanical and floral illustrations for nature lovers",
        "stripe_link": "https://checkout.stripe.com/pay/price_1Twnb2PHKHqdKWZzDSqo6fUD"
    },
    "Celestial & Abstract": {
        "id": "lggiq",
        "price": "$12.99",
        "description": "9 cosmic and abstract designs for modern, inspiring spaces",
        "stripe_link": "https://checkout.stripe.com/pay/price_1Twnb1PHKHqdKWZzp00px4Fe"
    }
}

# Header
col1, col2 = st.columns([3, 1])
with col1:
    st.title("🎨 Artisty Art Collections")
    st.markdown("Premium digital art bundles for every space and style")

# Collections grid
st.markdown("---")
cols = st.columns(2)

for i, (name, details) in enumerate(collections.items()):
    with cols[i % 2]:
        st.markdown(f"""
        <div class="collection-card">
            <h3>{name}</h3>
            <p>{details['description']}</p>
            <div class="price">{details['price']}</div>
            <p><strong>9 High-Resolution Images</strong></p>
            <a href="{details['stripe_link']}" class="btn-stripe">
                💳 Buy Now
            </a>
            <br><br>
            <small>📥 Instant Download | 🖼️ Print-Ready | 💯 High-Res</small>
        </div>
        """, unsafe_allow_html=True)

st.markdown("---")

# FAQ
with st.expander("❓ Frequently Asked Questions"):
    st.markdown("""
    **What format are the images?**
    PNG and JPG, optimized for both digital and print.
    
    **Can I use these commercially?**
    Personal use only. Contact us for commercial licenses.
    
    **Are these digital or physical?**
    Digital downloads - instant access after purchase.
    
    **What resolution?**
    High-resolution (3000x2000px+) suitable for printing.
    
    **How do I download?**
    After purchase via Stripe, you'll receive a download link instantly.
    """)

# Footer
st.markdown("---")
st.markdown("""
<div style="text-align: center; color: #666;">
    <p>Made with ❤️ by <strong>Artisty</strong> | <a href="https://artisty-store-rebuild.netlify.app">Visit Main Store</a></p>
</div>
""", unsafe_allow_html=True)
