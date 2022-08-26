import { Exclude, Transform } from "class-transformer";
import { CreateUserDto } from "./create-user.dto";
import { Tag } from '../../tags/entities/tag.entity';

export class GetUserDto extends CreateUserDto {
  @Exclude({ toPlainOnly: true })
  uid: string;

  @Exclude({ toPlainOnly: true })
  password: string;

  @Transform(({ value }) => value.map(tag => {
    return {
      "id": tag.id,
      "name": tag.name,
      "sortOrder": tag.sortOrder,
    };
  }))
  tags: Tag[]

  @Exclude({ toPlainOnly: true })
  createdTags: Tag[]

  constructor(partial: Partial<GetUserDto>) {
    super()
    Object.assign(this, partial);
  }
}