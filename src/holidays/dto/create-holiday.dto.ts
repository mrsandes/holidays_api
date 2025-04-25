import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";

export enum HolidayType {
  NACIONAL = "nacional",
  ESTADUAL = "estadual",
  MUNICIPAL = "municipal",
}

export class CreateHolidayDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(HolidayType)
  type?: HolidayType;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  city?: string;
}

