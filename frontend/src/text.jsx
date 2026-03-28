import React from 'react';
import { Container, Navbar, Nav, Button, Card } from 'react-bootstrap';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar 
        expand="lg" 
        style={{ backgroundColor: 'var(--navbar-footer-color)' }}
      >
        <Container>
          <Navbar.Brand 
            href="#home" 
            style={{ color: 'var(--navbar-text)', fontWeight: 'bold' }}
          >
            MoodFM
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link 
                href="#home" 
                style={{ color: 'var(--navbar-text)' }}
              >
                Home
              </Nav.Link>
              <Nav.Link 
                href="#about" 
                style={{ color: 'var(--navbar-text)' }}
              >
                About
              </Nav.Link>
              <Nav.Link 
                href="#contact" 
                style={{ color: 'var(--navbar-text)' }}
              >
                Contact
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-5">
        <div className="text-center mb-5">
          <h1 className="display-4">Welcome to MoodFM</h1>
          <p className="lead">Your React.js application with Bootstrap</p>
        </div>

        <div className="row">
          <div className="col-md-4 mb-4">
            <Card style={{ backgroundColor: 'var(--background-color)', borderColor: 'var(--lines-color)' }}>
              <Card.Body>
                <Card.Title style={{ color: 'var(--text-primary)' }}>Feature One</Card.Title>
                <Card.Text style={{ color: 'var(--text-secondary)' }}>
                  This is a sample card component using React Bootstrap.
                </Card.Text>
                <Button 
                  style={{ backgroundColor: 'var(--color-orange)', borderColor: 'var(--color-orange)' }}
                >
                  Learn More
                </Button>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-4 mb-4">
            <Card style={{ backgroundColor: 'var(--background-color)', borderColor: 'var(--lines-color)' }}>
              <Card.Body>
                <Card.Title style={{ color: 'var(--text-primary)' }}>Feature Two</Card.Title>
                <Card.Text style={{ color: 'var(--text-secondary)' }}>
                  Bootstrap components are now ready to use in your application.
                </Card.Text>
                <Button 
                  style={{ backgroundColor: 'var(--color-green)', borderColor: 'var(--color-green)' }}
                >
                  Get Started
                </Button>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-4 mb-4">
            <Card style={{ backgroundColor: 'var(--background-color)', borderColor: 'var(--lines-color)' }}>
              <Card.Body>
                <Card.Title style={{ color: 'var(--text-primary)' }}>Feature Three</Card.Title>
                <Card.Text style={{ color: 'var(--text-secondary)' }}>
                  Start building your amazing MoodFM application!
                </Card.Text>
                <Button 
                  style={{ backgroundColor: 'var(--color-cyan)', borderColor: 'var(--color-cyan)' }}
                >
                  Explore
                </Button>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default App;
