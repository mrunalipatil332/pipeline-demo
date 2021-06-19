import { Component } from 'react';

export default class Api extends Component {
  static baseUrl = Api.getBaseUrl();

  static loginUrl = `${Api.baseUrl}admin/login`;

  static usersUrl = 'https://jsonplaceholder.typicode.com/users';

  static countriesUrl = 'https://zf3a0kdlxb.execute-api.me-south-1.amazonaws.com/dev/api/v1/countries/';

  static statesUrl = 'https://zf3a0kdlxb.execute-api.me-south-1.amazonaws.com/dev/api/v1/states/?sort_by=order_by&sort_direction=ascending&type=all&language=en';

  static citiesUrl = 'https://zf3a0kdlxb.execute-api.me-south-1.amazonaws.com/dev/api/v1/city/';

  static classesUrl = 'https://iblypkr3ef.execute-api.eu-west-2.amazonaws.com/staging/api/v1/class/?status=1'

  // Get base URL of APIs
  static getBaseUrl() {
    const env = 'dev';
    let url = '';
    switch (env) {
      case 'production':
        url = '';
        break;
      // Default: development server
      default:
        url =
          'https://85brgtkdy3.execute-api.ca-central-1.amazonaws.com/dev/api/';
        break;
    }
    return url;
  }

  environment;

  constructor(props) {
    super(props);
    this.state = {};
    this.getBaseUrl = this.getBaseUrl.bind(this);
  }
}
