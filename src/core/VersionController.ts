import { Controller, Get } from '@tsed/common';
import { Docs, Summary } from '@tsed/swagger';

@Docs('api-v1')
@Controller('/')
export class VersionController {

  @Get('/')
  @Summary('Receives all versions for this API')
  public getRoutes() {
    return [
      {
        version: 'v1',
        docs: 'https://api.getfood.io/api-docs',
        prefix: '/v1/'
      }
    ];
  }
}
