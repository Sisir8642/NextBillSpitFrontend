export interface User {
  id: number;
  username: string;
  email?: string;
}


export interface Member {
  id: number;
  user: User;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  participants: Member[];
}

export interface ExpenseParticipant {
  user_id: number;
  amount?: number;
  percentage?: number;
}

export interface CreateExpenseRequest {
  group: string;
  title: string;
  amount: number;
  paid_by: number;
  split_type: "equal" | "unequal" | "percentage";
  participants: ExpenseParticipant[];
}
