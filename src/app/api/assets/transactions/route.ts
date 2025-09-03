import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/assets/transactions - Get all asset transactions with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const assetId = searchParams.get('assetId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const skip = (page - 1) * limit

    const where: any = {}
    if (assetId) {
      where.assetId = parseInt(assetId)
    }

    const [transactions, totalCount] = await Promise.all([
      prisma.assetTransaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.assetTransaction.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      data: transactions,
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
    console.error('Error fetching asset transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch asset transactions' },
      { status: 500 }
    )
  }
}

// POST /api/assets/transactions - Create a new asset transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { assetId, action, oldValue, newValue, userId, notes } = body

    if (!assetId || !action) {
      return NextResponse.json(
        { error: 'Asset ID and action are required' },
        { status: 400 }
      )
    }

    const transaction = await prisma.assetTransaction.create({
      data: {
        assetId: parseInt(assetId),
        action,
        oldValue: oldValue ? JSON.stringify(oldValue) : null,
        newValue: newValue ? JSON.stringify(newValue) : null,
        userId: userId ? parseInt(userId) : null,
        notes
      }
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error('Error creating asset transaction:', error)
    return NextResponse.json(
      { error: 'Failed to create asset transaction' },
      { status: 500 }
    )
  }
}