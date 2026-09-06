export interface subscription{
    Name : string;
    Amount: number;
    BillingCycle: string;
    NextBillingDate: string;
    Category: string;
}

export interface SubscriptionDto {
  id: string;
  name: string;
  amount: number;
  billingCycle: string;
  status: string;
  nextBillingDate: string;
  category: string;
}