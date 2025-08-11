import prisma from '../lib/prisma'

async function updateExistingUsers() {
  try {
    // Get all users
    const users = await prisma.user.findMany();

    // Update each user
    for (const user of users) {
      // Generate a username from their email
      const baseUsername = user.email.split('@')[0];
      
      // Skip if user already has a username
      if (user.username) {
        console.log(`User ${user.email} already has username: ${user.username}`);
        continue;
      }

      // Try to update with the base username
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            username: baseUsername,
          }
        });
        console.log(`Updated user ${user.email} with username: ${baseUsername}`);
      } catch (e) {
        // If username is taken, append numbers until we find a unique one
        let counter = 1;
        let success = false;
        
        while (!success && counter < 100) { // Add limit to prevent infinite loop
          try {
            const newUsername = `${baseUsername}${counter}`;
            await prisma.user.update({
              where: { id: user.id },
              data: {
                username: newUsername,
              }
            });
            console.log(`Updated user ${user.email} with username: ${newUsername}`);
            success = true;
          } catch (e) {
            counter++;
          }
        }
        
        if (!success) {
          console.error(`Failed to generate unique username for ${user.email}`);
        }
      }
    }

    console.log('Successfully updated all existing users with usernames');
  } catch (error) {
    console.error('Error updating users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateExistingUsers();
