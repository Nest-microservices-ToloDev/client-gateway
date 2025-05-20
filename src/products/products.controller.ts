import {  Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { NATS_SERVICE } from '../config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from '../common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client:ClientProxy
  ) {}

  @Post()
  createProduct(@Body() createProductDto:CreateProductDto){
    return this.client.send({cmd:"create_product"},createProductDto)
  }

   @Get()
  findAllProducts(@Query() paginationDto:PaginationDto){
   return this.client.send({cmd:"find_all_products"},paginationDto)

  }

   @Get(":id")
  async findProductById(@Param('id') id:string){
    try {

      const product=await firstValueFrom( this.client.send({cmd:"find_one_product"},{id}))
      return product
    } catch (error) {
        throw new RpcException(error)
    }
  }

  @Patch(":id")
  updateProduct(
    @Body() updateProductDto:UpdateProductDto,
    @Param('id',ParseIntPipe) id:number){
    return this.client.send({cmd:"update_product"},{id,...updateProductDto}).pipe(
      catchError(err=> {
        throw new RpcException(err)
      })
    )
  }


    @Delete(":id")
  deleteProduct(@Param('id',ParseIntPipe) id:number){
    return this.client.send({cmd:"delete_product"},{id}).pipe(
      catchError(err=> {
        throw new RpcException(err)
      })
    )
  }

}
