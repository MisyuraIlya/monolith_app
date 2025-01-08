export class CreateChatDto {
    readonly message: string;
    readonly sender: string;
    readonly receiver: string;
    readonly isRead?: boolean; 
  }