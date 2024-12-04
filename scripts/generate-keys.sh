#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

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

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(development|production)$ ]]; then
    echo -e "${RED}Invalid environment. Must be 'development' or 'production'${NC}"
    exit 1
fi

# Function to generate random hex string
generate_hex() {
    openssl rand -hex 32
}

# Function to generate Nostr keypair
generate_nostr_keypair() {
    # This will be implemented using nostr-tools in a Node.js script
    node "$PROJECT_ROOT/scripts/generate-nostr-keypair.js"
}

# Function to generate API key
generate_api_key() {
    local timestamp
    timestamp=$(date +%s)
    echo "nostr_${ENVIRONMENT}_magiclink_${timestamp}"
}

# Function to setup development keys
setup_dev_keys() {
    local key_dir="$PROJECT_ROOT/local/keys"
    mkdir -p "$key_dir"

    # Generate Nostr keypair
    echo -e "${GREEN}Generating Nostr keypair...${NC}"
    generate_nostr_keypair > "$key_dir/nostr_keys.json"

    # Generate JWT secret
    echo -e "${GREEN}Generating JWT secret...${NC}"
    generate_hex > "$key_dir/jwt.secret"

    # Generate API key
    echo -e "${GREEN}Generating API key...${NC}"
    generate_api_key > "$key_dir/api.key"

    echo -e "${GREEN}Development keys generated successfully in $key_dir${NC}"
}

# Function to setup production keys
setup_prod_keys() {
    echo -e "${GREEN}Generating production keys...${NC}"
    
    # Generate keys
    local nostr_keys
    nostr_keys=$(generate_nostr_keypair)
    local jwt_secret
    jwt_secret=$(generate_hex)
    local api_key
    api_key=$(generate_api_key)

    # In production, we would store these in Supabase
    # For now, we'll just show them
    echo -e "${YELLOW}Production Keys (store these securely):${NC}"
    echo "Nostr Keys: $nostr_keys"
    echo "JWT Secret: $jwt_secret"
    echo "API Key: $api_key"
}

# Main execution
echo -e "${GREEN}Generating keys for $ENVIRONMENT environment...${NC}"

if [ "$ENVIRONMENT" = "development" ]; then
    setup_dev_keys
else
    setup_prod_keys
fi
