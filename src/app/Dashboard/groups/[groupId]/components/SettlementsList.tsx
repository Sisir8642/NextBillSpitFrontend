import React from "react";
import { ArrowRight } from "lucide-react";

interface Settlement {
  from_user: string;
  to_user: string;
  amount: string;
}

interface SettlementsListProps {
  settlements: Settlement[];
  loading: boolean;
}

const SettlementsList: React.FC<SettlementsListProps> = ({ settlements, loading }) => {
  if (loading) {
    return <p className="text-gray-500">Loading settlements...</p>;
  }

  if (settlements.length === 0) {
    return <p className="text-green-600 font-medium"> All settled up! No balances to show.</p>;
  }

  return (
    <ul className="space-y-3">
      {settlements.map((settlement, idx) => (
        <li
          key={idx}
          className="flex items-center justify-between border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center gap-2">
            <strong className="text-red-500">{settlement.from_user}</strong>
            <ArrowRight className="w-4 h-4 text-gray-500" />
            <strong className="text-green-500">{settlement.to_user}</strong>
          </div>
          <span className="font-semibold text-gray-700">₹{settlement.amount}</span>
        </li>
      ))}
    </ul>
  );
};

export default SettlementsList;
