/**
 * SubscriptionPlans Component
 * Displays available subscription plans with features and pricing
 */

import { Check, Zap } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { subscriptionPlans } from '../../data/sample';
import { toast } from 'sonner';
import "../../styles/globals.css"
interface SubscriptionPlansProps {
  currentPlanId?: string;
  onSelectPlan: (planId: string) => void;
}

export function SubscriptionPlans({ currentPlanId, onSelectPlan }: SubscriptionPlansProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleSelectPlan = (planId: string, planName: string) => {
    if (planId === currentPlanId) {
      toast.info('You are already subscribed to this plan');
      return;
    }

    onSelectPlan(planId);
    // API: POST /subscriptions { planId }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {subscriptionPlans.map((plan:any) => {
        const isCurrentPlan = plan.id === currentPlanId;
        const isPremium = plan.name === 'Premium';

        return (
          <Card
            key={plan.id}
            className={`p-6 rounded-2xl relative ${
              isPremium
                ? 'border-2 border-[#0f766e] shadow-lg'
                : 'border'
            }`}
          >
            {/* Popular Badge */}
            {isPremium && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-[#0f766e]">Most Popular</Badge>
              </div>
            )}

            {/* Current Plan Badge */}
            {isCurrentPlan && (
              <div className="absolute -top-3 right-4">
                <Badge className="bg-blue-500">Current Plan</Badge>
              </div>
            )}

            {/* Plan Header */}
            <div className="text-center mb-6">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl mb-3 ${
                isPremium ? 'bg-[#0f766e] text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mb-2">{plan.name}</h3>
              <div className="mb-2">
                {plan.price === 0 ? (
                  <p className="text-3xl">Free</p>
                ) : (
                  <>
                    <p className="text-3xl">{formatCurrency(plan.price)}</p>
                    <p className="text-sm text-gray-600">{plan.duration}</p>
                  </>
                )}
              </div>
              {plan.discountPercentage > 0 && (
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {plan.discountPercentage}% discount on charges
                </Badge>
              )}
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-6">
              {plan.benefits.map((benefit:any, index:any) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                      isPremium ? 'bg-[#0f766e] text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      <Check className="h-3 w-3" />
                    </div>
                  </div>
                  <span className="text-sm">{benefit}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <Button
              className={`w-full ${
                isPremium
                  ? 'bg-[#0f766e] hover:bg-[#0f766e]/90'
                  : isCurrentPlan
                  ? 'bg-gray-300 cursor-not-allowed'
                  : ''
              }`}
              disabled={isCurrentPlan}
              onClick={() => handleSelectPlan(plan.id, plan.name)}
            >
              {isCurrentPlan ? 'Current Plan' : plan.price === 0 ? 'Current Plan' : 'Upgrade'}
            </Button>
          </Card>
        );
      })}
    </div>
  );
}
