import { Link } from 'react-router-dom'

import type { LogoBoxProps } from '@/types/component-props'

import logoDark from '@/assets/images/logo-dark.png'
import logoLight from '@/assets/images/logo-light.png'

const LogoBox = ({ containerClassName, squareLogo }: LogoBoxProps) => {
  return (
    <div className={containerClassName ?? ''}>
      <Link to="/" className="logo-dark">
        <img src={logoDark} className={squareLogo?.className} height={squareLogo?.height ?? 30} width={squareLogo?.width ?? 19} alt="logo sm" />
        {/* <img src={logoDark} className={textLogo?.className} height={textLogo?.height ?? 20} width={textLogo?.width ?? 60} alt="logo dark" /> */}
      </Link>
      <Link to="/" className="logo-light">
        <img src={logoLight} className={squareLogo?.className} height={squareLogo?.height ?? 30} width={squareLogo?.width ?? 19} alt="logo sm" />
        {/* <img src={logoLight} className={textLogo?.className} height={textLogo?.height ?? 20} width={textLogo?.width ?? 60} alt="logo light" /> */}
      </Link>
    </div>
  )
}

export default LogoBox
