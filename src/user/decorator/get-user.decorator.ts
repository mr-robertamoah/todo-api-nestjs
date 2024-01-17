import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | null, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (data && request.user && request.user[data]) return request.user[data];
    return request.user;
  },
);
