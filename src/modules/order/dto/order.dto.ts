import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsUUID, Length, Max, Min, ValidateArguments, ValidateIf } from 'class-validator';
import { FulfilmentMethodEnum } from '../../../common/enums/fulfilment-method.enum';
import { OrderStatusEnum } from '../../../common/enums/order-status.enum';
import { PaymentMethodEnum } from '../../../common/enums/payment-method.enum';
import { MAX_PAGE_LIMIT } from '../../../common/helpers/pagination.helper';

export class CheckoutDto {

  @IsEnum(FulfilmentMethodEnum)
  fulfilment_method!: FulfilmentMethodEnum;
  @ValidateIf((dto: CheckoutDto) => dto.fulfilment_method === FulfilmentMethodEnum.DELIVERY)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))

  @Length(1, 500, {
    message: ({ value }: ValidationArguments) => {
      if (value === undefined || value === null || value === '') {
        return 'delivery_address is required for delivery';
      }
      if (typeof value !== 'string') {
        return 'delivery_address must be a string';
      }
      return 'delivery_address must be at most 500 characters';
    },
  })
  delivery_address?: string;

  @IsEnum(PaymentMethodEnum)
  payment_method!: PaymentMethodEnum;
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatusEnum)
  status!: OrderStatusEnum;
}

export class ListOrdersQueryDto {
  @IsOptional()
  @IsUUID()
  user_id?: string;

  @IsOptional()
  @IsEnum(OrderStatusEnum)
  order_status?: OrderStatusEnum;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_PAGE_LIMIT)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;
}