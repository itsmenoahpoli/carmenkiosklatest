import React from "react";
import { Container, Spinner, Placeholder, Row, Col } from "react-bootstrap";
import DataTable from "react-data-table-component";

const tableStyles = {
  headCells: {
    style: {
      color: "#454545",
      fontSize: "13px",
    },
  },
  cells: {
    style: {
      paddingTop: "15px",
      paddingBottom: "15px",
    },
  },
};

const LoadingTableDataComponent = () => {
  return (
    <Container className="text-center py-4">
      <small>
        <Spinner animation="border" />
      </small>
      {/* <Row>
        <Col>
          <Placeholder as="p" animation="glow">
            <Placeholder xs={12} />
          </Placeholder>
        </Col>
      </Row> */}
    </Container>
  );
};

const EmptyTableDataComponent = () => {
  return (
    <Container className="text-center py-4">
      <small>No data available</small>
    </Container>
  );
};

export const TableBuilder = (props) => {
  const { columns, data, loading } = props;

  return (
    <DataTable
      columns={columns}
      data={data}
      progressPending={loading}
      progressComponent={<LoadingTableDataComponent />}
      noDataComponent={<EmptyTableDataComponent />}
      fixedHeader
      fixedHeaderScrollHeight="80vh"
      responsive
      highlightOnHover
      selectableRows
      persistTableHead
      pagination
      paginationPerPage={25}
      paginationRowsPerPageOptions={[10, 25, 50, 75, 100]}
      customStyles={tableStyles}
    />
  );
};
