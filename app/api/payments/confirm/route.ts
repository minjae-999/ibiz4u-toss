import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentKey, orderId, amount } = body;

    // 토스 API에 결제 승인 요청
    const confirmResponse = await axios.post(
      'https://api.tosspayments.com/v1/payments/confirm',
      {
        paymentKey,
        orderId,
        amount,
      },
      {
        auth: {
          username: process.env.TOSS_SECRET_KEY || '',
          password: '',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json({
      success: true,
      paymentId: confirmResponse.data.paymentId,
      status: confirmResponse.data.status,
      message: '결제가 승인되었습니다',
    });
  } catch (error: any) {
    console.error('결제 승인 오류:', error.response?.data || error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.response?.data?.message || '결제 승인 실패',
      },
      { status: error.response?.status || 500 }
    );
  }
}