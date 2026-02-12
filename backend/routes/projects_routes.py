"""
Projects & Clients Routes
Handles project management, client management, and portfolio
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import os
from datetime import datetime, timezone
from pydantic import BaseModel, Field
from typing import Optional, List
import uuid

router = APIRouter(tags=["Projects & Clients"])
security = HTTPBearer()

SECRET_KEY = os.environ.get('JWT_SECRET', 'datavision-secret-key-2024')
ALGORITHM = "HS256"

# ==================== MODELS ====================

class Project(BaseModel):
    title: str
    client_id: str
    description: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    budget: float = 0
    status: str = "planning"  # planning, active, on-hold, completed
    products_used: List[str] = []

class Client(BaseModel):
    name: str
    type: str  # International Organization, UN Agency, Government, NGO, etc.
    contact_person: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    products_subscribed: List[str] = []

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def create_projects_routes(db):
    """Factory function to create projects & clients routes with database dependency"""
    
    # ==================== PROJECTS ====================
    
    @router.get("/projects")
    async def get_projects(status: Optional[str] = None, client_id: Optional[str] = None):
        """Get all projects with optional filters."""
        query = {}
        if status:
            query["status"] = status
        if client_id:
            query["client_id"] = client_id
        
        projects = await db.projects.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
        return projects
    
    @router.get("/projects/{project_id}")
    async def get_project(project_id: str):
        """Get a specific project."""
        project = await db.projects.find_one({"id": project_id}, {"_id": 0})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        return project
    
    @router.post("/projects")
    async def create_project(project_data: Project, payload: dict = Depends(verify_token)):
        """Create a new project."""
        # Get client name
        client = await db.clients.find_one({"id": project_data.client_id}, {"_id": 0})
        client_name = client.get("name", "Unknown") if client else "Unknown"
        
        project = {
            "id": str(uuid.uuid4()),
            "title": project_data.title,
            "client_id": project_data.client_id,
            "client": client_name,
            "description": project_data.description,
            "location": project_data.location,
            "start_date": project_data.start_date,
            "end_date": project_data.end_date,
            "budget": project_data.budget,
            "spent": 0,
            "progress": 0,
            "status": project_data.status,
            "products_used": project_data.products_used,
            "team_size": 0,
            "experts_assigned": [],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "created_by": payload.get("email")
        }
        await db.projects.insert_one(project)
        return {"message": "Project created", "id": project["id"]}
    
    @router.put("/projects/{project_id}")
    async def update_project(project_id: str, project_data: dict, payload: dict = Depends(verify_token)):
        """Update a project."""
        project_data["updated_at"] = datetime.now(timezone.utc).isoformat()
        result = await db.projects.update_one(
            {"id": project_id},
            {"$set": project_data}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Project not found")
        return {"message": "Project updated"}
    
    @router.delete("/projects/{project_id}")
    async def delete_project(project_id: str, payload: dict = Depends(verify_token)):
        """Delete a project."""
        result = await db.projects.delete_one({"id": project_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Project not found")
        return {"message": "Project deleted"}
    
    @router.put("/projects/{project_id}/progress")
    async def update_project_progress(project_id: str, progress_data: dict, payload: dict = Depends(verify_token)):
        """Update project progress."""
        progress = progress_data.get("progress", 0)
        if not 0 <= progress <= 100:
            raise HTTPException(status_code=400, detail="Progress must be between 0 and 100")
        
        update_data = {
            "progress": progress,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        # Auto-update status if 100%
        if progress == 100:
            update_data["status"] = "completed"
        
        result = await db.projects.update_one(
            {"id": project_id},
            {"$set": update_data}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Project not found")
        return {"message": "Progress updated"}
    
    @router.post("/projects/{project_id}/experts")
    async def assign_expert_to_project(project_id: str, expert_data: dict, payload: dict = Depends(verify_token)):
        """Assign an expert to a project."""
        expert_name = expert_data.get("expert_name")
        if not expert_name:
            raise HTTPException(status_code=400, detail="Expert name required")
        
        result = await db.projects.update_one(
            {"id": project_id},
            {
                "$addToSet": {"experts_assigned": expert_name},
                "$inc": {"team_size": 1}
            }
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Project not found")
        return {"message": "Expert assigned"}
    
    # ==================== CLIENTS ====================
    
    @router.get("/clients")
    async def get_clients(type: Optional[str] = None, status: Optional[str] = None):
        """Get all clients with optional filters."""
        query = {}
        if type:
            query["type"] = type
        if status:
            query["status"] = status
        
        clients = await db.clients.find(query, {"_id": 0}).sort("name", 1).to_list(100)
        return clients
    
    @router.get("/clients/{client_id}")
    async def get_client(client_id: str):
        """Get a specific client."""
        client = await db.clients.find_one({"id": client_id}, {"_id": 0})
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")
        return client
    
    @router.post("/clients")
    async def create_client(client_data: Client, payload: dict = Depends(verify_token)):
        """Create a new client."""
        client = {
            "id": str(uuid.uuid4()),
            "name": client_data.name,
            "type": client_data.type,
            "contact_person": client_data.contact_person,
            "email": client_data.email,
            "phone": client_data.phone,
            "location": client_data.location,
            "status": "active",
            "products_subscribed": client_data.products_subscribed,
            "projects_count": 0,
            "total_revenue": 0,
            "since": str(datetime.now().year),
            "created_at": datetime.now(timezone.utc).isoformat(),
            "created_by": payload.get("email")
        }
        await db.clients.insert_one(client)
        return {"message": "Client created", "id": client["id"]}
    
    @router.put("/clients/{client_id}")
    async def update_client(client_id: str, client_data: dict, payload: dict = Depends(verify_token)):
        """Update a client."""
        client_data["updated_at"] = datetime.now(timezone.utc).isoformat()
        result = await db.clients.update_one(
            {"id": client_id},
            {"$set": client_data}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Client not found")
        return {"message": "Client updated"}
    
    @router.delete("/clients/{client_id}")
    async def delete_client(client_id: str, payload: dict = Depends(verify_token)):
        """Delete a client."""
        # Check if client has projects
        projects_count = await db.projects.count_documents({"client_id": client_id})
        if projects_count > 0:
            raise HTTPException(status_code=400, detail=f"Cannot delete client with {projects_count} associated projects")
        
        result = await db.clients.delete_one({"id": client_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Client not found")
        return {"message": "Client deleted"}
    
    @router.get("/clients/{client_id}/projects")
    async def get_client_projects(client_id: str):
        """Get all projects for a specific client."""
        projects = await db.projects.find({"client_id": client_id}, {"_id": 0}).to_list(50)
        return projects
    
    # ==================== PORTFOLIO ====================
    
    @router.get("/portfolio")
    async def get_portfolio():
        """Get completed projects for public portfolio."""
        projects = await db.projects.find(
            {"status": "completed", "featured": True},
            {"_id": 0}
        ).sort("end_date", -1).to_list(20)
        return projects
    
    @router.put("/projects/{project_id}/feature")
    async def toggle_project_featured(project_id: str, payload: dict = Depends(verify_token)):
        """Toggle project featured status."""
        project = await db.projects.find_one({"id": project_id})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        new_featured = not project.get("featured", False)
        await db.projects.update_one(
            {"id": project_id},
            {"$set": {"featured": new_featured}}
        )
        return {"message": f"Project {'featured' if new_featured else 'unfeatured'}", "featured": new_featured}
    
    # ==================== STATISTICS ====================
    
    @router.get("/projects/stats")
    async def get_projects_stats(payload: dict = Depends(verify_token)):
        """Get project statistics."""
        total_projects = await db.projects.count_documents({})
        active_projects = await db.projects.count_documents({"status": "active"})
        completed_projects = await db.projects.count_documents({"status": "completed"})
        
        # Calculate total budget
        pipeline = [{"$group": {"_id": None, "total_budget": {"$sum": "$budget"}, "total_spent": {"$sum": "$spent"}}}]
        budget_result = await db.projects.aggregate(pipeline).to_list(1)
        total_budget = budget_result[0]["total_budget"] if budget_result else 0
        total_spent = budget_result[0]["total_spent"] if budget_result else 0
        
        total_clients = await db.clients.count_documents({})
        active_clients = await db.clients.count_documents({"status": "active"})
        
        return {
            "projects": {
                "total": total_projects,
                "active": active_projects,
                "completed": completed_projects,
                "totalBudget": total_budget,
                "totalSpent": total_spent
            },
            "clients": {
                "total": total_clients,
                "active": active_clients
            }
        }
    
    return router
