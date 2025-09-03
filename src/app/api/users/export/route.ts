import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/users/export - Export all users to CSV
export async function GET(request: NextRequest) {
  try {
    // Fetch all users for export (no pagination)
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    })

    // Create CSV content
    const csvHeaders = [
      'ID',
      'Name',
      'Email',
      'Role',
      'Created At',
      'Updated At'
    ]

    const csvRows = users.map(user => [
      user.id,
      `"${user.name || ''}"`,
      `"${user.email}"`,
      `"${user.role}"`,
      new Date(user.createdAt).toLocaleDateString(),
      new Date(user.updatedAt).toLocaleDateString()
    ])

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n')

    // Return CSV file
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="users_export_${new Date().toISOString().split('T')[0]}.csv"`
      }
    })
  } catch (error) {
    console.error('Error exporting users:', error)
    return NextResponse.json(
      { error: 'Failed to export users' },
      { status: 500 }
    )
  }
}