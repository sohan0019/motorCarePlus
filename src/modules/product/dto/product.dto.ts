import { Transform, Type } from 'class-transformer';
import {  ArrayMaxSize, ArrayUnique, IsArray, IsBoolean, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, IsUrl, Max, MaxLength, Min, } from 'class-validator';
import { ProductTypeEnum } from '../../../common/enums/product-type.enum';
import { VehicleTypeEnum } from '../../../common/enums/vehicle-type.enum';

const MAX_PAGE_LIMIT = 100;
const MAX_PRICE = 99999999.99;
const MAX_MODELS = 500;
const MAX_NAME_LENGTH = 200;
const MAX_SEARCH_LENGTH = 200;
const MAX_IMAGE_URL_LENGTH = 500;

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

const toBoolean = ({ value }: { value: unknown }) =>
  value === 'true' || value === true
    ? true
    : value === 'false' || value === false
      ? false
      : value;

export const PRODUCT_SORT_FIELDS = [
  'name',
  'price',
  'created_at',
  'stock',
] as const;

export type ProductSortField = (typeof PRODUCT_SORT_FIELDS)[number];

const PRICE_NUMBER_OPTIONS = {
  maxDecimalPlaces: 2,
  allowNaN: false,
  allowInfinity: false,
};

export class CreateProductDto {
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  category_name!: string;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  brand_name!: string;

  @IsEnum(ProductTypeEnum, { message: 'product_type must be part or decoration' })
  product_type!: ProductTypeEnum;

  @IsEnum(VehicleTypeEnum, { message: 'vehicle_type must be car, bike or both' })
  vehicle_type!: VehicleTypeEnum;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_NAME_LENGTH)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsNumber(PRICE_NUMBER_OPTIONS)
  @Min(0)
  @Max(MAX_PRICE)
  price!: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber(PRICE_NUMBER_OPTIONS)
  @Min(0)
  @Max(MAX_PRICE)
  market_price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0, {
    message: 'stock cannot be below 0',
  })
  stock?: number;

  @IsOptional()
  @IsString()
  @IsUrl(
    {
      protocols: ['http', 'https'],
      require_protocol: true,
    },
    {
      message: 'image_url must be a valid HTTP or HTTPS URL',
    },
  )
  @MaxLength(MAX_IMAGE_URL_LENGTH)
  image_url?: string;

  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @ArrayMaxSize(MAX_MODELS)
  @IsString({ each: true })
  models?: string[];
}

export class UpdateProductDto {
  @IsOptional()
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  category_name?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  brand_name?: string;

  @IsOptional()
  @IsEnum(ProductTypeEnum, {
    message: 'product_type must be part or decoration',
  })
  product_type?: ProductTypeEnum;

  @IsOptional()
  @IsEnum(VehicleTypeEnum, {
    message: 'vehicle_type must be car, bike or both',
  })
  vehicle_type?: VehicleTypeEnum;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_NAME_LENGTH)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber(PRICE_NUMBER_OPTIONS)
  @Min(0)
  @Max(MAX_PRICE)
  price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber(PRICE_NUMBER_OPTIONS)
  @Min(0)
  @Max(MAX_PRICE)
  market_price?: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0, {
    message: 'stock cannot be below 0',
  })
  stock?: number;

  @IsOptional()
  @IsString()
  @IsUrl(
    {
      protocols: ['http', 'https'],
      require_protocol: true,
    },
    {
      message: 'image_url must be a valid HTTP or HTTPS URL',
    },
  )
  @MaxLength(MAX_IMAGE_URL_LENGTH)
  image_url?: string;

  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @ArrayMaxSize(MAX_MODELS)
  @IsString({ each: true })
  models?: string[];
}

export class SetCompatibilityDto {
  @IsArray()
  @ArrayUnique()
  @ArrayMaxSize(MAX_MODELS)
  @IsUUID('all', { each: true })
  model_ids!: string[];
}

export class ListProductsQueryDto {
  @IsOptional()
  @IsEnum(ProductTypeEnum)
  product_type?: ProductTypeEnum;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  category_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  brand_id?: number;

  @IsOptional()
  @IsEnum(VehicleTypeEnum)
  vehicle_type?: VehicleTypeEnum;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
  })
  @Min(0)
  min_price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
  })
  @Min(0)
  max_price?: number;

  @IsOptional()
  @IsUUID()
  fits_model_id?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(MAX_SEARCH_LENGTH)
  q?: string;

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

  @IsOptional()
  @IsEnum(PRODUCT_SORT_FIELDS, {
    message: `sort_by must be one of: ${PRODUCT_SORT_FIELDS.join(', ')}`,
  })
  sort_by?: ProductSortField;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  )
  @IsEnum(['asc', 'desc'], {
    message: 'sort_order must be asc or desc',
  })
  sort_order?: 'asc' | 'desc';

  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  include_inactive?: boolean;
}

export class GetProductQueryDto {
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  include_inactive?: boolean;
}
