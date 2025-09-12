export interface User {
  id: number
  email: string
}

export interface Member {
  id: number
  user: User
}

export interface Group {
  id: number
  title: string
  description?: string
  participants: Member[] 
}

export interface ExpenseParticipant {
  user: number
  amount: number
}


export interface CreateExpenseRequest {
  group: string | string[] 
  title: string
  name: string
  description?: string
  date: string
  amount: string | number
  split_type: "equal" | "unequal" | "percentage"
  participants: ExpenseParticipant[]
}
