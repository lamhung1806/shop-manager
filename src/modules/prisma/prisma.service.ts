import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../../generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // constructor() {
  //   super({
  //     log: [
  //       {
  //         emit: 'event',
  //         level: 'query',
  //       },
  //       {
  //         emit: 'stdout',
  //         level: 'error',
  //       },
  //       {
  //         emit: 'stdout',
  //         level: 'info',
  //       },
  //       {
  //         emit: 'stdout',
  //         level: 'warn',
  //       },
  //     ],
  //     errorFormat: 'colorless',
  //   });
  // }

  async onModuleInit() {
    // this.$on('query', (event) => {
    //   /* eslint-disable */
    //   console.log('#Query: ', event.query);
    //   console.log('#Params: ', event.params);
    //   console.log('#Duration: ', event.duration);
    //   console.log('####################################################33');
    // });
    await this.$connect();
  }
}
