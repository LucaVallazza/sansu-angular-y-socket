import { Injectable } from '@angular/core';
import { enviroment } from '../../enviroment/enviroment';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class SocketHandlerService extends Socket {
  constructor() {
    super({
      url: enviroment.ws_url,
      options: {
        reconnection: true,
      },
    });
  }


}

