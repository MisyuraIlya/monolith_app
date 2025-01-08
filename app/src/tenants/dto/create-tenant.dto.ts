import { CreateUserDto } from "src/users/dto/create-user.dto";

export class CreateTenantDto {
    companyName: string;
    user: CreateUserDto
}
