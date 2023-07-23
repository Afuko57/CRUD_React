import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTable = async () => {
    try {
      const response = await fetch('http://localhost:3000/users');
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const userCreate = async () => {
    Swal.fire({
      title: 'Create user',
      html: `
        <input id="id" class="swal2-input" placeholder="ID">
        <input id="fname" class="swal2-input" placeholder="First">
        <input id="lname" class="swal2-input" placeholder="Last">
        <input id="username" class="swal2-input" placeholder="Username">
        <input id="email" class="swal2-input" placeholder="Email">
        <input id="avatar" class="swal2-input" placeholder="Avatar">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const id = document.getElementById('id').value;
        const fname = document.getElementById('fname').value;
        const lname = document.getElementById('lname').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const avatar = document.getElementById('avatar').value;

        const newUser = {
          id: parseInt(id),
          fname,
          lname,
          username,
          email,
          avatar,
        };

        createUser(newUser);
      },
    });
  };

  const createUser = async (user) => {
    try {
      const response = await fetch('http://localhost:3000/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.status === 200) {
        const data = await response.json();
        Swal.fire(data.message);
        loadTable();
      } else {
        console.error('Failed to create user:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  useEffect(() => {
    loadTable();
  }, []);

  return (
    <div className="container">
      <div className="d-flex bd-highlight mb-3">
        <div className="me-auto p-2 bd-highlight">
          <h2>Users</h2>
        </div>
        <div className="p-2 bd-highlight">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => userCreate()}
          >
            Create
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Avatar</th>
              <th scope="col">First</th>
              <th scope="col">Last</th>
              <th scope="col">Username</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <th scope="row" colSpan="5">
                  Loading...
                </th>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <th scope="row">{user.id}</th>
                  <td>
                    <img
                      width="50px"
                      src={user.avatar}
                      alt="Avatar"
                      className="avatar"
                    />
                  </td>
                  <td>{user.fname}</td>
                  <td>{user.lname}</td>
                  <td>{user.username}</td>
                  <td>
                    {/* <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => showUserEditBox(user.id)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => userDelete(user.id)}
                    >
                      Del
                    </button> */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div className="App">
      <nav className="navbar navbar-dark bg-mynav">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            My App
          </a>
        </div>
      </nav>
      <UserTable />
    </div>
  );
};

export default App;
