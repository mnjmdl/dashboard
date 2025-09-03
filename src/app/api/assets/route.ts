import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/assets - Get all assets with pagination and search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const skip = (page - 1) * limit

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

    const [assets, totalCount] = await Promise.all([
      prisma.asset.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.asset.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      data: assets,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })
  } catch (error) {
    console.error('Error fetching assets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assets' },
      { status: 500 }
    )
  }
}

// POST /api/assets - Create a new asset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, model, serialNumber, purchaseOrder, purchaseDate, warrantyExpiry, location, assignedToId } = body

    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      )
    }

    const asset = await prisma.asset.create({
      data: {
        name,
        type,
        model,
        serialNumber,
        purchaseOrder,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        warrantyExpiry: warrantyExpiry ? new Date(warrantyExpiry) : null,
        location,
        assignedToId: assignedToId ? parseInt(assignedToId) : null
      }
    })

    return NextResponse.json(asset, { status: 201 })
  } catch (error) {
    console.error('Error creating asset:', error)
    return NextResponse.json(
      { error: 'Failed to create asset' },
      { status: 500 }
    )
  }
}