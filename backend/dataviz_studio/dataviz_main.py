"""
DataViz Studio - Main Router
Combines all DataViz Studio route modules for integration with the main DataVision platform.
"""
from fastapi import APIRouter

# Create main router for DataViz Studio
dataviz_router = APIRouter(prefix="/dataviz", tags=["DataViz Studio"])

# Import and include routers safely
try:
    from .routes.dataviz_auth import router as auth_router
    dataviz_router.include_router(auth_router)
except ImportError as e:
    print(f"Warning: Could not import dataviz_auth routes: {e}")

try:
    from .routes.dataviz_datasets import router as datasets_router
    dataviz_router.include_router(datasets_router)
except ImportError as e:
    print(f"Warning: Could not import dataviz_datasets routes: {e}")

try:
    from .routes.dataviz_dashboards import router as dashboards_router
    dataviz_router.include_router(dashboards_router)
except ImportError as e:
    print(f"Warning: Could not import dataviz_dashboards routes: {e}")

try:
    from .routes.dataviz_widgets import router as widgets_router
    dataviz_router.include_router(widgets_router)
except ImportError as e:
    print(f"Warning: Could not import dataviz_widgets routes: {e}")

try:
    from .routes.dataviz_data_sources import router as data_sources_router
    dataviz_router.include_router(data_sources_router)
except ImportError as e:
    print(f"Warning: Could not import dataviz_data_sources routes: {e}")

try:
    from .routes.dataviz_templates import router as templates_router
    dataviz_router.include_router(templates_router)
except ImportError as e:
    print(f"Warning: Could not import dataviz_templates routes: {e}")
