import { All, Authenticated, Controller, Get, RouteService } from '@tsed/common';
import { Docs, Security, Summary } from '@tsed/swagger';

@Docs('api-v1')
@Controller('/')
export class VersionController {

  @Get('/')
  @Authenticated()
  @Summary('Receives all versions for this API')
  @Security('token')
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
