"""Survey360 - Main Router Integration
Copied AS IS from https://github.com/macleangm-debug/Survey360
Integrates all 46 route modules into a single router for DataVision
"""
from fastapi import APIRouter, Request
import sys
import os

# Add survey360 package to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Create main router with survey360 prefix
survey360_router = APIRouter(prefix="/survey360", tags=["Survey360"])

# Import all route modules from the routes directory
from routes.auth_routes import router as auth_router
from routes.org_routes import router as org_router
from routes.project_routes import router as project_router
from routes.form_routes import router as form_router
from routes.survey_routes import router as survey_router
from routes.submission_routes import router as submission_router
from routes.case_routes import router as case_router
from routes.dashboard_routes import router as dashboard_router
from routes.analysis_routes import router as analysis_router
from routes.export_routes import router as export_router
from routes.analytics_routes import router as analytics_router
from routes.report_routes import router as report_router
from routes.stats_routes import router as stats_router
from routes.survey_stats_routes import router as survey_stats_router
from routes.gps_routes import router as gps_router
from routes.media_routes import router as media_router
from routes.device_routes import router as device_router
from routes.job_routes import router as job_router
from routes.logic_routes import router as logic_router
from routes.translation_routes import router as translation_router
from routes.template_routes import router as template_router
from routes.cati_routes import router as cati_router
from routes.cawi_routes import router as cawi_router
from routes.backcheck_routes import router as backcheck_router
from routes.quality_ai_routes import router as quality_ai_router
from routes.workflow_routes import router as workflow_router
from routes.collaboration_routes import router as collaboration_router
from routes.rbac_routes import router as rbac_router
from routes.security_routes import router as security_router
from routes.audit_routes import router as audit_router
from routes.admin_routes import router as admin_router
from routes.versioning_routes import router as versioning_router
from routes.revision_routes import router as revision_router
from routes.reproducibility_routes import router as reproducibility_router
from routes.preload_routes import router as preload_router
from routes.paradata_routes import router as paradata_router
from routes.duplicate_routes import router as duplicate_router
from routes.case_import_routes import router as case_import_router
from routes.dataset_routes import router as dataset_router
from routes.simulation_routes import router as simulation_router
from routes.analysis_export_routes import router as analysis_export_router
from routes.widget_routes import router as widget_router
from routes.dashboard_builder_routes import router as dashboard_builder_router
from routes.ai_copilot_routes import router as ai_copilot_router
from routes.advanced_models_routes import router as advanced_models_router

# Include all routers
survey360_router.include_router(auth_router)
survey360_router.include_router(org_router)
survey360_router.include_router(project_router)
survey360_router.include_router(form_router)
survey360_router.include_router(survey_router)
survey360_router.include_router(submission_router)
survey360_router.include_router(case_router)
survey360_router.include_router(dashboard_router)
survey360_router.include_router(analysis_router)
survey360_router.include_router(export_router)
survey360_router.include_router(analytics_router)
survey360_router.include_router(report_router)
survey360_router.include_router(stats_router)
survey360_router.include_router(survey_stats_router)
survey360_router.include_router(gps_router)
survey360_router.include_router(media_router)
survey360_router.include_router(device_router)
survey360_router.include_router(job_router)
survey360_router.include_router(logic_router)
survey360_router.include_router(translation_router)
survey360_router.include_router(template_router)
survey360_router.include_router(cati_router)
survey360_router.include_router(cawi_router)
survey360_router.include_router(backcheck_router)
survey360_router.include_router(quality_ai_router)
survey360_router.include_router(workflow_router)
survey360_router.include_router(collaboration_router)
survey360_router.include_router(rbac_router)
survey360_router.include_router(security_router)
survey360_router.include_router(audit_router)
survey360_router.include_router(admin_router)
survey360_router.include_router(versioning_router)
survey360_router.include_router(revision_router)
survey360_router.include_router(reproducibility_router)
survey360_router.include_router(preload_router)
survey360_router.include_router(paradata_router)
survey360_router.include_router(duplicate_router)
survey360_router.include_router(case_import_router)
survey360_router.include_router(dataset_router)
survey360_router.include_router(simulation_router)
survey360_router.include_router(analysis_export_router)
survey360_router.include_router(widget_router)
survey360_router.include_router(dashboard_builder_router)
survey360_router.include_router(ai_copilot_router)
survey360_router.include_router(advanced_models_router)

# Database initialization function
async def init_survey360_db(db):
    """Initialize Survey360 database indexes and demo data"""
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.users.create_index("id", unique=True)
    await db.organizations.create_index("slug", unique=True)
    await db.organizations.create_index("id", unique=True)
    await db.org_members.create_index([("org_id", 1), ("user_id", 1)], unique=True)
    await db.projects.create_index("id", unique=True)
    await db.projects.create_index("org_id")
    await db.forms.create_index("id", unique=True)
    await db.forms.create_index("project_id")
    await db.surveys.create_index("id", unique=True)
    await db.surveys.create_index("form_id")
    await db.submissions.create_index("id", unique=True)
    await db.submissions.create_index("survey_id")
    await db.submissions.create_index("submitted_at")
    
    print("Survey360: Database indexes created")
