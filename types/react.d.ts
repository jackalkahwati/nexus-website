/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace React {
  interface StatelessComponent<P = {}> {
    (props: P & { children?: React.ReactNode }, context?: any): React.ReactElement<any, any> | null;
    displayName?: string;
    defaultProps?: Partial<P>;
  }
  interface FunctionComponent<P = {}> extends StatelessComponent<P> {}
  interface FC<P = {}> extends FunctionComponent<P> {}
} 