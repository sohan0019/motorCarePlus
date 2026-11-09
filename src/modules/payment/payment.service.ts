import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { DataSource, Repository } from 'typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { OrderEntity } from '../order/entities/order.entity';
import { PayDto } from './dto/payment.dto';
import { OrderStatusEnum } from '../../common/enums/order-status.enum';
import { PaymentMethodEnum } from '../../common/enums/payment-method.enum';
import { PaymentStatusEnum } from '../../common/enums/payment-status.enum';

const REF_PREFIX: Record<PaymentMethodEnum, string> = {
  [PaymentMethodEnum.CASH_ON_DELIVERY]: 'COD',
  [PaymentMethodEnum.CARD_SIMULATED]: 'CARD',
  [PaymentMethodEnum.MOBILE_BANKING_SIMULATED]: 'MFS',
};

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  // Simulated payment: no real gateway, it just marks the payment and the order as paid.
  async pay(dto: PayDto) {
    await this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(OrderEntity, {
        where: { id: dto.order_id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      if (order.order_status === OrderStatusEnum.CANCELLED) {
        throw new BadRequestException('A cancelled order cannot be paid');
      }
      if (order.order_status === OrderStatusEnum.PAID) {
        throw new ConflictException('This order is already paid');
      }

      const payment = await manager.findOne(PaymentEntity, {
        where: { order_id: order.id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!payment) {
        throw new NotFoundException('Payment not found for this order');
      }
      if (payment.status !== PaymentStatusEnum.PENDING) {
        throw new ConflictException(`This payment is already ${payment.status}`);
      }

      payment.status = PaymentStatusEnum.PAID;
      payment.paid_at = new Date();
      payment.transaction_ref = `SIM-${REF_PREFIX[payment.method]}-${randomUUID()
        .replace(/-/g, '')
        .slice(0, 12)
        .toUpperCase()}`;
      await manager.save(payment);

      order.order_status = OrderStatusEnum.PAID;
      await manager.save(order);
    });

    return this.findByOrder(dto.order_id);
  }

  async findOne(id: number) {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: { order: true },
    });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    return payment;
  }

  async findByOrder(orderId: number) {
    const payment = await this.paymentRepository.findOne({
      where: { order_id: orderId },
      relations: { order: true },
    });
    if (!payment) {
      throw new NotFoundException('Payment not found for this order');
    }
    return payment;
  }
}