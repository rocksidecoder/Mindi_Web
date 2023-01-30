import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../../context/userContext";
import authAxios from "../../http/authAxios";

const History = () => {
  const [userHistory, setUserHistory] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const { loginDetail } = useContext(userContext);
  let { username } = JSON.parse(localStorage.getItem("user-info"));

  const userHistoryFunc = async () => {
    const res = await authAxios.get(
      `/room/history/${loginDetail.username || username}`
    );
    setUserHistory(res.data);
  };

  const highlightUser = (players) => {
    return players.map((ele, index) => (
      <span
        style={{
          color: (loginDetail.username || username) == ele ? "#41bb3f" : ""
        }}
      >
        {ele}
        {index !== players.length - 1 && " | "}
      </span>
    ));
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowPerPage = (e) => {
    setRowsPerPage(e.target.value);
  };

  useEffect(() => {
    userHistoryFunc();
  }, []);

  return (
    <div>
      <TableContainer>
        <Table
          sx={{ minWidth: 750, backgroundColor: "white" }}
          aria-labelledby="tableTitle"
          size="medium"
        >
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Team 1</TableCell>
              <TableCell>Team 2</TableCell>
              <TableCell>Mindi | Hands</TableCell>
              <TableCell>Winner</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userHistory
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((ele, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell>{page * rowsPerPage + i + 1}</TableCell>
                    <TableCell>
                      {highlightUser(ele.teams.team1.players)}
                    </TableCell>
                    <TableCell>
                      {highlightUser(ele.teams.team2.players)}
                    </TableCell>
                    <TableCell>
                      {ele.teams[ele.playerTeam].mindi} |{" "}
                      {ele.teams[ele.playerTeam].hands}
                    </TableCell>
                    <TableCell>{ele.winnerTeam}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
          <TablePagination
            rowsPerPageOptions={[5, 10]}
            count={userHistory.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleRowPerPage}
          ></TablePagination>
        </Table>
      </TableContainer>
    </div>
  );
};

export default History;
