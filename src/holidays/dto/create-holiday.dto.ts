import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";

export enum HolidayType {
  Nacional = "nacional",
  Estadual = "estadual",
  Municipal = "municipal",
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

