export interface Student {
  id: string;
  name: string;
  rollNo: string;
  department: string;
}

export interface Marks {
  math: number;
  science: number;
  english: number;
  history: number;
  computer: number;
}

export interface Result extends Student {
  marks: Marks;
  gpa: number;
  grade: string;
}

export function calculateGrade(marks: Marks): { gpa: number; grade: string } {
  const values = Object.values(marks);
  const average = values.reduce((sum, val) => sum + val, 0) / values.length;
  
  let gpa = (average / 20).toFixed(2); // 0-100 scale to 0-5.0 scale
  let grade = "F";

  if (average >= 90) grade = "A+";
  else if (average >= 80) grade = "A";
  else if (average >= 70) grade = "B";
  else if (average >= 60) grade = "C";
  else if (average >= 50) grade = "D";
  else grade = "F";

  return { gpa: parseFloat(gpa), grade };
}
