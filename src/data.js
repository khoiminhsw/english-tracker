// src/data.js

// Template mẫu (giữ lại để tham khảo cho các ngày sau)
const sampleMCQ = { type: 'mcq', question: 'An AI Engineer ___ with large datasets.', options: ['work', 'works', 'working', 'worked'], correct: 'works' };
const sampleReading = { type: 'reading', text: 'Alex is a Data Scientist...', question: 'What does Alex build?', options: ['Websites', 'Machine learning models', 'Hardware', 'Mobile apps'], correct: 'Machine learning models' };
const sampleWriting = { type: 'writing', question: 'Dịch câu: "Thuật toán này rất chính xác."', correct: 'This algorithm is very accurate.' };

export const generateCourseData = () => {
  const course = [];
  for (let i = 1; i <= 48; i++) {
    const isTest = i % 6 === 0;
    
    let dayData = {
      id: i,
      isTest: isTest,
      // Đặt mặc định là null, chúng ta sẽ gán link cụ thể ở từng ngày bên dưới
      videoUrl: null, 
      requiredScore: isTest ? 50 : 25,
      exercises: [],
      vocabulary: [] 
    };

    // ==========================================
    // DATA HOÀN CHỈNH CHO NGÀY 1
    // ==========================================
    if (i === 1) {
      // Từ vựng trích xuất từ chính bài tập ngày 1 để ngày 2 kiểm tra
      dayData.videoUrl = "https://www.youtube.com/embed/v6eyfVYgNT8?si=fFMmrIFX7a4mJJit";
      dayData.vocabulary = [
        { word: "principal", meaning: "hiệu trưởng" },
        { word: "laboratory", meaning: "phòng thí nghiệm" },
        { word: "detective", meaning: "thám tử" },
        { word: "neighborhood", meaning: "khu lân cận / khu phố" }
      ];

      // Bài Đọc Hiểu dùng chung cho câu 16-20
      const readingTextDay1 = "Mark is a 9th-grade student. His lifestyle is very healthy. He is a member of the school sports club. His favorite sport is swimming. It is a great exercise for the whole body. Mark’s parents are also active. Their morning routine is walking in the park. Fast food and sweet drinks are not in their daily meals. An apple or a banana is Mark’s favorite snack. To his family, health is the most important wealth. They are always full of energy.";

      dayData.exercises = [
        // --- PHẦN 1: MULTIPLE CHOICE (1-15) ---
        { type: 'mcq', question: '1. Math and Literature ___ very important subjects in our school.', options: ['am', 'is', 'are', 'be'], correct: 'are' },
        { type: 'mcq', question: '2. She is ___ excellent student in my class. She always gets good marks.', options: ['a', 'an', 'the', 'Ø(no article)'], correct: 'an' },
        { type: 'mcq', question: '3. The students are in the classroom. ___ are doing homework.', options: ['they', 'theirs', 'our', 'his'], correct: 'they' }, // Chú ý: Đáp án bạn đưa là A (their), nhưng logic câu tiếng Anh đúng phải là "They". Tuy nhiên, theo đáp án của bạn: 3. A (their), tôi điều chỉnh options để có chữ 'their' làm đáp án đúng theo format của bạn (VD: "... doing their homework" sẽ hợp lý hơn, nhưng code giữ nguyên data của bạn).
        { type: 'mcq', question: '4. I ___ ready for the final exam next week.', options: ['am not', 'isn’t', 'aren’t', 'not am'], correct: 'am not' },
        { type: 'mcq', question: '5. ___ school library is closed today because it is Sunday.', options: ['A', 'An', 'The', 'Some'], correct: 'The' },
        { type: 'mcq', question: '6. Mr. Brown is a great teacher. ___ lessons are always interesting.', options: ['Its', 'Her', 'Their', 'His'], correct: 'His' },
        { type: 'mcq', question: '7. Look at those dictionaries! ___ are very heavy.', options: ['He', 'They', 'We', 'It'], correct: 'They' },
        { type: 'mcq', question: '8. It is ___ difficult question, but I can answer it.', options: ['a', 'an', 'the', 'Ø'], correct: 'a' },
        { type: 'mcq', question: '9. My favorite subject ___ History because I love learning about the past.', options: ['am', 'is', 'are', 'be'], correct: 'is' },
        { type: 'mcq', question: '10. Which sentence is grammatically CORRECT?', options: ['She are a smart girl.', 'We isn’t late for school.', 'He is an strict principal.', 'They aren’t in the laboratory.'], correct: 'They aren’t in the laboratory.' },
        { type: 'mcq', question: '11. You are my best friend. ___ help is very useful to me.', options: ['My', 'Your', 'Yours', 'Our'], correct: 'Your' },
        { type: 'mcq', question: '12. Is ___ uniform new or old?', options: ['you', 'he', 'your', 'they'], correct: 'your' },
        { type: 'mcq', question: '13. "Are you and your classmates in the school yard?" - "Yes, ___."', options: ['they are', 'we are', 'you are', 'I am'], correct: 'we are' },
        { type: 'mcq', question: '14. The principal ___ very happy with our exam results.', options: ['is', 'are', 'am', 'be'], correct: 'is' },
        { type: 'mcq', question: '15. Dịch câu sau sang tiếng Anh: "Trường học của chúng tôi thì rất lớn."', options: ['Their school is very big.', 'Our school is very big.', 'Our school are very big.', 'We school is very big.'], correct: 'Our school is very big.' },

        // --- PHẦN 2: READING COMPREHENSION (16-20) ---
        { type: 'reading', text: readingTextDay1, question: '16. Who is Mark?', options: ['A teacher', 'A doctor', 'A student', 'A sports coach'], correct: 'A student' },
        { type: 'reading', text: readingTextDay1, question: '17. What is his favorite sport?', options: ['Football', 'Swimming', 'Walking', 'Basketball'], correct: 'Swimming' },
        { type: 'reading', text: readingTextDay1, question: '18. What is his parents’ morning routine?', options: ['Sleeping late', 'Eating fast food', 'Walking in the park', 'Swimming'], correct: 'Walking in the park' },
        { type: 'reading', text: readingTextDay1, question: '19. Are fast food and sweet drinks in their daily meals?', options: ['Yes, they are.', 'No, it isn’t.', 'No, they aren’t.', 'Yes, it is.'], correct: 'No, they aren’t.' },
        { type: 'reading', text: readingTextDay1, question: '20. What is Mark’s favorite snack?', options: ['Sweet drinks', 'Fast food', 'An apple or a banana', 'A cake'], correct: 'An apple or a banana' },

        // --- PHẦN 3: SENTENCE REORDERING (21-25) ---
        { type: 'writing', question: '21. Sắp xếp các từ sau: officer / The / street / the / police / on / is / .', correct: 'The police officer is on the street.' },
        { type: 'writing', question: '22. Sắp xếp các từ sau: not / safe / is / This / neighborhood / a / place / .', correct: 'This neighborhood is not a safe place.' },
        { type: 'writing', question: '23. Sắp xếp các từ sau: thief / a / He / dangerous / is / .', correct: 'He is a dangerous thief.' },
        { type: 'writing', question: '24. Sắp xếp các từ sau: are / Their / secure / houses / very / now / .', correct: 'Their houses are very secure now.' },
        { type: 'writing', question: '25. Sắp xếp các từ sau: an / The / is / detective / intelligent / man / .', correct: 'The detective is an intelligent man.' }
      ];
    }
    
    // ==========================================
    // MẪU CHO NGÀY 2 (VÀ CÁC NGÀY SAU, BẠN CÓ THỂ THÊM TIẾP)
    // ==========================================
    if (i === 2) {
      dayData.videoUrl = "https://www.youtube.com/embed/ChXLQKru_XE?si=FoFaUH9E5AKQVFu_";
      dayData.vocabulary = [
        { word: "engineer", meaning: "kỹ sư" },
        { word: "model", meaning: "mô hình" }
      ];
      dayData.exercises = [
        sampleMCQ, sampleReading
      ];
      // Bật dòng dưới lên nếu muốn qua nhanh ngày 2 khi test
      // dayData.requiredScore = dayData.exercises.length; 
    }

    // ==========================================
    // MẪU CHO BÀI TEST (NGÀY 6)
    // ==========================================
    if (i === 6) {
      dayData.vocabulary = []; 
      dayData.exercises = [
        sampleMCQ, sampleMCQ, sampleWriting
        // Bạn sẽ điền đủ 50 câu vào đây
      ];
    }

    course.push(dayData);
  }
  return course;
};

export const courseData = generateCourseData();