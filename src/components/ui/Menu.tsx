import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function CatMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        sx={{
          color: "#222831",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: 1,
          border: "1px solid #E5E7EB",
          borderRadius: "20px",
          padding: "8px 12px",
          ":hover": {
            backgroundColor: "#F7F7F7",
          },
        }}
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        Categories <KeyboardArrowDownIcon />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "basic-button",
          },
        }}
      >
        <MenuItem onClick={handleClose} sx={{ color: "#222831" }}>Accomodation</MenuItem>
        <MenuItem onClick={handleClose} sx={{ color: "#222831" }}>Dining</MenuItem>
        <MenuItem onClick={handleClose} sx={{ color: "#222831" }}>Wellness</MenuItem>
        <MenuItem onClick={handleClose} sx={{ color: "#222831" }}>Entertainments</MenuItem>
      </Menu>
    </div>
  );
}
