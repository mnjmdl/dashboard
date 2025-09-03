import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create sample users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@company.com',
        name: 'System Administrator',
        role: 'admin'
      }
    }),
    prisma.user.create({
      data: {
        email: 'john.technician@company.com',
        name: 'John Smith',
        role: 'technician'
      }
    }),
    prisma.user.create({
      data: {
        email: 'sarah.technician@company.com',
        name: 'Sarah Johnson',
        role: 'technician'
      }
    }),
    prisma.user.create({
      data: {
        email: 'mike.manager@company.com',
        name: 'Mike Wilson',
        role: 'manager'
      }
    }),
    prisma.user.create({
      data: {
        email: 'alice.user@company.com',
        name: 'Alice Brown',
        role: 'user'
      }
    }),
    prisma.user.create({
      data: {
        email: 'bob.user@company.com',
        name: 'Bob Davis',
        role: 'user'
      }
    })
  ])

  console.log('✅ Created users:', users.length)

  // Create sample assets
  const assets = await Promise.all([
    // Computers
    prisma.asset.create({
      data: {
        name: 'Dell Latitude 5420',
        type: 'computer',
        model: 'Latitude 5420',
        serialNumber: 'DL5420-001',
        purchaseDate: new Date('2023-01-15'),
        warrantyExpiry: new Date('2026-01-15'),
        location: 'Floor 1, Office 101',
        status: 'active',
        assignedToId: users[4].id // Alice Brown
      }
    }),
    prisma.asset.create({
      data: {
        name: 'HP EliteBook 840',
        type: 'computer',
        model: 'EliteBook 840 G8',
        serialNumber: 'HP840-002',
        purchaseDate: new Date('2023-02-20'),
        warrantyExpiry: new Date('2026-02-20'),
        location: 'Floor 1, Office 102',
        status: 'active',
        assignedToId: users[5].id // Bob Davis
      }
    }),
    prisma.asset.create({
      data: {
        name: 'MacBook Pro 16"',
        type: 'computer',
        model: 'MacBook Pro M1',
        serialNumber: 'MBP16-003',
        purchaseDate: new Date('2023-03-10'),
        warrantyExpiry: new Date('2026-03-10'),
        location: 'Floor 2, Office 201',
        status: 'active',
        assignedToId: users[1].id // John Smith
      }
    }),

    // Monitors
    prisma.asset.create({
      data: {
        name: 'Dell 27" 4K Monitor',
        type: 'monitor',
        model: 'U2720Q',
        serialNumber: 'DELL27-004',
        purchaseDate: new Date('2023-01-15'),
        warrantyExpiry: new Date('2026-01-15'),
        location: 'Floor 1, Office 101',
        status: 'active',
        assignedToId: users[4].id
      }
    }),
    prisma.asset.create({
      data: {
        name: 'LG 32" UltraWide Monitor',
        type: 'monitor',
        model: '32UL950-W',
        serialNumber: 'LG32-005',
        purchaseDate: new Date('2023-02-20'),
        warrantyExpiry: new Date('2026-02-20'),
        location: 'Floor 1, Office 102',
        status: 'active',
        assignedToId: users[5].id
      }
    }),

    // Printers
    prisma.asset.create({
      data: {
        name: 'HP LaserJet Pro MFP',
        type: 'printer',
        model: 'M182nw',
        serialNumber: 'HP182-006',
        purchaseDate: new Date('2023-03-01'),
        warrantyExpiry: new Date('2025-03-01'),
        location: 'Floor 1, Printer Room',
        status: 'active'
      }
    }),
    prisma.asset.create({
      data: {
        name: 'Brother MFC-L2710DW',
        type: 'printer',
        model: 'MFC-L2710DW',
        serialNumber: 'BR2710-007',
        purchaseDate: new Date('2023-04-15'),
        warrantyExpiry: new Date('2025-04-15'),
        location: 'Floor 2, Copy Room',
        status: 'maintenance'
      }
    }),

    // Servers
    prisma.asset.create({
      data: {
        name: 'Dell PowerEdge R440',
        type: 'server',
        model: 'PowerEdge R440',
        serialNumber: 'DER440-008',
        purchaseDate: new Date('2022-12-01'),
        warrantyExpiry: new Date('2025-12-01'),
        location: 'Server Room',
        status: 'active'
      }
    }),

    // Network Devices
    prisma.asset.create({
      data: {
        name: 'Cisco Catalyst 2960',
        type: 'network_device',
        model: 'WS-C2960-24TT-L',
        serialNumber: 'CISCO2960-009',
        purchaseDate: new Date('2022-11-15'),
        warrantyExpiry: new Date('2025-11-15'),
        location: 'Network Closet',
        status: 'active'
      }
    }),

    // Software Licenses
    prisma.asset.create({
      data: {
        name: 'Microsoft Office 365 Pro Plus',
        type: 'software_license',
        model: 'Office 365 Pro Plus',
        serialNumber: 'MS365-010',
        purchaseDate: new Date('2023-01-01'),
        warrantyExpiry: new Date('2024-01-01'),
        location: 'Software Licenses',
        status: 'active'
      }
    }),
    prisma.asset.create({
      data: {
        name: 'Adobe Creative Cloud',
        type: 'software_license',
        model: 'Creative Cloud All Apps',
        serialNumber: 'ADOBE-011',
        purchaseDate: new Date('2023-02-01'),
        warrantyExpiry: new Date('2024-02-01'),
        location: 'Software Licenses',
        status: 'active',
        assignedToId: users[1].id
      }
    })
  ])

  console.log('✅ Created assets:', assets.length)

  // Create sample tickets
  const tickets = await Promise.all([
    prisma.ticket.create({
      data: {
        title: 'Computer not starting up',
        description: 'My Dell laptop won\'t turn on. Tried multiple power outlets and the battery is charged.',
        status: 'open',
        priority: 'high',
        category: 'hardware',
        creatorId: users[4].id,
        assetId: assets[0].id
      }
    }),
    prisma.ticket.create({
      data: {
        title: 'Cannot access company email',
        description: 'Getting authentication error when trying to log into Outlook. Password reset didn\'t help.',
        status: 'in_progress',
        priority: 'urgent',
        category: 'access',
        creatorId: users[5].id,
        assigneeId: users[1].id,
        assetId: assets[1].id
      }
    }),
    prisma.ticket.create({
      data: {
        title: 'Printer out of toner',
        description: 'The main office printer is showing "out of toner" error. Need replacement cartridge.',
        status: 'open',
        priority: 'medium',
        category: 'hardware',
        creatorId: users[4].id,
        assetId: assets[5].id
      }
    }),
    prisma.ticket.create({
      data: {
        title: 'Slow internet connection',
        description: 'Internet speed has been very slow for the past few days. Pages take forever to load.',
        status: 'open',
        priority: 'medium',
        category: 'network',
        creatorId: users[5].id
      }
    }),
    prisma.ticket.create({
      data: {
        title: 'Software installation request',
        description: 'Need Adobe Photoshop installed on my workstation for design work.',
        status: 'resolved',
        priority: 'low',
        category: 'software',
        creatorId: users[1].id,
        assigneeId: users[2].id,
        assetId: assets[2].id,
        resolvedAt: new Date('2024-01-15')
      }
    }),
    prisma.ticket.create({
      data: {
        title: 'Monitor flickering issue',
        description: 'The external monitor connected to my laptop keeps flickering intermittently.',
        status: 'in_progress',
        priority: 'medium',
        category: 'hardware',
        creatorId: users[4].id,
        assigneeId: users[1].id,
        assetId: assets[3].id
      }
    }),
    prisma.ticket.create({
      data: {
        title: 'VPN connection problems',
        description: 'Unable to connect to company VPN from home office. Getting timeout errors.',
        status: 'open',
        priority: 'high',
        category: 'network',
        creatorId: users[5].id
      }
    }),
    prisma.ticket.create({
      data: {
        title: 'New employee setup',
        description: 'Need to set up workstation, email, and access for new marketing hire.',
        status: 'resolved',
        priority: 'high',
        category: 'access',
        creatorId: users[3].id,
        assigneeId: users[1].id,
        resolvedAt: new Date('2024-01-10')
      }
    }),
    prisma.ticket.create({
      data: {
        title: 'Server backup failure',
        description: 'Automated backup job failed last night. Need to investigate and fix.',
        status: 'in_progress',
        priority: 'urgent',
        category: 'hardware',
        creatorId: users[0].id,
        assigneeId: users[2].id,
        assetId: assets[6].id
      }
    }),
    prisma.ticket.create({
      data: {
        title: 'Microsoft Office activation',
        description: 'Office applications showing "product not activated" error.',
        status: 'open',
        priority: 'medium',
        category: 'software',
        creatorId: users[4].id,
        assetId: assets[8].id
      }
    })
  ])

  console.log('✅ Created tickets:', tickets.length)

  // Create sample departments
  const departments = await Promise.all([
    prisma.department.create({
      data: {
        name: 'IT Department',
        description: 'Information Technology and Support',
        managerId: users[3].id
      }
    }),
    prisma.department.create({
      data: {
        name: 'Marketing',
        description: 'Marketing and Communications',
        managerId: users[3].id
      }
    }),
    prisma.department.create({
      data: {
        name: 'Sales',
        description: 'Sales and Business Development'
      }
    }),
    prisma.department.create({
      data: {
        name: 'Finance',
        description: 'Accounting and Financial Operations'
      }
    })
  ])

  console.log('✅ Created departments:', departments.length)

  console.log('🎉 Database seeding completed successfully!')
  console.log('📊 Summary:')
  console.log(`   - Users: ${users.length}`)
  console.log(`   - Assets: ${assets.length}`)
  console.log(`   - Tickets: ${tickets.length}`)
  console.log(`   - Departments: ${departments.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })