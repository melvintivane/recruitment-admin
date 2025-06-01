/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'simplebar-react' {
  export type Props = import('simplebar-react/dist/index').Props;
  const SimpleBar: import('react').ForwardRefExoticComponent<
    Props & import('react').RefAttributes<any>
  >;
  export default SimpleBar;
}