import { Controller } from '@nestjs/common';
import { RegionalService } from './regional.service';

@Controller('regional')
export class RegionalController {
  constructor(private readonly regionalService: RegionalService) {}
}
