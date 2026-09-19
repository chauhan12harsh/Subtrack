export interface Subscription{
    Name : string;
    Amount: number;
    BillingCycle: string;
    NextBillingDate: string;
    Category: string;
}

export type SubscriptionStatus = "Active" | "Paused" | "Cancelled";

export interface SubscriptionDto {
  id: string;
  name: string;
  amount: number;
  billingCycle: string;
  status: SubscriptionStatus;
  nextBillingDate: string;
  category: string;
}