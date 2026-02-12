"""
WebSocket Manager for Real-Time Notifications
Handles WebSocket connections and broadcasting to admin clients
"""

from fastapi import WebSocket
from typing import Dict, List, Set
import json
import asyncio
from datetime import datetime, timezone

class ConnectionManager:
    """Manages WebSocket connections for real-time notifications."""
    
    def __init__(self):
        # Map of admin email to their WebSocket connections (supports multiple tabs)
        self.active_connections: Dict[str, List[WebSocket]] = {}
        # All active connections for broadcasting
        self.all_connections: Set[WebSocket] = set()
        
    async def connect(self, websocket: WebSocket, admin_email: str = None):
        """Accept and store a new WebSocket connection."""
        await websocket.accept()
        self.all_connections.add(websocket)
        
        if admin_email:
            if admin_email not in self.active_connections:
                self.active_connections[admin_email] = []
            self.active_connections[admin_email].append(websocket)
        
        # Send connection confirmation
        await websocket.send_json({
            "type": "connection",
            "status": "connected",
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
    
    def disconnect(self, websocket: WebSocket, admin_email: str = None):
        """Remove a WebSocket connection."""
        self.all_connections.discard(websocket)
        
        if admin_email and admin_email in self.active_connections:
            if websocket in self.active_connections[admin_email]:
                self.active_connections[admin_email].remove(websocket)
            if not self.active_connections[admin_email]:
                del self.active_connections[admin_email]
    
    async def send_personal(self, message: dict, admin_email: str):
        """Send a message to a specific admin's connections."""
        if admin_email in self.active_connections:
            for connection in self.active_connections[admin_email]:
                try:
                    await connection.send_json(message)
                except Exception:
                    pass
    
    async def broadcast(self, message: dict):
        """Broadcast a message to all connected admins."""
        disconnected = []
        for connection in self.all_connections:
            try:
                await connection.send_json(message)
            except Exception:
                disconnected.append(connection)
        
        # Clean up disconnected connections
        for conn in disconnected:
            self.all_connections.discard(conn)
    
    async def send_notification(
        self, 
        notification_type: str,
        title: str, 
        description: str, 
        data: dict = None,
        priority: str = "normal"
    ):
        """Send a notification to all connected admins."""
        notification = {
            "type": "notification",
            "notification_type": notification_type,
            "title": title,
            "description": description,
            "data": data or {},
            "priority": priority,  # "low", "normal", "high", "urgent"
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "read": False
        }
        await self.broadcast(notification)
        return notification
    
    def get_connection_count(self) -> int:
        """Get the number of active connections."""
        return len(self.all_connections)
    
    def get_connected_admins(self) -> List[str]:
        """Get list of connected admin emails."""
        return list(self.active_connections.keys())


# Global connection manager instance
notification_manager = ConnectionManager()


# Notification types for different events
class NotificationType:
    EXPERT_REGISTRATION = "expert_registration"
    USER_SIGNUP = "user_signup"
    JOB_APPLICATION = "job_application"
    NEW_LEAD = "new_lead"
    PROJECT_UPDATE = "project_update"
    PAYMENT_RECEIVED = "payment_received"
    EXPERT_VERIFIED = "expert_verified"
    SYSTEM_ALERT = "system_alert"


# Helper functions to send specific notification types
async def notify_expert_registration(expert_name: str, expertise: str):
    """Send notification when a new expert registers."""
    await notification_manager.send_notification(
        notification_type=NotificationType.EXPERT_REGISTRATION,
        title="New Expert Registration",
        description=f"{expert_name} registered as {expertise} expert",
        data={"expert_name": expert_name, "expertise": expertise},
        priority="normal"
    )


async def notify_user_signup(user_email: str, product: str = None):
    """Send notification when a new user signs up."""
    desc = f"New user registered: {user_email}"
    if product:
        desc += f" for {product}"
    
    await notification_manager.send_notification(
        notification_type=NotificationType.USER_SIGNUP,
        title="New User Registration",
        description=desc,
        data={"user_email": user_email, "product": product},
        priority="normal"
    )


async def notify_job_application(applicant_name: str, job_title: str):
    """Send notification when someone applies for a job."""
    await notification_manager.send_notification(
        notification_type=NotificationType.JOB_APPLICATION,
        title="New Job Application",
        description=f"{applicant_name} applied for {job_title}",
        data={"applicant_name": applicant_name, "job_title": job_title},
        priority="normal"
    )


async def notify_new_lead(company: str, contact_name: str):
    """Send notification when a new lead is created."""
    await notification_manager.send_notification(
        notification_type=NotificationType.NEW_LEAD,
        title="New Lead Inquiry",
        description=f"New inquiry from {contact_name} at {company}",
        data={"company": company, "contact_name": contact_name},
        priority="high"
    )


async def notify_payment_received(amount: float, product: str, customer: str):
    """Send notification when payment is received."""
    await notification_manager.send_notification(
        notification_type=NotificationType.PAYMENT_RECEIVED,
        title="Payment Received",
        description=f"${amount:,.2f} received from {customer} for {product}",
        data={"amount": amount, "product": product, "customer": customer},
        priority="high"
    )


async def notify_system_alert(message: str, severity: str = "warning"):
    """Send system alert notification."""
    priority_map = {"info": "low", "warning": "normal", "error": "high", "critical": "urgent"}
    await notification_manager.send_notification(
        notification_type=NotificationType.SYSTEM_ALERT,
        title="System Alert",
        description=message,
        data={"severity": severity},
        priority=priority_map.get(severity, "normal")
    )
