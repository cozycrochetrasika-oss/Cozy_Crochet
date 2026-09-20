import { NextRequest, NextResponse } from 'next/server';
import { getReviews, createReview, moderateReview } from '@/lib/server/repository';
import { verifyAdminRequest } from '@/lib/auth/admin-session';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId') || undefined;
    const all = searchParams.get('all') === 'true';

    let approvedOnly = true;
    if (all) {
      const isAdmin = await verifyAdminRequest(request);
      if (isAdmin) {
        approvedOnly = false;
      }
    }

    const reviews = await getReviews(productId, approvedOnly);
    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.author || !body.productId || typeof body.rating !== 'number') {
      return NextResponse.json({ success: false, error: 'Author, product, and rating are required.' }, { status: 400 });
    }

    const newReview = await createReview({
      productId: body.productId,
      productName: body.productName || 'Artisan Crochet Item',
      author: body.author.trim(),
      city: body.city?.trim() || 'India',
      rating: Math.min(5, Math.max(1, body.rating)),
      title: body.title?.trim() || 'Handmade Delight',
      body: body.body?.trim() || '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      approved: false, // Moderated by default in production
      verifiedPurchase: Boolean(body.verifiedPurchase),
    });

    return NextResponse.json({
      success: true,
      review: newReview,
      message: 'Review submitted for artisan moderation. Thank you for supporting handmade craft!',
    }, { status: 201 });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit review' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminRequest(request);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }

    const body = await request.json();
    const { id, action } = body;
    if (!id || !action || !['approve', 'reject', 'delete'].includes(action)) {
      return NextResponse.json({ success: false, error: 'Valid id and action (approve, reject, delete) are required.' }, { status: 400 });
    }

    const success = await moderateReview(id, action);
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error moderating review:', error);
    return NextResponse.json({ success: false, error: 'Failed to moderate review' }, { status: 500 });
  }
}
