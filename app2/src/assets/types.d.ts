export interface UserType{
  id : number,
  name: string,
  votes: number[],
  hasShown: boolean,
}

export interface OptionType{
  id: number,
  description: string
}
