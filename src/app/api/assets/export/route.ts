import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/assets/export - Export all assets to CSV
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const search = searchParams.get('search')

    const where: any = {}
    if (status && status !== 'all') {
      if (status === 'in_stock') {
        // In Stock means unassigned assets
        where.assignedToId = null
      } else {
        where.status = status
      }
    }
    if (type && type !== 'all') where.type = type

    // Add search functionality
    if (search && search.trim()) {
      where.OR = [
        { name: { contains: search.trim() } },
        { model: { contains: search.trim() } },
        { serialNumber: { contains: search.trim() } },
        { location: { contains: search.trim() } },
        { purchaseOrder: { contains: search.trim() } }
      ]
    }

    // Fetch all assets for export (no pagination)
    const assets = await prisma.asset.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    // Create CSV content
    const csvHeaders = [
      'ID',
      'Name',
      'Type',
      'Model',
      'Serial Number',
      'Purchase Order',
      'Purchase Date',
      'Warranty Expiry',
      'Location',
      'Status',
      'Assigned To',
      'Created At',
      'Updated At'
    ]

    const csvRows = assets.map(asset => [
      asset.id,
      `"${asset.name}"`,
      `"${asset.type}"`,
      `"${asset.model || ''}"`,
      `"${asset.serialNumber || ''}"`,
      `"${asset.purchaseOrder || ''}"`,
      asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString() : '',
      asset.warrantyExpiry ? new Date(asset.warrantyExpiry).toLocaleDateString() : '',
      `"${asset.location || ''}"`,
      `"${asset.status === 'in_stock' ? 'In Stock' : asset.status}"`,
      asset.assignedToId ? `"User ${asset.assignedToId}"` : '"Unassigned"',
      new Date(asset.createdAt).toLocaleDateString(),
      new Date(asset.updatedAt).toLocaleDateString()
    ])

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n')

    // Return CSV file
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="assets_export_${new Date().toISOString().split('T')[0]}.csv"`
      }
    })
  } catch (error) {
    console.error('Error exporting assets:', error)
    return NextResponse.json(
      { error: 'Failed to export assets' },
      { status: 500 }
    )
  }
}