import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingNumber = searchParams.get('trackingNumber');

    if (!trackingNumber) {
      return NextResponse.json(
        { error: '추적번호가 필요합니다' },
        { status: 400 }
      );
    }

    // 더미 배송 데이터
    const deliveryData = {
      trackingNumber,
      carrier: '쿠팡택배',
      status: 'on_the_way', // collected, on_the_way, delivered
      estimatedDelivery: '2026-02-15',
      history: [
        {
          status: '배송 중',
          location: '서울 배송센터',
          time: new Date().toISOString(),
        },
        {
          status: '배송 출발',
          location: '인천 물류센터',
          time: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          status: '집하',
          location: '판매자',
          time: new Date(Date.now() - 7200000).toISOString(),
        },
      ],
    };

    return NextResponse.json(deliveryData);
  } catch (error) {
    return NextResponse.json(
      { error: '배송 정보 조회 실패' },
      { status: 500 }
    );
  }
}