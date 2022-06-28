import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { useState } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import { Button, Spinner } from 'react-bootstrap';
import { Graphviz } from 'graphviz-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

function App() {
  const [address, setAddress] = useState('');
  const [graph, setGraph] = useState('graph {}')
  const [loading, setLoading] = useState(false);

  const getGraph = async (e) => {
    setLoading(true);

    try {
      const response = await axios.get(`${BACKEND_URL}/api/graph?address=${address}`)
      if (response.status != 200) {
        console.log("ERROR: %s", response.data);
      }

      setGraph(response.data);
    } catch (error) {
      console.log("ERROR fetching graph: %s", error);
      setGraph(`graph {
        "Unexpected status ${error.response?.status}"
        [style=filled, fillcolor=red, shape=box]
      }`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>AccessControl permissions visualization</h1>
      <div className="inputFields">
        <Form.Control type="text" id="address" placeholder="Contract Address" onChange={e => setAddress(e.target.value)} />
        <Button variant="primary" onClick={getGraph} disabled={loading}>Get</Button>
      </div>
      {loading && <Spinner animation="grow" />}
      <Graphviz dot={graph} />
    </div>
  );
}

export default App;
