import { Controller, Get, JsonProperty } from '@tsed/common';
import { Docs, Example, Returns, ReturnsArray, Summary } from '@tsed/swagger';
import { ListModel } from '../v2/modules/list/List';

export class EndpointInfo {
  @JsonProperty()
  @Example('v1')
  public version: string = '';
  @JsonProperty()
  @Example('https://api.getfood.io/')
  public baseUrl: string = '';
  @JsonProperty()
  @Example('https://api.getfood.io/api-docs')
  public docs: string = '';
  @JsonProperty()
  @Example('/v1/')
  public prefix: string = '';

  constructor(parameters: { version: string, baseUrl: string, docs: string, prefix: string }) {
    let { version, baseUrl, docs, prefix } = parameters;
    this.version = version;
    this.baseUrl = baseUrl;
    this.docs = docs;
    this.prefix = prefix;
  }
}

@Docs('api-v2')
@Controller('/')
export class VersionController {

  @Get('/')
  @ReturnsArray(200, { type: EndpointInfo })
  @Summary('Receives all versions for this API')
  public getRoutes() {
    return [
      new EndpointInfo({
        version: 'v1',
        baseUrl: 'https://api.getfood.io/',
        docs: 'https://api.getfood.io/api-docs',
        prefix: '/v1/'
      }),
      new EndpointInfo({
        version: 'v2',
        baseUrl: 'https://api-v2.getfood.io/',
        docs: process.env[ 'ENV' ] === 'development' ? 'http://localhost:8080/api-docs' : 'https://api-v2.getfood.io/api-docs',
        prefix: '/v2/'
      })
    ];
  }
}
