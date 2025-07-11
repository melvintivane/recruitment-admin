import { Card, CardBody, Col } from 'react-bootstrap'

import LogoBox from '@/components/LogoBox'
import PageMetaData from '@/components/PageTitle'
import ThirdPartyAuth from '@/components/ThirdPartyAuth'
import LoginForm from './components/LoginForm'

const SignIn2 = () => {
  return (
    <>
      <PageMetaData title="Sign In" />

      <Col xl={5} className="mx-auto">
        <Card className="auth-card">
          <CardBody className="px-3 py-5">
            <LogoBox
              textLogo={{
                height: 24,
                width: 110,
              }}
              squareLogo={{ className: 'me-2', width: 50, height: 33 }}
              containerClassName="mx-auto mb-4 text-center auth-logo"
            />
            <h2 className="fw-bold text-center fs-18">Sign In</h2>
            <p className="text-muted text-center mt-1 mb-4">Enter your email address and password to access admin panel.</p>
            <div className="px-4">
              <LoginForm />
              <ThirdPartyAuth />
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

export default SignIn2
