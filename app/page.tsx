'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState<'shopping' | 'payment' | 'delivery'>('shopping');
  const [orderData, setOrderData] = useState<any>(null);

  const product = {
    name: '무선 헤드폰',
    price: 117000,
    description: '고음질 무선 헤드폰 - 최대 30시간 배터리',
    image: 'https://via.placeholder.com/400x300?text=Wireless+Headphone',
  };

  const handlePurchase = async () => {
    setIsLoading(true);

    // 더미 데이터 생성
    const dummyOrder = {
      orderId: `ORDER-${Date.now()}`,
      amount: product.price,
      trackingNumber: `TRACK-${Date.now()}`,
      deliveryStatus: 'collected',
    };

    setOrderData(dummyOrder);
    setOrderStatus('payment');

    // 토스 SDK 로드
    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v1';
    script.async = true;
    script.onload = () => {
      try {
        // @ts-ignore
        const tossPayments = window.TossPayments(
          process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY
        );

        tossPayments.requestPayment('카드', {
          amount: product.price,
          orderId: dummyOrder.orderId,
          orderName: product.name,
          customerEmail: 'customer@example.com',
          customerName: '고객명',
          successUrl: `${window.location.origin}/?success=true`,
          failUrl: `${window.location.origin}/?success=false`,
        });

        // 2초 후 배송 화면으로 이동
        setTimeout(() => {
          setOrderStatus('delivery');
          setIsLoading(false);
        }, 2000);
      } catch (error) {
        console.error('토스 결제 오류:', error);
        alert('결제 처리 중 오류가 발생했습니다');
        setIsLoading(false);
      }
    };

    script.onerror = () => {
      alert('토스 SDK 로딩 실패');
      setIsLoading(false);
    };

    document.head.appendChild(script);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">iBiz4U 마켓</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {orderStatus === 'shopping' && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="relative h-80 bg-gray-200">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h2>
              <p className="text-gray-600 mb-6">{product.description}</p>

              <div className="bg-blue-50 p-6 rounded-lg mb-8">
                <p className="text-sm text-gray-600 mb-2">결제 금액</p>
                <p className="text-4xl font-bold text-blue-600">
                  ₩{product.price.toLocaleString()}
                </p>
              </div>

              <button
                onClick={handlePurchase}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition duration-200 text-lg"
              >
                {isLoading ? '처리 중...' : '구매하기'}
              </button>
            </div>
          </div>
        )}

        {orderStatus === 'payment' && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">💳</div>
            <h2 className="text-2xl font-bold text-gray-900">결제 진행 중</h2>
            <p className="text-gray-600 mt-2">토스 결제 UI가 팝업되었습니다</p>
          </div>
        )}

        {orderStatus === 'delivery' && orderData && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-900">결제 완료!</h2>
            </div>

            <div className="bg-green-50 p-6 rounded-lg mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">주문 정보</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>주문번호</span>
                  <span className="font-mono">{orderData.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span>결제금액</span>
                  <span>₩{orderData.amount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">배송 상태</h3>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">추적번호</p>
                <p className="font-mono mb-4">{orderData.trackingNumber}</p>
                <div className="flex items-center space-x-2">
                  <div className="text-xl">📦</div>
                  <span className="font-semibold text-gray-900">배송 준비 중</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
            >
              처음으로
            </button>
          </div>
        )}
      </main>
    </div>
  );
}