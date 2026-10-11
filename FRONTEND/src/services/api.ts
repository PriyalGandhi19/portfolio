import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export interface ProjectData {
  id: number;
  title: string;
  description: string;
  tech_stack: string[];
  github_url?: string;
  live_url?: string;
  featured: boolean;
}

export interface SkillData {
  id: number;
  category: string;
  name: string;
  level: number;
}

export const fetchProjects = () => api.get<ProjectData[]>('/projects/').then(res => res.data);
export const fetchSkills = () => api.get<SkillData[]>('/skills/').then(res => res.data);