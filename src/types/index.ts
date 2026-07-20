export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'student' | 'admin';
  onboarding_complete: boolean;
}

export interface StudentProfile extends User {
  program: string;
  level: string;
  interests: string[];
  gpa: string | null;
  completed_course_ids: number[];
  interaction_count: number;
}

export interface Department {
  id: number;
  name: string;
  code: string;
}

export interface Course {
  id: number;
  code: string;
  title: string;
  description: string;
  credits: number;
  level: string;
  department: Department;
  tags: string[];
  prerequisite_ids: number[];
  is_active: boolean;
}

export type RecommendationType = 'CF' | 'CBF' | 'HYBRID';

export interface Recommendation {
  id: number;
  rank: number;
  score: number;
  recommendation_type: RecommendationType;
  rationale: string;
  course: Pick<Course, 'id' | 'code' | 'title' | 'credits' | 'tags'> & { department: string };
  feedback?: { rating: 1 | -1 } | null;
}

export interface RecommendationsResponse {
  student_id: number;
  is_cold_start: boolean;
  w_weight: number;
  generated_at: string;
  recommendations: Recommendation[];
}

export interface EngineSettings {
  hybrid_weight: number;
  top_n: number;
  cold_start_threshold: number;
  updated_at: string;
}

export interface AnalyticsData {
  summary: {
    total_students: number;
    active_students_30d: number;
    total_recommendations_generated: number;
    positive_feedback_rate: number;
    average_click_through_rate: number;
  };
  accuracy: {
    mae: number;
    rmse: number;
    f1_score: number;
    precision: number;
    recall: number;
  };
  top_recommended_courses: Array<{
    course_id: number;
    title: string;
    recommendation_count: number;
  }>;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  error: string;
  detail: string | Record<string, string[]>;
  code: string;
}

export interface CourseActivity {
  id: number;
  title: string;
  activity_type: 'quiz' | 'page' | 'assignment' | 'url';
  content: string;
  url: string;
  order: number;
  duration_minutes: number | null;
}

export interface CourseModule {
  id: number;
  title: string;
  description: string;
  order: number;
  activity_count: number;
  activities: CourseActivity[];
}

export interface CourseDetail extends Course {
  syllabus_text_excerpt: string;
  modules: CourseModule[];
  prerequisites: Array<{ id: number; code: string; title: string }>;
}
