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
        --to)
            to="$2"
            shift
            shift
            ;;
        --amount)
            amount="$2"
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
    local to=$2
    local amount=$3

    cast send "$contract" "mint(address,uint256)" "$to" "$amount" --rpc-url $RPC_URL --private-key $PRIVATE_KEY
}

mint_tokens "$contract" "$to" "$amount"

