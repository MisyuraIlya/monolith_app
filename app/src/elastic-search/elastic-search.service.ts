import { Injectable } from '@nestjs/common';
import { ElasticsearchService as NestElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ElasticsearchService {
  constructor(private readonly elasticsearchService: NestElasticsearchService) {}

  // Index a document
  async indexDocument(index: string, id: string, body: any): Promise<any> {
    return await this.elasticsearchService.index({
      index,
      id,
      body,
    });
  }

  // Search documents
  async searchDocuments(index: string, query: any): Promise<any> {
    return await this.elasticsearchService.search({
      index,
      body: {
        query,
      },
    });
  }

  // Check if document exists
  async documentExists(index: string, id: string): Promise<boolean> {
    // @ts-ignore
    const { body } = await this.elasticsearchService.exists({
      index,
      id,
    });
    return body;
  }

  // Delete a document
  async deleteDocument(index: string, id: string): Promise<any> {
    return await this.elasticsearchService.delete({
      index,
      id,
    });
  }
}
