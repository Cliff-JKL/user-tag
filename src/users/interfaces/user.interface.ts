export interface PublicUserInterface {
  nickname: string;
  uid: string;
}

export interface PartialUserInterface {
  email: string;
  nickname: string;
}

export interface LoginUserInterface {
  email: string;
  password: string;
}