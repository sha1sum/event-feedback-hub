import { getAuth } from '@clerk/express';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { Request } from 'express';

interface GraphqlContext {
  req: Request;
}

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { req } =
      GqlExecutionContext.create(context).getContext<GraphqlContext>();
    const auth = getAuth(req);

    if (!auth.isAuthenticated) {
      throw new UnauthorizedException('Sign in to submit feedback');
    }

    return true;
  }
}
