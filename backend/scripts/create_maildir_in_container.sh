#!/bin/bash

# Helper script to create maildir for a user in the postfix container
# Usage: ./create_maildir_in_container.sh <domain> <localpart>

if [ $# -ne 2 ]; then
    echo "Usage: $0 <domain> <localpart>"
    echo "Example: $0 webmailapp.com alice"
    exit 1
fi

DOMAIN=$1
LOCALPART=$2

echo "Creating maildir for $LOCALPART@$DOMAIN in postfix container..."

# Execute the maildir creation script inside the postfix container
docker compose -f ../infra/docker-compose.yml exec postfix /scripts/create_maildir.sh "$DOMAIN" "$LOCALPART"

echo "Maildir creation completed!"
