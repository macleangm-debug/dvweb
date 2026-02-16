"""
Email API Routes for DataVision SSO
Centralized email endpoints with product customization support.
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any, List
import logging

from services.email_service import email_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/email", tags=["Email"])


# ==================== REQUEST MODELS ====================

class WelcomeEmailRequest(BaseModel):
    to_email: EmailStr
    name: str
    product: Optional[str] = None  # survey360, fieldforce, datapulse

class PasswordResetRequest(BaseModel):
    to_email: EmailStr
    name: str
    reset_link: str

class VerificationEmailRequest(BaseModel):
    to_email: EmailStr
    name: str
    verification_link: str

class SecurityAlertRequest(BaseModel):
    to_email: EmailStr
    name: str
    alert_type: str  # new_login, password_changed, suspicious_activity
    details: Optional[Dict[str, Any]] = None

class ProductNotificationRequest(BaseModel):
    to_email: EmailStr
    name: str
    product: str  # survey360, fieldforce, datapulse
    subject: str
    message: str
    action_text: Optional[str] = None
    action_link: Optional[str] = None
    details: Optional[Dict[str, Any]] = None

class BulkEmailRequest(BaseModel):
    recipients: List[EmailStr]
    subject: str
    message: str
    product: Optional[str] = None


# ==================== ENDPOINTS ====================

@router.get("/status")
async def email_service_status():
    """Check if email service is configured"""
    return {
        "configured": email_service.is_configured,
        "sender_email": email_service.sender_email if email_service.is_configured else None,
        "sender_name": email_service.sender_name
    }


@router.post("/welcome")
async def send_welcome_email(request: WelcomeEmailRequest):
    """Send welcome email to new user"""
    result = await email_service.send_welcome_email(
        to_email=request.to_email,
        name=request.name,
        product=request.product
    )
    
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result["message"])
    
    return result


@router.post("/password-reset")
async def send_password_reset(request: PasswordResetRequest):
    """Send password reset email"""
    result = await email_service.send_password_reset(
        to_email=request.to_email,
        name=request.name,
        reset_link=request.reset_link
    )
    
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result["message"])
    
    return result


@router.post("/verification")
async def send_verification_email(request: VerificationEmailRequest):
    """Send email verification"""
    result = await email_service.send_verification_email(
        to_email=request.to_email,
        name=request.name,
        verification_link=request.verification_link
    )
    
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result["message"])
    
    return result


@router.post("/security-alert")
async def send_security_alert(request: SecurityAlertRequest):
    """Send security alert email"""
    valid_alert_types = ["new_login", "password_changed", "suspicious_activity"]
    if request.alert_type not in valid_alert_types:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid alert_type. Must be one of: {valid_alert_types}"
        )
    
    result = await email_service.send_security_alert(
        to_email=request.to_email,
        name=request.name,
        alert_type=request.alert_type,
        details=request.details
    )
    
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result["message"])
    
    return result


@router.post("/product-notification")
async def send_product_notification(request: ProductNotificationRequest):
    """Send product-specific notification email"""
    valid_products = ["survey360", "fieldforce", "datapulse"]
    if request.product not in valid_products:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid product. Must be one of: {valid_products}"
        )
    
    result = await email_service.send_product_notification(
        to_email=request.to_email,
        name=request.name,
        product=request.product,
        subject=request.subject,
        message=request.message,
        action_text=request.action_text,
        action_link=request.action_link,
        details=request.details
    )
    
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result["message"])
    
    return result


# ==================== PRODUCT-SPECIFIC REQUEST MODELS ====================

class Survey360InviteRequest(BaseModel):
    to_email: EmailStr
    name: str
    survey_name: str
    survey_link: str
    deadline: Optional[str] = None

class Survey360CompleteRequest(BaseModel):
    to_email: EmailStr
    name: str
    survey_name: str
    responses_count: int

class FieldForceDataSyncRequest(BaseModel):
    to_email: EmailStr
    name: str
    records_synced: int
    project_name: str

class FieldForceAssignmentRequest(BaseModel):
    to_email: EmailStr
    name: str
    project_name: str
    location: str
    due_date: str

class DataPulsePipelineRequest(BaseModel):
    to_email: EmailStr
    name: str
    pipeline_name: str
    status: str
    records_processed: Optional[int] = None

class DataPulseReportRequest(BaseModel):
    to_email: EmailStr
    name: str
    report_name: str
    report_link: str

class GenericProductEmailRequest(BaseModel):
    """Generic endpoint for products to send customized branded emails"""
    to_email: EmailStr
    name: str
    product: str  # survey360, fieldforce, datapulse
    subject: str
    template_type: str = "notification"  # notification, alert, success, info
    template_data: Dict[str, Any] = {}  # Custom template variables


# ==================== PRODUCT-SPECIFIC CONVENIENCE ENDPOINTS ====================

@router.post("/survey360/survey-invite")
async def send_survey_invite(request: Survey360InviteRequest):
    """Send Survey360 survey invitation"""
    details = {"Survey Name": request.survey_name}
    if request.deadline:
        details["Deadline"] = request.deadline
    
    result = await email_service.send_product_notification(
        to_email=request.to_email,
        name=request.name,
        product="survey360",
        subject=f"You're Invited: {request.survey_name}",
        message="you have been invited to participate in a survey. Your feedback is valuable to us.",
        action_text="Take Survey",
        action_link=request.survey_link,
        details=details
    )
    return result


@router.post("/survey360/survey-complete")
async def send_survey_complete(request: Survey360CompleteRequest):
    """Send Survey360 survey completion notification"""
    result = await email_service.send_product_notification(
        to_email=request.to_email,
        name=request.name,
        product="survey360",
        subject=f"Survey Complete: {request.survey_name}",
        message=f"your survey '{request.survey_name}' has been completed with {request.responses_count} responses.",
        action_text="View Results",
        action_link="https://datavision.co.tz/solutions/survey360/app/dashboard",
        details={
            "Survey Name": request.survey_name,
            "Total Responses": str(request.responses_count)
        }
    )
    return result


@router.post("/fieldforce/data-sync")
async def send_fieldforce_sync_notification(request: FieldForceDataSyncRequest):
    """Send FieldForce data sync notification"""
    result = await email_service.send_product_notification(
        to_email=request.to_email,
        name=request.name,
        product="fieldforce",
        subject=f"Data Synced: {request.project_name}",
        message=f"your field data has been successfully synced to the cloud.",
        action_text="View Data",
        action_link="https://datavision.co.tz/solutions/fieldforce/app/dashboard",
        details={
            "Project": request.project_name,
            "Records Synced": str(request.records_synced)
        }
    )
    return result


@router.post("/fieldforce/assignment")
async def send_fieldforce_assignment(request: FieldForceAssignmentRequest):
    """Send FieldForce field assignment notification"""
    result = await email_service.send_product_notification(
        to_email=request.to_email,
        name=request.name,
        product="fieldforce",
        subject=f"New Assignment: {request.project_name}",
        message="you have been assigned a new field data collection task.",
        action_text="View Assignment",
        action_link="https://datavision.co.tz/solutions/fieldforce/app/assignments",
        details={
            "Project": request.project_name,
            "Location": request.location,
            "Due Date": request.due_date
        }
    )
    return result


@router.post("/datapulse/pipeline-status")
async def send_datapulse_pipeline_status(request: DataPulsePipelineRequest):
    """Send DataPulse pipeline status notification"""
    details = {"Pipeline": request.pipeline_name, "Status": request.status}
    if request.records_processed:
        details["Records Processed"] = str(request.records_processed)
    
    result = await email_service.send_product_notification(
        to_email=request.to_email,
        name=request.name,
        product="datapulse",
        subject=f"Pipeline {request.status.capitalize()}: {request.pipeline_name}",
        message=f"your data pipeline '{request.pipeline_name}' has {request.status}.",
        action_text="View Pipeline",
        action_link="https://datavision.co.tz/solutions/datapulse/app/pipelines",
        details=details
    )
    return result


@router.post("/datapulse/report-ready")
async def send_datapulse_report_ready(request: DataPulseReportRequest):
    """Send DataPulse report ready notification"""
    result = await email_service.send_product_notification(
        to_email=request.to_email,
        name=request.name,
        product="datapulse",
        subject=f"Report Ready: {request.report_name}",
        message=f"your report '{request.report_name}' is ready for download.",
        action_text="Download Report",
        action_link=request.report_link,
        details={"Report Name": request.report_name}
    )
    return result


@router.post("/send-product-email")
async def send_generic_product_email(request: GenericProductEmailRequest):
    """
    Generic endpoint for products to send customized branded emails.
    Products can specify custom template data for rich email content.
    """
    valid_products = ["survey360", "fieldforce", "datapulse"]
    if request.product not in valid_products:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid product. Must be one of: {valid_products}"
        )
    
    # Extract template data
    message = request.template_data.get("message", "You have a new notification.")
    action_text = request.template_data.get("action_text")
    action_link = request.template_data.get("action_link")
    details = request.template_data.get("details", {})
    
    result = await email_service.send_product_notification(
        to_email=request.to_email,
        name=request.name,
        product=request.product,
        subject=request.subject,
        message=message,
        action_text=action_text,
        action_link=action_link,
        details=details
    )
    
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result["message"])
    
    return result
