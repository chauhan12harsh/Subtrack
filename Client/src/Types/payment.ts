export interface CreatePayment{
    subscriptionId:string;
    Amount: number;
}

export interface Payment {
  id: string;
  transactionReference: string;
  amount: number;
  paymentDate: string;
  status: string;
  subscriptionId: string;
  userId: string;
}