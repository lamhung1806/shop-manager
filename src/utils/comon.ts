export class Common {
  public static extractTokenFromHeader(authorization: string): string {
    const [type, token] = authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : '';
  }

  public static excludeFields<T, K extends keyof T>(
    obj: T,
    keys: K[],
  ): Omit<T, K> {
    const result = { ...obj };
    keys.forEach((key) => delete result[key]);
    return result;
  }
}
