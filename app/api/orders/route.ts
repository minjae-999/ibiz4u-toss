import { NextRequest, NextResponse } from 'next/server';

const orders: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productName, amount } = body;

    const order = {
      id: Date.now().toString(),
      orderId: `ORDER-${Date.now()}`,
      amount,
      productName,
      status: 'pending',
      createdAt: new Date(),
    };

    orders.push(order);

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: '주문 생성 실패' },
      { status: 500 }
    );
  }
}