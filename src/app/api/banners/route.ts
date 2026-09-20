import { NextRequest, NextResponse } from 'next/server';
import { getBanners, createBanner, updateBanner, deleteBanner } from '@/lib/server/repository';
import { verifyAdminRequest } from '@/lib/auth/admin-session';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('all') === 'true';

    let activeOnly = true;
    if (includeInactive) {
      const isAdmin = await verifyAdminRequest(request);
      if (isAdmin) {
        activeOnly = false;
      }
    }

    const banners = await getBanners(activeOnly);
    return NextResponse.json({ success: true, banners });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch banners' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminRequest(request);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.title || !body.imageUrl) {
      return NextResponse.json({ success: false, error: 'Title and image are required.' }, { status: 400 });
    }

    const banner = await createBanner({
      title: body.title,
      subtitle: body.subtitle || '',
      imageUrl: body.imageUrl,
      linkUrl: body.linkUrl || '',
      ctaLabel: body.ctaLabel || 'Shop Collection',
      active: body.active ?? true,
      bannerType: body.bannerType || 'festival',
      startDate: body.startDate,
      endDate: body.endDate,
    });

    return NextResponse.json({ success: true, banner }, { status: 201 });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json({ success: false, error: 'Failed to create banner' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminRequest(request);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Banner id is required.' }, { status: 400 });
    }

    const updated = await updateBanner(body.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Banner not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, banner: updated });
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json({ success: false, error: 'Failed to update banner' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminRequest(request);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Banner id is required.' }, { status: 400 });
    }

    const success = await deleteBanner(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete banner' }, { status: 500 });
  }
}
