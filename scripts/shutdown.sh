#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# PM2 process name
PM2_NAME="nostr-dm-magiclink"

# Function to check if PM2 is installed
check_pm2() {
    if ! command -v pm2 &> /dev/null; then
        echo -e "${RED}PM2 is not installed${NC}"
        exit 1
    fi
}

# Function to stop the service
stop_service() {
    echo -e "${GREEN}Stopping Nostr DM Magic Link Middleware...${NC}"
    
    # Check if service is running
    if pm2 show "$PM2_NAME" &>/dev/null; then
        # Stop the service
        pm2 stop "$PM2_NAME"
        pm2 delete "$PM2_NAME"
        pm2 save
        echo -e "${GREEN}Service stopped successfully${NC}"
    else
        echo -e "${YELLOW}Service is not running${NC}"
    fi
}

# Main execution
check_pm2
stop_service
