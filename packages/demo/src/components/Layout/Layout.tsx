import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import './Layout.scss';

function Layout(props: React.PropsWithChildren<any>): React.ReactElement {
  return (
    <div className="px-3">
      <Navbar variant="dark" expand="lg" className="demo-navbar fixed-top">
        <Navbar.Brand href="#">Curves Demo</Navbar.Brand>
        <Navbar.Toggle aria-controls="layout-navbar-nav" />
        <Navbar.Collapse id="layout-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#intro">Introduction</Nav.Link>
            <Nav.Link href="#curvetypes">Curve Types</Nav.Link>
          </Nav>
          <Nav className="ml-auto">
            <Nav.Link href="http://robertzmay.com/curves-documentation">Documentation</Nav.Link>
            <Nav.Link href="https://www.npmjs.com/package/curves">
              <i className="fab fa-npm" />
            </Nav.Link>
            <Nav.Link href="https://github.com/robertmay2003/curves">
              <i className="fab fa-github" />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div className="layout-children">
        {props.children}
      </div>
    </div>
  );
}

export default Layout;
