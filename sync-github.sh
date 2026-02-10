#!/bin/bash
# DataVision GitHub Sync Script
# Syncs Survey360 and FieldForce code from GitHub repos to DataVision

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="/app"
SOURCES_DIR="$APP_DIR/github-sources"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  DataVision GitHub Sync Script${NC}"
echo -e "${GREEN}========================================${NC}"

# Function to sync Survey360
sync_survey360() {
    echo -e "\n${YELLOW}[1/4] Pulling latest Survey360 from GitHub...${NC}"
    cd "$SOURCES_DIR/Survey360"
    git fetch origin
    git reset --hard origin/main
    echo -e "${GREEN}✓ Survey360 pulled successfully${NC}"
    
    echo -e "\n${YELLOW}[2/4] Syncing Survey360 backend routes...${NC}"
    # Sync backend routes
    rm -rf "$BACKEND_DIR/survey360/routes"
    mkdir -p "$BACKEND_DIR/survey360/routes"
    cp -r "$SOURCES_DIR/Survey360/backend/routes/"* "$BACKEND_DIR/survey360/routes/"
    
    # Sync backend core files
    cp "$SOURCES_DIR/Survey360/backend/models.py" "$BACKEND_DIR/survey360/"
    cp "$SOURCES_DIR/Survey360/backend/auth.py" "$BACKEND_DIR/survey360/"
    cp "$SOURCES_DIR/Survey360/backend/logic_engine.py" "$BACKEND_DIR/survey360/" 2>/dev/null || true
    
    # Sync utils
    rm -rf "$BACKEND_DIR/survey360/utils"
    mkdir -p "$BACKEND_DIR/survey360/utils"
    cp -r "$SOURCES_DIR/Survey360/backend/utils/"* "$BACKEND_DIR/survey360/utils/" 2>/dev/null || true
    
    # Fix imports for DataVision integration
    echo -e "${YELLOW}   Fixing imports for DataVision integration...${NC}"
    cd "$BACKEND_DIR/survey360/routes"
    sed -i 's/from models import/from survey360.models import/g' *.py
    sed -i 's/from auth import/from survey360.auth import/g' *.py
    sed -i 's/from logic_engine import/from survey360.logic_engine import/g' *.py
    sed -i 's/from utils\./from survey360.utils./g' *.py
    
    # Fix JWT secret to match DataVision
    sed -i 's/datapulse-secret-key-change-in-production/datavision-secret-key-2024/g' "$BACKEND_DIR/survey360/auth.py"
    
    echo -e "${GREEN}✓ Survey360 backend synced${NC}"
    
    # Sync frontend pages
    echo -e "${YELLOW}   Syncing Survey360 frontend pages...${NC}"
    S360_FE_SRC="$SOURCES_DIR/Survey360/frontend/src/pages/solutions"
    S360_FE_DEST="$FRONTEND_DIR/src/pages/solutions/survey360"
    
    # Copy frontend pages if they exist
    if [ -d "$S360_FE_SRC" ]; then
        cp "$S360_FE_SRC/Survey360"*.jsx "$S360_FE_DEST/" 2>/dev/null || true
        echo -e "${GREEN}   ✓ Frontend pages synced${NC}"
    fi
    
    # Count routes
    ROUTE_COUNT=$(ls "$BACKEND_DIR/survey360/routes/"*.py 2>/dev/null | wc -l)
    echo -e "${GREEN}   Total route files: $ROUTE_COUNT${NC}"
}

# Function to sync FieldForce
sync_fieldforce() {
    echo -e "\n${YELLOW}[3/4] Pulling latest FieldForce from GitHub...${NC}"
    cd "$SOURCES_DIR/FieldForce"
    git fetch origin
    git reset --hard origin/main
    echo -e "${GREEN}✓ FieldForce pulled successfully${NC}"
    
    echo -e "\n${YELLOW}[4/4] Syncing FieldForce backend routes...${NC}"
    
    # FieldForce has routes in /fieldforce/backend/routes/
    FF_SOURCE="$SOURCES_DIR/FieldForce/fieldforce/backend"
    
    # Sync backend routes
    rm -rf "$BACKEND_DIR/fieldforce/routes"
    mkdir -p "$BACKEND_DIR/fieldforce/routes"
    cp -r "$FF_SOURCE/routes/"* "$BACKEND_DIR/fieldforce/routes/"
    
    # Sync backend core files
    cp "$FF_SOURCE/models.py" "$BACKEND_DIR/fieldforce/"
    cp "$FF_SOURCE/auth.py" "$BACKEND_DIR/fieldforce/"
    cp "$FF_SOURCE/logic_engine.py" "$BACKEND_DIR/fieldforce/" 2>/dev/null || true
    
    # Sync utils if exists
    if [ -d "$FF_SOURCE/utils" ]; then
        rm -rf "$BACKEND_DIR/fieldforce/utils"
        mkdir -p "$BACKEND_DIR/fieldforce/utils"
        cp -r "$FF_SOURCE/utils/"* "$BACKEND_DIR/fieldforce/utils/" 2>/dev/null || true
    fi
    
    # Fix imports for DataVision integration
    echo -e "${YELLOW}   Fixing imports for DataVision integration...${NC}"
    cd "$BACKEND_DIR/fieldforce/routes"
    sed -i 's/from models import/from fieldforce.models import/g' *.py
    sed -i 's/from auth import/from fieldforce.auth import/g' *.py
    sed -i 's/from logic_engine import/from fieldforce.logic_engine import/g' *.py 2>/dev/null || true
    sed -i 's/from utils\./from fieldforce.utils./g' *.py 2>/dev/null || true
    
    echo -e "${GREEN}✓ FieldForce backend synced${NC}"
    
    # Count routes
    ROUTE_COUNT=$(ls "$BACKEND_DIR/fieldforce/routes/"*.py 2>/dev/null | wc -l)
    echo -e "${GREEN}   Total route files: $ROUTE_COUNT${NC}"
}

# Function to restart backend
restart_backend() {
    echo -e "\n${YELLOW}Restarting backend service...${NC}"
    sudo supervisorctl restart backend
    sleep 3
    
    # Check if backend is running
    if sudo supervisorctl status backend | grep -q "RUNNING"; then
        echo -e "${GREEN}✓ Backend restarted successfully${NC}"
    else
        echo -e "${RED}✗ Backend failed to start. Check logs:${NC}"
        tail -n 20 /var/log/supervisor/backend.err.log
        exit 1
    fi
}

# Main execution
main() {
    echo -e "\nStarting sync at $(date)"
    
    # Check if sources exist, clone if not
    if [ ! -d "$SOURCES_DIR/Survey360" ]; then
        echo -e "${YELLOW}Cloning Survey360 repo...${NC}"
        mkdir -p "$SOURCES_DIR"
        cd "$SOURCES_DIR"
        git clone https://github.com/macleangm-debug/Survey360.git
    fi
    
    if [ ! -d "$SOURCES_DIR/FieldForce" ]; then
        echo -e "${YELLOW}Cloning FieldForce repo...${NC}"
        mkdir -p "$SOURCES_DIR"
        cd "$SOURCES_DIR"
        git clone https://github.com/macleangm-debug/FieldForce.git
    fi
    
    # Parse arguments
    case "${1:-all}" in
        survey360)
            sync_survey360
            ;;
        fieldforce)
            sync_fieldforce
            ;;
        all|*)
            sync_survey360
            sync_fieldforce
            ;;
    esac
    
    # Restart backend if --restart flag is passed
    if [[ "$*" == *"--restart"* ]]; then
        restart_backend
    fi
    
    echo -e "\n${GREEN}========================================${NC}"
    echo -e "${GREEN}  Sync completed at $(date)${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo -e "\nTo restart backend, run: ${YELLOW}sudo supervisorctl restart backend${NC}"
}

# Run main
main "$@"
