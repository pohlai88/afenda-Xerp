let mockPathname = "/";

export function __setMockPathname(pathname: string) {
  mockPathname = pathname;
}

export function usePathname() {
  return mockPathname;
}
