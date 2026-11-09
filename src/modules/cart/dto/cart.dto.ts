import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';

// TEMPORARY: user_id comes from @CurrentUser() once auth is added.
export class CartUserQueryDto {
  @IsUUID()
  user_id!: string;
}

export class AddCartItemDto {
  @IsUUID()
  user_id!: string;

  @IsInt()
  @Min(1)
  product_id!: number;

  // how many to add (or add on top of what is already in the cart); defaults to 1
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;
}

export class UpdateCartItemDto {
  @IsUUID()
  user_id!: string;

  // the new quantity (not an increment); use DELETE to remove the item
  @IsInt()
  @Min(1)
  quantity!: number;
}