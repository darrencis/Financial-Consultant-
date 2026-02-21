"""Live Canadian market rate fetcher. Fallback if APIs fail."""
from datetime import datetime, timedelta
import asyncio

import httpx
import yfinance as yf

from engine.models import LiveRates

FALLBACK_RATES = LiveRates(
    hisa_rate=4.20,
    gic_1yr_rate=3.50,
    etf_vgro_ytd=6.50,
    boc_overnight=2.25,
    fetched_at=datetime(2026, 2, 1),
    is_fallback=True,
)

_CACHE: LiveRates | None = None
_CACHE_EXPIRY: datetime | None = None
_CACHE_TTL = timedelta(hours=1)


async def fetch_live_rates() -> LiveRates:
    """Fetch VGRO.TO, PSA.TO, BoC overnight. Cache 1 hour. Never crash."""
    global _CACHE, _CACHE_EXPIRY
    if _CACHE and _CACHE_EXPIRY and datetime.utcnow() < _CACHE_EXPIRY:
        return _CACHE

    try:
        loop = asyncio.get_event_loop()
        hisa_rate, gic_rate, etf_ytd = await loop.run_in_executor(
            None, _fetch_yfinance_rates
        )
        boc_rate = await _fetch_boc_rate()
        _CACHE = LiveRates(
            hisa_rate=hisa_rate,
            gic_1yr_rate=gic_rate,
            etf_vgro_ytd=etf_ytd,
            boc_overnight=boc_rate,
            fetched_at=datetime.utcnow(),
            is_fallback=False,
        )
        _CACHE_EXPIRY = datetime.utcnow() + _CACHE_TTL
        return _CACHE
    except Exception:
        return FALLBACK_RATES


def _fetch_yfinance_rates() -> tuple[float, float, float]:
    """Fetch VGRO.TO 1yr return, PSA.TO dividend yield. Sync for yfinance."""
    hisa_rate = FALLBACK_RATES.hisa_rate
    gic_rate = FALLBACK_RATES.gic_1yr_rate
    etf_ytd = FALLBACK_RATES.etf_vgro_ytd

    try:
        vgro = yf.Ticker("VGRO.TO")
        hist = vgro.history(period="1y")
        if hist is not None and not hist.empty:
            start = hist["Close"].iloc[0]
            end = hist["Close"].iloc[-1]
            if start > 0:
                etf_ytd = ((end - start) / start) * 100
    except Exception:
        pass

    try:
        psa = yf.Ticker("PSA.TO")
        info = psa.info
        if info and "yield" in info:
            hisa_rate = float(info.get("yield", hisa_rate)) * 100
        elif info and "dividendYield" in info:
            hisa_rate = float(info.get("dividendYield", hisa_rate)) * 100
    except Exception:
        pass

    gic_rate = hisa_rate - 0.7
    return (hisa_rate, gic_rate, etf_ytd)


async def _fetch_boc_rate() -> float:
    """Fetch BoC overnight rate."""
    url = "https://www.bankofcanada.ca/valet/observations/V39079/json?recent=1"
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            r = await client.get(url)
            r.raise_for_status()
            data = r.json()
            obs = data.get("observations", [])
            if obs:
                val = obs[0].get("V39079", {}).get("v")
                if val:
                    return float(val)
    except Exception:
        pass
    return FALLBACK_RATES.boc_overnight
