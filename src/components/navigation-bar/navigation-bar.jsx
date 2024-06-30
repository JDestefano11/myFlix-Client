import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './navigationBar.scss';

export const NavigationBar = ({ user, onLoggedOut }) => {
    return (
        <Navbar bg="dark" expand="lg" variant="dark" className="custom-navbar">
            <Container>
                <Navbar.Brand as={Link} to="/" className="brand-link">
                    Movies App
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {/* Add Links here */}
                    </Nav>
                    <Nav className="ml-auto d-flex align-items-center">
                        {user ? (
                            <>
                                <Link to="/profile" className="text-light me-3">
                                    Profile
                                </Link>
                                <Button variant="outline-light" onClick={onLoggedOut}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login" className="nav-link">
                                    Login
                                </Nav.Link>
                                <Nav.Link as={Link} to="/signup" className="nav-link">
                                    Sign Up
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

