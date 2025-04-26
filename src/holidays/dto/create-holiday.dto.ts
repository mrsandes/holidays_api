import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export enum HolidayType {
  NACIONAL = 'nacional',
  ESTADUAL = 'estadual',
  MUNICIPAL = 'municipal',
}

export class CreateHolidayDto {
  @ApiPropertyOptional({
    type: [String],
    description: 'Nome do feriado',
    example: 'Dia da Consciência Negra',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    enum: HolidayType,
    description: 'Tipo do feriado',
    example: HolidayType.ESTADUAL,
  })
  @IsOptional()
  @IsEnum(HolidayType)
  type?: HolidayType;

  @ApiPropertyOptional({
    type: [String],
    description: 'Data do feriado',
    example: '0000-11-20',
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Estado do feriado',
    example: '31',
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Cidade do feriado',
    example: '3118601',
  })
  @IsOptional()
  @IsString()
  city?: string;
}
