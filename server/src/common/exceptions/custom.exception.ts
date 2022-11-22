import { HttpException, HttpStatus } from '@nestjs/common';

// exceptions 폴더 구조 유지를 위한 임시 파일
export class CustomException extends HttpException {
  constructor() {
    super('Custom Message', HttpStatus.BAD_REQUEST);
  }
}
