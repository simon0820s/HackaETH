#!/bin/bash

source .env

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
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

function deploy() {
    local network=$1

    npx hardhat run scripts/deploy.ts --network $network
}

deploy "$network"
