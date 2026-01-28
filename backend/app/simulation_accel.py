"""
Numba-accelerated Monte Carlo helper with safe numpy fallback.

Design:
- Generate a matrix of standard normals using numpy.
- Use numba njit kernel to compute geometric Brownian motion paths given the random matrix.
- If numba not available or kernel fails, fallback to a numpy-only implementation.

This approach avoids trying to call numpy RNG directly inside njit (which is more fragile).
"""

import numpy as np
import math
import logging

logger = logging.getLogger(__name__)

try:
    import numba as nb
    HAVE_NUMBA = True
except Exception:
    HAVE_NUMBA = False

if HAVE_NUMBA:
    @nb.njit(parallel=True)
    def _simulate_kernel(z, initial_value, drift, vol, dt):
        n_paths, steps = z.shape
        paths = np.empty((n_paths, steps + 1), dtype=np.float64)
        for i in nb.prange(n_paths):
            paths[i, 0] = initial_value
            for t in range(1, steps + 1):
                # z[i, t-1] is the pre-generated standard normal
                paths[i, t] = paths[i, t-1] * math.exp(drift * dt + vol * math.sqrt(dt) * z[i, t-1])
        return paths

def monte_carlo_paths_accel(initial_value: float, expected_return: float, volatility: float, years: int, n_paths: int = 10000, steps_per_year: int = 12):
    """
    Returns dict with aggregated stats: final_mean, p10, p90, etc.
    Uses numba kernel if available for speed.
    """
    dt = 1.0 / steps_per_year
    steps = int(years * steps_per_year)
    # Pre-generate random normals (shape: n_paths x steps)
    z = np.random.normal(0.0, 1.0, size=(n_paths, steps)).astype(np.float64)
    drift = expected_return - 0.5 * volatility * volatility
    if HAVE_NUMBA:
        try:
            paths = _simulate_kernel(z, float(initial_value), float(drift), float(volatility), float(dt))
            final = paths[:, -1]
            return {
                "final_mean": float(np.mean(final)),
                "final_median": float(np.median(final)),
                "p10": float(np.percentile(final, 10)),
                "p90": float(np.percentile(final, 90))
            }
        except Exception as e:
            logger.exception("Numba kernel failed, falling back to numpy implementation: %s", e)
    # Fallback numpy implementation
    paths = np.zeros((n_paths, steps + 1), dtype=np.float64)
    paths[:, 0] = initial_value
    for t in range(1, steps + 1):
        paths[:, t] = paths[:, t-1] * np.exp(drift * dt + volatility * np.sqrt(dt) * z[:, t-1])
    final = paths[:, -1]
    return {
        "final_mean": float(np.mean(final)),
        "final_median": float(np.median(final)),
        "p10": float(np.percentile(final, 10)),
        "p90": float(np.percentile(final, 90))
    }