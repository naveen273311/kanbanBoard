import React, { useState, useEffect } from "react";
import TicketCard from "./TicketCard";
// import { fetchTickets } from "./../api.js"; // Import the fetchTickets function
import { fetchTickets } from "../services/api";
import { ReactComponent as ThreeDotIcon } from "../assests/3-dot-menu.svg";
import { ReactComponent as AddButton } from "../assests/add.svg";
import { ReactComponent as BacklogIcon } from "../assests/Backlog.svg";
import { ReactComponent as TodoIcon } from "../assests/To-do.svg";
import { ReactComponent as InProgressIcon } from "../assests/in-progress.svg";
import { ReactComponent as DoneIcon } from "../assests/Done.svg";
import { ReactComponent as CancelledIcon } from "../assests/Cancelled.svg";
import { ReactComponent as NoPriorityIcon } from "../assests/No-priority.svg";
import { ReactComponent as LowPriorityIcon } from "../assests/low-priority-icon.svg";
import { ReactComponent as MediumPriorityIcon } from "../assests/medium-priority-icon.svg";
import { ReactComponent as HighPriorityIcon } from "../assests/high-priority-icon.svg";
import { ReactComponent as UrgentPriorityIcon } from "../assests/urgent-priority-icon.svg";

const KanbanBoard = ({ groupBy }) => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState({});

  useEffect(() => {
    // Fetch tickets and users from API
    const { tickets, users: userData } = fetchTickets();

    // Set the fetched tickets to state
    setTickets(tickets);

    // Transform users into a dictionary by userId for easy access
    const userMap = userData.reduce((acc, user) => {
      acc[user.id] = user.name;
      return acc;
    }, {});

    // Set the transformed users object to state
    setUsers(userMap);
  }, []);

  // Define priority levels for sorting
  const priorityOrder = {
    no_priority: 0,
    low: 1,
    medium: 2,
    high: 3,
    urgent: 4,
  };

  // Define constant status categories
  const statusCategories = [
    "backlog",
    "todo",
    "in progress",
    "done",
    "cancelled",
  ];

  const categoriesMap = {
    backlog: <BacklogIcon />,
    todo: <TodoIcon />,
    "in progress": <InProgressIcon />,
    done: <DoneIcon />,
    cancelled: <CancelledIcon />,
  };
  const categoriesMap2 = {
    "No priority": <NoPriorityIcon />,
    Low: <LowPriorityIcon />,
    Medium: <MediumPriorityIcon />,
    High: <HighPriorityIcon />,
    Urgent: <UrgentPriorityIcon />,
  };

  // Define constant priority categories
  const priorityCategories = [
    { label: "No priority", value: "no_priority" },
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
    { label: "Urgent", value: "urgent" },
  ];

  // Group tickets based on selected option
  const groupTickets = (groupBy) => {
    if (groupBy === "status") {
      const groups = statusCategories.reduce((acc, status) => {
        acc[status] = [];
        return acc;
      }, {});

      tickets.forEach((ticket) => {
        if (groups[ticket.status.toLowerCase()]) {
          groups[ticket.status.toLowerCase()].push(ticket);
        }
      });

      return groups;
    } else if (groupBy === "priority") {
      const groups = priorityCategories.reduce((acc, { value }) => {
        acc[value] = [];
        return acc;
      }, {});

      tickets.forEach((ticket) => {
        const priorityKey =
          Object.keys(priorityOrder).find(
            (key) => priorityOrder[key] === ticket.priority
          ) || "no_priority";
        if (groups[priorityKey]) {
          groups[priorityKey].push(ticket);
        }
      });

      return groups;
    } else if (groupBy === "user") {
      const groups = Object.keys(users).reduce((acc, userId) => {
        acc[users[userId]] = [];
        return acc;
      }, {});

      tickets.forEach((ticket) => {
        if (users[ticket.userId]) {
          groups[users[ticket.userId]].push(ticket);
        }
      });

      return groups;
    }
  };

  const groupedTickets = groupTickets(groupBy);

  const sortedGroupedTickets =
    groupBy === "priority"
      ? Object.fromEntries(
          Object.entries(groupedTickets).map(([group, tickets]) => [
            group,
            tickets.sort(
              (a, b) =>
                priorityOrder[
                  Object.keys(priorityOrder).find(
                    (key) => priorityOrder[key] === a.priority
                  ) || "no_priority"
                ] -
                priorityOrder[
                  Object.keys(priorityOrder).find(
                    (key) => priorityOrder[key] === b.priority
                  ) || "no_priority"
                ]
            ),
          ])
        )
      : groupedTickets;
  console.log("Sorted Grouped Tickets:", sortedGroupedTickets);

  return (
    <div className="kanban-board">
      <div className="kanban-columns">
        {groupBy === "status" &&
          statusCategories.map((status) => {
            const ticketCount = sortedGroupedTickets[status]?.length || 0;
            return (
              <div key={status} className="kanban-column">
                <div
                  style={{
                    display: "flex", // Enable Flexbox layout
                    alignItems: "center", // Center items vertically
                    justifyContent: "space-between", // Space between items (optional)
                  }}
                >
                  <p style={{ marginRight: "-140px" }}>
                    {categoriesMap[status]}
                  </p>
                  {/* {console.log("status", status, categoriesMap[status])} */}
                  <h3>
                    {status.charAt(0).toUpperCase() + status.slice(1)}{" "}
                    <span
                      style={{
                        fontSize: "small",
                        color: "gray",
                        marginLeft: "5px",
                      }}
                    >
                      ({ticketCount})
                    </span>
                  </h3>

                  <p style={{ marginRight: "-140px" }}>
                    <AddButton /> <ThreeDotIcon />
                  </p>
                  <p style={{ marginRight: "10px" }}></p>
                </div>

                {sortedGroupedTickets[status]?.length > 0 ? (
                  sortedGroupedTickets[status].map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))
                ) : (
                  <p></p>
                )}
              </div>
            );
          })}

        {/* {groupBy === "priority" &&
          priorityCategories.map(({ label, value }) => (
            <div key={value} className="kanban-column">
              <div
                style={{
                  display: "flex", // Enable Flexbox layout
                  alignItems: "center", // Center items vertically
                  justifyContent: "space-between", // Space between items (optional)
                }}
              >
                <p style={{ marginRight: "-140px" }}>{categoriesMap2[label]}</p>
                <h3>{label}</h3>
                <p style={{ marginRight: "-140px" }}>
                  <AddButton /> <ThreeDotIcon />
                </p>
                <p style={{ marginRight: "10px" }}></p>
              </div>

              {sortedGroupedTickets[value]?.length > 0 ? (
                sortedGroupedTickets[value].map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))
              ) : (
                <p>No tickets</p>
              )}
            </div>
          ))} */}

        {groupBy === "priority" &&
          priorityCategories.map(({ label, value }) => {
            // Get the count of tickets in the current priority category
            const ticketCount = sortedGroupedTickets[value]?.length || 0;
            {
              console.log("cnt", sortedGroupedTickets);
            }
            return (
              <div key={value} className="kanban-column">
                <div
                  style={{
                    display: "flex", // Enable Flexbox layout
                    alignItems: "center", // Center items vertically
                    justifyContent: "space-between", // Space between items (optional)
                  }}
                >
                  <p style={{ marginRight: "-140px" }}>
                    {categoriesMap2[label]}
                  </p>
                  <h3 style={{ margin: 0 }}>
                    {label}{" "}
                    <span
                      style={{
                        fontSize: "small",
                        color: "gray",
                        marginLeft: "5px",
                      }}
                    >
                      ({ticketCount})
                    </span>
                  </h3>
                  <p style={{ marginRight: "-140px" }}>
                    <AddButton /> <ThreeDotIcon />
                  </p>
                  <p style={{ marginRight: "10px" }}></p>
                </div>

                {sortedGroupedTickets[value]?.length > 0 ? (
                  sortedGroupedTickets[value].map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))
                ) : (
                  <p>No tickets</p>
                )}
              </div>
            );
          })}

        {groupBy === "user" &&
          Object.keys(users).map((userId) => {
            const ticketCount =
              sortedGroupedTickets[users[userId]]?.length || 0;
            return (
              <div key={userId} className="kanban-column">
                <div
                  style={{
                    display: "flex", // Enable Flexbox layout
                    alignItems: "center", // Center items vertically
                    justifyContent: "space-between", // Space between items (optional)
                  }}
                >
                  <h3 style={{ margin: 0 }}>
                    {" "}
                    {users[userId]}{" "}
                    <span
                      style={{
                        fontSize: "small",
                        color: "gray",
                        marginLeft: "5px",
                      }}
                    >
                      ({ticketCount})
                    </span>
                  </h3>
                  <p style={{ marginRight: "-140px" }}>
                    <AddButton /> <ThreeDotIcon />
                  </p>
                  <p style={{ marginRight: "10px" }}></p>
                </div>

                {sortedGroupedTickets[users[userId]]?.length > 0 ? (
                  sortedGroupedTickets[users[userId]].map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))
                ) : (
                  <p></p>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default KanbanBoard;
