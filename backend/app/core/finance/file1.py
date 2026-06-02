import json
import yfinance as yf
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

# load sector mapper
with open(BASE_DIR / "sector_mapper.txt", "r") as f:
    sector_map = json.load(f)

metadata = {}

for ticker, sector in sector_map.items():
    try:
        info = yf.Ticker(ticker).info

        description = (info.get("longBusinessSummary", "No description") or "")[:180]

        metadata[ticker] = {
            "ticker": ticker,
            "name": info.get("longName", ticker),
            "sector": sector,
            "description": description
        }

        print("OK", ticker)

    except Exception as e:
        print("FAIL", ticker, e)


# write TS file (THIS replaces your second snippet)
out_path = BASE_DIR / "assetMetadata.ts"

with open(out_path, "w", encoding="utf-8") as f:

    f.write("export type AssetMetadata = {\n")
    f.write("  ticker: string;\n")
    f.write("  name: string;\n")
    f.write("  sector: string;\n")
    f.write("  description: string;\n")
    f.write("};\n\n")

    f.write("export const assetMetadata: Record<string, AssetMetadata> = {\n")

    for ticker, data in metadata.items():

        name = (data["name"] or "").replace('"', '\\"')
        desc = (data["description"] or "").replace('"', '\\"')

        f.write(f'''  "{ticker}": {{
    ticker: "{ticker}",
    name: "{name}",
    sector: "{data["sector"]}",
    description: "{desc}"
  }},
''')

    f.write("};\n")