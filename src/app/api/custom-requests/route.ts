import { NextRequest, NextResponse } from 'next/server';
import { getCustomRequests, createCustomRequest, updateCustomRequestStatus } from '@/lib/server/repository';
import { verifyAdminRequest } from '@/lib/auth/admin-session';

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminRequest(request);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }

    const requests = await getCustomRequests();
    return NextResponse.json({ success: true, requests });
  } catch (error) {
    console.error('Error fetching custom requests:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch custom requests' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.phone || !body.itemType || !body.description) {
      return NextResponse.json({ success: false, error: 'Name, phone, item type, and description are required.' }, { status: 400 });
    }

    const newReq = await createCustomRequest({
      customerName: body.name.trim(),
      email: body.email?.trim() || '',
      phone: body.phone.trim(),
      itemType: body.itemType,
      colorPreferences: body.colorPreferences || '',
      description: body.description.trim(),
      budgetPaise: typeof body.budgetPaise === 'number' ? body.budgetPaise : undefined,
      referenceImages: Array.isArray(body.referenceImages) ? body.referenceImages : [],
    });

    return NextResponse.json({
      success: true,
      request: newReq,
      message: 'Custom request received. Artisan Rasika will review and connect with you on WhatsApp!',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating custom request:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit custom request' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminRequest(request);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, adminNotes } = body;
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'id and status are required.' }, { status: 400 });
    }

    const updated = await updateCustomRequestStatus(id, status, adminNotes);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, request: updated });
  } catch (error) {
    console.error('Error updating custom request:', error);
    return NextResponse.json({ success: false, error: 'Failed to update custom request' }, { status: 500 });
  }
}
