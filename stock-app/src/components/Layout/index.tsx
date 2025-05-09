import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { styled } from "@mui/system";

const StyledLink = styled(Link)({
  color: "white",
  textDecoration: "none",
  margin: "0 1rem",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' sx={{ flexGrow: 1 }}>
            <StyledLink to='/'>Stock Analytics</StyledLink>
          </Typography>
          <Button color='inherit'>
            <StyledLink to='/'>Stock</StyledLink>
          </Button>
          <Button color='inherit'>
            <StyledLink to='/correlation'>Correlation</StyledLink>
          </Button>
        </Toolbar>
      </AppBar>
      <main>{children}</main>
    </>
  );
}
