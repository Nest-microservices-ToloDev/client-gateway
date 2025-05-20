import { Module } from '@nestjs/common'
import { ProductsController } from './products.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, NATS_SERVICE} from '../config';
import { NatsModule } from '../transports/nats.module';


@Module({
  imports:[ NatsModule],
  controllers: [ProductsController]
})
export class ProductsModule {}
