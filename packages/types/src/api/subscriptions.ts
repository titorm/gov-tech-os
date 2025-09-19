export interface Subscription {
  id: string
  userId: string
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  priceId?: string
  amount?: number
  currency: string
  interval?: string
  intervalCount?: number
  trialStart?: string
  trialEnd?: string
  currentPeriodStart?: string
  currentPeriodEnd?: string
  cancelAtPeriodEnd: boolean
  canceledAt?: string
  createdAt: string
  updatedAt: string
}

export enum SubscriptionPlan {
  FREE = 'free',
  BASIC = 'basic',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  PAST_DUE = 'past_due',
  UNPAID = 'unpaid',
}

export interface CreateSubscriptionRequest {
  plan: SubscriptionPlan
  priceId: string
}

export interface UpdateSubscriptionRequest {
  plan?: SubscriptionPlan
  cancelAtPeriodEnd?: boolean
}