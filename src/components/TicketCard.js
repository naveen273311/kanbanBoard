import React from "react";
import "../style/TicketCard.css"; // Import the CSS file
import { ReactComponent as ThreeDotIcon } from "../assests/3-dot-menu.svg";
const TicketCard = ({ ticket }) => {
  return (
    <div
      className="ticket-card"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start", // Align items to the left
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        backgroundColor: "#fff",
      }}
    >
      <p>{ticket.id}</p>
      <h3>{ticket.title}</h3>
      <div>
        <span
          style={{
            // display: "flex",
            // justifyContent: "center", // Centers horizontally
            alignItems: "center", // Centers vertically
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "5px",
            // width: "50px", // Set width (optional, based on your design)
            // height: "50px", // Set height (optional, based on your design)
          }}
        >
          <ThreeDotIcon style={{ width: "24px", height: "10px" }} />
        </span>

        <span
          style={{
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "5px",
            marginLeft: "5px",
          }}
        >
          {ticket.tag.join(", ")}
        </span>
      </div>
    </div>
  );
};

export default TicketCard;
