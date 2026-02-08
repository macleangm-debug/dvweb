"""
DataVision International - Pydantic Models
All data models used across the application
"""

from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

# ==================== AUTH MODELS ====================

class AdminLogin(BaseModel):
    email: str
    password: str

class AdminUser(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str = "Administrator"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: AdminUser

# ==================== CONTENT MODELS ====================

class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    client: str
    sector: str
    country: str
    year: int
    featured: bool = False
    image_url: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ProjectCreate(BaseModel):
    title: str
    description: str
    client: str
    sector: str
    country: str
    year: int
    featured: bool = False
    image_url: Optional[str] = None

class TeamMember(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    position: str
    bio: str
    image_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    order: int = 0
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class TeamMemberCreate(BaseModel):
    name: str
    position: str
    bio: str
    image_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    order: int = 0

class Testimonial(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    quote: str
    author_name: str
    author_title: str
    organization: str
    image_url: Optional[str] = None
    featured: bool = True
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class TestimonialCreate(BaseModel):
    quote: str
    author_name: str
    author_title: str
    organization: str
    image_url: Optional[str] = None
    featured: bool = True

class Statistic(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    label: str
    value: int
    suffix: str = ""
    prefix: str = ""
    order: int = 0

class StatisticCreate(BaseModel):
    label: str
    value: int
    suffix: str = ""
    prefix: str = ""
    order: int = 0

class NewsArticle(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    excerpt: str
    content: str
    image_url: Optional[str] = None
    published: bool = True
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class NewsArticleCreate(BaseModel):
    title: str
    excerpt: str
    content: str
    image_url: Optional[str] = None
    published: bool = True

class Inquiry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    company: Optional[str] = None
    subject: str
    message: str
    inquiry_type: str = "general"
    status: str = "new"
    honeypot: str = ""
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class InquiryCreate(BaseModel):
    name: str
    email: EmailStr
    company: Optional[str] = None
    subject: str
    message: str
    inquiry_type: str = "general"
    honeypot: str = ""

class Partner(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    logo_url: str
    website_url: Optional[str] = None
    order: int = 0

class PartnerCreate(BaseModel):
    name: str
    logo_url: str
    website_url: Optional[str] = None
    order: int = 0

# ==================== EXPERT NETWORK MODELS ====================

class ExpertSkill(BaseModel):
    name: str
    years_experience: int = 0
    proficiency: str = "intermediate"

class ExpertEducation(BaseModel):
    degree: str
    field: str
    institution: str
    year: int

class ExpertRegistration(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    email: EmailStr
    phone: str
    location_country: str
    location_city: str
    nationality: str
    languages: List[str] = []
    current_title: str
    current_organization: Optional[str] = None
    years_experience: int
    education: List[ExpertEducation] = []
    certifications: List[str] = []
    primary_sectors: List[str] = []
    secondary_sectors: List[str] = []
    skills: List[ExpertSkill] = []
    countries_experience: List[str] = []
    regional_expertise: List[str] = []
    availability: str = "available"
    availability_start_date: Optional[str] = None
    engagement_type: List[str] = []
    daily_rate_min: Optional[float] = None
    daily_rate_max: Optional[float] = None
    rate_currency: str = "USD"
    willing_to_travel: bool = True
    cv_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    notable_projects: List[str] = []
    publications: List[str] = []
    references: List[str] = []
    status: str = "pending"
    match_score: float = 0.0
    last_engagement_date: Optional[str] = None
    total_engagements: int = 0
    rating: float = 0.0
    notes: str = ""
    verification_status: str = "unverified"
    verification_score: float = 0.0
    trust_tier: str = "bronze"
    skills_assessment_score: float = 0.0
    skills_assessments_completed: List[str] = []
    reference_verification_score: float = 0.0
    references_verified: int = 0
    document_verification_score: float = 0.0
    documents_verified: List[str] = []
    linkedin_verified: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ExpertRegistrationCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    location_country: str
    location_city: str
    nationality: str
    languages: List[str] = []
    current_title: str
    current_organization: Optional[str] = None
    years_experience: int
    education: List[ExpertEducation] = []
    certifications: List[str] = []
    primary_sectors: List[str] = []
    secondary_sectors: List[str] = []
    skills: List[ExpertSkill] = []
    countries_experience: List[str] = []
    regional_expertise: List[str] = []
    availability: str = "available"
    availability_start_date: Optional[str] = None
    engagement_type: List[str] = []
    daily_rate_min: Optional[float] = None
    daily_rate_max: Optional[float] = None
    rate_currency: str = "USD"
    willing_to_travel: bool = True
    cv_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    notable_projects: List[str] = []
    publications: List[str] = []
    references: List[str] = []

class ExpertSearchQuery(BaseModel):
    sectors: List[str] = []
    skills: List[str] = []
    min_experience: int = 0
    countries: List[str] = []
    availability: List[str] = []
    engagement_type: List[str] = []
    max_daily_rate: Optional[float] = None
    willing_to_travel: Optional[bool] = None
    status: List[str] = ["approved", "active"]

# ==================== PROJECT MATCHING MODELS ====================

class ProjectRequirement(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    sectors: List[str] = []
    required_skills: List[str] = []
    preferred_skills: List[str] = []
    min_experience: int = 0
    countries: List[str] = []
    start_date: Optional[str] = None
    duration_months: int = 1
    engagement_type: str = "short-term"
    budget_max: Optional[float] = None
    positions_needed: int = 1
    status: str = "open"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ProjectRequirementCreate(BaseModel):
    title: str
    description: str
    sectors: List[str] = []
    required_skills: List[str] = []
    preferred_skills: List[str] = []
    min_experience: int = 0
    countries: List[str] = []
    start_date: Optional[str] = None
    duration_months: int = 1
    engagement_type: str = "short-term"
    budget_max: Optional[float] = None
    positions_needed: int = 1

class ExpertMatch(BaseModel):
    expert_id: str
    expert_name: str
    expert_email: str
    match_score: float
    matching_sectors: List[str]
    matching_skills: List[str]
    years_experience: int
    availability: str
    daily_rate_min: Optional[float]
    daily_rate_max: Optional[float]
    verification_score: float = 0.0
    trust_tier: str = "bronze"

# ==================== VERIFICATION MODELS ====================

class SkillsAssessmentQuestion(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    sector: str
    skill: str
    question: str
    options: List[str]
    correct_answer: int
    difficulty: str = "medium"
    points: int = 10

class SkillsAssessment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    sector: str
    title: str
    description: str
    questions: List[SkillsAssessmentQuestion] = []
    time_limit_minutes: int = 30
    passing_score: int = 70
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class AssessmentSubmission(BaseModel):
    expert_id: str
    assessment_id: str
    answers: List[int]

class AssessmentResult(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    expert_id: str
    assessment_id: str
    sector: str
    score: float
    passed: bool
    answers: List[int]
    correct_answers: int
    total_questions: int
    time_taken_seconds: int = 0
    submitted_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ReferenceRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    expert_id: str
    expert_name: str
    reference_name: str
    reference_email: str
    reference_organization: Optional[str] = None
    status: str = "pending"
    token: str = Field(default_factory=lambda: str(uuid.uuid4()))
    sent_at: Optional[str] = None
    completed_at: Optional[str] = None
    reminder_count: int = 0
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ReferenceResponse(BaseModel):
    knows_expert: bool = True
    relationship: str = ""
    years_known: int = 0
    technical_skills: int = 0
    communication: int = 0
    reliability: int = 0
    quality_of_work: int = 0
    professionalism: int = 0
    confirms_role: bool = False
    confirms_experience: bool = False
    confirms_skills: List[str] = []
    strengths: str = ""
    areas_for_improvement: str = ""
    would_recommend: bool = True
    recommendation_level: int = 0
    additional_comments: str = ""

class ReferenceSubmission(BaseModel):
    token: str
    response: ReferenceResponse

class DocumentVerification(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    expert_id: str
    document_type: str
    document_url: str
    status: str = "pending"
    verification_notes: str = ""
    verified_claims: List[str] = []
    score: float = 0.0
    verified_at: Optional[str] = None
    verified_by: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class VerificationSummary(BaseModel):
    expert_id: str
    expert_name: str
    verification_status: str
    verification_score: float
    trust_tier: str
    components: dict
    assessments_completed: int
    assessments_passed: int
    references_requested: int
    references_verified: int
    documents_submitted: int
    documents_verified: int
