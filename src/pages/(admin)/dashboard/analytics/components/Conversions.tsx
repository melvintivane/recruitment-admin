import SimplebarReactClient from "@/components/wrappers/SimplebarReactClient";
import type { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Row,
} from "react-bootstrap";
import { topJobs } from "../data";
import { Link } from "react-router-dom";

const RecruitmentMetrics = () => {
  const hireRateChartOpts: ApexOptions = {
    chart: {
      height: 292,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        dataLabels: {
          name: {
            fontSize: "14px",
            color: "undefined",
            offsetY: 100,
          },
          value: {
            offsetY: 55,
            fontSize: "20px",
            color: undefined,
            formatter: function (val) {
              return val + "%";
            },
          },
        },
        track: {
          background: "rgba(170,184,197, 0.2)",
          margin: 0,
        },
      },
    },
    fill: {
      gradient: {
        shade: "dark",
        shadeIntensity: 0.2,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 65, 91],
      },
    },
    stroke: {
      dashArray: 4,
    },
    colors: ["#1bb394", "#1bb394"],
    series: [72.5],
    labels: ["Successful Hires"],
    responsive: [
      {
        breakpoint: 380,
        options: {
          chart: {
            height: 180,
          },
        },
      },
    ],
    grid: {
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
  };

  const hiringTrendsChartOpts: ApexOptions = {
    series: [
      {
        name: "Applications",
        type: "bar",
        data: [45, 68, 52, 89, 76, 58, 49, 72, 65, 88, 76, 92],
      },
      {
        name: "Hires",
        type: "area",
        data: [5, 8, 6, 10, 9, 7, 5, 8, 7, 11, 9, 12],
      },
    ],
    chart: {
      height: 313,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      dashArray: [0, 0],
      width: [0, 2],
      curve: "smooth",
    },
    fill: {
      opacity: [1, 1],
      type: ["solid", "gradient"],
      gradient: {
        type: "vertical",
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90],
      },
    },
    markers: {
      size: [0, 0],
      strokeWidth: 2,
      hover: {
        size: 4,
      },
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      axisBorder: {
        show: false,
      },
    },
    grid: {
      show: true,
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: -2,
        bottom: 0,
        left: 10,
      },
    },
    legend: {
      show: true,
      horizontalAlign: "center",
      offsetX: 0,
      offsetY: 5,
      markers: {
        width: 9,
        height: 9,
        radius: 6,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "30%",
        barHeight: "70%",
        borderRadius: 3,
      },
    },
    colors: ["#1bb394", "#1e84c4"],
    tooltip: {
      shared: true,
      y: [
        {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              return y.toFixed(0);
            }
            return y;
          },
        },
        {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              return y.toFixed(0);
            }
            return y;
          },
        },
      ],
    },
  };

  return (
    <Card>
      <CardBody className="p-0">
        <Row className="g-0">
          <Col lg={3}>
            <div className="p-3">
              <CardTitle>Hire Rate</CardTitle>
              <ReactApexChart
                height={255}
                options={hireRateChartOpts}
                series={hireRateChartOpts.series}
                type="radialBar"
                className="mb-2 mt-4"
              />
              <Row className="text-center">
                <Col xs={6}>
                  <p className="text-muted mb-2">This Month</p>
                  <h3 className="text-dark mb-3">18</h3>
                </Col>
                <Col xs={6}>
                  <p className="text-muted mb-2">Last Month</p>
                  <h3 className="text-dark mb-3">14</h3>
                </Col>
              </Row>
              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-light shadow-none w-100"
                >
                  View Hiring Report
                </button>
              </div>
            </div>
          </Col>
          <Col lg={6} className="border-start border-end">
            <div className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <CardTitle as="h4">Hiring Trends</CardTitle>
                <div className="icons-center gap-1">
                  <Button variant="outline-light" size="sm">
                    ALL
                  </Button>
                  <Button variant="outline-light" size="sm">
                    Q1
                  </Button>
                  <Button variant="outline-light" size="sm">
                    Q2
                  </Button>
                  <Button variant="outline-light" size="sm" active>
                    YTD
                  </Button>
                </div>
              </div>
              <div
                className="alert alert-info mt-3 text text-truncate mb-0"
                role="alert"
              >
                Hiring goal for Q3: 25 new team members across all departments.
              </div>
              <div dir="ltr">
                <ReactApexChart
                  height={313}
                  options={hiringTrendsChartOpts}
                  series={hiringTrendsChartOpts.series}
                  type="line"
                />
              </div>
            </div>
          </Col>
          <Col lg={3}>
            <div className="d-flex justify-content-between p-3">
              <CardTitle>Top Job Openings</CardTitle>
            </div>
            <SimplebarReactClient
              className="px-3"
              style={{
                maxHeight: 310,
                height: "auto",
                overflow: "hidden, scroll",
              }}
            >
              {topJobs.map((job, idx) => (
                <div className="row p-2" key={idx}>
                  <span
                    className="col-6 fw-medium text-truncate"
                    title={job.title}
                  >
                    {job.title}
                  </span>
                  <span className="col-3 text-center fw-medium">
                    {job.applications}
                  </span>
                  <span className="col-3 text-end fw-medium">
                    <Badge bg="success">{job.hireRate}%</Badge>
                  </span>
                </div>
              ))}
            </SimplebarReactClient>
            <div className="text-center p-3">
              <Link
                to={"/vacancies"}
                className="btn btn-light shadow-none w-100"
              >
                View All Positions
              </Link>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default RecruitmentMetrics;
