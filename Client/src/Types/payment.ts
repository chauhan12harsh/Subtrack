export interface CreatePayment{
    subscriptionId:string;
    Amount: number;
}

export interface Payment {
  id: string;
  transactionReference: string;
  amount: number;
  paymentDate: string | null;
  status: string;  
  SubscriptionName: string;  
}