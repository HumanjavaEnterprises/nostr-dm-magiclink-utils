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

# Function to validate hex string
validate_hex() {
    local hex="$1"
    if [[ ! "$hex" =~ ^[0-9a-fA-F]{64}$ ]]; then
        return 1
    fi
    return 0
}

# Function to validate API key format
validate_api_key() {
    local key="$1"
    if [[ ! "$key" =~ ^nostr_${ENVIRONMENT}_magiclink_[0-9]+$ ]]; then
        return 1
    fi
    return 0
}

# Function to validate development keys
validate_dev_keys() {
    local key_dir="$PROJECT_ROOT/local/keys"
    local has_error=0

    # Check if key directory exists
    if [ ! -d "$key_dir" ]; then
        echo -e "${RED}Error: Key directory not found at $key_dir${NC}"
        echo -e "${YELLOW}Run ./scripts/generate-keys.sh --env development to generate keys${NC}"
        return 1
    fi

    # Validate Nostr keys
    if [ -f "$key_dir/nostr_keys.json" ]; then
        echo -e "${GREEN} Nostr keys file exists${NC}"
        # Validate JSON structure using Node
        if node -e "const keys=require('$key_dir/nostr_keys.json'); process.exit(!keys.privateKey || !keys.publicKey || !keys.nsec || !keys.npub ? 1 : 0)" 2>/dev/null; then
            echo -e "${GREEN} Nostr keys format is valid${NC}"
        else
            echo -e "${RED} Invalid Nostr keys format${NC}"
            has_error=1
        fi
    else
        echo -e "${RED} Nostr keys file missing${NC}"
        has_error=1
    fi

    # Validate JWT secret
    if [ -f "$key_dir/jwt.secret" ]; then
        local jwt_secret
        jwt_secret=$(cat "$key_dir/jwt.secret")
        if validate_hex "$jwt_secret"; then
            echo -e "${GREEN} JWT secret is valid${NC}"
        else
            echo -e "${RED} Invalid JWT secret format${NC}"
            has_error=1
        fi
    else
        echo -e "${RED} JWT secret file missing${NC}"
        has_error=1
    fi

    # Validate API key
    if [ -f "$key_dir/api.key" ]; then
        local api_key
        api_key=$(cat "$key_dir/api.key")
        if validate_api_key "$api_key"; then
            echo -e "${GREEN} API key is valid${NC}"
        else
            echo -e "${RED} Invalid API key format${NC}"
            has_error=1
        fi
    else
        echo -e "${RED} API key file missing${NC}"
        has_error=1
    fi

    return $has_error
}

# Function to validate production keys
validate_prod_keys() {
    echo -e "${YELLOW}Production key validation would check Supabase storage${NC}"
    echo -e "${YELLOW}Implement production validation when Supabase integration is ready${NC}"
    return 0
}

# Main execution
echo -e "${GREEN}Validating keys for $ENVIRONMENT environment...${NC}"

if [ "$ENVIRONMENT" = "development" ]; then
    validate_dev_keys
else
    validate_prod_keys
fi
