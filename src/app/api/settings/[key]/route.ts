import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/settings/[key] - Get a specific setting
export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: decodeURIComponent(params.key) }
    })

    if (!setting) {
      return NextResponse.json(
        { error: 'Setting not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(setting)
  } catch (error) {
    console.error('Error fetching setting:', error)
    return NextResponse.json(
      { error: 'Failed to fetch setting' },
      { status: 500 }
    )
  }
}

// PUT /api/settings/[key] - Update a setting
export async function PUT(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const body = await request.json()
    const { value, type } = body

    if (!value) {
      return NextResponse.json(
        { error: 'Value is required' },
        { status: 400 }
      )
    }

    const setting = await prisma.setting.update({
      where: { key: decodeURIComponent(params.key) },
      data: {
        value,
        type: type || 'string'
      }
    })

    return NextResponse.json(setting)
  } catch (error) {
    console.error('Error updating setting:', error)
    return NextResponse.json(
      { error: 'Failed to update setting' },
      { status: 500 }
    )
  }
}

// DELETE /api/settings/[key] - Delete a setting
export async function DELETE(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    await prisma.setting.delete({
      where: { key: decodeURIComponent(params.key) }
    })

    return NextResponse.json({ message: 'Setting deleted successfully' })
  } catch (error) {
    console.error('Error deleting setting:', error)
    return NextResponse.json(
      { error: 'Failed to delete setting' },
      { status: 500 }
    )
  }
}