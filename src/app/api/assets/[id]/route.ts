import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/assets/[id] - Get a specific asset
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const asset = await prisma.asset.findUnique({
      where: { id: parseInt(id) }
    })

    if (!asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(asset)
  } catch (error) {
    console.error('Error fetching asset:', error)
    return NextResponse.json(
      { error: 'Failed to fetch asset' },
      { status: 500 }
    )
  }
}

// PUT /api/assets/[id] - Update an asset
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const assetId = parseInt(id)

    // Get the current asset to compare changes
    const currentAsset = await prisma.asset.findUnique({
      where: { id: assetId }
    })

    if (!currentAsset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const {
      name,
      type,
      model,
      serialNumber,
      purchaseOrder,
      purchaseDate,
      warrantyExpiry,
      location,
      status,
      assignedToId
    } = body

    // Prepare update data
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (type !== undefined) updateData.type = type
    if (model !== undefined) updateData.model = model
    if (serialNumber !== undefined) updateData.serialNumber = serialNumber
    if (purchaseOrder !== undefined) updateData.purchaseOrder = purchaseOrder
    if (purchaseDate !== undefined) updateData.purchaseDate = purchaseDate ? new Date(purchaseDate) : null
    if (warrantyExpiry !== undefined) updateData.warrantyExpiry = warrantyExpiry ? new Date(warrantyExpiry) : null
    if (location !== undefined) updateData.location = location
    if (status !== undefined) updateData.status = status
    if (assignedToId !== undefined) updateData.assignedToId = assignedToId ? parseInt(assignedToId) : null

    // Update the asset
    const updatedAsset = await prisma.asset.update({
      where: { id: assetId },
      data: updateData
    })

    // Create transaction records for changes
    const changes = []

    // Check for assignment changes
    if (currentAsset.assignedToId !== updatedAsset.assignedToId) {
      if (updatedAsset.assignedToId) {
        changes.push({
          action: 'assigned',
          oldValue: JSON.stringify({ assignedToId: currentAsset.assignedToId }),
          newValue: JSON.stringify({ assignedToId: updatedAsset.assignedToId }),
          notes: `Asset assigned to user ${updatedAsset.assignedToId}`
        })
      } else if (currentAsset.assignedToId) {
        changes.push({
          action: 'returned',
          oldValue: JSON.stringify({ assignedToId: currentAsset.assignedToId }),
          newValue: JSON.stringify({ assignedToId: null }),
          notes: `Asset returned from user ${currentAsset.assignedToId}`
        })
      }
    }

    // Check for status changes
    if (currentAsset.status !== updatedAsset.status) {
      changes.push({
        action: 'status_change',
        oldValue: JSON.stringify({ status: currentAsset.status }),
        newValue: JSON.stringify({ status: updatedAsset.status }),
        notes: `Status changed from ${currentAsset.status} to ${updatedAsset.status}`
      })

      // Special handling for maintenance status
      if (updatedAsset.status === 'maintenance') {
        changes.push({
          action: 'maintenance',
          oldValue: JSON.stringify({ status: currentAsset.status }),
          newValue: JSON.stringify({ status: 'maintenance' }),
          notes: 'Asset sent for maintenance'
        })
      }
    }

    // Check for location changes
    if (currentAsset.location !== updatedAsset.location) {
      changes.push({
        action: 'updated',
        oldValue: JSON.stringify({ location: currentAsset.location }),
        newValue: JSON.stringify({ location: updatedAsset.location }),
        notes: `Location changed from ${currentAsset.location || 'N/A'} to ${updatedAsset.location || 'N/A'}`
      })
    }

    // Create transaction records
    for (const change of changes) {
      await prisma.assetTransaction.create({
        data: {
          assetId,
          action: change.action,
          oldValue: change.oldValue,
          newValue: change.newValue,
          notes: change.notes
        }
      })
    }

    return NextResponse.json(updatedAsset)
  } catch (error) {
    console.error('Error updating asset:', error)
    return NextResponse.json(
      { error: 'Failed to update asset' },
      { status: 500 }
    )
  }
}

// DELETE /api/assets/[id] - Delete an asset
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const assetId = parseInt(id)

    // Create transaction record for deletion
    await prisma.assetTransaction.create({
      data: {
        assetId,
        action: 'deleted',
        notes: 'Asset deleted from system'
      }
    })

    // Delete the asset
    await prisma.asset.delete({
      where: { id: assetId }
    })

    return NextResponse.json({ message: 'Asset deleted successfully' })
  } catch (error) {
    console.error('Error deleting asset:', error)
    return NextResponse.json(
      { error: 'Failed to delete asset' },
      { status: 500 }
    )
  }
}