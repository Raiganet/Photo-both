import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { packageId, amount, customerName } = await req.json();

    // Midtrans Snap API
    const snapToken = await createMidtransTransaction({
      transaction_id: `TXN-${Date.now()}`,
      gross_amount: amount,
      customer_name: customerName,
      payment_type: 'qris',
    });

    return NextResponse.json({
      success: true,
      token: snapToken.token,
      redirect_url: snapToken.redirect_url,
      qr_string: snapToken.qr_string,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Payment failed' },
      { status: 500 }
    );
  }
}

async function createMidtransTransaction(params: any) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const isProduction = process.env.NODE_ENV === 'production';
  const baseUrl = isProduction
    ? 'https://app.midtrans.com/snap/v1/transactions'
    : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Basic ${Buffer.from(`${serverKey}:`).toString('base64')}`,
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: params.transaction_id,
        gross_amount: params.gross_amount,
      },
      customer_details: {
        first_name: params.customer_name,
      },
      enabled_payments: ['qris'],
    }),
  });

  if (!response.ok) throw new Error('Midtrans API error');
  return response.json();
}
