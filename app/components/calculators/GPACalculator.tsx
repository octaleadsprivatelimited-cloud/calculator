'use client'

import React, { useState, useCallback } from 'react'
import { GraduationCap } from 'lucide-react'

interface Course {
  name: string
  credits: number
  grade: string
}

export default function GPACalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { name: 'Course 1', credits: 3, grade: 'A' }
  ])
  const [showResults, setShowResults] = useState(false)

  const gradeToPoints = (grade: string): number => {
    switch (grade.toUpperCase()) {
      case 'A+': return 4.0
      case 'A': return 4.0
      case 'A-': return 3.7
      case 'B+': return 3.3
      case 'B': return 3.0
      case 'B-': return 2.7
      case 'C+': return 2.3
      case 'C': return 2.0
      case 'C-': return 1.7
      case 'D+': return 1.3
      case 'D': return 1.0
      case 'F': return 0.0
      default: return 0.0
    }
  }

  const calculateGPA = useCallback(() => {
    let totalPoints = 0
    let totalCredits = 0

    courses.forEach(course => {
      const points = gradeToPoints(course.grade)
      totalPoints += points * course.credits
      totalCredits += course.credits
    })

    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0
    const letterGrade = getLetterGrade(gpa)

    return { gpa, totalPoints, totalCredits, letterGrade }
  }, [courses])

  const getLetterGrade = (gpa: number): string => {
    if (gpa >= 3.7) return 'A'
    if (gpa >= 3.3) return 'A-'
    if (gpa >= 3.0) return 'B+'
    if (gpa >= 2.7) return 'B'
    if (gpa >= 2.3) return 'B-'
    if (gpa >= 2.0) return 'C+'
    if (gpa >= 1.7) return 'C'
    if (gpa >= 1.3) return 'C-'
    if (gpa >= 1.0) return 'D+'
    if (gpa >= 0.7) return 'D'
    return 'F'
  }

  const addCourse = () => {
    setCourses([...courses, { name: `Course ${courses.length + 1}`, credits: 3, grade: 'A' }])
  }

  const removeCourse = (index: number) => {
    if (courses.length > 1) {
      setCourses(courses.filter((_, i) => i !== index))
    }
  }

  const updateCourse = (index: number, field: keyof Course, value: string | number) => {
    const newCourses = [...courses]
    newCourses[index] = { ...newCourses[index], [field]: value }
    setCourses(newCourses)
  }

  const handleCalculate = () => {
    setShowResults(true)
  }

  const handleReset = () => {
    setCourses([{ name: 'Course 1', credits: 3, grade: 'A' }])
    setShowResults(false)
  }

  const result = showResults ? calculateGPA() : { gpa: 0, totalPoints: 0, totalCredits: 0, letterGrade: '' }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">GPA Calculator</h1>
            <p className="text-blue-100 text-lg">
              Calculate your Grade Point Average (GPA) from course grades and credits.
            </p>
          </div>
          <div className="hidden md:block">
            <GraduationCap className="w-16 h-16 text-blue-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Courses</h3>
            <button
              onClick={addCourse}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Add Course
            </button>
          </div>

          <div className="space-y-4">
            {courses.map((course, index) => (
              <div key={index} className="grid md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                                     <input
                     type="text"
                     value={course.name}
                     onChange={(e) => updateCourse(index, 'name', e.target.value)}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                     placeholder="Course name"
                     aria-label="Course name"
                   />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
                  <input
                    type="number"
                    value={course.credits}
                    onChange={(e) => updateCourse(index, 'credits', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="6"
                    step="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                  <select
                    value={course.grade}
                    onChange={(e) => updateCourse(index, 'grade', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Select grade"
                  >
                    <option value="A+">A+ (4.0)</option>
                    <option value="A">A (4.0)</option>
                    <option value="A-">A- (3.7)</option>
                    <option value="B+">B+ (3.3)</option>
                    <option value="B">B (3.0)</option>
                    <option value="B-">B- (2.7)</option>
                    <option value="C+">C+ (2.3)</option>
                    <option value="C">C (2.0)</option>
                    <option value="C-">C- (1.7)</option>
                    <option value="D+">D+ (1.3)</option>
                    <option value="D">D (1.0)</option>
                    <option value="F">F (0.0)</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={() => removeCourse(index)}
                    disabled={courses.length === 1}
                    className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleCalculate}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Calculate GPA
          </button>
        </div>

        {showResults && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">GPA Results</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-700">{result.gpa.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">GPA</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-700">{result.letterGrade}</div>
                  <div className="text-sm text-gray-600">Letter Grade</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-700">{result.totalCredits}</div>
                  <div className="text-sm text-gray-600">Total Credits</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-700">{result.totalPoints.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Total Points</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleReset}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
