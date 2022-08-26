import { PublicUserInterface } from "../../users/interfaces/user.interface";

export interface PartialTagInterface {
  name: string;
  sortOrder: number;
}

export interface GetTagInterface extends PartialTagInterface {
  id: number;
}

export interface TagInterface extends PartialTagInterface {
  creator: PublicUserInterface;
}

export interface QueryTagInterface {
  data: TagInterface[];
  meta: {
    offset: number;
    length: number;
    quantity: number;
  };
}

export interface GetTagsInterface {
  tags: GetTagInterface[];
}