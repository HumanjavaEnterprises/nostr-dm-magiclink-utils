#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Environment file
ENV_FILE="$PROJECT_ROOT/.env"
KEYS_DIR="$PROJECT_ROOT/local/keys"

# PM2 process name
PM2_NAME="nostr-dm-magiclink"

# Default environment
ENVIRONMENT="development"

# Parse command line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --env) ENVIRONMENT="$2"; shift ;;
        *) echo "Unknown parameter: $1"; exit 1 ;;
    esac
    shift
done

# Function to check if PM2 is running
check_pm2() {
    if ! command -v pm2 &> /dev/null; then
        echo -e "${RED}PM2 is not installed. Please run ./scripts/config.sh first${NC}"
        exit 1
    fi
}

# Function to check environment file
check_env() {
    if [ ! -f "$ENV_FILE" ]; then
        echo -e "${RED}Environment file not found. Please run ./scripts/config.sh first${NC}"
        exit 1
    fi
}

# Function to validate keys
validate_keys() {
    echo -e "${GREEN}Validating keys...${NC}"
    if ! "$SCRIPT_DIR/validate-keys.sh" --env "$ENVIRONMENT"; then
        echo -e "${RED}Key validation failed. Please run ./scripts/config.sh to set up keys${NC}"
        exit 1
    fi
}

# Function to load Nostr keys into environment
load_nostr_keys() {
    local nostr_keys_file="$KEYS_DIR/nostr_keys.json"
    if [ ! -f "$nostr_keys_file" ]; then
        echo -e "${RED}Nostr keys file not found at $nostr_keys_file${NC}"
        exit 1
    fi

    # Extract private key using Node.js
    export NOSTR_PRIVATE_KEY=$(node -e "console.log(require('$nostr_keys_file').privateKey)")
    if [ -z "$NOSTR_PRIVATE_KEY" ]; then
        echo -e "${RED}Failed to load Nostr private key${NC}"
        exit 1
    fi
    echo -e "${GREEN}Loaded Nostr keys into environment${NC}"
}

# Function to start the service
start_service() {
    echo -e "${GREEN}Starting Nostr DM Magic Link Middleware...${NC}"
    
    # Check if service is already running
    if pm2 show "$PM2_NAME" &>/dev/null; then
        echo -e "${YELLOW}Service is already running. Restarting...${NC}"
        pm2 restart "$PM2_NAME"
    else
        # Start the service with PM2
        cd "$PROJECT_ROOT" || exit 1
        pm2 start dist/index.js --name "$PM2_NAME" --time
    fi
    
    # Save PM2 process list
    pm2 save

    echo -e "${GREEN}Service started successfully!${NC}"
    echo -e "Monitor logs with: ${YELLOW}pm2 logs $PM2_NAME${NC}"
}

# Main execution
check_pm2
check_env
validate_keys
load_nostr_keys
start_service
