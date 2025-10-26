import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RepositoryModule } from './repository/repository.module';
import { ProductModule } from './modules/product/product.module';
import { FileModule } from './modules/file/file.module';
import { OrderModule } from './modules/order/order.module';
import { CartModule } from './modules/cart/cart.module';

@Module({
  imports: [
    AuthModule,
    RepositoryModule,
    UserModule,
    ProductModule,
    FileModule,
    OrderModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
