import React, { useState, useEffect } from "react";
import AppDrawer from "../../components/AppDrawer";
import CircularProgress from '@mui/material/CircularProgress';
import "./Report_Page.css";
import TableView from '../../components/Report/TableView';
import qs from 'qs';
import axios from 'axios';

export default function Report_Page() {
  const [State, setState] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userCode, setUserCode] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [viewReportClicked, setViewReportClicked] = useState(false);
  const [combinedAnswers, setCombinedAnswers] = useState({ answers: [] });
  const [loading, setLoading] = useState(true);
  

  const fetchUserCode = async () => {
    setLoadingLogin(true);
    const TOKEN = 'drishtee';
    const FCMID = "";

    try {
      const loginResponse = await axios.post(
        `https://bcadmin.drishtee.in/api/Login`,
        qs.stringify({ username, password, token: TOKEN, FCMID }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      if (loginResponse.status === 200) {
        const usercode = loginResponse.data.Data[0].modified_by;
        setUserCode(usercode);
      } else {
        throw new Error(loginResponse.data.message || "Login request failed");
      }
    } catch (error) {
      console.error("Error fetching user code:", error);
    } finally {
      setLoadingLogin(false);
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      setLoadingItems(true);
      try {
        const response = await axios.get(
          `https://bcadmin.drishtee.in/api/GetCSPUser/GetCSPUserLists?userid=${userCode}`,
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        if (response.status === 200 && response.data.Data2) {
          setItems(response.data.Data2.map(item => ({
            value: item.cspcode,
            label: item.cspname
          })));
        } else if (response.data.Message === "No records found") {
          console.warn("No records found");
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoadingItems(false);
      }
    };

    if (userCode) {
      fetchItems();
    }
  }, [userCode]);

  const handleSelect = (event) => {
    const value = event.target.value;
    setSelectedItem(value);
    console.log("Selected item:", value); // Logs the new value directly
  };
  
  

  // const renderItem = async () => {
  //   try {
  //     console.log("Fetching data...");
  //     const response = await fetch('http://testinterns.drishtee.in/forms/cspreport', {
  //       method: 'POST',
  //       body: JSON.stringify({ cspCode: selectedItem }),
  //     });
  //     const json = await response.json();
  //     if (response.ok) {
  //       const combinedAnswers = json
  //         .filter(Boolean)
  //         .flatMap(response => response.answers || []);
  //       setCombinedAnswers({ answers: combinedAnswers });
  //     } else {
  //       console.error(`Form response error:`, json.message || response.statusText);
  //     }
  //   } catch (error) {
  //     console.error(`Error fetching responses`, error);
  //   } finally {
  //     console.log("Setting loading to false");
  //     setLoading(false);
  //   }
  //   setViewReportClicked(true);
  // };

  const renderItem = async () => {
    if (!selectedItem) {
      alert("Please select an item before fetching the report!");
      return;
    }
  
    try {
      console.log("Fetching data for CSP Code:", selectedItem);
      const response = await fetch('http://testinterns.drishtee.in/forms/cspreport', {
        method: 'POST',
        // headers: {
        //   'Content-Type': 'application/json',
        // },
        body: JSON.stringify({ cspCode: selectedItem }),
      });
  
      const json = await response.json();
  
      if (response.ok) {
        // Flatten and deduplicate answers
        const combinedAnswers = Array.from(
          new Set(
            json.flatMap(response => response.answers || [])
          )
        );
        console.log(json);
        console.log(combinedAnswers)
        setCombinedAnswers({ answers: combinedAnswers });
      }  else {
        console.error(`Form response error:`, json.message || response.statusText);
      }
    } catch (error) {
      console.error(`Error fetching responses`, error);
    } finally {
      setLoading(false);
    }
    setViewReportClicked(true);
  };
  
  
  
  

  return (
    <div className="mainContainer" style={{ marginLeft: State ? "20%" : 0 }}>
      <AppDrawer onChange={setState} />

      <div className="upperDiv">
        <div className="detailsContainer" style={{ position: 'relative' }}>
          <input
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter the Email of CSP holder"
            style={{
              width: '30%',
              padding: '10px 15px',
              borderRadius: '1rem',
              border: '1px solid #ccc',
              outline: 'none',
              fontSize: '14px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'box-shadow 0.3s ease',
            }}
            onFocus={(e) => (e.target.style.boxShadow = '0 4px 8px rgba(0, 128, 255, 0.4)')}
            onBlur={(e) => (e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)')}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            style={{
              width: '30%',
              padding: '10px 15px',
              borderRadius: '1rem',
              border: '1px solid #ccc',
              outline: 'none',
              fontSize: '14px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'box-shadow 0.3s ease',
            }}
            onFocus={(e) => (e.target.style.boxShadow = '0 4px 8px rgba(0, 128, 255, 0.4)')}
            onBlur={(e) => (e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)')}
          />
          <button className="btn" onClick={fetchUserCode}>Fetch Data</button>

          {loadingLogin && (
            <CircularProgress
              size={24}
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
              }}
            />
          )}
          {!loadingLogin && loadingItems && (
            <CircularProgress
              size={24}
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
              }}
            />
          )}

          {!loadingLogin && !loadingItems && (
            <select
              className="dropDown"
              id="dropdown"
              value={selectedItem}
              onChange={handleSelect}
              style={{
                width: '200px',
                padding: '10px',
                borderRadius: '1rem',
                border: '1px solid #ccc',
                fontSize: '14px',
                backgroundColor: '#f8f9fa',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                outline: 'none',
                transition: 'box-shadow 0.3s ease, background-color 0.3s ease',
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = '0 4px 8px rgba(0, 128, 255, 0.4)';
                e.target.style.backgroundColor = '#e0f7fa';
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                e.target.style.backgroundColor = '#f8f9fa';
              }}
            >
              <option value="">Select an option</option>
              {items.map((item, index) => (
                <option key={index} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          )}
        </div>
        <button className="btn" onClick={renderItem}>View report</button>

        {/* Conditionally render TableView */}
        {viewReportClicked && combinedAnswers && (
          <TableView answers={combinedAnswers} />
        )}
      </div>
    </div>
  );
}
