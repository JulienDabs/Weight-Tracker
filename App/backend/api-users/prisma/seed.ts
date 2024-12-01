import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a simple user to test
  const user = await prisma.users.create({
    data: {
      firstname: 'Julien',
      lastname: 'Dabadie',
      email: 'juli3n.web.dev@gmail.com',
      password: 'Ujuj8181',
      height: 180,
      birthday: new Date('1990-01-01'),
      gender: 'MALE',
      preferences: {
        create: {
          tcComplied: true,
          tcCompliedDate: new Date(),
          isVerified: true,
          profileCompleted: true
        }
      }
    }
  })

  console.log('User created:', user)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })