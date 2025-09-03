import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting to seed 250 assets...')

  const assetTypes = [
    'computer',
    'monitor',
    'printer',
    'server',
    'network_device',
    'software_license'
  ]

  const computerModels = [
    'MacBook Pro 16"',
    'MacBook Pro 14"',
    'MacBook Air 13"',
    'Dell XPS 13',
    'Dell XPS 15',
    'HP Spectre x360',
    'Lenovo ThinkPad X1',
    'Lenovo ThinkPad T14',
    'ASUS ROG Zephyrus',
    'Microsoft Surface Laptop'
  ]

  const monitorModels = [
    'Dell UltraSharp U2720Q',
    'LG 27UK650-W',
    'Samsung UR59C',
    'ASUS ProArt PA278QV',
    'BenQ PD2700Q',
    'ViewSonic VX3276-4K',
    'Acer EI322QUR',
    'HP Z27',
    'Apple Studio Display',
    'Sony PVM-X1800'
  ]

  const printerModels = [
    'HP LaserJet Pro M182nw',
    'Canon PIXMA TR8520',
    'Epson EcoTank ET-8550',
    'Brother MFC-J995DW',
    'Xerox VersaLink C405',
    'Ricoh IM C3000',
    'Kyocera TASKalfa 3554ci',
    'Lexmark MX522',
    'Samsung Xpress M2880FW',
    'OKI MC873dn'
  ]

  const serverModels = [
    'Dell PowerEdge R750',
    'HPE ProLiant DL380',
    'Lenovo ThinkSystem SR650',
    'Cisco UCS C220',
    'Supermicro SYS-5019S-MR',
    'IBM Power System S922',
    'Oracle Sun Server X5-2',
    'Fujitsu PRIMERGY RX2530',
    'ASUS RS700A-E9',
    'QNAP TS-873'
  ]

  const networkDeviceModels = [
    'Cisco Catalyst 2960-X',
    'Ubiquiti UniFi AP AC Pro',
    'Netgear Nighthawk RS700S',
    'TP-Link Archer C80',
    'ASUS RT-AX88U',
    'Linksys WRT3200ACM',
    'D-Link DIR-882',
    'Google Nest Wifi Pro',
    'Eero Pro 6',
    'Orbi RBK752'
  ]

  const softwareLicenseModels = [
    'Microsoft Office 365 ProPlus',
    'Adobe Creative Cloud All Apps',
    'AutoCAD 2024',
    'SolidWorks Premium',
    'VMware vSphere',
    'Windows Server 2022 Standard',
    'SQL Server 2022 Enterprise',
    'Visual Studio Enterprise',
    'IntelliJ IDEA Ultimate',
    'JetBrains All Products Pack'
  ]

  const locations = [
    'Office 101',
    'Office 102',
    'Office 103',
    'Office 201',
    'Office 202',
    'Office 203',
    'Conference Room A',
    'Conference Room B',
    'Server Room',
    'IT Department',
    'HR Department',
    'Finance Department',
    'Marketing Department',
    'Sales Department',
    'Engineering Lab',
    'Data Center',
    'Remote Office NYC',
    'Remote Office LA',
    'Remote Office Chicago',
    'Warehouse A'
  ]

  const statuses = ['active', 'in_stock', 'maintenance', 'retired', 'lost']

  // Clear existing assets
  await prisma.asset.deleteMany({})
  console.log('🗑️  Cleared existing assets')

  // Generate 250 assets
  const assets = []
  for (let i = 1; i <= 250; i++) {
    const type = assetTypes[Math.floor(Math.random() * assetTypes.length)]
    let model = ''

    switch (type) {
      case 'computer':
        model = computerModels[Math.floor(Math.random() * computerModels.length)]
        break
      case 'monitor':
        model = monitorModels[Math.floor(Math.random() * monitorModels.length)]
        break
      case 'printer':
        model = printerModels[Math.floor(Math.random() * printerModels.length)]
        break
      case 'server':
        model = serverModels[Math.floor(Math.random() * serverModels.length)]
        break
      case 'network_device':
        model = networkDeviceModels[Math.floor(Math.random() * networkDeviceModels.length)]
        break
      case 'software_license':
        model = softwareLicenseModels[Math.floor(Math.random() * softwareLicenseModels.length)]
        break
    }

    const location = locations[Math.floor(Math.random() * locations.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]

    // Generate purchase date (between 1-3 years ago)
    const purchaseDate = new Date()
    purchaseDate.setFullYear(purchaseDate.getFullYear() - Math.floor(Math.random() * 3) - 1)
    purchaseDate.setMonth(Math.floor(Math.random() * 12))
    purchaseDate.setDate(Math.floor(Math.random() * 28) + 1)

    // Generate warranty expiry (1-5 years from purchase)
    const warrantyExpiry = new Date(purchaseDate)
    warrantyExpiry.setFullYear(warrantyExpiry.getFullYear() + Math.floor(Math.random() * 5) + 1)

    // Generate serial number
    const serialNumber = `${type.toUpperCase().substring(0, 3)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${i.toString().padStart(4, '0')}`

    // Generate purchase order
    const purchaseOrder = `PO-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`

    // 70% chance of being assigned, 30% chance of being unassigned
    const assignedToId = Math.random() < 0.7 ? Math.floor(Math.random() * 50) + 1 : null

    assets.push({
      name: `${model} #${i}`,
      type,
      model,
      serialNumber,
      purchaseOrder,
      purchaseDate,
      warrantyExpiry,
      location,
      status,
      assignedToId
    })
  }

  // Insert assets in batches to avoid memory issues
  const batchSize = 50
  for (let i = 0; i < assets.length; i += batchSize) {
    const batch = assets.slice(i, i + batchSize)
    await prisma.asset.createMany({
      data: batch
    })
    console.log(`📦 Inserted assets ${i + 1} to ${Math.min(i + batchSize, assets.length)}`)
  }

  console.log('✅ Successfully seeded 250 assets!')
  console.log('📊 Asset distribution:')
  console.log(`   - Computers: ${assets.filter(a => a.type === 'computer').length}`)
  console.log(`   - Monitors: ${assets.filter(a => a.type === 'monitor').length}`)
  console.log(`   - Printers: ${assets.filter(a => a.type === 'printer').length}`)
  console.log(`   - Servers: ${assets.filter(a => a.type === 'server').length}`)
  console.log(`   - Network Devices: ${assets.filter(a => a.type === 'network_device').length}`)
  console.log(`   - Software Licenses: ${assets.filter(a => a.type === 'software_license').length}`)
  console.log(`   - In Stock: ${assets.filter(a => a.assignedToId === null).length}`)
  console.log(`   - Assigned: ${assets.filter(a => a.assignedToId !== null).length}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })