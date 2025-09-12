import React, { useState, useEffect } from "react";

interface NetBalance {
  user: string;
  balance: number;
}

interface NetBalanceProps {
  settlements: {
    from_user: string;
    to_user: string;
    amount: number;
  }[];
}

const NetBalanceCalculate: React.FC<NetBalanceProps> = ({ settlements }) => {
  const [netBalances, setNetBalances] = useState<NetBalance[]>([]);

  useEffect(() => {
    if (!settlements || settlements.length === 0) {
      setNetBalances([]);
      return;
    }

    const balancesMap: Record<string, number> = {};

    settlements.forEach((s) => {
      balancesMap[s.from_user] = (balancesMap[s.from_user] || 0) - s.amount;
      balancesMap[s.to_user] = (balancesMap[s.to_user] || 0) + s.amount;
    });

    const balancesArray: NetBalance[] = Object.entries(balancesMap).map(
      ([user, balance]) => ({
        user,
        balance: parseFloat(balance.toFixed(2)),
      })
    );

    setNetBalances(balancesArray);
  }, [settlements]);

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-4"> Net Balances:</h2>

      {!netBalances || netBalances.length === 0 ? (
        <p className="text-gray-400">No balances available.</p>
      ) : (
        <div className="space-y-3">
          {netBalances.map((nb, idx) => (
            <div
              key={idx}
              className={`flex p-2 pr-5 flex-wrap gap-2 justify-end max-w-full${
                nb.balance >= 0
                  ? "border-green-500 bg-green-900/20"
                  : "border-red-500 bg-red-900/20"
              }`}
            >
              <p className="text-sm">
                <strong className="text-[#4D75E6]">{nb.user}</strong> :{" "}
                <span className={nb.balance >= 0 ? "text-green-400" : "text-red-400"}>
                  ₹{Math.abs(nb.balance)} {nb.balance >= 0 ? "owed" : "owes"}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default NetBalanceCalculate;
