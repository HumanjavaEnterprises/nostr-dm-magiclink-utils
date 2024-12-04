#!/bin/bash

# Service Configuration
export SERVICE_NAME="${SERVICE_NAME:-nostr-dm-magiclink-middleware}"
export SERVICE_DIR="${SERVICE_DIR:-/opt/nostr-platform/magiclink}"
export SERVICE_USER="${SERVICE_USER:-nostr}"
export SERVICE_GROUP="${SERVICE_GROUP:-nostr}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Environment file paths
ENV_EXAMPLE="$PROJECT_ROOT/.env.example"
ENV_FILE="$PROJECT_ROOT/.env"

# Development vs Production paths
if [ "$NODE_ENV" = "development" ] || [ -z "$NODE_ENV" ]; then
    KEYS_DIR="$PROJECT_ROOT/.keys"
    LOG_DIR="$PROJECT_ROOT/logs"
else
    KEYS_DIR="/opt/nostr-platform/magiclink/keys"
    LOG_DIR="/var/log/nostr-platform/magiclink"
fi

# Function to generate a secure random hex string
generate_hex() {
    local length=$1
    head -c $((length/2)) /dev/urandom | xxd -p
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to setup development keys
setup_dev_keys() {
    echo -e "${GREEN}Setting up development keys...${NC}"
    
    # Create keys directory if it doesn't exist
    mkdir -p "$KEYS_DIR"
    
    # Generate Nostr keys if they don't exist
    if [ ! -f "$KEYS_DIR/nostr_private_key" ]; then
        generate_hex 64 > "$KEYS_DIR/nostr_private_key"
        echo -e "${GREEN}Generated Nostr private key${NC}"
    fi
    
    # Generate JWT secret if it doesn't exist
    if [ ! -f "$KEYS_DIR/jwt_secret" ]; then
        generate_hex 64 > "$KEYS_DIR/jwt_secret"
        echo -e "${GREEN}Generated JWT secret${NC}"
    fi
    
    # Update .env file with the keys
    if [ -f "$ENV_FILE" ]; then
        NOSTR_PRIVATE_KEY=$(cat "$KEYS_DIR/nostr_private_key")
        JWT_SECRET=$(cat "$KEYS_DIR/jwt_secret")
        
        # Update or add the keys to .env
        sed -i '' "s/^NOSTR_PRIVATE_KEY=.*$/NOSTR_PRIVATE_KEY=$NOSTR_PRIVATE_KEY/" "$ENV_FILE" 2>/dev/null || \
        echo "NOSTR_PRIVATE_KEY=$NOSTR_PRIVATE_KEY" >> "$ENV_FILE"
        
        sed -i '' "s/^JWT_SECRET=.*$/JWT_SECRET=$JWT_SECRET/" "$ENV_FILE" 2>/dev/null || \
        echo "JWT_SECRET=$JWT_SECRET" >> "$ENV_FILE"
        
        # Add MAGIC_LINK_BASE_URL if in development
        if [ "$NODE_ENV" = "development" ] || [ -z "$NODE_ENV" ]; then
            sed -i '' "s|^MAGIC_LINK_BASE_URL=.*$|MAGIC_LINK_BASE_URL=http://localhost:3003/auth/magiclink/verify|" "$ENV_FILE" 2>/dev/null || \
            echo "MAGIC_LINK_BASE_URL=http://localhost:3003/auth/magiclink/verify" >> "$ENV_FILE"
        fi
        
        echo -e "${GREEN}Updated .env file with keys${NC}"
    else
        echo -e "${RED}Error: .env file not found${NC}"
        exit 1
    fi
}

# Function to validate keys
validate_keys() {
    echo -e "${GREEN}Validating keys...${NC}"
    local valid=true
    
    if [ "$NODE_ENV" = "development" ] || [ -z "$NODE_ENV" ]; then
        # Check if keys exist in development
        if [ ! -f "$KEYS_DIR/nostr_private_key" ]; then
            echo -e "${RED}Error: Nostr private key not found${NC}"
            valid=false
        fi
        
        if [ ! -f "$KEYS_DIR/jwt_secret" ]; then
            echo -e "${RED}Error: JWT secret not found${NC}"
            valid=false
        fi
    else
        # In production, check if keys are in environment
        if [ -z "$NOSTR_PRIVATE_KEY" ]; then
            echo -e "${RED}Error: NOSTR_PRIVATE_KEY not set${NC}"
            valid=false
        fi
        
        if [ -z "$JWT_SECRET" ]; then
            echo -e "${RED}Error: JWT_SECRET not set${NC}"
            valid=false
        fi
    fi
    
    if [ "$valid" = false ]; then
        exit 1
    fi
    
    echo -e "${GREEN}Key validation successful${NC}"
}

# Function to setup environment file
setup_environment() {
    if [ ! -f "$ENV_FILE" ]; then
        if [ -f "$ENV_EXAMPLE" ]; then
            cp "$ENV_EXAMPLE" "$ENV_FILE"
            echo -e "${GREEN}Created .env file from example${NC}"
        else
            echo -e "${RED}Error: .env.example file not found${NC}"
            exit 1
        fi
    fi
}

# Function to check and install dependencies
check_dependencies() {
    local missing_deps=()

    # Check for Node.js
    if ! command_exists node; then
        missing_deps+=("nodejs")
    fi

    # Check for npm
    if ! command_exists npm; then
        missing_deps+=("npm")
    fi

    # If there are missing dependencies, print them and exit
    if [ ${#missing_deps[@]} -ne 0 ]; then
        echo -e "${RED}Missing required dependencies: ${missing_deps[*]}${NC}"
        exit 1
    fi
}

# Function to install project dependencies
install_dependencies() {
    echo -e "${GREEN}Installing project dependencies...${NC}"
    npm install
}

# Function to build the project
build_project() {
    echo -e "${GREEN}Building project...${NC}"
    npm run build
}

# Main execution
echo -e "${GREEN}Configuring Nostr DM Magic Link Middleware...${NC}"

check_dependencies
setup_environment

if [ "$NODE_ENV" = "development" ] || [ -z "$NODE_ENV" ]; then
    setup_dev_keys
fi

validate_keys
install_dependencies
build_project

echo -e "${GREEN}Configuration complete!${NC}"
echo -e "${YELLOW}Don't forget to:
1. Review the .env file settings
2. Run ./scripts/startup.sh to start the service${NC}"
