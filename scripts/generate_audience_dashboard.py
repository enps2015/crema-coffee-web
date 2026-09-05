#!/usr/bin/env python3
"""
CREMA° — Audience Analytics Dashboard SVG Generator
----------------------------------------------------
Queries GoatCounter API v0 and generates a rich, dark-mode SVG audience
dashboard styled specifically for CREMA° (Espresso, Caramelo, Warm Crema).
"""

import os
import sys
import json
import math
import html
import urllib.request
import urllib.error
from datetime import datetime, timedelta, timezone

API_BASE = "https://ericpimentel.goatcounter.com/api/v0"
DEFAULT_OUTPUT = os.path.join(os.path.dirname(__file__), "..", "assets", "analytics", "crema-audience.svg")

# Mapping of country codes to emoji flags
COUNTRY_FLAGS = {
    "BR": "🇧🇷", "PT": "🇵🇹", "US": "🇺🇸", "DE": "🇩🇪", "FR": "🇫🇷",
    "GB": "🇬🇧", "ES": "🇪🇸", "IT": "🇮🇹", "CA": "🇨🇦", "NL": "🇳🇱",
    "CH": "🇨🇭", "JP": "🇯🇵", "AR": "🇦🇷", "CL": "🇨🇱", "CO": "🇨🇴",
    "MX": "🇲🇽", "UY": "🇺🇾", "AU": "🇦🇺", "SE": "🇸🇪", "NO": "🇳🇴",
    "FI": "🇫🇮", "DK": "🇩🇰", "IE": "🇮🇪", "BE": "🇧🇪", "AT": "🇦🇹"
}

def country_to_flag(code: str) -> str:
    if not code or len(code) != 2:
        return "🌐"
    code = code.upper()
    if code in COUNTRY_FLAGS:
        return COUNTRY_FLAGS[code]
    try:
        # Regional Indicator Symbols conversion
        return chr(127397 + ord(code[0])) + chr(127397 + ord(code[1]))
    except Exception:
        return "🌐"

def fetch_goatcounter_endpoint(endpoint: str, token: str) -> dict:
    """Safely query GoatCounter API without leaking token in logs."""
    url = f"{API_BASE}{endpoint}"
    req = urllib.request.Request(
        url,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "User-Agent": "CREMA-Audience-Dashboard/1.0"
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=12) as response:
            if response.status == 200:
                data = json.loads(response.read().decode("utf-8"))
                return data
            else:
                print(f"[WARN] Endpoint {endpoint} returned status {response.status}", file=sys.stderr)
                return {}
    except urllib.error.HTTPError as e:
        print(f"[WARN] HTTP Error {e.code} on {endpoint}: {e.reason}", file=sys.stderr)
        return {}
    except Exception as e:
        print(f"[WARN] Failed to fetch {endpoint}: {type(e).__name__}", file=sys.stderr)
        return {}

def collect_audience_data(token: str) -> dict:
    """Collect 30-day stats, totals, locations and referrers."""
    now = datetime.now(timezone.utc)
    start_30d = (now - timedelta(days=30)).replace(minute=0, second=0, microsecond=0)
    end_iso = now.strftime("%Y-%m-%dT%H:%M:%SZ")
    start_iso = start_30d.strftime("%Y-%m-%dT%H:%M:%SZ")

    print(f"[*] Querying GoatCounter API for period: {start_iso} to {end_iso}...")
    
    # 1. Total 30-day stats & daily curve
    total_30d_data = fetch_goatcounter_endpoint(f"/stats/total?start={start_iso}&end={end_iso}", token)
    
    # 2. All-time total stats
    all_time_data = fetch_goatcounter_endpoint("/stats/total", token)
    
    # 3. Top locations
    locations_data = fetch_goatcounter_endpoint(f"/stats/locations?start={start_iso}&end={end_iso}&limit=5", token)
    
    # 4. Top referrers
    refs_data = fetch_goatcounter_endpoint(f"/stats/toprefs?start={start_iso}&end={end_iso}&limit=5", token)

    return {
        "total_30d": total_30d_data,
        "all_time": all_time_data,
        "locations": locations_data,
        "toprefs": refs_data,
        "timestamp": now.strftime("%Y-%m-%d %H:%M UTC")
    }

def get_test_dataset(state: str) -> dict:
    """Generate realistic test states for validation without modifying production data."""
    now = datetime.now(timezone.utc)
    ts = now.strftime("%Y-%m-%d %H:%M UTC")

    if state == "empty":
        return {
            "visits_30d": 0,
            "total_reach": 0,
            "countries_count": 0,
            "top_source": "—",
            "daily_series": [(now - timedelta(days=i)).strftime("%Y-%m-%d") for i in range(29, -1, -1)],
            "daily_counts": [0] * 30,
            "countries": [],
            "referrers": [],
            "timestamp": ts,
            "status_label": "Collecting audience signals · Zero personal cookies"
        }
    elif state == "sparse":
        days = [(now - timedelta(days=i)).strftime("%Y-%m-%d") for i in range(29, -1, -1)]
        counts = [0] * 28 + [3, 8]
        return {
            "visits_30d": 11,
            "total_reach": 11,
            "countries_count": 2,
            "top_source": "LinkedIn",
            "daily_series": days,
            "daily_counts": counts,
            "countries": [
                {"name": "Brazil", "code": "BR", "count": 9, "pct": 81.8},
                {"name": "Portugal", "code": "PT", "count": 2, "pct": 18.2}
            ],
            "referrers": [
                {"name": "LinkedIn", "count": 8, "pct": 72.7},
                {"name": "Direct", "count": 3, "pct": 27.3}
            ],
            "timestamp": ts,
            "status_label": "Early audience data · Telemetry maturing"
        }
    else:  # rich state
        days = [(now - timedelta(days=i)).strftime("%Y-%m-%d") for i in range(29, -1, -1)]
        counts = [max(0, int(15 + 10 * math.sin(i / 3.0) + (i % 5))) for i in range(30)]
        return {
            "visits_30d": sum(counts),
            "total_reach": sum(counts) + 140,
            "countries_count": 5,
            "top_source": "LinkedIn",
            "daily_series": days,
            "daily_counts": counts,
            "countries": [
                {"name": "Brazil", "code": "BR", "count": 312, "pct": 74.3},
                {"name": "Portugal", "code": "PT", "count": 48, "pct": 11.4},
                {"name": "United States", "code": "US", "count": 34, "pct": 8.1},
                {"name": "Germany", "code": "DE", "count": 16, "pct": 3.8},
                {"name": "Spain", "code": "ES", "count": 10, "pct": 2.4}
            ],
            "referrers": [
                {"name": "LinkedIn", "count": 245, "pct": 58.3},
                {"name": "Direct / Bookmarks", "count": 96, "pct": 22.9},
                {"name": "Google Search", "count": 44, "pct": 10.5},
                {"name": "GitHub", "count": 25, "pct": 6.0},
                {"name": "Twitter / X", "count": 10, "pct": 2.4}
            ],
            "timestamp": ts,
            "status_label": "Live Telemetry · Multi-region audience"
        }

def process_raw_data(raw: dict) -> dict:
    """Normalize raw GoatCounter data into clean dashboard structures."""
    now = datetime.now(timezone.utc)
    ts = raw.get("timestamp", now.strftime("%Y-%m-%d %H:%M UTC"))
    
    t30 = raw.get("total_30d", {})
    visits_30d = t30.get("total", 0)
    all_time = raw.get("all_time", {}).get("total", visits_30d)
    if all_time < visits_30d:
        all_time = visits_30d

    # Reconstruct 30-day timeline
    date_map = {}
    for item in t30.get("stats", []):
        day_str = item.get("day")
        if day_str:
            date_map[day_str] = item.get("daily", 0)

    daily_series = []
    daily_counts = []
    for i in range(29, -1, -1):
        d_str = (now - timedelta(days=i)).strftime("%Y-%m-%d")
        daily_series.append(d_str)
        daily_counts.append(date_map.get(d_str, 0))

    # Parse locations
    loc_items = raw.get("locations", {}).get("stats", [])
    countries_count = len(loc_items)
    countries = []
    tot_loc_visits = sum(x.get("count", 0) for x in loc_items) or 1
    for loc in loc_items[:5]:
        c_code = loc.get("id", "").upper()
        c_name = loc.get("name") or c_code or "Unknown"
        count = loc.get("count", 0)
        pct = round((count / tot_loc_visits) * 100, 1)
        countries.append({
            "name": c_name,
            "code": c_code,
            "count": count,
            "pct": pct
        })

    # Parse referrers
    ref_items = raw.get("toprefs", {}).get("stats", [])
    referrers = []
    tot_ref_visits = sum(x.get("count", 0) for x in ref_items) or 1
    for ref in ref_items[:5]:
        r_name = ref.get("name") or "Direct"
        count = ref.get("count", 0)
        pct = round((count / tot_ref_visits) * 100, 1)
        referrers.append({
            "name": r_name,
            "count": count,
            "pct": pct
        })

    top_source = referrers[0]["name"] if referrers else "Direct"

    # Status label determination
    if visits_30d == 0:
        status_label = "Collecting audience signals · Zero personal cookies"
    elif visits_30d < 25:
        status_label = "Early audience data · Multi-channel tracking"
    else:
        status_label = "Live Telemetry · Consolidated metrics"

    return {
        "visits_30d": visits_30d,
        "total_reach": all_time,
        "countries_count": countries_count,
        "top_source": top_source,
        "daily_series": daily_series,
        "daily_counts": daily_counts,
        "countries": countries,
        "referrers": referrers,
        "timestamp": ts,
        "status_label": status_label
    }

def generate_svg(data: dict) -> str:
    """Generate high-density, editorial CREMA° SVG audience dashboard (1200x700)."""
    ts = html.escape(str(data["timestamp"]))
    visits_30d = data["visits_30d"]
    total_reach = data["total_reach"]
    countries_count = data["countries_count"]
    top_source = html.escape(data["top_source"][:18])
    status_label = html.escape(data["status_label"])
    
    # 1. Chart Coordinates Computation (Relative to Card Origin x:45, y:220)
    chart_x = 55
    chart_y = 90
    chart_w = 555
    chart_h = 260
    
    counts = data["daily_counts"]
    max_val = max(counts) if counts else 0
    # Provide a minimum headroom
    y_max = max(max_val, 5)
    if y_max <= 5:
        y_max = 5
    elif y_max <= 10:
        y_max = 10
    elif y_max <= 25:
        y_max = 25
    elif y_max <= 50:
        y_max = 50
    elif y_max <= 100:
        y_max = 100
    else:
        y_max = math.ceil(y_max / 50.0) * 50

    # Build points
    pts = []
    n = len(counts)
    dx = chart_w / (n - 1) if n > 1 else chart_w
    for i, c in enumerate(counts):
        px = chart_x + i * dx
        py = chart_y + chart_h - (c / y_max) * chart_h
        pts.append((px, py))

    # Build smooth SVG path
    path_d = f"M {pts[0][0]:.1f} {pts[0][1]:.1f}"
    for i in range(len(pts) - 1):
        x0, y0 = pts[i]
        x1, y1 = pts[i + 1]
        cx = (x0 + x1) / 2
        path_d += f" C {cx:.1f} {y0:.1f}, {cx:.1f} {y1:.1f}, {x1:.1f} {y1:.1f}"

    area_d = path_d + f" L {pts[-1][0]:.1f} {chart_y + chart_h:.1f} L {pts[0][0]:.1f} {chart_y + chart_h:.1f} Z"

    # Grid lines (3 horizontal intervals)
    grid_svg = []
    for step in [0.25, 0.5, 0.75, 1.0]:
        gy = chart_y + chart_h - step * chart_h
        val_lbl = int(round(step * y_max))
        grid_svg.append(f'<line x1="{chart_x}" y1="{gy:.1f}" x2="{chart_x + chart_w}" y2="{gy:.1f}" stroke="#221e18" stroke-dasharray="3,3" />')
        grid_svg.append(f'<text x="{chart_x - 10}" y="{gy + 4:.1f}" text-anchor="end" class="chart-axis-val">{val_lbl}</text>')

    # Date markers on X axis (5 markers)
    x_axis_svg = []
    idx_steps = [0, 7, 14, 21, 29]
    for idx in idx_steps:
        if idx < len(data["daily_series"]):
            day_str = data["daily_series"][idx]
            dt_part = day_str[5:] # MM-DD
            gx = chart_x + idx * dx
            x_axis_svg.append(f'<text x="{gx:.1f}" y="{chart_y + chart_h + 24}" text-anchor="middle" class="chart-axis-val">{dt_part}</text>')

    # 2. Render Top Countries bars (Inside right card, relative coords)
    countries_svg = []
    c_y_base = 65
    c_h_step = 28
    countries_list = data.get("countries", [])
    if not countries_list:
        countries_svg.append(f'<text x="25" y="{c_y_base + 30}" class="empty-state">No country signals recorded yet</text>')
    else:
        for i, c in enumerate(countries_list[:5]):
            cy = c_y_base + i * c_h_step
            flag = country_to_flag(c.get("code", ""))
            name = html.escape(c.get("name", "Unknown")[:16])
            cnt = c.get("count", 0)
            pct = c.get("pct", 0.0)
            bar_w = max(4, int((pct / 100.0) * 190))
            countries_svg.append(f'''
            <g transform="translate(25, {cy})">
              <text x="0" y="14" class="rank-name">{flag} {name}</text>
              <rect x="180" y="4" width="190" height="9" rx="3" fill="#1e1b17" />
              <rect x="180" y="4" width="{bar_w}" height="9" rx="3" fill="url(#barGrad1)" />
              <text x="385" y="13" class="rank-val">{cnt} <tspan class="rank-pct">({pct}%)</tspan></text>
            </g>
            ''')

    # 3. Render Top Referrers bars (Inside right card, relative coords)
    referrers_svg = []
    r_y_base = 275
    r_h_step = 28
    refs_list = data.get("referrers", [])
    if not refs_list:
        referrers_svg.append(f'<text x="25" y="{r_y_base + 30}" class="empty-state">Direct exploration / bookmarks</text>')
    else:
        for i, r in enumerate(refs_list[:5]):
            ry = r_y_base + i * r_h_step
            name = html.escape(r.get("name", "Direct")[:18])
            cnt = r.get("count", 0)
            pct = r.get("pct", 0.0)
            bar_w = max(4, int((pct / 100.0) * 190))
            referrers_svg.append(f'''
            <g transform="translate(25, {ry})">
              <text x="0" y="14" class="rank-name">🔗 {name}</text>
              <rect x="180" y="4" width="190" height="9" rx="3" fill="#1e1b17" />
              <rect x="180" y="4" width="{bar_w}" height="9" rx="3" fill="url(#barGrad2)" />
              <text x="385" y="13" class="rank-val">{cnt} <tspan class="rank-pct">({pct}%)</tspan></text>
            </g>
            ''')

    # Construct the final SVG XML
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700" width="100%" height="auto">
  <defs>
    <!-- Gradients -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#12100d" />
      <stop offset="50%" stop-color="#0e0d0b" />
      <stop offset="100%" stop-color="#090807" />
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#171512" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#13110e" stop-opacity="0.95" />
    </linearGradient>
    <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#c97a3e" stop-opacity="0.40" />
      <stop offset="60%" stop-color="#c97a3e" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#c97a3e" stop-opacity="0.0" />
    </linearGradient>
    <linearGradient id="barGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#c97a3e" />
      <stop offset="100%" stop-color="#e59a5a" />
    </linearGradient>
    <linearGradient id="barGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#d4af37" />
      <stop offset="100%" stop-color="#f5e0a3" />
    </linearGradient>
    <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000000" flood-opacity="0.45" />
    </filter>
  </defs>

  <style>
    .title-main {{ font-family: 'Instrument Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 26px; font-weight: 700; fill: #f5f0eb; letter-spacing: 0.5px; }}
    .title-deg {{ fill: #c97a3e; font-size: 20px; }}
    .sub-head {{ font-family: 'Instrument Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; fill: #8f8576; letter-spacing: 0.3px; }}
    .badge-live {{ font-family: 'IBM Plex Mono', monospace; font-size: 11px; fill: #48bb78; font-weight: 600; letter-spacing: 0.5px; }}
    .badge-time {{ font-family: 'IBM Plex Mono', monospace; font-size: 11px; fill: #786f62; }}
    
    .kpi-label {{ font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600; fill: #8c8273; letter-spacing: 1px; text-transform: uppercase; }}
    .kpi-val {{ font-family: 'IBM Plex Mono', monospace; font-size: 32px; font-weight: 700; fill: #f5f0eb; }}
    .kpi-val-accent {{ fill: #c97a3e; }}
    .kpi-val-gold {{ fill: #d4af37; }}
    .kpi-sub {{ font-family: 'Instrument Sans', -apple-system, sans-serif; font-size: 11px; fill: #6e6557; }}
    
    .panel-title {{ font-family: 'Instrument Sans', -apple-system, sans-serif; font-size: 16px; font-weight: 600; fill: #f5f0eb; letter-spacing: 0.3px; }}
    .panel-sub {{ font-family: 'Instrument Sans', -apple-system, sans-serif; font-size: 12px; fill: #786f62; }}
    
    .chart-axis-val {{ font-family: 'IBM Plex Mono', monospace; font-size: 10px; fill: #635b50; }}
    .rank-name {{ font-family: 'Instrument Sans', -apple-system, sans-serif; font-size: 12px; fill: #ddd5cc; font-weight: 500; }}
    .rank-val {{ font-family: 'IBM Plex Mono', monospace; font-size: 11px; fill: #f5f0eb; font-weight: 600; }}
    .rank-pct {{ font-size: 10px; fill: #7e7568; font-weight: 400; }}
    .empty-state {{ font-family: 'Instrument Sans', -apple-system, sans-serif; font-size: 13px; font-style: italic; fill: #696154; }}
    
    .foot-text {{ font-family: 'Instrument Sans', -apple-system, sans-serif; font-size: 11px; fill: #61584c; }}
    .foot-link {{ font-family: 'IBM Plex Mono', monospace; font-size: 11px; fill: #8f8576; font-weight: 500; }}
  </style>

  <!-- Deep Espresso Canvas Background -->
  <rect width="1200" height="700" fill="url(#bgGrad)" rx="16" />
  <rect width="1198" height="698" x="1" y="1" fill="none" stroke="#2b2620" stroke-width="1.5" rx="15" />

  <!-- HEADER SECTION -->
  <g transform="translate(45, 48)">
    <text x="0" y="0" class="title-main">CREMA<tspan class="title-deg">°</tspan> · AUDIENCE ANALYTICS</text>
    <text x="0" y="24" class="sub-head">Privacy-friendly website telemetry · {status_label}</text>
    
    <!-- Top Right Meta Status & Timestamp -->
    <g transform="translate(1110, 0)" text-anchor="end">
      <!-- Status pill -->
      <g transform="translate(0, -6)">
        <rect x="-136" y="-13" width="136" height="22" rx="11" fill="#18231a" stroke="#254329" stroke-width="1" />
        <circle cx="-120" cy="-2" r="3.5" fill="#48bb78" />
        <text x="-14" y="1.5" class="badge-live" text-anchor="end">LIVE TELEMETRY</text>
      </g>
      <text x="0" y="24" class="badge-time">Last updated: {ts}</text>
    </g>
  </g>

  <!-- KPI SUMMARY CARDS -->
  <!-- Card 1: 30D Visits -->
  <g transform="translate(45, 105)" filter="url(#cardShadow)">
    <rect width="262" height="92" fill="url(#cardGrad)" rx="10" stroke="#26221c" stroke-width="1.2" />
    <text x="20" y="28" class="kpi-label">👥 30D Visits</text>
    <text x="20" y="66" class="kpi-val">{visits_30d}</text>
    <text x="20" y="81" class="kpi-sub">Trailing 30-day audience</text>
  </g>

  <!-- Card 2: Total Reach -->
  <g transform="translate(327, 105)" filter="url(#cardShadow)">
    <rect width="262" height="92" fill="url(#cardGrad)" rx="10" stroke="#26221c" stroke-width="1.2" />
    <text x="20" y="28" class="kpi-label">📊 Total Reach</text>
    <text x="20" y="66" class="kpi-val kpi-val-accent">{total_reach}</text>
    <text x="20" y="81" class="kpi-sub">All-time tracked pageviews</text>
  </g>

  <!-- Card 3: Countries -->
  <g transform="translate(609, 105)" filter="url(#cardShadow)">
    <rect width="262" height="92" fill="url(#cardGrad)" rx="10" stroke="#26221c" stroke-width="1.2" />
    <text x="20" y="28" class="kpi-label">🌎 Countries</text>
    <text x="20" y="66" class="kpi-val kpi-val-gold">{countries_count}</text>
    <text x="20" y="81" class="kpi-sub">Global geographical reach</text>
  </g>

  <!-- Card 4: Top Source -->
  <g transform="translate(891, 105)" filter="url(#cardShadow)">
    <rect width="264" height="92" fill="url(#cardGrad)" rx="10" stroke="#26221c" stroke-width="1.2" />
    <text x="20" y="28" class="kpi-label">🔗 Top Source</text>
    <text x="20" y="64" class="kpi-val" style="font-size: 24px;">{top_source}</text>
    <text x="20" y="81" class="kpi-sub">Primary acquisition channel</text>
  </g>

  <!-- MAIN SECTION: CHART (LEFT) + REGIONAL / CHANNEL BREAKDOWN (RIGHT) -->
  
  <!-- Left Container: 30D Evolution Curve -->
  <g transform="translate(45, 220)" filter="url(#cardShadow)">
    <rect width="645" height="420" fill="url(#cardGrad)" rx="12" stroke="#26221c" stroke-width="1.2" />
    
    <text x="25" y="38" class="panel-title">📈 30-Day Activity Curve</text>
    <text x="25" y="58" class="panel-sub">Daily audience volume &amp; exploration cadence</text>

    <!-- Grid lines -->
    {''.join(grid_svg)}

    <!-- Baseline 0 -->
    <line x1="{chart_x}" y1="{chart_y + chart_h}" x2="{chart_x + chart_w}" y2="{chart_y + chart_h}" stroke="#332c24" stroke-width="1.5" />
    <text x="{chart_x - 10}" y="{chart_y + chart_h + 4}" text-anchor="end" class="chart-axis-val">0</text>

    <!-- Curve Area Fill -->
    <path d="{area_d}" fill="url(#chartGrad)" />

    <!-- Main Stroke Curve -->
    <path d="{path_d}" fill="none" stroke="#c97a3e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

    <!-- Current Point Marker -->
    <circle cx="{pts[-1][0]:.1f}" cy="{pts[-1][1]:.1f}" r="4.5" fill="#f5f0eb" stroke="#c97a3e" stroke-width="2.5" />

    <!-- X-Axis Labels -->
    {''.join(x_axis_svg)}
  </g>

  <!-- Right Container: Breakdown Cards -->
  <g transform="translate(710, 220)" filter="url(#cardShadow)">
    <rect width="445" height="420" fill="url(#cardGrad)" rx="12" stroke="#26221c" stroke-width="1.2" />
    
    <!-- Top Subsection: Geographic Footprint -->
    <g transform="translate(25, 34)">
      <text x="0" y="0" class="panel-title">🌍 Geographic Footprint</text>
      <text x="0" y="18" class="panel-sub">Top visitor countries / territories</text>
      <line x1="0" y1="28" x2="395" y2="28" stroke="#211e19" stroke-width="1" />
    </g>
    {''.join(countries_svg)}

    <line x1="25" y1="220" x2="420" y2="220" stroke="#26221c" stroke-width="1" stroke-dasharray="2,2" />

    <!-- Bottom Subsection: Acquisition Channels -->
    <g transform="translate(25, 245)">
      <text x="0" y="0" class="panel-title">🧭 Acquisition Channels</text>
      <text x="0" y="18" class="panel-sub">Primary referral &amp; exploration origins</text>
      <line x1="0" y1="28" x2="395" y2="28" stroke="#211e19" stroke-width="1" />
    </g>
    {''.join(referrers_svg)}
  </g>

  <!-- FOOTER TECH SNAPSHOT -->
  <g transform="translate(45, 672)">
    <text x="0" y="0" class="foot-text">🛡️ Privacy-first telemetry · Zero tracking cookies · No personal data storage · LGPD &amp; GDPR compliant</text>
    <text x="1110" y="0" text-anchor="end" class="foot-link">Powered by GoatCounter API v0</text>
  </g>
</svg>'''
    return svg_content

def main():
    import argparse
    parser = argparse.ArgumentParser(description="Generate CREMA° Audience Dashboard SVG")
    parser.add_argument("--output", "-o", default=DEFAULT_OUTPUT, help="Destination SVG path")
    parser.add_argument("--test-state", choices=["empty", "sparse", "rich"], help="Render mock state for test validation")
    args = parser.parse_args()

    token = os.environ.get("GOATCOUNTER_API_TOKEN", "").strip()

    if args.test_state:
        print(f"[*] Generating test dataset with state='{args.test_state}'...")
        data = get_test_dataset(args.test_state)
    elif token:
        print("[*] GOATCOUNTER_API_TOKEN detected. Fetching real telemetry from API...")
        raw = collect_audience_data(token)
        data = process_raw_data(raw)
    else:
        print("[!] No GOATCOUNTER_API_TOKEN environment variable found.")
        print("[*] Generating baseline placeholder state with empty telemetry signals.")
        data = get_test_dataset("empty")

    svg_str = generate_svg(data)
    
    os.makedirs(os.path.dirname(os.path.abspath(args.output)), exist_ok=True)
    with open(args.output, "w", encoding="utf-8") as f:
        f.write(svg_str)

    print(f"[+] Audience dashboard successfully written to: {args.output}")

if __name__ == "__main__":
    main()
