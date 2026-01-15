import { CreditCard, CheckCircle } from 'lucide-react';
import { ImageWithFallback } from '../../components/ImageWithFallback';

export function RestaurantPaymentsPage() {
  const payments = [
    {
      id: 1,
      payer: 'Sarah Johnson',
      payerImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
      amount: 2500,
      date: '2026-01-14',
      method: 'M-Pesa',
      status: 'Completed',
    },
    {
      id: 2,
      payer: 'Michael Chen',
      payerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      amount: 1800,
      date: '2026-01-13',
      method: 'Card',
      status: 'Completed',
    },
    {
      id: 3,
      payer: 'Emily Williams',
      payerImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      amount: 3200,
      date: '2026-01-13',
      method: 'M-Pesa',
      status: 'Completed',
    },
    {
      id: 4,
      payer: 'James Brown',
      payerImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      amount: 1500,
      date: '2026-01-12',
      method: 'Cash',
      status: 'Completed',
    },
    {
      id: 5,
      payer: 'Lisa Anderson',
      payerImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      amount: 2100,
      date: '2026-01-12',
      method: 'M-Pesa',
      status: 'Completed',
    },
  ];

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#A60311] mb-2">Payment History</h2>
        <p className="text-gray-600">View all transactions and payments</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <CreditCard className="w-6 h-6 text-[#F20519]" />
          <h3 className="text-2xl font-bold text-[#A60311]">Transaction History</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#F20519] to-[#F20530] text-white">
              <tr>
                <th className="px-4 py-3 text-left rounded-tl-xl">Payer</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Method</th>
                <th className="px-4 py-3 text-left rounded-tr-xl">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr
                  key={payment.id}
                  className={`border-b ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  } hover:bg-[#F20519]/5 transition-colors`}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#D9895B]">
                        <ImageWithFallback
                          src={payment.payerImage}
                          alt={payment.payer}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-semibold text-gray-800">{payment.payer}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-bold text-[#A60311]">
                    KSh {payment.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-gray-600">{payment.date}</td>
                  <td className="px-4 py-4">
                    <span className="bg-[#D9895B]/20 text-[#D9895B] px-3 py-1 rounded-full text-sm font-semibold">
                      {payment.method}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 w-fit">
                      <CheckCircle className="w-4 h-4" />
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
