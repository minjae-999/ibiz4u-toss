import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');

    // 결제 승인
    const confirmResponse = await axios.post(
      'https://api.tosspayments.com/v1/payments/confirm',
      {
        paymentKey,
        orderId,
        amount: parseInt(amount || '0'),
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

    // 성공 페이지로 리다이렉트
    return NextResponse.redirect(
      new URL(`/?success=true&orderId=${orderId}`, request.url)
    );
  } catch (error) {
    console.error('결제 승인 오류:', error);
    return NextResponse.redirect(
      new URL('/?success=false', request.url)
    );
  }
}