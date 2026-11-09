import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PayDto } from './dto/payment.dto';

// TODO (after auth): only the order's owner can pay / view.
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('pay')
  @HttpCode(HttpStatus.OK)
  pay(@Body() dto: PayDto) {
    return this.paymentService.pay(dto);
  }

  // GET /payments/order/:order_id
  @Get('order/:order_id')
  findByOrder(@Param('order_id', ParseIntPipe) orderId: number) {
    return this.paymentService.findByOrder(orderId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.findOne(id);
  }
}