"""FieldForce - Main Router Integration
Original code from https://github.com/macleangm-debug/FieldForce
This file creates a combined router for all FieldForce routes to integrate into DataVision
"""
from fastapi import APIRouter

# Create a parent router with /fieldforce prefix
fieldforce_router = APIRouter(prefix="/fieldforce", tags=["FieldForce"])

# Import all the original FieldForce route modules
from fieldforce.routes.auth_routes import router as auth_router
from fieldforce.routes.org_routes import router as org_router
from fieldforce.routes.project_routes import router as project_router
from fieldforce.routes.form_routes import router as form_router
from fieldforce.routes.submission_routes import router as submission_router
from fieldforce.routes.case_routes import router as case_router
from fieldforce.routes.case_import_routes import router as case_import_router
from fieldforce.routes.export_routes import router as export_router
from fieldforce.routes.media_routes import router as media_router
from fieldforce.routes.gps_routes import router as gps_router
from fieldforce.routes.template_routes import router as template_router
from fieldforce.routes.logic_routes import router as logic_router
from fieldforce.routes.widget_routes import router as widget_router
from fieldforce.routes.device_routes import router as device_router
from fieldforce.routes.rbac_routes import router as rbac_router
from fieldforce.routes.analytics_routes import router as analytics_router
from fieldforce.routes.translation_routes import router as translation_router
from fieldforce.routes.paradata_routes import router as paradata_router
from fieldforce.routes.revision_routes import router as revision_router
from fieldforce.routes.dataset_routes import router as dataset_router
from fieldforce.routes.cawi_routes import router as cawi_router
from fieldforce.routes.quality_ai_routes import router as quality_ai_router
from fieldforce.routes.dashboard_routes import router as dashboard_router

# Include all route modules into the fieldforce router
fieldforce_router.include_router(auth_router)
fieldforce_router.include_router(org_router)
fieldforce_router.include_router(project_router)
fieldforce_router.include_router(form_router)
fieldforce_router.include_router(submission_router)
fieldforce_router.include_router(case_router)
fieldforce_router.include_router(case_import_router)
fieldforce_router.include_router(export_router)
fieldforce_router.include_router(media_router)
fieldforce_router.include_router(gps_router)
fieldforce_router.include_router(template_router)
fieldforce_router.include_router(logic_router)
fieldforce_router.include_router(widget_router)
fieldforce_router.include_router(device_router)
fieldforce_router.include_router(rbac_router)
fieldforce_router.include_router(analytics_router)
fieldforce_router.include_router(translation_router)
fieldforce_router.include_router(paradata_routes)
fieldforce_router.include_router(revision_router)
fieldforce_router.include_router(dataset_router)
fieldforce_router.include_router(cawi_router)
fieldforce_router.include_router(quality_ai_router)
fieldforce_router.include_router(dashboard_router)


# Health check endpoint for FieldForce
@fieldforce_router.get("/")
async def fieldforce_root():
    return {"message": "FieldForce API is running", "version": "1.0.0", "provider": "DataVision International"}


@fieldforce_router.get("/health")
async def fieldforce_health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "FieldForce"}
