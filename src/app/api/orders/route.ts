import { NextRequest, NextResponse } from 'next/server';
import { getOrders, createOrder, verifyOrderPayment, updateOrderStatus } from '@/lib/server/repository';
import { verifyAdminRequest } from '@/lib/auth/admin-session';

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminRequest(request);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('status') || undefined;

    const orders = await getOrders(filter);
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.customerName || !body.customerPhone || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ success: false, error: 'Customer details and items are required.' }, { status: 400 });
    }

    const isManualUpi = body.paymentProvider === 'upi_manual' || body.paymentProvider === 'whatsapp';
    const verificationCode = isManualUpi
      ? String(Math.floor(100000 + Math.random() * 900000))
      : undefined;

    const order = await createOrder({
      customerName: body.customerName,
      customerEmail: body.customerEmail || '',
      customerPhone: body.customerPhone,
      shippingAddress: body.shippingAddress || 'Standard Delivery',
      items: body.items,
      totalPaise: body.totalPaise || 0,
      shippingPaise: body.shippingPaise || 0,
      paymentProvider: body.paymentProvider || 'upi_manual',
      paymentStatus: isManualUpi ? 'pending_verification' : 'initiated',
      fulfilmentStatus: 'pending',
      verificationCode,
      adminNotes: body.customerNotes,
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminRequest(request);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, action, verificationCode, status, fulfilmentStatus, adminNotes } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'orderId is required.' }, { status: 400 });
    }

    if (action === 'verify_payment') {
      const verified = await verifyOrderPayment(orderId, verificationCode);
      if (!verified) {
        return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, order: verified, message: 'Payment marked as verified.' });
    }

    const updated = await updateOrderStatus(orderId, {
      paymentStatus: status,
      fulfilmentStatus,
      adminNotes,
    });

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 });
  }
}
