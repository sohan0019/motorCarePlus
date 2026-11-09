import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CheckoutDto, ListOrdersQueryDto, UpdateOrderStatusDto } from './dto/order.dto';

// TODO (after auth): user_id comes from @CurrentUser(); list/detail are limited to the owner;
// the status change is admin only.
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('checkout')
  checkout(@Body() dto: CheckoutDto) {
    return this.orderService.checkout(dto);
  }

  // example: GET /orders?user_id=<uuid>&order_status=pending&limit=20&offset=0
  @Get()
  findAll(@Query() query: ListOrdersQueryDto) {
    return this.orderService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
  }

  // TODO (after auth): admin only
  @Put(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateStatus(id, dto);
  }
}