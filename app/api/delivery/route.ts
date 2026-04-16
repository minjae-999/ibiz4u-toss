import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingNumber = searchParams.get('trackingNumber');

    if (!trackingNumber) {
      return NextResponse.json(
        { error: '추적 번호가 필요합니다' },
        { status: 400 }
      );
    }

    // DeliveryAPI 호출
    const response = await axios.get(
      `https://apis.tracker.delivery/carriers/tracking/search`,
      {
        params: {
          t_key: process.env.DELIVERY_API_KEY,
          t_invoice: trackingNumber,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('배송 정보 조회 오류:', error);
    return NextResponse.json(
      { error: '배송 정보 조회 실패' },
      { status: 500 }
    );
  }
}