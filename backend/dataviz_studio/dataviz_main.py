"""
DataViz Studio - Main Router
Combines all DataViz Studio route modules for integration with the main DataVision platform.
"""
from fastapi import APIRouter
from .routes.dataviz_auth import router as auth_router
from .routes.dataviz_datasets import router as datasets_router
from .routes.dataviz_dashboards import router as dashboards_router
from .routes.dataviz_widgets import router as widgets_router
from .routes.dataviz_data_sources import router as data_sources_router
from .routes.dataviz_templates import router as templates_router

# Create main router for DataViz Studio
dataviz_router = APIRouter(prefix="/dataviz", tags=["DataViz Studio"])

# Include all sub-routers
dataviz_router.include_router(auth_router)
dataviz_router.include_router(datasets_router)
dataviz_router.include_router(dashboards_router)
dataviz_router.include_router(widgets_router)
dataviz_router.include_router(data_sources_router)
dataviz_router.include_router(templates_router)
