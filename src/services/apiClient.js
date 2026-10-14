/**
 * Production API Client for Unity College Academic Gateway
 * Handles backend API requests, bearer authentication tokens, and graceful resilience.
 */

const BASE_URL = ''; // Relative path, proxied via Vite to :3001

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('unity_api_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('unity_api_token', token);
    } else {
      localStorage.removeItem('unity_api_token');
    }
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...(options.headers || {})
    };

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (err) {
      console.warn(`[ApiClient] Request to ${endpoint} failed:`, err.message);
      throw err;
    }
  }

  // Auth Methods
  async loginGoogle(payload) {
    const res = await this.request('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (res.token) this.setToken(res.token);
    return res;
  }

  async loginStudent(identifier, password) {
    const res = await this.request('/api/auth/login-student', {
      method: 'POST',
      body: JSON.stringify({ identifier, password })
    });
    if (res.token) this.setToken(res.token);
    return res;
  }

  async loginStaff(email, password) {
    const res = await this.request('/api/auth/login-staff', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.token) this.setToken(res.token);
    return res;
  }

  logout() {
    this.setToken(null);
  }

  // Academic Entities
  async getStudents(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/students${query ? `?${query}` : ''}`);
  }

  async createStudent(studentData) {
    return this.request('/api/students', {
      method: 'POST',
      body: JSON.stringify(studentData)
    });
  }

  async updateStudent(id, studentData) {
    return this.request(`/api/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData)
    });
  }

  async deleteStudent(id) {
    return this.request(`/api/students/${id}`, {
      method: 'DELETE'
    });
  }

  async getCourses() {
    return this.request('/api/courses');
  }

  async toggleEnrollment(courseId, studentId) {
    return this.request(`/api/courses/${courseId}/enroll`, {
      method: 'POST',
      body: JSON.stringify({ studentId })
    });
  }

  async checkInAttendance(studentId, token) {
    return this.request('/api/attendance/check-in', {
      method: 'POST',
      body: JSON.stringify({ studentId, token })
    });
  }

  async toggleLiveSession() {
    return this.request('/api/attendance/session/toggle', {
      method: 'POST'
    });
  }

  async getAuditLogs() {
    return this.request('/api/audit-logs');
  }

  async getStats() {
    return this.request('/api/stats');
  }
}

export const apiClient = new ApiClient();
export default apiClient;
