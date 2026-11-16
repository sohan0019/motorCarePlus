import { randomUUID } from 'crypto';
import { PaymentMethodEnum } from '../enums/payment-method.enum';

const REF_PREFIX: Record<PaymentMethodEnum, string> = {
  [PaymentMethodEnum.CASH_ON_DELIVERY]: 'COD',
  [PaymentMethodEnum.CARD_SIMULATED]: 'CARD',
  [PaymentMethodEnum.MOBILE_BANKING_SIMULATED]: 'MFS',
};

export function makeTransactionRef(method: PaymentMethodEnum): string {
  const random = randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase();
  return `SIM-${REF_PREFIX[method]}-${random}`;
}