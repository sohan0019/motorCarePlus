import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddCartItemDto, CartUserQueryDto, UpdateCartItemDto } from './dto/cart.dto';

// TODO (after auth): user_id comes from @CurrentUser() and JwtGuard is added.
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // GET /cart?user_id=<uuid>
  @Get()
  getCart(@Query() query: CartUserQueryDto) {
    return this.cartService.getCart(query.user_id);
  }

  // add a product, or increase it if it is already in the cart
  @Post('items')
  addItem(@Body() dto: AddCartItemDto) {
    return this.cartService.addItem(dto);
  }

  // set the quantity of one cart item
  @Put('items/:item_id')
  updateItem(
    @Param('item_id', ParseIntPipe) itemId: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(itemId, dto);
  }

  // DELETE /cart/items/:item_id?user_id=<uuid>
  @Delete('items/:item_id')
  removeItem(
    @Param('item_id', ParseIntPipe) itemId: number,
    @Query() query: CartUserQueryDto,
  ) {
    return this.cartService.removeItem(itemId, query.user_id);
  }

  // DELETE /cart?user_id=<uuid>
  @Delete()
  clear(@Query() query: CartUserQueryDto) {
    return this.cartService.clear(query.user_id);
  }
}