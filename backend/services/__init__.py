"""
DataVision International - Business Logic Services
Contains matching algorithms and verification scoring logic
"""

from typing import List, Dict, Any

def calculate_match_score(expert: dict, requirement: dict) -> float:
    """Calculate matching score between an expert and project requirement"""
    score = 0.0
    max_score = 100.0
    
    # Sector match (30 points)
    req_sectors = set(requirement.get("sectors", []))
    expert_primary = set(expert.get("primary_sectors", []))
    expert_secondary = set(expert.get("secondary_sectors", []))
    
    primary_matches = len(req_sectors & expert_primary)
    secondary_matches = len(req_sectors & expert_secondary)
    
    if req_sectors:
        sector_score = (primary_matches * 30 + secondary_matches * 15) / len(req_sectors)
        score += min(sector_score, 30)
    
    # Skills match (30 points)
    required_skills = set(requirement.get("required_skills", []))
    preferred_skills = set(requirement.get("preferred_skills", []))
    expert_skills = set([s.get("name", "") for s in expert.get("skills", [])])
    
    required_matches = len(required_skills & expert_skills)
    preferred_matches = len(preferred_skills & expert_skills)
    
    if required_skills:
        req_skill_score = (required_matches / len(required_skills)) * 20
        score += req_skill_score
    
    if preferred_skills:
        pref_skill_score = (preferred_matches / len(preferred_skills)) * 10
        score += pref_skill_score
    
    # Experience match (20 points)
    min_exp = requirement.get("min_experience", 0)
    expert_exp = expert.get("years_experience", 0)
    
    if expert_exp >= min_exp:
        exp_bonus = min((expert_exp - min_exp) * 2, 10)
        score += 10 + exp_bonus
    elif min_exp > 0:
        score += max(0, 10 - (min_exp - expert_exp) * 2)
    else:
        score += 10
    
    # Country/regional match (10 points)
    req_countries = set(requirement.get("countries", []))
    expert_countries = set(expert.get("countries_experience", []))
    
    if req_countries:
        country_matches = len(req_countries & expert_countries)
        score += (country_matches / len(req_countries)) * 10
    else:
        score += 10
    
    # Availability match (10 points)
    if expert.get("availability") == "available":
        score += 10
    elif expert.get("availability") == "limited":
        score += 5
    
    # Engagement type match (bonus)
    req_type = requirement.get("engagement_type", "")
    expert_types = expert.get("engagement_type", [])
    if req_type in expert_types:
        score += 5
    
    # Budget match (bonus/penalty)
    budget_max = requirement.get("budget_max")
    expert_rate_min = expert.get("daily_rate_min")
    
    if budget_max and expert_rate_min:
        if expert_rate_min <= budget_max:
            score += 5
        else:
            score -= 10
    
    return min(max(score, 0), max_score + 10)


def calculate_verification_score(expert: dict) -> Dict[str, Any]:
    """
    Calculate the overall verification score and trust tier for an expert.
    Returns updated fields to be applied to the expert document.
    """
    skills_score = expert.get("skills_assessment_score", 0)
    reference_score = expert.get("reference_verification_score", 0)
    document_score = expert.get("document_verification_score", 0)
    
    # Weighted average: Skills (40%), References (40%), Documents (20%)
    verification_score = (skills_score * 0.4) + (reference_score * 0.4) + (document_score * 0.2)
    
    # Determine trust tier
    if verification_score >= 85:
        trust_tier = "platinum"
    elif verification_score >= 70:
        trust_tier = "gold"
    elif verification_score >= 50:
        trust_tier = "silver"
    else:
        trust_tier = "bronze"
    
    # Determine verification status
    if verification_score >= 85:
        verification_status = "trusted"
    elif verification_score >= 70:
        verification_status = "verified"
    elif verification_score >= 50:
        verification_status = "partially_verified"
    elif verification_score > 0:
        verification_status = "pending_verification"
    else:
        verification_status = "unverified"
    
    return {
        "verification_score": verification_score,
        "trust_tier": trust_tier,
        "verification_status": verification_status
    }


def calculate_reference_score(responses: List[dict]) -> float:
    """Calculate reference verification score from multiple reference responses"""
    if not responses:
        return 0.0
    
    total_score = 0.0
    
    for response in responses:
        resp_data = response.get("response", response)
        
        # Base verification (20 points)
        score = 0.0
        if resp_data.get("knows_expert"):
            score += 10
        if resp_data.get("confirms_role"):
            score += 5
        if resp_data.get("confirms_experience"):
            score += 5
        
        # Competency ratings average (40 points)
        competencies = [
            resp_data.get("technical_skills", 0),
            resp_data.get("communication", 0),
            resp_data.get("reliability", 0),
            resp_data.get("quality_of_work", 0),
            resp_data.get("professionalism", 0)
        ]
        avg_competency = sum(competencies) / len(competencies) if competencies else 0
        score += (avg_competency / 5) * 40
        
        # Recommendation (20 points)
        if resp_data.get("would_recommend"):
            score += 10
        rec_level = resp_data.get("recommendation_level", 0)
        score += (rec_level / 10) * 10
        
        total_score += score
    
    return total_score / len(responses)


def get_matching_items(expert: dict, requirement: dict) -> Dict[str, List[str]]:
    """Get lists of matching sectors and skills between expert and requirement"""
    req_sectors = set(requirement.get("sectors", []))
    expert_sectors = set(expert.get("primary_sectors", []) + expert.get("secondary_sectors", []))
    
    all_req_skills = set(requirement.get("required_skills", []) + requirement.get("preferred_skills", []))
    expert_skills = set([s.get("name", "") for s in expert.get("skills", [])])
    
    return {
        "matching_sectors": list(req_sectors & expert_sectors),
        "matching_skills": list(all_req_skills & expert_skills)
    }
