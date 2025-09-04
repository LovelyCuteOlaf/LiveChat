export interface IUser {
  id: number;
  name: string;
  bio?: string;
  email: string;
  avatarUrl: string;
  location?: string;
  nickname?: string;
}

export interface UpdateUserDto {
  name?: string;
  bio?: string;
  email?: string;
  location?: string;
  nickname?: string;
}

export interface UpdatePasswordDto {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SearchUsersDto {
  name: string;
}
