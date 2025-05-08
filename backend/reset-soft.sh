#!/bin/bash

# Display what"s happening
echo "Undoing seeders & migrations..."

# Undo seeders
npx dotenv sequelize db:seed:undo:all

# Undo migrations
npx dotenv sequelize db:migrate:undo:all

# Run migrations
echo "Running migrations..."
npx dotenv sequelize db:migrate

# Run seeders
echo "Running seeders..."
npx dotenv sequelize db:seed:all

echo "Database reset complete!"
