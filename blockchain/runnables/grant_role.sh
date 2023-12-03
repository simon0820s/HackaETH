#!/bin/bash

source .env

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        --contract)
            token="$2"
            shift
            shift
            ;;
        --role)
            role="$2"
            shift
            shift
            ;;
        --user)
            user="$2"
            shift
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

function mint_tokens() {
    local contract=$1
    local role=$2
    local user=$3

    cast send "$contract" "grantRole(bytes32,address)" "$role" "$user" --rpc-url $RPC_URL --private-key $PRIVATE_KEY
}

mint_tokens "$contract" "$role" "$user"

