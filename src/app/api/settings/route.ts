import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/settings - Get all settings
export async function GET() {
  try {
    const settings = await prisma.setting.findMany({
      orderBy: { key: 'asc' }
    })
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// POST /api/settings - Create or update a setting
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, value, type } = body

    if (!key || !value) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      )
    }

    const setting = await prisma.setting.upsert({
      where: { key },
      update: {
        value,
        type: type || 'string'
      },
      create: {
        key,
        value,
        type: type || 'string'
      }
    })

    return NextResponse.json(setting, { status: 201 })
  } catch (error) {
    console.error('Error creating/updating setting:', error)
    return NextResponse.json(
      { error: 'Failed to create/update setting' },
      { status: 500 }
    )
  }
}