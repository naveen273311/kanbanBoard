import React, { useState, useEffect } from "react";
import KanbanBoard from "./components/KanbanBoard";
import { fetchTickets } from "./services/api";
// import { ReactComponent as ThreeDotIcon } from "../assests/3-dot-menu.svg";

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [groupBy, setGroupBy] = useState("status");

  useEffect(() => {
    const data = fetchTickets();
    setTickets(data.tickets);
  }, []);

  return (
    <div className="App">
      <div
        style={{
          backgroundColor: "#fff",
          height: "40px",
          paddingTop: "3px",
          paddingBottom: "12px",
        }}
      >
        <div
          className="controls"
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <label htmlFor="groupBy" style={{ marginRight: "8px" }}>
            Display:
          </label>
          <select id="groupBy" onChange={(e) => setGroupBy(e.target.value)}>
            <option value="status">Status</option>
            <option value="user">User</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>
      <KanbanBoard tickets={tickets} groupBy={groupBy} />
    </div>
  );
};

export default App;
