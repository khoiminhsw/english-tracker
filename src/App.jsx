// src/App.jsx
import React, { useState, useEffect } from 'react';
import { courseData } from './data';
import Lesson from './Lesson';
import { Flame, Lock, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [unlockedDay, setUnlockedDay] = useState(1);
  const [activeLesson, setActiveLesson] = useState(null);
  const [streak, setStreak] = useState(0);

  // Khởi tạo data từ localStorage khi load web
  useEffect(() => {
    const savedDay = localStorage.getItem('eng_unlockedDay');
    if (savedDay) setUnlockedDay(parseInt(savedDay));

    // Tính toán Streak
    const lastLogin = localStorage.getItem('eng_lastLogin');
    const savedStreak = localStorage.getItem('eng_streak') || 0;
    const today = new Date().toDateString();

    if (lastLogin) {
      const lastDate = new Date(lastLogin);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

      if (diffDays === 1) {
        // Đăng nhập ngày hôm sau -> Tăng streak
        setStreak(parseInt(savedStreak) + 1);
        localStorage.setItem('eng_streak', parseInt(savedStreak) + 1);
      } else if (diffDays > 1) {
        // Mất streak
        setStreak(0);
        localStorage.setItem('eng_streak', 0);
      } else {
        setStreak(parseInt(savedStreak));
      }
    } else {
      setStreak(1);
      localStorage.setItem('eng_streak', 1);
    }
    localStorage.setItem('eng_lastLogin', today);
  }, []);

  const handleCompleteLesson = (dayId) => {
    if (dayId === unlockedDay && dayId < 48) {
      const nextDay = dayId + 1;
      setUnlockedDay(nextDay);
      localStorage.setItem('eng_unlockedDay', nextDay);
    }
    setActiveLesson(null);
    alert("Chúc mừng! Miu đã hoàn thành xuất sắc và mở khóa ngày tiếp theo!");
  };

  // Render màn hình làm bài nếu có activeLesson
  if (activeLesson) {
    const dayData = courseData.find(d => d.id === activeLesson);
    return <Lesson dayData={dayData} onComplete={handleCompleteLesson} onBack={() => setActiveLesson(null)} />;
  }

  // Render Dashboard
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-10 bg-white p-6 rounded-xl shadow-sm border">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">Tiếng Anh là thứ giúp Miu nhìn ra thế giới</h1>
            <p className="text-gray-500 mt-1">Thử thách Tiếng Anh 48 ngày</p>
          </div>
          <div className="flex items-center space-x-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-lg font-bold text-lg border border-orange-200">
            <Flame size={24} className="text-orange-500" />
            <span>{streak} Day Streak</span>
          </div>
        </header>

        {/* Lưới tiến độ 48 ngày */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {courseData.map((day) => {
            const isUnlocked = day.id <= unlockedDay;
            const isCompleted = day.id < unlockedDay;
            const isTest = day.isTest;

            return (
              <button
                key={day.id}
                disabled={!isUnlocked}
                onClick={() => setActiveLesson(day.id)}
                className={`
                  relative p-4 h-32 rounded-xl flex flex-col justify-center items-center border-2 transition-all
                  ${!isUnlocked ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : 
                    isCompleted ? 'bg-green-50 border-green-500 text-green-700 hover:bg-green-100' : 
                    isTest ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-md hover:scale-105' : 
                    'bg-white border-blue-500 text-blue-700 shadow-md hover:scale-105'}
                `}
              >
                {!isUnlocked && <Lock className="absolute top-2 right-2 w-4 h-4 text-gray-300" />}
                {isCompleted && <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-green-500" />}
                
                <span className="text-sm font-semibold opacity-80">{isTest ? 'MAJOR TEST' : 'DAY'}</span>
                <span className="text-3xl font-black">{day.id}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}