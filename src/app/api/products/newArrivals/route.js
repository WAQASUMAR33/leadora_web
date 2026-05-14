// server/api/products/newArrivals.js
import prisma from '../../../util/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const newArrivals = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        images: true, // Include related images
      },
    });

    return NextResponse.json({ data: newArrivals, status: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch new arrivals', error: error.message, status: false }, { status: 500 });
  }
}
