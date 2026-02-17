"""
Centralized Email Service for DataVision SSO
Handles all email communications with product customization support.
"""

import os
import asyncio
import logging
from typing import Optional, Dict, Any
from datetime import datetime
import resend
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# Initialize Resend
RESEND_API_KEY = os.environ.get("RESEND_API_KEY")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
SENDER_NAME = os.environ.get("SENDER_NAME", "DataVision International")

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY


# ==================== EMAIL TEMPLATES ====================

def get_base_template(content: str, product: Optional[str] = None) -> str:
    """Base email template with DataVision branding and optional product customization"""
    
    # Product-specific colors and branding
    product_branding = {
        "survey360": {
            "color": "#8b5cf6",  # Purple
            "name": "Survey360",
            "tagline": "Survey Management Platform"
        },
        "fieldforce": {
            "color": "#10b981",  # Green
            "name": "FieldForce",
            "tagline": "Mobile Data Collection"
        },
        "datapulse": {
            "color": "#3b82f6",  # Blue
            "name": "DataPulse",
            "tagline": "Enterprise Data Collection"
        },
        "datavision": {
            "color": "#e63946",  # Red
            "name": "DataVision",
            "tagline": "Data-Driven Insights"
        }
    }
    
    branding = product_branding.get(product, product_branding["datavision"])
    
    return f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0a1628 0%, #1e293b 100%); padding: 30px 40px; border-radius: 12px 12px 0 0;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td>
                                        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">
                                            <span style="color: {branding['color']};">●</span> {branding['name']}
                                        </h1>
                                        <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 14px;">{branding['tagline']}</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            {content}
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 30px 40px; border-radius: 0 0 12px 12px; border-top: 1px solid #e2e8f0;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td style="color: #64748b; font-size: 12px; line-height: 1.6;">
                                        <p style="margin: 0 0 10px 0;">
                                            <strong style="color: #0a1628;">DataVision International</strong><br>
                                            Garden Road, Mikocheni Area, Dar es Salaam
                                        </p>
                                        <p style="margin: 0; color: #94a3b8;">
                                            &copy; {datetime.now().year} DataVision International. All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
"""


def welcome_email_template(name: str, product: Optional[str] = None) -> str:
    """Welcome email for new user registration"""
    content = f"""
        <h2 style="margin: 0 0 20px 0; color: #0a1628; font-size: 22px;">Welcome to DataVision, {name}!</h2>
        <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
            Thank you for creating your DataVision account. You now have access to our suite of data collection and analytics tools.
        </p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
            <tr>
                <td style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #e63946;">
                    <p style="margin: 0 0 10px 0; color: #0a1628; font-weight: 600;">What you can do:</p>
                    <ul style="margin: 0; padding-left: 20px; color: #475569;">
                        <li style="margin-bottom: 8px;">Access Survey360 for survey management</li>
                        <li style="margin-bottom: 8px;">Use FieldForce for mobile data collection</li>
                        <li style="margin-bottom: 8px;">Explore DataPulse for enterprise solutions</li>
                    </ul>
                </td>
            </tr>
        </table>
        <p style="margin: 0 0 30px 0; color: #475569; font-size: 16px; line-height: 1.6;">
            If you have any questions, our support team is here to help.
        </p>
        <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
                <td style="background-color: #e63946; border-radius: 6px;">
                    <a href="https://datavision.co.tz/auth/login" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px;">
                        Get Started
                    </a>
                </td>
            </tr>
        </table>
    """
    return get_base_template(content, product)


def password_reset_template(name: str, reset_link: str, expires_in: str = "1 hour") -> str:
    """Password reset email template"""
    content = f"""
        <h2 style="margin: 0 0 20px 0; color: #0a1628; font-size: 22px;">Reset Your Password</h2>
        <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
            Hi {name}, we received a request to reset your password. Click the button below to create a new password.
        </p>
        <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
            <tr>
                <td style="background-color: #e63946; border-radius: 6px;">
                    <a href="{reset_link}" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px;">
                        Reset Password
                    </a>
                </td>
            </tr>
        </table>
        <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;">
            This link will expire in <strong>{expires_in}</strong>.
        </p>
        <p style="margin: 0; color: #64748b; font-size: 14px;">
            If you didn't request this, you can safely ignore this email.
        </p>
    """
    return get_base_template(content)


def email_verification_template(name: str, verification_link: str) -> str:
    """Email verification template"""
    content = f"""
        <h2 style="margin: 0 0 20px 0; color: #0a1628; font-size: 22px;">Verify Your Email</h2>
        <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
            Hi {name}, please verify your email address to complete your DataVision account setup.
        </p>
        <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
            <tr>
                <td style="background-color: #10b981; border-radius: 6px;">
                    <a href="{verification_link}" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px;">
                        Verify Email
                    </a>
                </td>
            </tr>
        </table>
        <p style="margin: 0; color: #64748b; font-size: 14px;">
            If you didn't create an account, please ignore this email.
        </p>
    """
    return get_base_template(content)


def security_alert_template(name: str, alert_type: str, details: Dict[str, Any]) -> str:
    """Security alert email (new login, password changed, etc.)"""
    
    alert_configs = {
        "new_login": {
            "title": "New Login Detected",
            "icon": "🔐",
            "message": f"A new login was detected on your DataVision account.",
        },
        "password_changed": {
            "title": "Password Changed",
            "icon": "🔑",
            "message": "Your DataVision account password was successfully changed.",
        },
        "suspicious_activity": {
            "title": "Suspicious Activity",
            "icon": "⚠️",
            "message": "We detected unusual activity on your account.",
        }
    }
    
    config = alert_configs.get(alert_type, alert_configs["new_login"])
    
    details_html = ""
    if details:
        details_html = """
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 20px 0; background-color: #f8fafc; border-radius: 8px;">
        """
        for key, value in details.items():
            details_html += f"""
            <tr>
                <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px; width: 120px;">{key}</td>
                <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #0a1628; font-size: 14px;">{value}</td>
            </tr>
            """
        details_html += "</table>"
    
    content = f"""
        <h2 style="margin: 0 0 20px 0; color: #0a1628; font-size: 22px;">{config['icon']} {config['title']}</h2>
        <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
            Hi {name}, {config['message']}
        </p>
        {details_html}
        <p style="margin: 20px 0 0 0; color: #64748b; font-size: 14px;">
            If this wasn't you, please <a href="https://datavision.co.tz/auth/reset-password" style="color: #e63946;">reset your password</a> immediately.
        </p>
    """
    return get_base_template(content)


def product_notification_template(
    name: str, 
    product: str, 
    subject: str, 
    message: str, 
    action_text: Optional[str] = None,
    action_link: Optional[str] = None,
    details: Optional[Dict[str, Any]] = None
) -> str:
    """Generic product notification template with customization"""
    
    details_html = ""
    if details:
        details_html = """
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 20px 0; background-color: #f8fafc; border-radius: 8px;">
        """
        for key, value in details.items():
            details_html += f"""
            <tr>
                <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px; width: 140px;">{key}</td>
                <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #0a1628; font-size: 14px;">{value}</td>
            </tr>
            """
        details_html += "</table>"
    
    action_html = ""
    if action_text and action_link:
        product_colors = {
            "survey360": "#8b5cf6",
            "fieldforce": "#10b981",
            "datapulse": "#3b82f6",
        }
        color = product_colors.get(product, "#e63946")
        action_html = f"""
        <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
            <tr>
                <td style="background-color: {color}; border-radius: 6px;">
                    <a href="{action_link}" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px;">
                        {action_text}
                    </a>
                </td>
            </tr>
        </table>
        """
    
    content = f"""
        <h2 style="margin: 0 0 20px 0; color: #0a1628; font-size: 22px;">{subject}</h2>
        <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
            Hi {name}, {message}
        </p>
        {details_html}
        {action_html}
    """
    return get_base_template(content, product)


# ==================== EMAIL SERVICE CLASS ====================

class EmailService:
    """Centralized email service for DataVision SSO and all products"""
    
    def __init__(self):
        self.api_key = RESEND_API_KEY
        self.sender_email = SENDER_EMAIL
        self.sender_name = SENDER_NAME
        self.is_configured = bool(self.api_key)
    
    async def send_email(
        self, 
        to_email: str, 
        subject: str, 
        html_content: str,
        from_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """Send an email using Resend API"""
        
        if not self.is_configured:
            logger.warning("Email service not configured (RESEND_API_KEY missing)")
            return {
                "status": "skipped",
                "message": "Email service not configured",
                "email_id": None
            }
        
        sender = f"{from_name or self.sender_name} <{self.sender_email}>"
        
        params = {
            "from": sender,
            "to": [to_email],
            "subject": subject,
            "html": html_content
        }
        
        try:
            # Run sync SDK in thread to keep FastAPI non-blocking
            email = await asyncio.to_thread(resend.Emails.send, params)
            logger.info(f"Email sent successfully to {to_email}: {subject}")
            return {
                "status": "success",
                "message": f"Email sent to {to_email}",
                "email_id": email.get("id")
            }
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return {
                "status": "error",
                "message": str(e),
                "email_id": None
            }
    
    # ==================== CONVENIENCE METHODS ====================
    
    async def send_welcome_email(self, to_email: str, name: str, product: Optional[str] = None) -> Dict[str, Any]:
        """Send welcome email to new user"""
        html = welcome_email_template(name, product)
        return await self.send_email(
            to_email=to_email,
            subject="Welcome to DataVision!",
            html_content=html
        )
    
    async def send_password_reset(self, to_email: str, name: str, reset_link: str) -> Dict[str, Any]:
        """Send password reset email"""
        html = password_reset_template(name, reset_link)
        return await self.send_email(
            to_email=to_email,
            subject="Reset Your DataVision Password",
            html_content=html
        )
    
    async def send_verification_email(self, to_email: str, name: str, verification_link: str) -> Dict[str, Any]:
        """Send email verification"""
        html = email_verification_template(name, verification_link)
        return await self.send_email(
            to_email=to_email,
            subject="Verify Your Email Address",
            html_content=html
        )
    
    async def send_security_alert(
        self, 
        to_email: str, 
        name: str, 
        alert_type: str, 
        details: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Send security alert email"""
        html = security_alert_template(name, alert_type, details or {})
        subjects = {
            "new_login": "New Login to Your DataVision Account",
            "password_changed": "Your Password Was Changed",
            "suspicious_activity": "Security Alert: Unusual Activity Detected"
        }
        return await self.send_email(
            to_email=to_email,
            subject=subjects.get(alert_type, "Security Alert"),
            html_content=html
        )
    
    async def send_product_notification(
        self,
        to_email: str,
        name: str,
        product: str,
        subject: str,
        message: str,
        action_text: Optional[str] = None,
        action_link: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Send product-specific notification"""
        html = product_notification_template(
            name=name,
            product=product,
            subject=subject,
            message=message,
            action_text=action_text,
            action_link=action_link,
            details=details
        )
        return await self.send_email(
            to_email=to_email,
            subject=subject,
            html_content=html,
            from_name=f"DataVision {product.capitalize()}"
        )
    
    async def send_leaderboard_winner_email(
        self,
        to_email: str,
        name: str,
        rank: int,
        month: str,
        referrals: int,
        reward_type: str,
        reward_value: str,
        total_earnings: float = 0
    ) -> Dict[str, Any]:
        """Send monthly leaderboard winner notification"""
        
        rank_emojis = {1: "🥇", 2: "🥈", 3: "🥉"}
        rank_titles = {1: "1st Place", 2: "2nd Place", 3: "3rd Place"}
        rank_colors = {1: "#FFD700", 2: "#C0C0C0", 3: "#CD7F32"}
        
        emoji = rank_emojis.get(rank, "🏆")
        title = rank_titles.get(rank, f"{rank}th Place")
        color = rank_colors.get(rank, "#e63946")
        
        content = f"""
            <div style="text-align: center; padding: 20px 0;">
                <div style="font-size: 60px; margin-bottom: 10px;">{emoji}</div>
                <h1 style="margin: 0 0 10px 0; color: {color}; font-size: 32px;">Congratulations!</h1>
                <p style="margin: 0; color: #64748b; font-size: 18px;">You're a Top Partner for {month}!</p>
            </div>
            
            <div style="background: linear-gradient(135deg, {color}15, {color}05); border: 1px solid {color}30; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
                <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Achievement</p>
                <p style="margin: 0; color: #0a1628; font-size: 28px; font-weight: bold;">{title}</p>
                <p style="margin: 8px 0 0 0; color: #64748b; font-size: 16px;">{referrals} referrals this month</p>
            </div>
            
            <h2 style="margin: 24px 0 16px 0; color: #0a1628; font-size: 20px;">🎁 Your Reward</h2>
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Reward Type</td>
                        <td style="padding: 8px 0; color: #0a1628; font-size: 14px; font-weight: 600; text-align: right;">{reward_type}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Value</td>
                        <td style="padding: 8px 0; color: {color}; font-size: 14px; font-weight: 600; text-align: right;">{reward_value}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Total Earnings</td>
                        <td style="padding: 8px 0; color: #0a1628; font-size: 14px; font-weight: 600; text-align: right;">${total_earnings:,.2f}</td>
                    </tr>
                </table>
            </div>
            
            <p style="margin: 24px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                Hi {name}, thank you for being an amazing DataVision partner! Your dedication and hard work have earned you a top spot on our leaderboard.
            </p>
            
            <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 24px auto;">
                <tr>
                    <td style="background-color: #e63946; border-radius: 6px;">
                        <a href="https://datavision.co.tz/affiliate/dashboard" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px;">
                            View Dashboard
                        </a>
                    </td>
                </tr>
            </table>
            
            <p style="margin: 24px 0 0 0; color: #64748b; font-size: 14px; text-align: center;">
                Keep up the great work! The new month starts fresh - aim for #1! 🚀
            </p>
        """
        
        html = get_base_template(content)
        return await self.send_email(
            to_email=to_email,
            subject=f"{emoji} You're a Top Partner for {month}! - DataVision",
            html_content=html,
            from_name="DataVision Partner Program"
        )
    
    async def send_featured_partner_email(
        self,
        to_email: str,
        name: str,
        month: str
    ) -> Dict[str, Any]:
        """Send featured partner spotlight notification"""
        
        content = f"""
            <div style="text-align: center; padding: 20px 0;">
                <div style="font-size: 60px; margin-bottom: 10px;">⭐</div>
                <h1 style="margin: 0 0 10px 0; color: #e63946; font-size: 32px;">Featured Partner Spotlight!</h1>
                <p style="margin: 0; color: #64748b; font-size: 18px;">You've been selected for {month}!</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #e6394615, #e6394605); border: 1px solid #e6394630; border-radius: 12px; padding: 24px; margin: 24px 0;">
                <h2 style="margin: 0 0 16px 0; color: #0a1628; font-size: 20px;">What This Means</h2>
                <ul style="margin: 0; padding: 0 0 0 20px; color: #475569; font-size: 16px; line-height: 1.8;">
                    <li>Your profile will be featured on our homepage</li>
                    <li>Special "Featured Partner" badge on your dashboard</li>
                    <li>Priority listing in our partner directory</li>
                    <li>Social media shoutout on DataVision channels</li>
                </ul>
            </div>
            
            <p style="margin: 24px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                Hi {name}, congratulations! As one of our top-performing partners, you've earned a spot in our Featured Partner Spotlight. This is our way of recognizing your outstanding contributions to the DataVision partner network.
            </p>
            
            <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 24px auto;">
                <tr>
                    <td style="background-color: #e63946; border-radius: 6px;">
                        <a href="https://datavision.co.tz/affiliate/dashboard" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px;">
                            View Your Profile
                        </a>
                    </td>
                </tr>
            </table>
        """
        
        html = get_base_template(content)
        return await self.send_email(
            to_email=to_email,
            subject=f"⭐ You're Our Featured Partner for {month}! - DataVision",
            html_content=html,
            from_name="DataVision Partner Program"
        )


# Global email service instance
email_service = EmailService()
