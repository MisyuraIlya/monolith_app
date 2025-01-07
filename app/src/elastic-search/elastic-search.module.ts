import { Module } from '@nestjs/common';
import { ElasticsearchService } from './elastic-search.service';
import { ElasticsearchController } from './elastic-search.controller';
import { ElasticsearchModule as NestElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
    NestElasticsearchModule.register({
      node: process.env.ELASTICSEARCH_URI,
      auth: {
        username: process.env.ELASTICSEARCH_USERNAME,
        password: process.env.ELASTICSEARCH_PASSWORD,
      },
    }),
  ],
  controllers: [ElasticsearchController],
  providers: [ElasticsearchService],
})
export class ElasticSearchModule {}
