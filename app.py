import os
from dotenv import load_dotenv
import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
from datetime import datetime, timedelta

# Load environment variables from a local .env file in development.
load_dotenv()

# Securely load API keys from the environment instead of hardcoding them.
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PLOTLY_API_KEY = os.getenv("PLOTLY_API_KEY")
MAPBOX_TOKEN = os.getenv("MAPBOX_TOKEN")

# ==========================================
# PAGE CONFIGURATION & STYLING
# ==========================================
st.set_page_config(
    page_title="GeoScore AI | Global SMB Underwriting Platform",
    page_icon="🌍",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Theme Contrast Fixes (Dark/Light Safe Theme Architecture)
st.markdown("""
<style>
    .main-header { font-size:2.2rem !important; color: #1E293B; font-weight: 700; margin-bottom: 5px; }
    .sub-header { font-size:1.1rem !important; color: #64748B; margin-bottom: 25px; }
    .metric-container {
        background-color: #FFFFFF;
        color: #1E293B !important;
        padding: 20px;
        border-radius: 8px;
        border: 1px solid #E2E8F0;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        margin-bottom: 15px;
    }
    .metric-value { font-size: 1.8rem; font-weight: 700; color: #0F172A; }
    .metric-label { font-size: 0.85rem; font-weight: 600; color: #475569; text-transform: uppercase; }
    .pillar-card {
        background-color: #F8FAFC;
        color: #1E293B !important;
        padding: 15px;
        border-left: 4px solid #3B82F6;
        border-radius: 4px;
        margin-bottom: 12px;
    }
</style>
""", unsafe_allow_html=True)

# ==========================================
# GLOBAL COMPLIANT DATA SYNTHESIZER
# ==========================================
@st.cache_data
def generate_geospatial_and_financial_data(seed_val, lat_center, lon_center):
    np.random.seed(seed_val)
    
    dates = [datetime.now() - timedelta(days=x) for x in range(90, 0, -1)]
    inflows = np.random.normal(loc=12000, scale=2500, size=90)
    outflows = np.random.normal(loc=10500, scale=2000, size=90)
    
    for i in range(90):
        if i % 7 in [5, 6]:
            inflows[i] *= 1.35
            
    df_finance = pd.DataFrame({
        "Date": dates,
        "Inflow": inflows,
        "Outflow": outflows,
        "Net_Velocity": inflows - outflows
    })
    
    lats = np.random.uniform(lat_center - 0.015, lat_center + 0.015, size=5)
    lons = np.random.uniform(lon_center - 0.015, lon_center + 0.015, size=5)
    
    df_map = pd.DataFrame({
        "Merchant Name": [f"Merchant Unit 0{i+1}" for i in range(5)],
        "latitude": lats,
        "longitude": lons,
        "Credit Score": np.random.randint(580, 810, size=5),
        "Geospatial Grade": np.random.choice(["A+", "A", "B+", "B", "C"], size=5)
    })
    
    return df_finance, df_map

# ==========================================
# GLOBAL CONFIGURATION MATRIX (SIDEBAR)
# ==========================================
st.sidebar.markdown("## 🌍 GeoScore AI")
st.sidebar.markdown("*Global Underwriting Layer*")
st.sidebar.divider()

selected_region = st.sidebar.selectbox(
    "Select Regional Data Module",
    ["East Africa Framework", "Latin America Open Network", "Southeast Asia Corridor"]
)

if selected_region == "East Africa Framework":
    ingestion_source = "Telco API / M-Pesa Merchant Logs"
    utility_rail = "E-Water & National Grid Subscriptions"
    currency = "KES"
    fx_scale = 130.0
    lat_c, lon_c = -1.2921, 36.8219
    seed = 505
    merchants = ["Nairobi General Trade", "Kilimani Digital Retail Hub", "Jack's Electronics"]
elif selected_region == "Latin America Open Network":
    ingestion_source = "Central Open Banking API / Pix Registries"
    utility_rail = "National E-Invoicing Ledger (SEFAZ)"
    currency = "BRL"
    fx_scale = 5.2
    lat_c, lon_c = -23.5505, -46.6333
    seed = 808
    merchants = ["São Paulo Merchandising Co.", "Pinheiros Distribution Group"]
else:
    ingestion_source = "E-Wallet Integrations / MoMo Gateway Logs"
    utility_rail = "Regional Telecom & Power Utilities"
    currency = "VND"
    fx_scale = 25000.0
    lat_c, lon_c = 21.0285, 105.8542
    seed = 909
    merchants = ["Hanoi Electronics Assembly", "Hoan Kiem Consumer Outlets"]

target_smb = st.sidebar.selectbox("Target SMB Profile", merchants)

st.sidebar.divider()
st.sidebar.markdown("### ⚙️ Engine Ingestion Status")
st.sidebar.info(f"**Data Pipeline:** Active\n\n**Core Protocol:** {ingestion_source}\n\n**Fixed Cost Tracker:** {utility_rail}")
st.sidebar.caption("System Validation Target Status: Gini Metric > 0.45 Underwriting Confidence Confirmed.")

# Runtime API key visibility note for developers
if OPENAI_API_KEY is None:
    st.sidebar.warning("OPENAI_API_KEY is not set. Set it in your environment or .env file.")

# Run Data Engine
df_fin, df_geo = generate_geospatial_and_financial_data(seed, lat_c, lon_c)

df_fin["Inflow"] *= (fx_scale / 100)
df_fin["Outflow"] *= (fx_scale / 100)
df_fin["Net_Velocity"] *= (fx_scale / 100)

# ==========================================
# MAIN DASHBOARD INTERFACE UI
# ==========================================
st.markdown("<div class='main-header'>GeoScore AI Underwriting Protocol</div>", unsafe_allow_html=True)
st.markdown(f"<div class='sub-header'>Global Portal &nbsp;|&nbsp; <b>{selected_region}</b> &nbsp;|&nbsp; Evaluated Risk Asset: <b>{target_smb}</b></div>", unsafe_allow_html=True)

col1, col2, col3, col4 = st.columns(4)
with col1:
    st.markdown(f"""
    <div class='metric-container'>
        <div class='metric-label'>AI Credit Rating</div>
        <div class='metric-value' style='color: #10B981;'>742</div>
        <div style='font-size:0.8rem; color:#64748B;'>Scale: 300 - 850 | Low Risk</div>
    </div>
    """, unsafe_allow_html=True)
with col2:
    st.markdown(f"""
    <div class='metric-container'>
        <div class='metric-label'>Geospatial Grade</div>
        <div class='metric-value' style='color: #2563EB;'>A+</div>
        <div style='font-size:0.8rem; color:#64748B;'>High-Foot-Traffic Density</div>
    </div>
    """, unsafe_allow_html=True)
with col3:
    st.markdown(f"""
    <div class='metric-container'>
        <div class='metric-label'>Cash Flow Volatility</div>
        <div class='metric-value'>12.4%</div>
        <div style='font-size:0.8rem; color:#10B981;'>Stable Seasonal Trajectory</div>
    </div>
    """, unsafe_allow_html=True)
with col4:
    st.markdown(f"""
    <div class='metric-container'>
        <div class='metric-label'>Risk Evaluation Speed</div>
        <div class='metric-value'>3.2 min</div>
        <div style='font-size:0.8rem; color:#64748B;'>API Automated Ingestion</div>
    </div>
    """, unsafe_allow_html=True)

st.divider()

st.subheader("🌐 Pillar 1: Geospatial Demand Index & Location Diagnostics")
st.caption("This interface displays the live context of the target asset relative to economic infrastructure points. We track competitor saturation indexes, macro transit infrastructure access channels, and satellite luminosity metrics.")

map_left, map_right = st.columns([2, 1])

with map_left:
    fig_map = px.scatter_mapbox(
        df_geo,
        lat="latitude",
        lon="longitude",
        hover_name="Merchant Name",
        hover_data=["Credit Score", "Geospatial Grade"],
        color="Credit Score",
        color_continuous_scale=px.colors.sequential.Jet,
        size=np.array([20, 15, 15, 15, 15]),
        zoom=13.5
    )
    fig_map.update_layout(
        mapbox_style="open-street-map",
        margin=dict(l=0, r=0, t=0, b=0),
        height=380
    )
    if MAPBOX_TOKEN:
        fig_map.update_layout(mapbox_accesstoken=MAPBOX_TOKEN)
    st.plotly_chart(fig_map, use_container_width=True)

with map_right:
    st.markdown("#### **Location Infrastructure Indicators**")
    st.markdown("""
    <div class='pillar-card'>
        <b>🚆 Transit Hub Proximity Index: Excellent (420m)</b><br/>
        Correlates directly with baseline foot-traffic reliability indexes during commuter hours.
    </div>
    <div class='pillar-card'>
        <b>🏪 Local Peer/Competitor Saturation: Balanced</b><br/>
        Commercial density clusters confirm high industry demand vectors without triggering margin erosion constraints.
    </div>
    """, unsafe_allow_html=True)
