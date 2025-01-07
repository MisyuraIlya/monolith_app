import { Controller, Post, Body, Param, Get, Query, Delete } from '@nestjs/common';
import { ElasticsearchService } from './elastic-search.service';

@Controller('elasticsearch')
export class ElasticsearchController {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  @Post('index/:index/:id')
  async indexDocument(
    @Param('index') index: string,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return await this.elasticsearchService.indexDocument(index, id, body);
  }

  @Get('search/:index')
  async searchDocuments(
    @Param('index') index: string,
    @Query('q') query: string,
  ) {
    const parsedQuery = JSON.parse(query); // Assuming the query is in a JSON string format
    return await this.elasticsearchService.searchDocuments(index, parsedQuery);
  }

  @Delete('delete/:index/:id')
  async deleteDocument(
    @Param('index') index: string,
    @Param('id') id: string,
  ) {
    return await this.elasticsearchService.deleteDocument(index, id);
  }
}
