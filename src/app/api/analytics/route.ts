import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/analytics - Get analytics data with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const eventType = searchParams.get('eventType')

    const where = eventType ? { eventType } : {}

    // Get total count for pagination
    const totalCount = await prisma.analytics.count({ where })

    const analytics = await prisma.analytics.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: limit,
      skip: (page - 1) * limit
    })

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      data: analytics,
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
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

// POST /api/analytics - Create analytics event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventType, eventData, userId, ipAddress, userAgent } = body

    if (!eventType) {
      return NextResponse.json(
        { error: 'Event type is required' },
        { status: 400 }
      )
    }

    const analytics = await prisma.analytics.create({
      data: {
        eventType,
        eventData: eventData ? JSON.stringify(eventData) : null,
        userId: userId ? parseInt(userId) : null,
        ipAddress,
        userAgent
      }
    })

    return NextResponse.json(analytics, { status: 201 })
  } catch (error) {
    console.error('Error creating analytics event:', error)
    return NextResponse.json(
      { error: 'Failed to create analytics event' },
      { status: 500 }
    )
  }
}