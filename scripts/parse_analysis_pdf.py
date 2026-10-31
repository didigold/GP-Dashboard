"""
Dorna Sports Analysis.pdf Ingestion Engine
Downloads and extracts per-lap micro-sectors (T1-T4), trap speeds, and Michelin tire choices
from official session analysis documents at resources.motogp.com.
"""

import urllib.request
import io
import re
import json
import sys
from typing import Dict, List, Any

try:
    import pypdf
except ImportError:
    print("pypdf is required. Install via: pip install pypdf")
    sys.exit(1)


def parse_session_analysis(pdf_url: str) -> Dict[str, Any]:
    print(f"[*] Fetching: {pdf_url}")
    req = urllib.request.Request(pdf_url, headers={'User-Agent': 'Mozilla/5.0'})
    pdf_bytes = io.BytesIO(urllib.request.urlopen(req).read())
    reader = pypdf.PdfReader(pdf_bytes)

    print(f"[*] Total pages: {len(reader.pages)}")
    riders_data = []

    full_text = "\n".join([page.extract_text() for page in reader.pages])

    # Pattern to match rider header: e.g. "ITAFrancesco BAGNAIA1st" or "SPAJorge MARTIN2nd"
    # Matches lap rows: e.g. "1'53.1692 27.896 30.377 27.144 342.8 27.752"
    lines = full_text.splitlines()
    
    current_rider = None
    
    for line in lines:
        line_clean = line.strip()
        
        # Check for rider block
        if "Team" in line_clean and any(pos in line_clean for pos in ["1st", "2nd", "3rd", "th"]):
            current_rider = {
                "header": line_clean,
                "front_tyre": "Unknown",
                "rear_tyre": "Unknown",
                "laps": []
            }
            riders_data.append(current_rider)
            continue
            
        if current_rider and "Slick-" in line_clean:
            # Capture tire selection
            tyre_match = re.findall(r'Slick-(Soft|Medium|Hard)', line_clean)
            if len(tyre_match) >= 2:
                current_rider["front_tyre"] = f"Slick-{tyre_match[0]}"
                current_rider["rear_tyre"] = f"Slick-{tyre_match[1]}"
            elif len(tyre_match) == 1:
                current_rider["front_tyre"] = f"Slick-{tyre_match[0]}"

        # Check for lap row pattern: e.g. 1'54.9671 29.522 30.419 27.155 207.2 27.871
        # regex for lap line: lap_time, lap_num, t1, t2, t3, speed, t4
        lap_match = re.search(r"(\d+'\d{2}\.\d{3})\s*(\d+)?\s+(\d{2}\.\d{3})\s+(\d{2}\.\d{3})\s+(\d{2}\.\d{3})\s+(\d{3}\.\d)\s+(\d{2}\.\d{3})", line_clean)
        if current_rider and lap_match:
            lap_time = lap_match.group(1)
            lap_num = int(lap_match.group(2)) if lap_match.group(2) else len(current_rider["laps"]) + 1
            t1 = lap_match.group(3)
            t2 = lap_match.group(4)
            t3 = lap_match.group(5)
            speed = float(lap_match.group(6))
            t4 = lap_match.group(7)
            
            current_rider["laps"].append({
                "lap": lap_num,
                "lap_time": lap_time,
                "t1": t1,
                "t2": t2,
                "t3": t3,
                "speed_kmh": speed,
                "t4": t4
            })

    print(f"[+] Successfully extracted {len(riders_data)} rider performance datasets.")
    return {
        "source_url": pdf_url,
        "total_riders_parsed": len(riders_data),
        "data": riders_data[:5] # Sample preview
    }


if __name__ == "__main__":
    sample_url = "https://resources.motogp.com/files/results/2024/QAT/MotoGP/RAC/Analysis.pdf"
    result = parse_session_analysis(sample_url)
    print(json.dumps(result, indent=2))
