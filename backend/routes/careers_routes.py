"""
Careers & HR Routes
Handles job postings, applications, and applicant tracking
"""

from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import os
from datetime import datetime, timezone
from pydantic import BaseModel, Field
from typing import Optional, List
import uuid

router = APIRouter(prefix="/careers", tags=["Careers & HR"])
security = HTTPBearer()

SECRET_KEY = os.environ.get('JWT_SECRET', 'datavision-secret-key-2024')
ALGORITHM = "HS256"

# ==================== MODELS ====================

class JobPosting(BaseModel):
    title: str
    department: str
    location: str
    type: str  # full-time, part-time, contract, internship
    salary_range: Optional[str] = None
    description: str
    requirements: str
    responsibilities: Optional[str] = None
    benefits: Optional[str] = None

class JobApplication(BaseModel):
    job_id: str
    name: str
    email: str
    phone: Optional[str] = None
    experience: str
    education: str
    cover_letter: Optional[str] = None

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def create_careers_routes(db):
    """Factory function to create careers routes with database dependency"""
    
    # ==================== JOB POSTINGS ====================
    
    @router.get("/jobs")
    async def get_all_jobs(status: Optional[str] = None):
        """Get all job postings (public endpoint)."""
        query = {}
        if status:
            query["status"] = status
        else:
            query["status"] = "active"  # Default to active jobs for public
        
        jobs = await db.jobs.find(query, {"_id": 0}).sort("posted_date", -1).to_list(50)
        return jobs
    
    @router.get("/jobs/{job_id}")
    async def get_job(job_id: str):
        """Get a specific job posting (public endpoint)."""
        job = await db.jobs.find_one({"id": job_id}, {"_id": 0})
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        return job
    
    @router.post("/jobs")
    async def create_job(job_data: JobPosting, payload: dict = Depends(verify_token)):
        """Create a new job posting (admin only)."""
        job = {
            "id": str(uuid.uuid4()),
            "title": job_data.title,
            "department": job_data.department,
            "location": job_data.location,
            "type": job_data.type,
            "salary_range": job_data.salary_range,
            "description": job_data.description,
            "requirements": job_data.requirements,
            "responsibilities": job_data.responsibilities,
            "benefits": job_data.benefits,
            "status": "active",
            "applications_count": 0,
            "posted_date": datetime.now(timezone.utc).isoformat(),
            "created_by": payload.get("email")
        }
        await db.jobs.insert_one(job)
        return {"message": "Job posting created", "id": job["id"]}
    
    @router.put("/jobs/{job_id}")
    async def update_job(job_id: str, job_data: dict, payload: dict = Depends(verify_token)):
        """Update a job posting (admin only)."""
        job_data["updated_at"] = datetime.now(timezone.utc).isoformat()
        result = await db.jobs.update_one(
            {"id": job_id},
            {"$set": job_data}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Job not found")
        return {"message": "Job updated"}
    
    @router.delete("/jobs/{job_id}")
    async def delete_job(job_id: str, payload: dict = Depends(verify_token)):
        """Delete a job posting (admin only)."""
        result = await db.jobs.delete_one({"id": job_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Job not found")
        return {"message": "Job deleted"}
    
    @router.post("/jobs/{job_id}/close")
    async def close_job(job_id: str, payload: dict = Depends(verify_token)):
        """Close a job posting (admin only)."""
        result = await db.jobs.update_one(
            {"id": job_id},
            {"$set": {"status": "closed", "closed_date": datetime.now(timezone.utc).isoformat()}}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Job not found")
        return {"message": "Job closed"}
    
    # ==================== JOB APPLICATIONS ====================
    
    @router.get("/applications")
    async def get_all_applications(
        job_id: Optional[str] = None,
        status: Optional[str] = None,
        payload: dict = Depends(verify_token)
    ):
        """Get all job applications (admin only)."""
        query = {}
        if job_id:
            query["job_id"] = job_id
        if status:
            query["status"] = status
        
        applications = await db.job_applications.find(query, {"_id": 0}).sort("applied_date", -1).to_list(200)
        return applications
    
    @router.get("/applications/{application_id}")
    async def get_application(application_id: str, payload: dict = Depends(verify_token)):
        """Get a specific application (admin only)."""
        application = await db.job_applications.find_one({"id": application_id}, {"_id": 0})
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")
        return application
    
    @router.post("/applications")
    async def submit_application(app_data: JobApplication):
        """Submit a job application (public endpoint)."""
        # Get job details
        job = await db.jobs.find_one({"id": app_data.job_id}, {"_id": 0})
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        if job.get("status") != "active":
            raise HTTPException(status_code=400, detail="Job is no longer accepting applications")
        
        # Check for duplicate application
        existing = await db.job_applications.find_one({
            "job_id": app_data.job_id,
            "email": app_data.email
        })
        if existing:
            raise HTTPException(status_code=400, detail="You have already applied for this position")
        
        application = {
            "id": str(uuid.uuid4()),
            "job_id": app_data.job_id,
            "job_title": job.get("title"),
            "name": app_data.name,
            "email": app_data.email,
            "phone": app_data.phone,
            "experience": app_data.experience,
            "education": app_data.education,
            "cover_letter": app_data.cover_letter,
            "status": "new",
            "rating": 0,
            "notes": [],
            "applied_date": datetime.now(timezone.utc).isoformat()
        }
        
        await db.job_applications.insert_one(application)
        
        # Update applications count on job
        await db.jobs.update_one(
            {"id": app_data.job_id},
            {"$inc": {"applications_count": 1}}
        )
        
        return {"message": "Application submitted successfully", "id": application["id"]}
    
    @router.put("/applications/{application_id}/status")
    async def update_application_status(
        application_id: str,
        status_data: dict,
        payload: dict = Depends(verify_token)
    ):
        """Update application status (admin only)."""
        valid_statuses = ["new", "reviewing", "interviewed", "shortlisted", "rejected", "hired"]
        new_status = status_data.get("status")
        
        if new_status not in valid_statuses:
            raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
        
        update_data = {
            "status": new_status,
            "status_updated_at": datetime.now(timezone.utc).isoformat(),
            "status_updated_by": payload.get("email")
        }
        
        result = await db.job_applications.update_one(
            {"id": application_id},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Application not found")
        
        return {"message": f"Application status updated to {new_status}"}
    
    @router.put("/applications/{application_id}/rating")
    async def update_application_rating(
        application_id: str,
        rating_data: dict,
        payload: dict = Depends(verify_token)
    ):
        """Update application rating (admin only)."""
        rating = rating_data.get("rating", 0)
        if not 0 <= rating <= 5:
            raise HTTPException(status_code=400, detail="Rating must be between 0 and 5")
        
        result = await db.job_applications.update_one(
            {"id": application_id},
            {"$set": {"rating": rating}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Application not found")
        
        return {"message": "Rating updated"}
    
    @router.post("/applications/{application_id}/notes")
    async def add_application_note(
        application_id: str,
        note_data: dict,
        payload: dict = Depends(verify_token)
    ):
        """Add a note to an application (admin only)."""
        note = {
            "id": str(uuid.uuid4()),
            "content": note_data.get("content"),
            "author": payload.get("email"),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        result = await db.job_applications.update_one(
            {"id": application_id},
            {"$push": {"notes": note}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Application not found")
        
        return {"message": "Note added", "note_id": note["id"]}
    
    # ==================== STATISTICS ====================
    
    @router.get("/stats")
    async def get_careers_stats(payload: dict = Depends(verify_token)):
        """Get careers statistics (admin only)."""
        active_jobs = await db.jobs.count_documents({"status": "active"})
        closed_jobs = await db.jobs.count_documents({"status": "closed"})
        total_applications = await db.job_applications.count_documents({})
        
        # Applications by status
        new_apps = await db.job_applications.count_documents({"status": "new"})
        reviewing_apps = await db.job_applications.count_documents({"status": "reviewing"})
        interviewed_apps = await db.job_applications.count_documents({"status": "interviewed"})
        shortlisted_apps = await db.job_applications.count_documents({"status": "shortlisted"})
        hired_apps = await db.job_applications.count_documents({"status": "hired"})
        
        return {
            "activeJobs": active_jobs,
            "closedJobs": closed_jobs,
            "totalApplications": total_applications,
            "applicationsByStatus": {
                "new": new_apps,
                "reviewing": reviewing_apps,
                "interviewed": interviewed_apps,
                "shortlisted": shortlisted_apps,
                "hired": hired_apps
            },
            "avgApplicationsPerJob": round(total_applications / max(active_jobs + closed_jobs, 1), 1)
        }
    
    return router
