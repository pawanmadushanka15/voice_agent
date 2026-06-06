import { useEffect, useState } from "react";
import axios from "axios";

function Admin() {

  const [appointments, setAppointments] =
    useState([]);

  const [stats, setStats] =
    useState(null);

  const loadAppointments =
    async () => {

      const response =
        await axios.get(
          "http://127.0.0.1:8000/appointments"
        );

      setAppointments(
        response.data
      );
    };

  const loadStats =
    async () => {

      const response =
        await axios.get(
          "http://127.0.0.1:8000/dashboard-stats"
        );

      setStats(
        response.data
      );
    };

  const deleteAppointment =
    async (id) => {

      await axios.delete(
        `http://127.0.0.1:8000/appointments/${id}`
      );

      loadAppointments();
      loadStats();
    };

  useEffect(() => {

    loadAppointments();
    loadStats();

  }, []);

  return (

    <div
      style={{
        padding: "30px"
      }}
    >

      <h1>
        Admin Dashboard
      </h1>

      {stats && (

        <div>

          <h3>
            Total Appointments:
            {stats.totalAppointments}
          </h3>

          <h3>
            Haircuts:
            {stats.haircuts}
          </h3>

        </div>

      )}

      <table
        border="1"
        cellPadding="10"
      >

        <thead>

          <tr>

            <th>
              Customer
            </th>

            <th>
              Service
            </th>

            <th>
              Date
            </th>

            <th>
              Time
            </th>

            <th>
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {appointments.map(
            (item) => (

              <tr
                key={item._id}
              >

                <td>
                  {item.customer}
                </td>

                <td>
                  {item.service}
                </td>

                <td>
                  {item.date}
                </td>

                <td>
                  {item.time}
                </td>

                <td>

                  <button
                    onClick={() =>
                      deleteAppointment(
                        item._id
                      )
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>
            )
          )}

        </tbody>

      </table>

    </div>
  );
}

export default Admin;