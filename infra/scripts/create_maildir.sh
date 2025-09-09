#!/bin/bash

# Script to create Maildir structure for a user
# Usage: ./create_maildir.sh <domain> <localpart>

set -e

if [ $# -ne 2 ]; then
    echo "Usage: $0 <domain> <localpart>"
    echo "Example: $0 webmailapp.com alice"
    exit 1
fi

DOMAIN=$1
LOCALPART=$2
VMAIL_UID=${VMAIL_UID:-5000}
VMAIL_GID=${VMAIL_GID:-5000}

# Create the mail directory structure
MAILDIR="/var/mail/vhosts/$DOMAIN/$LOCALPART/Maildir"

echo "Creating maildir for $LOCALPART@$DOMAIN at $MAILDIR"

# Create the main directory
mkdir -p "$MAILDIR"

# Create Maildir subdirectories
mkdir -p "$MAILDIR/cur"
mkdir -p "$MAILDIR/new"
mkdir -p "$MAILDIR/tmp"

# Set proper ownership
chown -R $VMAIL_UID:$VMAIL_GID "$MAILDIR"

# Set proper permissions
chmod -R 755 "$MAILDIR"

echo "Maildir created successfully for $LOCALPART@$DOMAIN"
echo "Directory: $MAILDIR"
echo "Owner: $VMAIL_UID:$VMAIL_GID"
