import axios from "axios";

const API_BASE = "http://localhost:8080/api/tasks";

const taskService = {
  getAll: () => axios.get(API_BASE),
  getByStatus: (status) => axios.get(API_BASE, { params: { status } }),
  search: (keyword) => axios.get(API_BASE, { params: { search: keyword } }),
  create: (task) => axios.post(API_BASE, task),
  update: (id, task) => axios.put(`${API_BASE}/${id}`, task),
  remove: (id) => axios.delete(`${API_BASE}/${id}`),
};

export default taskService;
