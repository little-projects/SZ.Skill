export interface IError {
  data: {
    [key in string]: null
  }
  errors: Array<{
    message: string
    locations: Array<{
      line: number
      column: number
    }>
    path: string[]
  }>
};
