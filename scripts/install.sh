#!/bin/bash
set -x # Show the output of the following commands (useful for debugging)

# Import the SSH deployment key
openssl aes-256-cbc -K $encrypted_7fecd50c2af5_key -iv $encrypted_7fecd50c2af5_iv -in troubadour_key.enc -out troubadour_key -drm troubadour_key.enc
chmod 600 troubadour_key
mv troubadour_key ~/.ssh/id_rsa
