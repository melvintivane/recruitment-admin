import { Card, CardHeader, CardTitle, Table, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { topJobs } from '../data'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

const TopJobOpenings = () => {
  return (
    <Card className="card-height-100">
      <CardHeader className="d-flex align-items-center justify-content-between gap-2">
        <CardTitle as="h4" className="flex-grow-1">
          Top Job Openings
        </CardTitle>
        <div>
          <Link to={"/vacancies"} className="btn btn-success btn-sm ms-2">
            View All Positions
          </Link>
        </div>
      </CardHeader>
      <div className="table-responsive">
        <Table className="table-hover table-nowrap table-centered m-0">
          <thead className="bg-light bg-opacity-50">
            <tr>
              <th className="text-muted py-1">Job Title</th>
              <th className="text-muted py-1">Views</th>
              <th className="text-muted py-1">Applications</th>
              <th className="text-muted py-1">Hire Rate</th>
              <th className="text-muted py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {topJobs.map((job, idx) => (
              <tr key={idx}>
                <td>
                  <Link to={`/vacancies/${job.id}`} className="text-primary fw-semibold">
                    {job.title}
                  </Link>
                  <div className="text-muted fs-12">
                    <IconifyIcon icon="mdi:location" className="me-1" />
                    {job.location}
                  </div>
                </td>
                <td>{job.views.toLocaleString()}</td>
                <td>{job.applications}</td>
                <td>
                  <Badge bg={job.hireRate > 7 ? 'success' : job.hireRate > 4 ? 'warning' : 'danger'}>
                    {job.hireRate}%
                  </Badge>
                </td>
                <td>
                  <Badge bg={job.status === 'OPEN' ? 'success' : 'secondary'}>
                    {job.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Card>
  )
}

export default TopJobOpenings