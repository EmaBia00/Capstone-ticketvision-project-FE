import React from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import CinemaComponent from "../components/AdminPanel/CinemaComponent";
import FilmComponent from "../components/AdminPanel/FilmCompoent";
import SpettacoloComponent from "../components/AdminPanel/SpettacoloComponent";
import SalaComponent from "../components/AdminPanel/SalaComponent";
import UserComponent from "../components/AdminPanel/UserComponent";
const AdminPanel = () => {
  return (
    <Container className="mt-4">
      <h2>📋 Pannello di Amministrazione</h2>

      {/* Tab navigazione tra le sezioni */}
      <Tabs defaultActiveKey="films" id="admin-panel-tabs" className="mb-3">
        {/* Sezione Film */}
        <Tab eventKey="films" title="Gestione Film">
          <FilmComponent />
        </Tab>

        {/* Sezione Cinema */}
        <Tab eventKey="cinema" title="Gestione Cinema">
          <CinemaComponent />
        </Tab>

        {/* Sezione Sale */}
        <Tab eventKey="sale" title="Gestione Sale">
          <SalaComponent />
        </Tab>

        {/* Sezione Spettacoli */}
        <Tab eventKey="spettacoli" title="Gestione Spettacoli">
          <SpettacoloComponent />
        </Tab>

        <Tab eventKey="utenti" title="Utenti">
          <UserComponent />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AdminPanel;
