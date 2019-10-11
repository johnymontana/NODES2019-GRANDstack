import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import "./UserList.css";
import { withStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Paper,
  TableSortLabel,
  Typography,
  TextField
} from "@material-ui/core";

const styles = theme => ({
  root: {
    maxWidth: 1700,
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto",
    margin: "auto"
  },
  table: {
    minWidth: 700
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    minWidth: 300
  }
});

class UserList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: "asc",
      orderBy: "event_start",
      page: 0,
      rowsPerPage: 100,
      usernameFilter: ""
    };
  }

  handleSortRequest = property => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  getFilter = () => {
    return this.state.usernameFilter.length > 0
      ? { description_contains: this.state.usernameFilter }
      : {};
  };

  handleFilterChange = filterName => event => {
    const val = event.target.value;

    this.setState({
      [filterName]: val
    });
  };

  render() {
    const { order, orderBy } = this.state;
    const { classes } = this.props;
    return (
      <Paper className={classes.root}>
        <Typography variant="h2" gutterBottom>
          NODES 2019 Session List
        </Typography>
        <TextField
          id="search"
          label="Search Session Description"
          className={classes.textField}
          value={this.state.usernameFilter}
          onChange={this.handleFilterChange("usernameFilter")}
          margin="normal"
          variant="outlined"
          type="text"
          InputProps={{
            className: classes.input
          }}
        />

        <Query
          query={gql`
            query sessionQuery(
              $first: Int
              $offset: Int
              $orderBy: [_SessionOrdering]
              $filter: _SessionFilter
            ) {
              Session(
                first: $first
                offset: $offset
                orderBy: $orderBy
                filter: $filter
              ) {
                name
                description
                event_start {
                  formatted
                }
                event_end {
                  formatted
                }
                audience
                has_tag {
                  name
                }
                has_subject {
                  name
                }
                photo
                speakers {
                  name
                  works_for {
                    name
                  }
                }
                recommended(first: 1) {
                  name
                  id
                }
              }
            }
          `}
          variables={{
            first: this.state.rowsPerPage,
            offset: this.state.rowsPerPage * this.state.page,
            orderBy: this.state.orderBy + "_" + this.state.order,
            filter: this.getFilter()
          }}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error</p>;

            return (
              <Table className={this.props.classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      key="name"
                      sortDirection={orderBy === "name" ? order : false}
                    >
                      <Tooltip
                        title="Sort"
                        placement="bottom-start"
                        enterDelay={300}
                      >
                        <TableSortLabel
                          active={orderBy === "name"}
                          direction={order}
                          onClick={() => this.handleSortRequest("name")}
                        >
                          Image
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      key="avgStars"
                      sortDirection={orderBy === "avgStars" ? order : false}
                      numeric
                    >
                      <Tooltip
                        title="Sort"
                        placement="bottom-end"
                        enterDelay={300}
                      >
                        <TableSortLabel
                          active={orderBy === "avgStars"}
                          direction={order}
                          onClick={() => this.handleSortRequest("avgStars")}
                        >
                          Name
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      key="numReviews"
                      sortDirection={orderBy === "numReviews" ? order : false}
                      numeric
                    >
                      <Tooltip
                        title="Sort"
                        placement="bottom-start"
                        enterDelay={300}
                      >
                        <TableSortLabel
                          active={orderBy === "numReviews"}
                          direction={order}
                          onClick={() => this.handleSortRequest("numReviews")}
                        >
                          Presenter
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>

                    <TableCell
                      key="name"
                      sortDirection={orderBy === "name" ? order : false}
                    >
                      <Tooltip
                        title="Sort"
                        placement="bottom-start"
                        enterDelay={300}
                      >
                        <TableSortLabel
                          active={orderBy === "name"}
                          direction={order}
                          onClick={() => this.handleSortRequest("name")}
                        >
                          Description
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>

                    <TableCell
                      key="name"
                      sortDirection={orderBy === "name" ? order : false}
                    >
                      <Tooltip
                        title="Sort"
                        placement="bottom-start"
                        enterDelay={300}
                      >
                        <TableSortLabel
                          active={orderBy === "name"}
                          direction={order}
                          onClick={() => this.handleSortRequest("name")}
                        >
                          Recommended
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.Session.map(n => {
                    console.log(n);
                    return (
                      <TableRow key={n.id}>
                        <TableCell component="th" scope="row">
                          <img
                            width="300px"
                            src={
                              n.photo
                                ? "//" + n.photo
                                : "//go.neo4j.com/rs/710-RRC-335/images/neo4j_logo.png"
                            }
                          ></img>
                        </TableCell>
                        <TableCell>
                          <b>{n.name}</b>
                        </TableCell>
                        <TableCell>
                          {n.speakers.map(s => {
                            return s.name;
                          })}
                        </TableCell>
                        <TableCell>
                          <div
                            className="content"
                            dangerouslySetInnerHTML={{ __html: n.description }}
                          ></div>
                        </TableCell>

                        <TableCell>
                          <a
                            href={
                              n.recommended.length > 0
                                ? "https://neo4j.com/online-summit/session/" +
                                  n.recommended[0].id
                                : ""
                            }
                            target="_blank"
                          >
                            {n.recommended.length > 0
                              ? n.recommended[0].name
                              : ""}{" "}
                          </a>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            );
          }}
        </Query>
      </Paper>
    );
  }
}

export default withStyles(styles)(UserList);
