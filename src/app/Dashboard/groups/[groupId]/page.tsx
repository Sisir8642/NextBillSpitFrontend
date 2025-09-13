'use client'
import InvitationForm from './InvitationForm';
import React, { use, useEffect, useState } from 'react'
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ModeToggle"
import { Plus, Trash2 } from "lucide-react"
import baseapi from "@/lib/axios"
import NetBalanceCalculate from './components/NetBalanceCalculate';
import { Input } from "@/components/ui/input"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useAuth } from '@/app/context/AuthContext';

interface Participant {
  user: string;         // email from API
  share_amount?: string;
  paid_amount: string;
}

interface ActivityLog {
  id: string;
  group: string;  // UUID
  user: string;   // username string (because serializer uses StringRelatedField)
  action: string;
  metadata?: Record<string, any>;
  created_at: string;  // timestamp
}

interface MemberOption {
  label: string; // email
  value: string; // user_id
}


interface Settlement {
  from_user: string;  // email or username
  to_user: string;
  amount: string;
}

interface Expense {
  id: string;
  description: string;
  amount: string;
  paid_by: string;  // email or username
  split_type: string;
  created_at: string;
}

interface ParticipantOption {
  label: string; // email
  value: string; // UUID
}

interface ExpensePayload {
  group_id: string;
  paid_by: string;      // email
  description: string;
  amount: number;
  split_type: 'equal' | 'custom';
  participants: Participant[];
}



const GroupDashboardPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [paidBy, setPaidBy] = useState<string>("");
  const [splitType, setSplitType] = useState<'equal' | 'custom'>("equal");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [memberOptions, setMemberOptions] = useState<ParticipantOption[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loadingSettlements, setLoadingSettlements] = useState(false);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [settledIndexes, setSettledIndexes] = useState<number[]>([]);


  
  const { expenseId } = useParams();
  const { user } = useAuth();
  console.log("Current user:", user);


 
  useEffect(() => {
    if (memberOptions.length === 0) return;

    const initialParticipants = memberOptions.map((m) => ({
      user: m.value,        
      paid_amount: "0",     
      share_amount: "0.00", 
    }));

    setParticipants(initialParticipants);
  }, [memberOptions]);


  
  useEffect(() => {
    if (!groupId) return;

    const fetchGroupMembers = async () => {
      try {
        const res = await baseapi.get(`/api/groups/groups/${groupId}/members/`);
        const options = res.data
          .map((p: any) => ({
            label: p.email, 
            value: p.email,  
          }))
          .filter(
  (option: { label: string; value: string }, idx: number, self: { label: string; value: string }[]) =>
    idx === self.findIndex((o: { label: string; value: string }) => o.value === option.value)
);


        setMemberOptions(options);
        if (options.length > 0) setPaidBy(options[0].value);
      } catch (err) {
        console.error("Error fetching group members:", err);
      }
    };

    fetchGroupMembers();
  }, [groupId]);



  const fetchExpenses = async () => {
    if (!groupId) return;
    setLoadingExpenses(true);
    try {
      const res = await baseapi.get(`/api/expenses/?group=${groupId}`);
      setExpenses(res.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoadingExpenses(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [groupId]);

  useEffect(() => {
    if (!groupId) return;

    const fetchSettlements = async () => {
      setLoadingSettlements(true);
      try {
        const res = await baseapi.post(`/api/settlements/groups/${groupId}/settlements/calculate/`, {
          group_id: groupId,
        });
        console.log("Settlement API response:", res.data);

        const settlementsData = res.data.settlements || [];
        setSettlements(settlementsData);
      } catch (error) {
        console.error('Error fetching settlements:', error);
      }
      finally {
        setLoadingSettlements(false);
      }
    };


    fetchSettlements();
  }, [groupId]);


  const handleSubmitExpense = async () => {
    if (!groupId) return;

    if (!description.trim()) {
      alert("Description is required");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Amount must be greater than zero");
      return;
    }

    if (!paidBy) {
      alert("Please select who paid");
      return;
    }

   const preparedParticipants = participants.map(p => ({
  user: p.user,
  paid_amount: (Number(p.paid_amount) || 0).toString(),
  share_amount: (Number(p.share_amount) || 0).toFixed(2),
}));

    const payload: ExpensePayload = {
  group_id: groupId,
  paid_by: paidBy,
  description: description.trim(),
  amount: Number(amount),
  split_type: splitType,
  participants: preparedParticipants,
};

    
try {
  console.log("Submitting payload:", payload);
  await baseapi.post("/api/expenses/", payload);
  alert("Expense created successfully");

  setDescription("");
  setAmount("");
  setPaidBy("");
  setSplitType("equal");
  setParticipants([]);
  await fetchExpenses();
} catch (err: any) {
  if (err.response) {
    // Backend responded with a status code outside 2xx
    console.error("Backend error response:", err.response.data, err.response.status);
    alert(`Error: ${JSON.stringify(err.response.data)}`);
  } else if (err.request) {
    // Request was made but no response received
    console.error("No response received:", err.request);
    alert("No response received from server. Check your network or backend.");
  } else {
    // Something else happened
    console.error("Error setting up request:", err.message);
    alert(`Error: ${err.message}`);
  }
}
}; 
  // <-- MISSING CLOSING BRACE ADDED ABOVE

  const handleSettleClick = (index: number) => {
    setSettledIndexes(prev => [...prev, index]);
  };

  const updateParticipant = (index: number, field: keyof Participant, value: string) => {
    setParticipants(prev => {
      const newData = [...prev];
      newData[index][field] = value;
      return newData;
    });
  };

  const removeParticipant = (index: number) => {
    setParticipants(prev => prev.filter((_, idx) => idx !== index));
  };

  const fetchActivities = async () => {
    if (!groupId) return;
    setLoadingActivities(true);
    try {
      const res = await baseapi.get(`/api/activity-log/groups/${groupId}/activity-logs/`);
      setActivityLogs(res.data);
    } catch (err) {
      console.error("Error fetching activity logs:", err);
    } finally {
      setLoadingActivities(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [groupId]);

  return (
    <div>
      {/* Header */}
      <header className="shadow-md">
        <div className="flex justify-between items-center h-16 bg-[#0d0c0f] px-6">
          <h1 className="text-2xl font-semibold text-[#4269D7] px-20">
            Expenses Dashboard
          </h1>

          <Drawer>
            <DrawerTrigger asChild>
              <Button className="bg-[#4D75E6] text-white hover:bg-[#365ac4] transition">
                Add Member
              </Button>
            </DrawerTrigger>

            <DrawerContent className="bg-[#151519] border border-[#2a2a30] text-white ">
              <DrawerHeader>
                <DrawerTitle>Add Member</DrawerTitle>
                <DrawerDescription className="text-gray-400">
                  Invite a new member to this group
                </DrawerDescription>
              </DrawerHeader>

              <div className="px-4 pb-6">
                <InvitationForm groupId={groupId} />
              </div>

              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline" className="border-gray-600 text-gray-300">
                    Close
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>



        </div>
      </header>
      <div className='px-20 py-4 '>
        <main className="px-8 py-6 space-y-10 bg-[#0f0f12] min-h-screen text-white">
          <NetBalanceCalculate settlements={settlements.map(s => ({
            ...s,
            amount: Number(s.amount),
          }))} />

          <section>
            <h2 className="text-xl font-bold mb-4"> Expenses</h2>
            {loadingExpenses && <p>Loading expenses...</p>}
            {!loadingExpenses && expenses.length === 0 && (
              <p className="text-gray-400">No expenses found.</p>
            )}

            <div className="grid gap-4">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="bg-[#1c1c22] rounded-lg shadow-md p-4 hover:shadow-lg transition"
                >
                  <p className="text-lg font-semibold">{expense.description}</p>
                  <p className="text-sm text-gray-400">
                    <strong>Amount:</strong> ₹{expense.amount}
                  </p>
                  <p className="text-sm text-gray-400">
                    <strong>Paid By:</strong> {expense.paid_by}
                  </p>
                  <p className="text-sm text-gray-400">
                    <strong>Split Type:</strong> {expense.split_type}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(expense.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-bold mb-4"> Settlements</h2>

            {loadingSettlements && <p className="text-gray-400">Loading settlements...</p>}

            {!loadingSettlements && (!settlements || settlements.length === 0) && (
              <p className="text-gray-400">All settled up! No balances to show.</p>
            )}

            <div className="space-y-3">
              {Array.isArray(settlements) ? (
                settlements.map((settlement, idx) => {
                  const from = settlement?.from_user || "Unknown";
                  const to = settlement?.to_user || "Unknown";
                  const amount = settlement?.amount ?? "0";

                  return (
                    <div
  key={idx}
  className={`bg-[#1c1c22] p-4 rounded-lg border border-gray-700 flex justify-between items-center ${
    settledIndexes.includes(idx) ? "line-through text-red-500" : ""
  }`}
>
  <p className="text-sm">
    <strong className="text-[#4D75E6]">{settlement.from_user}</strong> owes{" "}
    <strong className="text-[#4D75E6]">{settlement.to_user}</strong> Rs{settlement.amount}
  </p>
  {!settledIndexes.includes(idx) && (
    <Button
      variant="outline"
      size="sm"
      className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
      onClick={() => handleSettleClick(idx)}
    >
      Settle
    </Button>
  )}
</div>

                  );
                })
              ) : (
                <p className="text-gray-400">No settlement data available.</p>
              )}
            </div>
          </section>


          {/* Activity Logs */}
          <section>
            <h2 className="text-xl font-bold mb-4"> Group Activities</h2>
            {loadingActivities && <p>Loading activities...</p>}
            {!loadingActivities && activityLogs.length === 0 && (
              <p className="text-gray-400">No activity yet.</p>
            )}

            <div className="space-y-3">
              {activityLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-[#1c1c22] p-3 rounded-lg border border-gray-700"
                >
                  <p>
                    <strong className="text-[#4D75E6]">{log.user}</strong> {log.action}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(log.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </main>

        <div className="fixed bottom-6 right-25 z-50">
          <Drawer>
            <DrawerTrigger asChild>
              <Button className="flex items-center justify-center shadow-lg rounded-full size-16 bg-[#4D75E6] hover:bg-blue-700">
                <Plus size={20} />
              </Button>
            </DrawerTrigger>

            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>New Expense</DrawerTitle>
                <DrawerDescription>Create a new expense</DrawerDescription>
              </DrawerHeader>

              <div className="px-4 space-y-4">
                <Input
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <Input
                  placeholder="Amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />

                <label>Paid By</label>
                <select
                  className="border p-2 rounded w-full bg-white text-black"
                  value={paidBy}
                  onChange={(e) => setPaidBy(e.target.value)}
                >
                  <option value="">Select</option>
                  {memberOptions.map((m, idx) => (
                    <option key={idx} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>

                <label>Split Type</label>
                <select
                  className="border p-2 rounded w-full bg-white text-black"
                  value={splitType}
                  onChange={(e) => setSplitType(e.target.value as "equal" | "custom")}
                >
                  <option value="equal">Equal</option>
                  <option value="custom">Custom</option>
                </select>

                <div>
                  <h3 className="font-semibold mb-2">Participants</h3>
                  {participants.map((p, idx) => (
                    <div
                      key={idx}
                      className="flex gap-2 mb-2 items-center border-b border-gray-700 pb-2"
                    >
                      <Input value={p.user} disabled />
                      <Input
                        placeholder="Paid Amount"
                        type="number"
                        value={p.paid_amount}
                        onChange={(e) =>
                          updateParticipant(idx, "paid_amount", e.target.value)
                        }
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeParticipant(idx)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>

                  ))}
                </div>
              </div>


              <DrawerFooter>
                <Button onClick={handleSubmitExpense}>Save Expense</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>

      </div>

    </div>
  );
};

export default GroupDashboardPage;