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


# ==================== PRODUCT-SPECIFIC CONVENIENCE ENDPOINTS ====================

@router.post("/survey360/survey-invite")
async def send_survey_invite(
    to_email: EmailStr,
    name: str,
    survey_name: str,
    survey_link: str,
    deadline: Optional[str] = None
):
    """Send Survey360 survey invitation"""
    details = {"Survey Name": survey_name}
    if deadline:
        details["Deadline"] = deadline
    
    result = await email_service.send_product_notification(
        to_email=to_email,
        name=name,
        product="survey360",
        subject=f"You're Invited: {survey_name}",
        message="you have been invited to participate in a survey. Your feedback is valuable to us.",
        action_text="Take Survey",
        action_link=survey_link,
        details=details
    )
    return result


@router.post("/survey360/survey-complete")
async def send_survey_complete(
    to_email: EmailStr,
    name: str,
    survey_name: str,
    responses_count: int
):
    """Send Survey360 survey completion notification"""
    result = await email_service.send_product_notification(
        to_email=to_email,
        name=name,
        product="survey360",
        subject=f"Survey Complete: {survey_name}",
        message=f"your survey '{survey_name}' has been completed with {responses_count} responses.",
        action_text="View Results",
        action_link="https://datavision.co.tz/solutions/survey360/app/dashboard",
        details={
            "Survey Name": survey_name,
            "Total Responses": str(responses_count)
        }
    )
    return result


@router.post("/fieldforce/data-sync")
async def send_fieldforce_sync_notification(
    to_email: EmailStr,
    name: str,
    records_synced: int,
    project_name: str
):
    """Send FieldForce data sync notification"""
    result = await email_service.send_product_notification(
        to_email=to_email,
        name=name,
        product="fieldforce",
        subject=f"Data Synced: {project_name}",
        message=f"your field data has been successfully synced to the cloud.",
        action_text="View Data",
        action_link="https://datavision.co.tz/solutions/fieldforce/app/dashboard",
        details={
            "Project": project_name,
            "Records Synced": str(records_synced)
        }
    )
    return result


@router.post("/fieldforce/assignment")
async def send_fieldforce_assignment(
    to_email: EmailStr,
    name: str,
    project_name: str,
    location: str,
    due_date: str
):
    """Send FieldForce field assignment notification"""
    result = await email_service.send_product_notification(
        to_email=to_email,
        name=name,
        product="fieldforce",
        subject=f"New Assignment: {project_name}",
        message="you have been assigned a new field data collection task.",
        action_text="View Assignment",
        action_link="https://datavision.co.tz/solutions/fieldforce/app/assignments",
        details={
            "Project": project_name,
            "Location": location,
            "Due Date": due_date
        }
    )
    return result


@router.post("/datapulse/pipeline-status")
async def send_datapulse_pipeline_status(
    to_email: EmailStr,
    name: str,
    pipeline_name: str,
    status: str,
    records_processed: Optional[int] = None
):
    """Send DataPulse pipeline status notification"""
    details = {"Pipeline": pipeline_name, "Status": status}
    if records_processed:
        details["Records Processed"] = str(records_processed)
    
    result = await email_service.send_product_notification(
        to_email=to_email,
        name=name,
        product="datapulse",
        subject=f"Pipeline {status.capitalize()}: {pipeline_name}",
        message=f"your data pipeline '{pipeline_name}' has {status}.",
        action_text="View Pipeline",
        action_link="https://datavision.co.tz/solutions/datapulse/app/pipelines",
        details=details
    )
    return result


@router.post("/datapulse/report-ready")
async def send_datapulse_report_ready(
    to_email: EmailStr,
    name: str,
    report_name: str,
    report_link: str
):
    """Send DataPulse report ready notification"""
    result = await email_service.send_product_notification(
        to_email=to_email,
        name=name,
        product="datapulse",
        subject=f"Report Ready: {report_name}",
        message=f"your report '{report_name}' is ready for download.",
        action_text="Download Report",
        action_link=report_link,
        details={"Report Name": report_name}
    )
    return result
