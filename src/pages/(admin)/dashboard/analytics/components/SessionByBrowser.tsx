/* eslint-disable @typescript-eslint/no-explicit-any */
import { WorldVectorMap } from '@/components/VectorMap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { toAlphaNumber } from '@/utils/change-casing'
import { Card, CardBody, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, ProgressBar, Row } from 'react-bootstrap'
import { Fragment } from 'react/jsx-runtime'
import { applicantLocations } from '../data'

const ApplicantsByLocation = () => {
  const mapOptions = {
    map: 'world',
    zoomOnScroll: true,
    zoomButtons: false,
    markersSelectable: true,
    markers: [
      { name: 'United States', coords: [37.0902, -95.7129] },
      { name: 'United Kingdom', coords: [55.3781, -3.4360] },
      { name: 'India', coords: [20.5937, 78.9629] },
      { name: 'Germany', coords: [51.1657, 10.4515] },
      { name: 'Australia', coords: [-25.2744, 133.7751] },
    ],
    markerStyle: {
      initial: { fill: '#7f56da' },
      selected: { fill: '#1bb394' },
    },
    labels: { markers: { render: (e: any) => e.name } },
    regionStyle: {
      initial: { fill: 'rgba(169,183,197, 0.3)', fillOpacity: 1 },
    },
  }

  return (
    <Card>
      <div className="d-flex card-header justify-content-between align-items-center border-bottom border-dashed">
        <h4 className="card-title">Applicants by Location</h4>
        <Dropdown>
          <DropdownToggle as={'a'} role="button" className="arrow-none btn btn-sm btn-outline-light icons-center gap-2">
            View Data <IconifyIcon icon="bx:chevron-down" className="fs-16" />
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end">
            <DropdownItem href="">Download CSV</DropdownItem>
            <DropdownItem href="">Export Report</DropdownItem>
            <DropdownItem href="">Print</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <CardBody className="py-0">
        <Row className="align-items-center">
          <Col lg={7}>
            <div id="applicants-world-map" className="mt-3">
              <WorldVectorMap 
                height="220px" 
                width="100%" 
                options={mapOptions} 
              />
            </div>
          </Col>
          <Col lg={5} dir="ltr">
            <div className="p-3 pb-0">
              {applicantLocations.map((location, idx) => (
                <Fragment key={idx}>
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="mb-1">
                      <IconifyIcon icon={location.icon} className="fs-16 align-middle me-1" /> 
                      <span className="align-middle">{location.name}</span>
                    </p>
                    <span className="text-muted fs-13">{location.percentage}%</span>
                  </div>
                  <Row className="align-items-center mb-3">
                    <Col>
                      <ProgressBar 
                        className="progress-soft progress-sm" 
                        now={location.percentage} 
                        variant={location.variant} 
                      />
                    </Col>
                    <Col xs="auto">
                      <p className="mb-0 fs-13 fw-semibold">{toAlphaNumber(location.applicants)}</p>
                    </Col>
                  </Row>
                </Fragment>
              ))}
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

export default ApplicantsByLocation