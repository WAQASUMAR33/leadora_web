import { NextResponse } from 'next/server';
import prisma from '../../../../util/prisma';

export async function PATCH(request, { params }) {
  try {
    const { slug } = await params;
    const product = await prisma.product.findUnique({ where: { slug }, select: { isActive: true } });
    if (!product) return NextResponse.json({ message: 'Product not found' }, { status: 404 });

    const updated = await prisma.product.update({
      where: { slug },
      data: { isActive: !product.isActive },
    });
    return NextResponse.json({ isActive: updated.isActive });
  } catch (error) {
    console.error('Error toggling product status:', error);
    return NextResponse.json({ message: 'Failed to toggle status', error: error.message }, { status: 500 });
  }
}
