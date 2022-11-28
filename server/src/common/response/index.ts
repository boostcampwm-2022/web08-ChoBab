export interface SuccessResType {
  message: string;
  data: any;
}

export interface FailResType {
  message: string;
}

export const successRes = (message: string, data: any): SuccessResType => {
  return { message, data };
};

export const failRes = (message: string): FailResType => {
  return { message };
};
