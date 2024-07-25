import Container from "react-bootstrap/Container";
import "../Header.css";

function Header() {
  return (
    <>
      <Container className="headerContainer">
        <div className="headerDiv">Eat Safe Austin</div>
        <p>
          The City of Austin inspects food establishments twice a year to ensure
          food safety. <br />
          Check the scores they received here.
        </p>
      </Container>
    </>
  );
}

export default Header;
