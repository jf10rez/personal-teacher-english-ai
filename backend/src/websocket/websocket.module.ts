import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppGateway } from './websocket.gateway';

@Module({
  imports: [JwtModule.register({})],
  providers: [AppGateway],
  exports: [AppGateway],
})
export class WebSocketModule { }
