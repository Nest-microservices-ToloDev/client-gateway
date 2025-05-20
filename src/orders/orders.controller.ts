import { Controller, Get, Post, Body,  Param, Inject, ParseUUIDPipe,  Query, Patch } from '@nestjs/common';
import { NATS_SERVICE} from '../config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from '../common';


@Controller('orders')
export class OrdersController {
  constructor(
     @Inject(NATS_SERVICE) private readonly client:ClientProxy
  ) {}

  @Post()
 async create(@Body() createOrderDto: CreateOrderDto) {

    try {

      const order=await firstValueFrom(this.client.send('createOrder',createOrderDto))
      return order

    } catch (error) {
      throw new RpcException(error)
    }
    
  }

  @Get()
 async findAll(@Query() orderPaginationDto:OrderPaginationDto) {

    try {    
      const orders=await firstValueFrom(this.client.send("findAllOrders",orderPaginationDto))
   return orders
    } catch (error) {
       throw new RpcException(error)
    }
    
  }

  @Get('id/:id')
  async findOne(@Param('id',ParseUUIDPipe) id: string) {
    try {
       const order=await firstValueFrom(this.client.send("findOneOrder",{id})) 
       return order
    } catch (error) {
      throw new RpcException(error)
    } 
  }

  @Get(":status")
  async findByStatus(
    @Param() statusDto:StatusDto,
    @Query() paginationDto:PaginationDto
){
     try {
       return this.client.send("findAllOrders",{
        ...paginationDto,
        status:statusDto.status
       })

    } catch (error) {
      throw new RpcException(error)
    } 
  }
  @Patch(":id")
  async changeStatus(
    @Param("id",ParseUUIDPipe) id:string,
    @Body() statusDto:StatusDto
  ){

    try { 
      
      return this.client.send("changeOrderStatus",{id,status:statusDto.status})
    } catch (error) {
        throw new RpcException(error)
    }
   
  }


}
