import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/server/repository';
import { verifyAdminRequest } from '@/lib/auth/admin-session';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('all') === 'true';

    // If requesting inactive products as well, verify admin authorization
    let activeOnly = true;
    if (includeInactive) {
      const isAdmin = await verifyAdminRequest(request);
      if (isAdmin) {
        activeOnly = false;
      }
    }

    const products = await getProducts(activeOnly);
    return NextResponse.json({ success: true, products }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminRequest(request);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.name || !body.category || typeof body.pricePaise !== 'number') {
      return NextResponse.json({ success: false, error: 'Invalid product payload.' }, { status: 400 });
    }

    const newProduct = await createProduct({
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      folderName: body.folderName || 'Custom',
      name: body.name,
      category: body.category,
      shortDescription: body.shortDescription || '',
      description: body.description || '',
      pricePaise: body.pricePaise,
      inventoryQty: body.inventoryQty ?? 10,
      rating: body.rating ?? 5.0,
      reviewCount: body.reviewCount ?? 0,
      soldCount: body.soldCount ?? 0,
      active: body.active ?? true,
      featured: body.featured ?? false,
      bestSeller: body.bestSeller ?? false,
      media: body.media || [],
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}
