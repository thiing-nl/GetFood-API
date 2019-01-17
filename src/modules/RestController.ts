import { Authenticated, Controller, Get, RouteService } from '@tsed/common';
import { Security } from '@tsed/swagger';

@Controller('/rest')
export class RestController {

  constructor(private routeService: RouteService) {

  }

  @Get('/')
  @Authenticated()
  @Security('token')
  public getRoutes() {
    return this.routeService.getAll();
  }
}
