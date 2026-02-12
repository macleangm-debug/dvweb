"""
Admin Dashboard & Analytics Routes
Provides comprehensive statistics and data for the admin panel
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import os
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel, Field
from typing import Optional, List
from bson import ObjectId
import uuid

router = APIRouter(prefix="/admin", tags=["Admin Dashboard"])
security = HTTPBearer()

SECRET_KEY = os.environ.get('JWT_SECRET', 'datavision-secret-key-2024')
ALGORITHM = "HS256"

def verify_admin_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def create_admin_dashboard_routes(db):
    """Factory function to create admin dashboard routes with database dependency"""
    
    # ==================== DASHBOARD STATS ====================
    
    @router.get("/dashboard/stats")
    async def get_dashboard_stats(payload: dict = Depends(verify_admin_token)):
        """Get comprehensive dashboard statistics."""
        try:
            # Count users by product
            fieldforce_users = await db.fieldforce_users.count_documents({})
            survey360_users = await db.survey360_users.count_documents({})
            datapulse_users = await db.datapulse_users.count_documents({})
            dv_users = await db.datavision_users.count_documents({})
            
            # Count other entities
            active_projects = await db.projects.count_documents({"status": "active"})
            total_experts = await db.experts.count_documents({})
            pending_verifications = await db.experts.count_documents({"status": "pending"})
            
            # Count leads
            total_leads = await db.leads.count_documents({})
            new_leads = await db.leads.count_documents({"status": "new"})
            
            # Count jobs and applications
            active_jobs = await db.jobs.count_documents({"status": "active"})
            total_applications = await db.job_applications.count_documents({})
            
            return {
                "totalRevenue": 245890,  # Mock - would come from payment system
                "revenueChange": 12.5,
                "activeUsers": fieldforce_users + survey360_users + datapulse_users + dv_users,
                "usersChange": 8.3,
                "activeProjects": active_projects or 34,
                "projectsChange": -2.1,
                "pendingTasks": pending_verifications + new_leads,
                "totalExperts": total_experts,
                "totalLeads": total_leads,
                "activeJobs": active_jobs,
                "totalApplications": total_applications,
                "solutionStats": {
                    "fieldforce": {
                        "users": fieldforce_users or 456,
                        "revenue": 89500,
                        "growth": 15.2
                    },
                    "survey360": {
                        "users": survey360_users or 612,
                        "revenue": 124300,
                        "growth": 22.8
                    },
                    "datapulse": {
                        "users": datapulse_users or 179,
                        "revenue": 32090,
                        "growth": 45.6
                    }
                }
            }
        except Exception as e:
            print(f"Error getting dashboard stats: {e}")
            # Return mock data on error
            return {
                "totalRevenue": 245890,
                "revenueChange": 12.5,
                "activeUsers": 1247,
                "usersChange": 8.3,
                "activeProjects": 34,
                "projectsChange": -2.1,
                "pendingTasks": 18,
                "solutionStats": {
                    "fieldforce": {"users": 456, "revenue": 89500, "growth": 15.2},
                    "survey360": {"users": 612, "revenue": 124300, "growth": 22.8},
                    "datapulse": {"users": 179, "revenue": 32090, "growth": 45.6}
                }
            }
    
    @router.get("/dashboard/activity")
    async def get_recent_activity(payload: dict = Depends(verify_admin_token), limit: int = 10):
        """Get recent activity across the platform."""
        activities = []
        
        try:
            # Get recent expert registrations
            recent_experts = await db.experts.find().sort("created_at", -1).limit(3).to_list(3)
            for expert in recent_experts:
                activities.append({
                    "type": "expert_registration",
                    "title": "New Expert Registration",
                    "description": f"{expert.get('name', 'Unknown')} registered as {expert.get('specialization', 'Expert')}",
                    "time": expert.get("created_at", datetime.now(timezone.utc).isoformat()),
                    "category": "info"
                })
            
            # Get recent leads
            recent_leads = await db.leads.find().sort("created_at", -1).limit(3).to_list(3)
            for lead in recent_leads:
                activities.append({
                    "type": "new_lead",
                    "title": "New Lead Inquiry",
                    "description": f"{lead.get('name', 'Unknown')} from {lead.get('company', 'Unknown company')}",
                    "time": lead.get("created_at", datetime.now(timezone.utc).isoformat()),
                    "category": "success"
                })
            
            # Get recent job applications
            recent_apps = await db.job_applications.find().sort("applied_date", -1).limit(2).to_list(2)
            for app in recent_apps:
                activities.append({
                    "type": "job_application",
                    "title": "Job Application",
                    "description": f"{app.get('name', 'Unknown')} applied for {app.get('job_title', 'position')}",
                    "time": app.get("applied_date", datetime.now(timezone.utc).isoformat()),
                    "category": "info"
                })
        except Exception as e:
            print(f"Error fetching activity: {e}")
        
        # Sort by time and return
        activities.sort(key=lambda x: x.get("time", ""), reverse=True)
        return activities[:limit]
    
    # ==================== LEADS & SALES ====================
    
    @router.get("/leads")
    async def get_leads(payload: dict = Depends(verify_admin_token), status: Optional[str] = None):
        """Get all leads with optional status filter."""
        query = {}
        if status:
            query["status"] = status
        
        leads = await db.leads.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
        return leads
    
    @router.post("/leads")
    async def create_lead(lead_data: dict, payload: dict = Depends(verify_admin_token)):
        """Create a new lead."""
        lead = {
            "id": str(uuid.uuid4()),
            "name": lead_data.get("name"),
            "email": lead_data.get("email"),
            "company": lead_data.get("company"),
            "phone": lead_data.get("phone"),
            "source": lead_data.get("source", "manual"),
            "status": "new",
            "value": lead_data.get("value", 0),
            "notes": lead_data.get("notes"),
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        await db.leads.insert_one(lead)
        return {"message": "Lead created", "id": lead["id"]}
    
    @router.put("/leads/{lead_id}")
    async def update_lead(lead_id: str, lead_data: dict, payload: dict = Depends(verify_admin_token)):
        """Update a lead."""
        lead_data["updated_at"] = datetime.now(timezone.utc).isoformat()
        result = await db.leads.update_one(
            {"id": lead_id},
            {"$set": lead_data}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Lead not found")
        return {"message": "Lead updated"}
    
    @router.delete("/leads/{lead_id}")
    async def delete_lead(lead_id: str, payload: dict = Depends(verify_admin_token)):
        """Delete a lead."""
        result = await db.leads.delete_one({"id": lead_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Lead not found")
        return {"message": "Lead deleted"}
    
    # ==================== SALES TASKS ====================
    
    @router.get("/sales/tasks")
    async def get_sales_tasks(payload: dict = Depends(verify_admin_token)):
        """Get all sales tasks."""
        tasks = await db.sales_tasks.find({}, {"_id": 0}).sort("due_date", 1).to_list(100)
        return tasks
    
    @router.post("/sales/tasks")
    async def create_sales_task(task_data: dict, payload: dict = Depends(verify_admin_token)):
        """Create a new sales task."""
        task = {
            "id": str(uuid.uuid4()),
            "title": task_data.get("title"),
            "description": task_data.get("description"),
            "assignee": task_data.get("assignee"),
            "lead_id": task_data.get("lead_id"),
            "priority": task_data.get("priority", "medium"),
            "status": "pending",
            "due_date": task_data.get("due_date"),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.sales_tasks.insert_one(task)
        return {"message": "Task created", "id": task["id"]}
    
    @router.put("/sales/tasks/{task_id}")
    async def update_sales_task(task_id: str, task_data: dict, payload: dict = Depends(verify_admin_token)):
        """Update a sales task."""
        result = await db.sales_tasks.update_one(
            {"id": task_id},
            {"$set": task_data}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Task not found")
        return {"message": "Task updated"}
    
    # ==================== MARKET SEGMENTS ====================
    
    @router.get("/segments")
    async def get_market_segments(payload: dict = Depends(verify_admin_token)):
        """Get market segments with stats."""
        segments = await db.market_segments.find({}, {"_id": 0}).to_list(20)
        if not segments:
            # Return default segments
            return [
                {"id": "1", "name": "International NGOs", "count": 45, "avgDealSize": 42000, "conversionRate": 28},
                {"id": "2", "name": "Government Agencies", "count": 32, "avgDealSize": 35000, "conversionRate": 22},
                {"id": "3", "name": "UN Agencies", "count": 18, "avgDealSize": 65000, "conversionRate": 35},
                {"id": "4", "name": "Research Institutions", "count": 28, "avgDealSize": 22000, "conversionRate": 18},
                {"id": "5", "name": "Private Sector", "count": 52, "avgDealSize": 15000, "conversionRate": 32},
            ]
        return segments
    
    # ==================== CHARTS DATA ====================
    
    @router.get("/dashboard/charts")
    async def get_dashboard_charts(period: int = 30, payload: dict = Depends(verify_admin_token)):
        """Get chart data for dashboard visualization."""
        import random
        from datetime import datetime, timezone, timedelta
        
        # Generate date range
        end_date = datetime.now(timezone.utc)
        
        # Try to fetch real data from database
        revenue_data = []
        users_data = []
        
        # Generate sample data based on actual user counts
        try:
            ff_count = await db.fieldforce_users.count_documents({}) or 456
            s360_count = await db.survey360_users.count_documents({}) or 612
            dp_count = await db.datapulse_users.count_documents({}) or 179
        except:
            ff_count, s360_count, dp_count = 456, 612, 179
        
        # Generate time series data
        cumulative = {
            "fieldforce": max(ff_count - period * 3, 100),
            "survey360": max(s360_count - period * 4, 150),
            "datapulse": max(dp_count - period * 2, 50)
        }
        
        for i in range(period - 1, -1, -1):
            date = end_date - timedelta(days=i)
            date_str = date.strftime("%b %d")
            
            # Revenue (simulated with some variation)
            base_revenue = 5000 + random.random() * 3000
            revenue_data.append({
                "date": date_str,
                "fieldforce": round(base_revenue * 0.4 + random.random() * 500),
                "survey360": round(base_revenue * 0.5 + random.random() * 800),
                "datapulse": round(base_revenue * 0.15 + random.random() * 300),
                "total": round(base_revenue + random.random() * 1500)
            })
            
            # User growth (cumulative)
            cumulative["fieldforce"] += random.randint(1, 5)
            cumulative["survey360"] += random.randint(2, 6)
            cumulative["datapulse"] += random.randint(0, 4)
            users_data.append({
                "date": date_str,
                "fieldforce": cumulative["fieldforce"],
                "survey360": cumulative["survey360"],
                "datapulse": cumulative["datapulse"],
                "total": cumulative["fieldforce"] + cumulative["survey360"] + cumulative["datapulse"]
            })
        
        # Product distribution for pie chart
        products_data = [
            {"name": "FieldForce", "value": ff_count, "color": "#14b8a6"},
            {"name": "Survey360", "value": s360_count, "color": "#8b5cf6"},
            {"name": "DataPulse", "value": dp_count, "color": "#f97316"}
        ]
        
        return {
            "revenue": revenue_data,
            "users": users_data,
            "products": products_data
        }
    
    # ==================== ANALYTICS DATA ====================
    
    @router.get("/analytics/overview")
    async def get_analytics_overview(payload: dict = Depends(verify_admin_token)):
        """Get comprehensive analytics overview."""
        try:
            # User metrics
            total_users = await db.datavision_users.count_documents({})
            ff_users = await db.fieldforce_users.count_documents({})
            s360_users = await db.survey360_users.count_documents({})
            dp_users = await db.datapulse_users.count_documents({})
            
            # Expert metrics
            total_experts = await db.experts.count_documents({})
            verified_experts = await db.experts.count_documents({"status": {"$in": ["approved", "active"]}})
            
            # Job metrics
            active_jobs = await db.jobs.count_documents({"status": "active"})
            total_applications = await db.job_applications.count_documents({})
            
            # Lead metrics
            total_leads = await db.leads.count_documents({})
            converted_leads = await db.leads.count_documents({"status": "converted"})
            
            return {
                "users": {
                    "total": total_users or 0,
                    "byProduct": {
                        "fieldforce": ff_users or 0,
                        "survey360": s360_users or 0,
                        "datapulse": dp_users or 0
                    }
                },
                "experts": {
                    "total": total_experts or 0,
                    "verified": verified_experts or 0,
                    "conversionRate": round((verified_experts / total_experts * 100) if total_experts > 0 else 0, 1)
                },
                "jobs": {
                    "active": active_jobs or 0,
                    "applications": total_applications or 0
                },
                "leads": {
                    "total": total_leads or 0,
                    "converted": converted_leads or 0,
                    "conversionRate": round((converted_leads / total_leads * 100) if total_leads > 0 else 0, 1)
                }
            }
        except Exception as e:
            print(f"Error in analytics overview: {e}")
            return {
                "users": {"total": 0, "byProduct": {}},
                "experts": {"total": 0, "verified": 0, "conversionRate": 0},
                "jobs": {"active": 0, "applications": 0},
                "leads": {"total": 0, "converted": 0, "conversionRate": 0}
            }
    
    # ==================== AUDIT LOGGING ====================
    
    @router.get("/audit-logs")
    async def get_audit_logs(
        action_type: Optional[str] = None,
        admin_email: Optional[str] = None,
        limit: int = 50,
        payload: dict = Depends(verify_admin_token)
    ):
        """Get audit logs for admin actions."""
        query = {}
        if action_type:
            query["action_type"] = action_type
        if admin_email:
            query["admin_email"] = admin_email
        
        logs = await db.audit_logs.find(query, {"_id": 0}).sort("timestamp", -1).limit(limit).to_list(limit)
        return logs
    
    async def log_admin_action(admin_email: str, action_type: str, details: dict, entity_type: str = None, entity_id: str = None):
        """Helper function to log admin actions."""
        log_entry = {
            "id": str(uuid.uuid4()),
            "admin_email": admin_email,
            "action_type": action_type,
            "entity_type": entity_type,
            "entity_id": entity_id,
            "details": details,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "ip_address": None  # Would be populated from request in real implementation
        }
        await db.audit_logs.insert_one(log_entry)
        return log_entry
    
    return router
