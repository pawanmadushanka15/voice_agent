import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "./api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

function Admin() {
  const [appointments, setAppointments] = useState([]);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [servicesData, setServicesData] = useState([]);
  const [datesData, setDatesData] = useState([]);

  const loadAppointments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/appointments`);
      setAppointments(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAnalytics = async () => {
    try {
      const [totalRes, servicesRes, datesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/analytics/total`),
        axios.get(`${API_BASE_URL}/analytics/services`),
        axios.get(`${API_BASE_URL}/analytics/dates`),
      ]);
      setTotalAppointments(totalRes.data.total);
      setServicesData(servicesRes.data);
      setDatesData(datesRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAppointment = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/appointments/${id}`);
      loadAppointments();
      loadAnalytics();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAppointments();
    loadAnalytics();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8">Admin Dashboard</h1>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Total Appointments Card */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col justify-center items-center border">
          <h2 className="text-xl text-gray-500 font-semibold mb-2">Total Appointments</h2>
          <p className="text-5xl font-bold text-blue-600">{totalAppointments}</p>
        </div>

        {/* Services Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6 border">
          <h2 className="text-xl font-semibold mb-4 text-center">Appointments by Service</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={servicesData}
                  dataKey="count"
                  nameKey="service"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {servicesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dates Bar Chart */}
        <div className="bg-white rounded-lg shadow p-6 border">
          <h2 className="text-xl font-semibold mb-4 text-center">Appointments by Date</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Appointments Table Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden border">
        <h2 className="text-2xl font-bold p-6 bg-gray-50 border-b">All Appointments</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-4 border-b">Customer</th>
                <th className="p-4 border-b">Service</th>
                <th className="p-4 border-b">Date</th>
                <th className="p-4 border-b">Time</th>
                <th className="p-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">No appointments found.</td>
                </tr>
              ) : (
                appointments.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 border-b last:border-0">
                    <td className="p-4">{item.customer}</td>
                    <td className="p-4">{item.service}</td>
                    <td className="p-4">{item.date}</td>
                    <td className="p-4">{item.time}</td>
                    <td className="p-4">
                      <button
                        onClick={() => deleteAppointment(item._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Admin;