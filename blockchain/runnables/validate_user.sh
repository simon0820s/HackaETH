#!/bin/bash

if [[ -f .env ]]; then
    source .env
else
    echo "Error: .env file not found."
    exit 1
fi

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        --contract)
            contract="$2"
            shift
            shift
            ;;
        --user)
            user="$2"
            shift
            shift
            ;;
        --limit)
            limit="$2"
            shift
            shift
            ;;
        --network)
            network="$2"
            shift
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

function validate_user() {
    local contract=$1
    local user=$2
    local limit=$3

    if [[ "$network" == "localhost" ]]; then
        cast send "$contract" "validateUser(address,uint256)" "$user" "$limit" --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
    else
        cast send "$contract" "validateUser(address,uint256)" "$user" "$limit" --rpc-url $RPC_URL --private-key $PRIVATE_KEY
    fi
}

validate_user "$contract" "$user" "$limit"
