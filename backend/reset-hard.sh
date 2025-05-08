#!/bin/bash

# Display what"s happening
echo "Resetting development database..."

# Remove the SQLite database file
rm -f db/dev.db

# Run migrations
echo "Running migrations..."
npx dotenv sequelize db:migrate

# Run seeders
echo "Running seeders..."
npx dotenv sequelize db:seed:all

echo "Database reset complete!"
