// setup.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting setup...');

// Run migrations
console.log('Running database migrations...');
try {
  execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
  console.log('Migrations completed successfully.');
} catch (error) {
  console.error('Error running migrations:', error);
  process.exit(1);
}

// Seed admin user
console.log('Creating admin user...');
try {
  execSync('npx tsx prisma/seed-user.ts', { stdio: 'inherit' });
  console.log('Admin user created successfully.');
} catch (error) {
  console.error('Error creating admin user:', error);
  process.exit(1);
}

console.log('\nSetup completed successfully!');
console.log('\nAdmin credentials:');
console.log('Email: admin@example.com');
console.log('Password: admin123');
console.log('\nClient credentials:');
console.log('Email: client@example.com');
console.log('Password: client123');
console.log('\nYou can now start the application with:');
console.log('npm run dev');
