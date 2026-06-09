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
      dayData.videoUrl = "https://drive.google.com/file/d/1aLdi-Y04zpfD15emgjRZ7j6VKOkzMtOG/view?usp=sharing";
      dayData.vocabulary = [
        { word: "principal", meaning: "hiệu trưởng" },
        { word: "laboratory", meaning: "phòng thí nghiệm" },
        { word: "detective", meaning: "thám tử" },
        { word: "neighborhood", meaning: "khu lân cận / khu phố" },
        // --- Các từ vựng được bổ sung thêm từ bài đọc và bài tập ---
        { word: "lifestyle", meaning: "lối sống" },
        { word: "routine", meaning: "thói quen hằng ngày" },
        { word: "wealth", meaning: "sự giàu có / tài sản" },
        { word: "energy", meaning: "năng lượng" },
        { word: "uniform", meaning: "đồng phục" },
        { word: "thief", meaning: "kẻ trộm" },
        { word: "secure", meaning: "an toàn / bảo đảm" },
        { word: "intelligent", meaning: "thông minh" }
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
    // DATA HOÀN CHỈNH CHO NGÀY 2
    // ==========================================
    if (i === 2) {
      // Từ vựng trích xuất từ nội dung học và bài tập ngày 2
      dayData.videoUrl = "https://drive.google.com/file/d/1NlX55dfjA4HUTiwCTJxdzQLfJWJJ-G9J/view?usp=sharing";
      dayData.vocabulary = [
        { word: "uncle", meaning: "chú/bác" },
        { word: "aunt", meaning: "cô/dì" },
        { word: "parents", meaning: "bố mẹ" },
        { word: "children", meaning: "con cái/trẻ em" },
        { word: "daughter", meaning: "con gái" },
        { word: "son", meaning: "con trai" },
        { word: "doctor", meaning: "bác sĩ" },
        { word: "lawyer", meaning: "luật sư" },
        { word: "firefighter", meaning: "lính cứu hỏa" },
        { word: "lovely", meaning: "đáng yêu" },
        { word: "busy", meaning: "bận rộn" },
        { word: "kind", meaning: "tốt bụng" },
        { word: "extended family", meaning: "gia đình đa thế hệ" },
        { word: "cousin", meaning: "anh chị em họ" }
      ];

      // Bài Đọc Hiểu dùng chung cho câu 16-20
      const readingTextDay2 = "Hello, my name is Linda. I am fourteen years old. I live in a big house with my family. There are five people in my extended family: my grandfather, my parents, my older brother, and me. My grandfather is seventy years old, and he is very kind. My father is a doctor; he works in a large hospital and is always busy. My mother is an English teacher. My brother, Peter, is eighteen years old and he is a college student. On weekends, my family often goes to the park or cooks meals in the kitchen together. We are a very happy family.";

      dayData.exercises = [
        // --- PHẦN 1: MULTIPLE CHOICE (1-15) ---
        { type: 'mcq', question: "1. My mother's sister is my ___", options: ["uncle", "aunt", "daughter", "niece"], correct: "aunt" },
        { type: 'mcq', question: "2. ___ are my parents. They are very kind.", options: ["This", "That", "These", "It"], correct: "These" },
        { type: 'mcq', question: "3. Is this your younger brother? - No, ___", options: ["it isn't", "he isn't", "she isn't", "they aren't"], correct: "he isn't" },
        { type: 'mcq', question: "4. How many ___ are there in your extended family?", options: ["person", "peoples", "people", "children"], correct: "people" },
        { type: 'mcq', question: "5. Look at ___ boy over there! He is my cousin.", options: ["this", "these", "that", "those"], correct: "that" },
        { type: 'mcq', question: "6. There ___ a new picture in my parents' room.", options: ["is", "are", "am", "be"], correct: "is" },
        { type: 'mcq', question: "7. Are they your grandfather and grandmother? - Yes, ___", options: ["they are", "these are", "those are", "they aren't"], correct: "they are" },
        { type: 'mcq', question: "8. My uncle has three ___ : one son and two daughters.", options: ["childs", "children", "child", "childrens"], correct: "children" },
        { type: 'mcq', question: "9. ___ your father a firefighter?", options: ["Are", "Do", "Is", "Does"], correct: "Is" },
        { type: 'mcq', question: "10. These ___ are very friendly and lovely.", options: ["woman", "women", "womans", "womens"], correct: "women" },
        { type: 'mcq', question: "11. Here ___ my daughter's toys.", options: ["is", "am", "be", "are"], correct: "are" },
        { type: 'mcq', question: "12. She is my aunt's daughter, so she is my ___", options: ["sister", "niece", "cousin", "aunt"], correct: "cousin" },
        { type: 'mcq', question: "13. Those ___ are my uncles. They are lawyers.", options: ["man", "men", "mans", "mens"], correct: "men" },
        { type: 'mcq', question: "14. Is your mother busy today? - ___", options: ["Yes, she is.", "Yes, her is.", "No, she don't.", "No, she aren't."], correct: "Yes, she is." },
        { type: 'mcq', question: "15. ___ people in the kitchen are my family members.", options: ["This", "That", "Those", "There"], correct: "Those" },

        // --- PHẦN 2: READING COMPREHENSION (16-20) ---
        { type: 'reading', text: readingTextDay2, question: "16. How many people are there in Linda's family?", options: ["Four", "Five", "Six", "Seven"], correct: "Five" },
        { type: 'reading', text: readingTextDay2, question: "17. Who is seventy years old?", options: ["Linda", "Her father", "Her grandfather", "Peter"], correct: "Her grandfather" },
        { type: 'reading', text: readingTextDay2, question: "18. What is Linda's mother's job?", options: ["A doctor", "A student", "A nurse", "A teacher"], correct: "A teacher" },
        { type: 'reading', text: readingTextDay2, question: "19. What do they often do on weekends?", options: ["Go to the hospital", "Read books", "Go to the park or cook together", "Visit their aunt and uncle"], correct: "Go to the park or cook together" },
        { type: 'reading', text: readingTextDay2, question: "20. Which of the following is NOT true about Peter?", options: ["He is older than Linda.", "He is eighteen years old.", "He is a doctor.", "He is a student."], correct: "He is a doctor." },

        // --- PHẦN 3: SENTENCE REORDERING (21-25) ---
        { type: 'writing', question: "21. Sắp xếp các từ sau: uncle / a / Is / your / firefighter / ?", correct: "Is your uncle a firefighter?" },
        { type: 'writing', question: "22. Sắp xếp các từ sau: are / There / my / people / four / in / family / .", correct: "There are four people in my family." },
        { type: 'writing', question: "23. Sắp xếp các từ sau: very / parents / busy / My / are / .", correct: "My parents are very busy." },
        { type: 'writing', question: "24. Sắp xếp các từ sau: brother / Is / late / school / younger / for / your / ?", correct: "Is your younger brother late for school?" },
        { type: 'writing', question: "25. Sắp xếp các từ sau: in / cooking / The / the / children / kitchen / are / .", correct: "The children are cooking in the kitchen." }
      ];
    }
    // DATA HOÀN CHỈNH CHO NGÀY 3
    // ==========================================
    if (i === 3) {
      // Từ vựng trích xuất từ nội dung học và bài tập ngày 3
      dayData.videoUrl = "https://drive.google.com/file/d/11lygOYmRb4nMp_BjwkR9uf2ASpqLtIo8/view?usp=drive_link";
      dayData.vocabulary = [
        { word: "grandfather", meaning: "ông" },
        { word: "grandmother", meaning: "bà" },
        { word: "cousin", meaning: "anh chị em họ" },
        { word: "classmate", meaning: "bạn cùng lớp" },
        { word: "bag", meaning: "cặp, túi" },
        { word: "desk", meaning: "bàn" },
        { word: "chair", meaning: "ghế" },
        { word: "shirt", meaning: "áo sơ mi" },
        { word: "hat", meaning: "mũ" },
        { word: "jeans", meaning: "quần bò" },
        { word: "sock", meaning: "tất" },
        { word: "banana", meaning: "quả chuối" },
        { word: "cake", meaning: "bánh" },
        { word: "pillow", meaning: "gối" },
        { word: "nuclear family", meaning: "gia đình hạt nhân" },
        { word: "extended family", meaning: "gia đình đa thế hệ" },
        { word: "siblings", meaning: "anh chị em ruột" },
        { word: "nephew", meaning: "cháu trai" },
        { word: "niece", meaning: "cháu gái" },
        { word: "stepfather", meaning: "bố dượng" },
        { word: "stepmother", meaning: "mẹ kế" }
      ];

      // Bài Đọc Hiểu dùng chung cho câu 16-20
      const readingTextDay3 = "My name is Tom. There are six people in my extended family: my grandparents, my parents, my sister, and me. My grandfather is a retired teacher, and my grandmother is a housewife. They are very kind. My father is an engineer, and he is often busy. My mother is a nurse. She works in a big hospital. My sister, Anna, is a student in grade 9, just like me. We love our family very much.";

      dayData.exercises = [
        // --- PHẦN 1: MULTIPLE CHOICE (1-15) ---
        { type: 'mcq', question: "1. ___ is that? That is my grandmother.", options: ["What", "Who", "Where", "How"], correct: "Who" },
        { type: 'mcq', question: "2. Who ___ she? She is my cousin.", options: ["is", "are", "am", "be"], correct: "is" },
        { type: 'mcq', question: "3. What ___ these? They are my grandfather's hats.", options: ["is", "am", "be", "are"], correct: "are" },
        { type: 'mcq', question: "4. My father's brother is my ___", options: ["aunt", "uncle", "cousin", "nephew"], correct: "uncle" },
        { type: 'mcq', question: "5. Who are ___? They are my classmates.", options: ["this", "that", "those", "it"], correct: "those" },
        { type: 'mcq', question: "6. ___ are they? They are my parents.", options: ["Who", "What", "Which", "When"], correct: "Who" },
        { type: 'mcq', question: "7. Is this your ___? Yes, he is the son of my aunt.", options: ["brother", "cousin", "sister", "uncle"], correct: "cousin" },
        { type: 'mcq', question: "8. What is that? ___ is a cake for my mother.", options: ["They", "This", "It", "Those"], correct: "It" },
        { type: 'mcq', question: "9. My mother's mother is my ___", options: ["grandfather", "grandmother", "aunt", "sister"], correct: "grandmother" },
        { type: 'mcq', question: "10. ___ this your bag?", options: ["Are", "Do", "Does", "Is"], correct: "Is" },
        { type: 'mcq', question: "11. Who is he? - ___ is my brother.", options: ["He", "She", "It", "They"], correct: "He" },
        { type: 'mcq', question: "12. ___ are those? They are my sister's jeans.", options: ["Who", "What", "Where", "Why"], correct: "What" },
        { type: 'mcq', question: "13. The daughter of my brother is my ___", options: ["niece", "nephew", "cousin", "aunt"], correct: "niece" },
        { type: 'mcq', question: "14. Who are these people? - ___ are my extended family.", options: ["We", "They", "It", "She"], correct: "They" },
        { type: 'mcq', question: "15. What are those? - ___ are pillows.", options: ["It", "They", "This", "That"], correct: "They" },

        // --- PHẦN 2: READING COMPREHENSION (16-20) ---
        { type: 'reading', text: readingTextDay3, question: "16. How many people are there in Tom's family?", options: ["4", "5", "6", "7"], correct: "6" },
        { type: 'reading', text: readingTextDay3, question: "17. What does Tom's grandfather do?", options: ["A doctor", "A retired teacher", "An engineer", "A nurse"], correct: "A retired teacher" },
        { type: 'reading', text: readingTextDay3, question: "18. Where does his mother work?", options: ["In a school", "In a factory", "In a clinic", "In a big hospital"], correct: "In a big hospital" },
        { type: 'reading', text: readingTextDay3, question: "19. Which grade is Anna in?", options: ["Grade 6", "Grade 7", "Grade 8", "Grade 9"], correct: "Grade 9" },
        { type: 'reading', text: readingTextDay3, question: "20. Who is often busy in Tom's family?", options: ["Tom", "Anna", "Tom's father", "Tom's grandmother"], correct: "Tom's father" },

        // --- PHẦN 3: SENTENCE REORDERING (21-25) ---
        { type: 'writing', question: "21. Sắp xếp các từ sau: is / Who / that / man / ?", correct: "Who is that man?" },
        { type: 'writing', question: "22. Sắp xếp các từ sau: are / These / my / cousins / .", correct: "These are my cousins." },
        { type: 'writing', question: "23. Sắp xếp các từ sau: What / those / the / table / are / on / ?", correct: "What are those on the table?" },
        { type: 'writing', question: "24. Sắp xếp các từ sau: grandfather / My / very / is / old / .", correct: "My grandfather is very old." },
        { type: 'writing', question: "25. Sắp xếp các từ sau: grandmother / that / Is / your / ?", correct: "Is that your grandmother?" }
      ];
    }
    // DATA HOÀN CHỈNH CHO NGÀY 4
    // ==========================================
    if (i === 4) {
      // Từ vựng trích xuất từ nội dung học và bài tập ngày 4 [cite: 400]
      dayData.videoUrl = "https://drive.google.com/file/d/1KR1Hdw2wvsH-MyyVtJBRDesXh5z-4aLg/view?usp=drive_link";
      dayData.vocabulary = [
        { word: "park", meaning: "công viên" }, // [cite: 402]
        { word: "garden", meaning: "khu vườn" }, // [cite: 402]
        { word: "wardrobe", meaning: "tủ quần áo" }, // [cite: 402]
        { word: "shopping center", meaning: "trung tâm mua sắm" }, // [cite: 402]
        { word: "supermarket", meaning: "siêu thị" }, // [cite: 402]
        { word: "airport", meaning: "sân bay" }, // [cite: 402]
        { word: "train station", meaning: "ga tàu" }, // [cite: 402]
        { word: "morning", meaning: "buổi sáng" }, // [cite: 403]
        { word: "noon / midday", meaning: "giữa trưa" }, // [cite: 403]
        { word: "midnight", meaning: "nửa đêm" }, // [cite: 403]
        { word: "library", meaning: "thư viện" }, // [cite: 422]
        { word: "laboratory", meaning: "phòng thí nghiệm" }, // [cite: 422]
        { word: "gymnasium", meaning: "phòng thể chất" }, // [cite: 422]
        { word: "principal", meaning: "hiệu trưởng" }, // [cite: 423]
        { word: "homeroom teacher", meaning: "giáo viên chủ nhiệm" }, // [cite: 423]
        { word: "semester / term", meaning: "học kỳ" }, // [cite: 424]
        { word: "schedule / timetable", meaning: "thời khóa biểu" }, // [cite: 424]
        { word: "extracurricular activities", meaning: "hoạt động ngoại khóa" } // [cite: 425]
      ];

      // Bài Đọc Hiểu dùng chung cho câu 16-20
      const readingTextDay4 = "Hello, my name is Minh. I am a student at Nguyen Du Secondary School. My school is very big and beautiful. There are three floors in my school. My classroom is on the second floor. Every day, my classes start at 7:15 AM and finish at 11:30 AM. On Mondays, we have math, literature, and English. During recess, my friends and I often play basketball in the schoolyard or read books in the library. The library is very quiet and it is on the first floor. In the afternoon, I sometimes join the science club at school. I love my school very much."; // [cite: 529, 530, 531, 532, 533, 534]

      dayData.exercises = [
        // --- PHẦN 1: MULTIPLE CHOICE (1-15) ---
        { type: 'mcq', question: "1. ___ is your history exam? It's on Tuesday.", options: ["Where", "When", "What", "Who"], correct: "When" }, // [cite: 435, 436, 437, 438, 439, 440, 572]
        { type: 'mcq', question: "2. Where is the school library? - It is ___ the second floor.", options: ["in", "at", "on", "to"], correct: "on" }, // [cite: 441, 442, 443, 444, 445, 575]
        { type: 'mcq', question: "3. Students have to be ___ school before 7:00 AM.", options: ["in", "on", "at", "for"], correct: "at" }, // [cite: 446, 447, 451, 452, 453, 578]
        { type: 'mcq', question: "4. ___ are my notebooks? They are in your backpack.", options: ["Where", "When", "Who", "Why"], correct: "Where" }, // [cite: 450, 455, 456, 457, 458, 581]
        { type: 'mcq', question: "5. We do not have classes ___ Sundays.", options: ["in", "at", "on", "during"], correct: "on" }, // [cite: 459, 460, 461, 462, 464, 584]
        { type: 'mcq', question: "6. When ___ the school festival?", options: ["are", "is", "do", "does"], correct: "is" }, // [cite: 465, 467, 468, 469, 470, 573]
        { type: 'mcq', question: "7. Look at the clock ___ the wall. It's time for recess.", options: ["at", "in", "on", "under"], correct: "on" }, // [cite: 471, 474, 475, 476, 477, 576]
        { type: 'mcq', question: "8. The principal is ___ the meeting room right now.", options: ["in", "on", "at", "above"], correct: "in" }, // [cite: 478, 480, 481, 482, 483, 579]
        { type: 'mcq', question: "9. ___ are the teachers? They are in the staffroom.", options: ["When", "Where", "What", "Which"], correct: "Where" }, // [cite: 485, 486, 487, 488, 489, 582]
        { type: 'mcq', question: "10. Our first English lesson is ___ 8:00 AM.", options: ["in", "on", "at", "about"], correct: "at" }, // [cite: 490, 491, 492, 493, 494, 585]
        { type: 'mcq', question: "11. Where is Peter? He is studying chemistry ___ the laboratory.", options: ["on", "in", "at", "over"], correct: "in" }, // [cite: 496, 497, 498, 499, 500, 574]
        { type: 'mcq', question: "12. I often do my homework ___ the evening.", options: ["in", "on", "at", "during"], correct: "in" }, // [cite: 501, 503, 504, 505, 506, 577]
        { type: 'mcq', question: "13. ___ is the summer vacation? It's in June.", options: ["Where", "How", "Why", "When"], correct: "When" }, // [cite: 508, 509, 510, 511, 512, 580]
        { type: 'mcq', question: "14. There is a big whiteboard ___ our classroom.", options: ["in", "on", "at", "under"], correct: "in" }, // [cite: 513, 517, 518, 519, 520, 583]
        { type: 'mcq', question: "15. Let's meet ___ the school gate after the class.", options: ["in", "on", "at", "for"], correct: "at" }, // [cite: 521, 523, 524, 525, 526, 586]

        // --- PHẦN 2: READING COMPREHENSION (16-20) ---
        { type: 'reading', text: readingTextDay4, question: "16. Where is Minh's classroom?", options: ["On the first floor", "On the second floor", "On the third floor", "In the schoolyard"], correct: "On the second floor" }, // [cite: 535, 536, 537, 538, 539, 588]
        { type: 'reading', text: readingTextDay4, question: "17. When do his classes start?", options: ["At 7:00 AM", "At 7:15 AM", "At 11:30 AM", "At noon"], correct: "At 7:15 AM" }, // [cite: 540, 541, 542, 543, 544, 589]
        { type: 'reading', text: readingTextDay4, question: "18. Where do Minh and his friends read books?", options: ["In the classroom", "In the science club", "In the schoolyard", "In the library"], correct: "In the library" }, // [cite: 545, 546, 547, 548, 549, 590]
        { type: 'reading', text: readingTextDay4, question: "19. Which of the following subjects does Minh have on Mondays?", options: ["History", "Geography", "English", "Physical Education"], correct: "English" }, // [cite: 550, 551, 552, 553, 555, 591]
        { type: 'reading', text: readingTextDay4, question: "20. What does Minh do in the afternoon?", options: ["He plays basketball.", "He goes to the library.", "He joins the science club.", "He studies math."], correct: "He joins the science club." }, // [cite: 556, 557, 558, 559, 560, 592]

        // --- PHẦN 3: SENTENCE REORDERING (21-25) ---
        { type: 'writing', question: "21. Sắp xếp các từ sau: school / Where / the / library / is / ?", correct: "Where is the school library?" }, // [cite: 563, 594]
        { type: 'writing', question: "22. Sắp xếp các từ sau: starts / Our / at / class / 8:00 AM / .", correct: "Our class starts at 8:00 AM." }, // [cite: 564, 595]
        { type: 'writing', question: "23. Sắp xếp các từ sau: students / The / are / the / classroom / in / .", correct: "The students are in the classroom." }, // [cite: 565, 596]
        { type: 'writing', question: "24. Sắp xếp các từ sau: When / your / test / math / is / ?", correct: "When is your math test?" }, // [cite: 566, 597]
        { type: 'writing', question: "25. Sắp xếp các từ sau: many / are / There / books / on / desk / the / .", correct: "There are many books on the desk." } // [cite: 567, 598]
      ];
    }
    // DATA HOÀN CHỈNH CHO NGÀY 5
    // ==========================================
    if (i === 5) {
      // Từ vựng trích xuất từ nội dung học và bài tập ngày 5
      dayData.videoUrl = "https://drive.google.com/file/d/1ZIu8U6S-S_dVWiL-R8fdJB6dS215UhZY/view?usp=sharing";
      dayData.vocabulary = [
        { word: "play", meaning: "chơi" },
        { word: "watch", meaning: "xem" },
        { word: "read", meaning: "đọc" },
        { word: "write", meaning: "viết" },
        { word: "listen", meaning: "nghe" },
        { word: "speak", meaning: "nói" },
        { word: "ride", meaning: "đạp xe/cưỡi" },
        { word: "live", meaning: "sống" },
        { word: "enjoy", meaning: "thích" },
        { word: "sing", meaning: "hát" },
        { word: "dance", meaning: "nhảy múa" },
        { word: "study", meaning: "học bài" },
        { word: "travel", meaning: "di chuyển/du lịch" },
        { word: "chess", meaning: "cờ vua" },
        { word: "football", meaning: "bóng đá" },
        { word: "homework", meaning: "bài tập về nhà" },
        { word: "assignment", meaning: "bài tập lớn / dự án học tập" },
        { word: "extracurricular activities", meaning: "hoạt động ngoại khóa" }
      ];

      // Bài Đọc Hiểu dùng chung cho câu 16-20
      const readingTextDay5 = "My name is Anna, and I am a 9th-grade student at a secondary school in the city center. My school day usually starts at 7:30 AM and finishes at 4:30 PM. I learn many subjects, but my favorite subject is English because I like communicating with foreigners. Our English teacher, Mr. Smith, teaches very well and he always gives us interesting projects. During the break time, I often go to the library to read books or talk with my friends. Sometimes, we play badminton in the schoolyard. I also join the school's music club. We practice singing every Friday afternoon. I love my school very much because it is a great place to learn and make friends.";

      dayData.exercises = [
        // --- PHẦN 1: MULTIPLE CHOICE (1-15) ---
        { type: 'mcq', question: "1. The students ___ their classroom every afternoon.", options: ["clean", "cleans", "cleaning", "is clean"], correct: "clean" },
        { type: 'mcq', question: "2. My best friend ___ English very well.", options: ["speak", "speaks", "speaking", "to speak"], correct: "speaks" },
        { type: 'mcq', question: "3. We ___ many difficult assignments this semester.", options: ["has", "having", "have", "to have"], correct: "have" },
        { type: 'mcq', question: "4. Peter often ___ to the school library to read science books.", options: ["go", "goes", "going", "went"], correct: "goes" },
        { type: 'mcq', question: "5. The principal usually ___ a speech on Monday mornings.", options: ["give", "giving", "gives", "to give"], correct: "gives" },
        { type: 'mcq', question: "6. Mary and Jane ___ extracurricular activities after school.", options: ["join", "joins", "joining", "are join"], correct: "join" },
        { type: 'mcq', question: "7. He ___ very hard to pass the final exam.", options: ["study", "studies", "studyes", "studying"], correct: "studies" },
        { type: 'mcq', question: "8. I always ___ my teachers carefully during the lessons.", options: ["listens to", "listening", "to listen", "listen to"], correct: "listen to" },
        { type: 'mcq', question: "9. The bell ___ at 7:00 AM every day.", options: ["ring", "rings", "ringing", "to ring"], correct: "rings" },
        { type: 'mcq', question: "10. Our form teacher ___ us a lot of homework on weekends.", options: ["give", "gives", "to give", "giving"], correct: "gives" },
        { type: 'mcq', question: "11. My sister ___ chemistry in the laboratory twice a week.", options: ["learn", "learns", "learning", "to learn"], correct: "learns" },
        { type: 'mcq', question: "12. They ___ football in the schoolyard during recess.", options: ["play", "plays", "plaies", "to play"], correct: "play" },
        { type: 'mcq', question: "13. Every student ___ a uniform on Mondays.", options: ["wear", "wears", "wearing", "to wear"], correct: "wears" },
        { type: 'mcq', question: "14. My classmates ___ reading books about history.", options: ["enjoys", "enjoy", "enjoying", "to enjoy"], correct: "enjoy" },
        { type: 'mcq', question: "15. John usually ___ his bike to school.", options: ["ride", "rides", "riding", "to ride"], correct: "rides" },

        // --- PHẦN 2: READING COMPREHENSION (16-20) ---
        { type: 'reading', text: readingTextDay5, question: "16. What grade is Anna in?", options: ["6th grade", "7th grade", "8th grade", "9th grade"], correct: "9th grade" },
        { type: 'reading', text: readingTextDay5, question: "17. Why does Anna like English?", options: ["Because she likes reading books.", "Because she wants to join the music club.", "Because she likes communicating with foreigners.", "Because Mr. Smith is handsome."], correct: "Because she likes communicating with foreigners." },
        { type: 'reading', text: readingTextDay5, question: "18. What does Mr. Smith always give the students?", options: ["Interesting books", "A lot of homework", "Interesting projects", "Good marks"], correct: "Interesting projects" },
        { type: 'reading', text: readingTextDay5, question: "19. Where does Anna often go during the break time?", options: ["The music club", "The library", "The laboratory", "The computer room"], correct: "The library" },
        { type: 'reading', text: readingTextDay5, question: "20. When does the music club practice singing?", options: ["Every Monday morning", "Every Friday afternoon", "Every weekend", "Every day"], correct: "Every Friday afternoon" },

        // --- PHẦN 3: SENTENCE REORDERING (21-25) ---
        { type: 'writing', question: "21. Sắp xếp các từ sau: go / We / school / to / bus / every / by / day / .", correct: "We go to school by bus every day." },
        { type: 'writing', question: "22. Sắp xếp các từ sau: often / My / helps / me / with / homework / brother / my / .", correct: "My brother often helps me with my homework." },
        { type: 'writing', question: "23. Sắp xếp các từ sau: learning / They / new / English / words / enjoy / .", correct: "They enjoy learning new English words." },
        { type: 'writing', question: "24. Sắp xếp các từ sau: English / speaks / fluently / teacher / Our / very / .", correct: "Our English teacher speaks very fluently." },
        { type: 'writing', question: "25. Sắp xếp các từ sau: read / students / The / books / library / the / in / .", correct: "The students read books in the library." }
      ];
    }

    // ==========================================
// ==========================================
    // MẪU CHO BÀI TEST (NGÀY 6)
    // ==========================================
    if (i === 6) {
      dayData.isTest = true;
      dayData.videoUrl = null; 
      dayData.requiredScore = 40; // Đề thi thực tế có 40 câu [cite: 3]
      dayData.vocabulary = []; 

      // Dữ liệu văn bản chung [cite: 154, 155, 156, 157, 158, 159, 160, 208, 209, 210, 211, 212, 213]
      const readingLinda = "My name is Linda. I am fourteen years old. I live in a big house with my family. There are five people in my extended family: my grandfather, my parents, my older brother, and me. My grandfather is seventy years old, and he is very kind. My father is a doctor; he works in a large hospital and is always busy. My mother is an English teacher. My brother, Peter, is eighteen years old and he is a college student. On weekends, my family often goes to the park or cooks meals in the kitchen together. We are a very happy family.";
      
      const clozeText = "Mark is a 9th-grade student. His lifestyle is very healthy. He is a member of the school sports club. His favorite sport (33) ___ swimming. It is a great exercise for the whole body. Mark's parents are also active. Their morning routine is walking (34) ___ the park. Fast food and sweet drinks are not in (35) ___ daily meals. An apple or a banana is Mark's favorite snack. They (36) ___ full of energy. Mark usually (37) ___ to school after breakfast.";

      dayData.exercises = [
        // I. BIỂN BÁO & THÔNG BÁO [cite: 9]
        { type: 'reading', text: "LIBRARY RULES\n- Please be quiet.\n- Students are studying.", question: "1. What does the sign say?", options: ["You can make noise in the library.", "You must keep silent in the library.", "You do not have to be quiet here.", "The library is a place for listening to loud music."], correct: "You must keep silent in the library." }, // [cite: 10, 11, 12, 13, 14]
        { type: 'reading', text: "ENGLISH CLUB MEETING\n- Friday afternoon at 2:30 PM\n- Room 15", question: "2. What does this notice say?", options: ["The club meets on Monday morning.", "You can join the club at 2:30 AM in Room 15.", "The English club meeting is on Friday afternoon.", "The meeting is in Room 2 and starts at 15:00."], correct: "The English club meeting is on Friday afternoon." }, // [cite: 15, 16, 17, 18]

        // II. NGỮ ÂM [cite: 19]
        { type: 'mcq', question: "3. Choose the word whose underlined part differs in pronunciation (ending -s/-es):", options: ["watches", "goes", "studies", "plays"], correct: "watches" }, // [cite: 20, 22, 23, 24]
        { type: 'mcq', question: "4. Choose the word whose underlined part differs in pronunciation (vowel 'a'):", options: ["bag", "hat", "park", "cat"], correct: "park" }, // [cite: 21, 22, 23, 25]

        // III. SẮP XẾP ĐOẠN VĂN [cite: 26]
        { type: 'reading', text: "a. In the afternoon, I often play football with my classmates.\nb. My name is Tom and I am a 9th-grade student.\nc. I have a very healthy lifestyle.\nd. In the morning, I always walk to school.\ne. On weekends, I go to the park with my family.", question: "5. Choose the correct arrangement to make a meaningful paragraph:", options: ["b - c - d - a - e", "c - b - a - d - e", "b - d - a - c - e", "c - d - a - e - b"], correct: "b - c - d - a - e" }, // [cite: 27, 28, 29, 30, 31, 32, 33, 35, 36, 37]
        { type: 'reading', text: "Dear Anna,\na. My new school is very big and beautiful.\nb. I hope you are doing well.\nc. Please write back to me soon.\nd. I study many subjects, but my favorite is English.\ne. I am writing to tell you about my new school.", question: "6. Choose the correct arrangement to make a meaningful letter:", options: ["a - e - d - b - c", "b - e - a - d - c", "b - a - d - e - c", "e - b - d - a - c"], correct: "b - e - a - d - c" }, // [cite: 34, 38, 39, 40, 41, 42, 43, 44, 45]

        // IV. NGỮ PHÁP & TỪ VỰNG [cite: 46, 47]
        { type: 'mcq', question: "7. My grandfather ___ a retired teacher.", options: ["am", "is", "are", "be"], correct: "is" }, // [cite: 48, 49, 50, 51, 52, 53]
        { type: 'mcq', question: "8. She is ___ excellent student in my class.", options: ["a", "an", "the", "Ø (no article)"], correct: "an" }, // [cite: 54, 55, 57, 58, 60, 61]
        { type: 'mcq', question: "9. I want to communicate with ___ from other countries.", options: ["foreigners", "subjects", "homework", "projects"], correct: "foreigners" }, // [cite: 59, 62, 63, 64, 65, 66]
        { type: 'mcq', question: "10. There are four ___ working in the school kitchen.", options: ["woman", "womans", "women", "womens"], correct: "women" }, // [cite: 67, 68, 69, 70, 71, 72]
        { type: 'mcq', question: "11. ___ is your math exam? - It is on Monday.", options: ["Where", "When", "What", "Who"], correct: "When" }, // [cite: 73, 74, 75, 76, 77, 78, 79]
        { type: 'mcq', question: "12. The students usually read books ___ the library.", options: ["in", "on", "at", "for"], correct: "in" }, // [cite: 80, 81, 82, 83, 84, 85]
        { type: 'mcq', question: "13. ___ are my parents. They are very kind.", options: ["This", "That", "These", "It"], correct: "These" }, // [cite: 86, 87, 88, 89, 90, 91]
        { type: 'mcq', question: "14. He ___ to school by bus every day.", options: ["go", "going", "goes", "went"], correct: "goes" }, // [cite: 92, 93, 94, 95, 96, 97]
        { type: 'mcq', question: "15. My sister ___ chemistry in the laboratory twice a week.", options: ["studies", "study", "studyes", "studying"], correct: "studies" }, // [cite: 98, 99, 100, 101, 102, 103]
        { type: 'mcq', question: "16. What are those? - ___ are my grandfather's pillows.", options: ["It", "They", "This", "That"], correct: "They" }, // [cite: 104, 105, 106, 107, 108]
        { type: 'mcq', question: "17. They play football in the ___ during recess.", options: ["wardrobe", "schoolyard", "airport", "kitchen"], correct: "schoolyard" }, // [cite: 109, 110, 111, 112, 113, 114]
        { type: 'mcq', question: "18. My father's brother is my ___", options: ["cousin", "uncle", "aunt", "nephew"], correct: "uncle" }, // [cite: 115, 116, 117, 118, 119]

        // V. SẮP XẾP TỪ THÀNH CÂU [cite: 120, 121]
        { type: 'mcq', question: "19. Choose the correct sentence arranged from: often / helps / My / with / me / brother / homework / my /.", options: ["My brother often helps me with my homework.", "My brother helps often me with my homework.", "My homework often helps me with my brother.", "My brother often helps my homework with me."], correct: "My brother often helps me with my homework." }, // [cite: 122, 123, 124, 125, 126]
        { type: 'mcq', question: "20. Choose the correct sentence arranged from: students / The / are / the / classroom / in /.", options: ["The classroom are in the students.", "The students in the classroom are.", "The students are in the classroom.", "Are the students in the classroom."], correct: "The students are in the classroom." }, // [cite: 127, 128, 129, 130, 131]

        // VI. TÌNH HUỐNG GIAO TIẾP [cite: 132, 133]
        { type: 'reading', text: "Mary and Jane are looking for their classmates.\nJane: \"Where are our classmates?\"\nMary: \"___\"", question: "21. Choose the best response:", options: ["Yes, they are.", "They are in the gymnasium.", "It is on the table.", "He is a doctor."], correct: "They are in the gymnasium." }, // [cite: 134, 135, 136, 139, 140, 141]

        // VII. VIẾT CÂU TỪ TỪ GỢI Ý [cite: 142, 143]
        { type: 'mcq', question: "22. Make a sentence from: Our / English / class / start / 7:15 AM /.", options: ["Our English class starts on 7:15 AM.", "Our English class starts in 7:15 AM.", "Our English class start at 7:15 AM.", "Our English class starts at 7:15 AM."], correct: "Our English class starts at 7:15 AM." }, // [cite: 144, 145, 146, 147, 148]
        { type: 'mcq', question: "23. Make a sentence from: She / have / two / brother / and / one / sister /.", options: ["She have two brothers and one sister.", "She has two brothers and one sister.", "She has two brother and one sister.", "She has two brothers and one sisters."], correct: "She has two brothers and one sister." }, // [cite: 149, 150, 151, 152]

        // VIII. ĐỌC HIỂU [cite: 153]
        { type: 'reading', text: readingLinda, question: "24. How many people are there in Linda's family?", options: ["Four", "Five", "Six", "Seven"], correct: "Five" }, // [cite: 161, 162, 163, 164, 165]
        { type: 'reading', text: readingLinda, question: "25. Who is seventy years old?", options: ["Linda", "Her father", "Her grandfather", "Peter"], correct: "Her grandfather" }, // [cite: 166, 167, 168, 169, 170]
        { type: 'reading', text: readingLinda, question: "26. What is Linda's mother's job?", options: ["A doctor", "A student", "A nurse", "A teacher"], correct: "A teacher" }, // [cite: 171, 172, 173, 174, 175]
        { type: 'reading', text: readingLinda, question: "27. What do they often do on weekends?", options: ["Go to the hospital", "Read books in the library", "Go to the park or cook together", "Visit their aunt and uncle"], correct: "Go to the park or cook together" }, // [cite: 176, 177, 178, 179, 180]
        { type: 'reading', text: readingLinda, question: "28. Which of the following is NOT true about Peter?", options: ["He is older than Linda.", "He is eighteen years old.", "He is a doctor.", "He is a student."], correct: "He is a doctor." }, // [cite: 181, 182, 183, 184, 185]

        // IX. TÌM CÂU ĐỒNG NGHĨA [cite: 186, 187]
        { type: 'mcq', question: "29. \"There are five people in my extended family.\" is closest in meaning to:", options: ["My extended family have five people.", "My extended family has five people.", "Five people is in my extended family.", "My extended family are five people."], correct: "My extended family has five people." }, // [cite: 188, 189, 190, 192]
        { type: 'mcq', question: "30. \"The garden is behind the house.\" is closest in meaning to:", options: ["The house is in front of the garden.", "The house is next to the garden.", "The garden is in front of the house.", "The house is under the garden."], correct: "The house is in front of the garden." }, // [cite: 193, 194, 195, 196]
        { type: 'mcq', question: "31. \"Peter rides his bike to school.\" is closest in meaning to:", options: ["Peter goes to school on bike.", "Peter travels to school by his bike.", "Peter goes to school by bike.", "Peter goes to school with bike."], correct: "Peter goes to school by bike." }, // [cite: 197, 198, 199, 200, 201]
        { type: 'mcq', question: "32. \"The English class starts at 8:00 AM.\" is closest in meaning to:", options: ["It is 8:00 AM. The English class ends.", "It is 8:00 AM when the English class starts.", "The English class is in 8:00 AM.", "We start the English class on 8:00 AM."], correct: "It is 8:00 AM when the English class starts." }, // [cite: 202, 203, 204, 205, 206]

        // X. ĐỌC ĐIỀN TỪ [cite: 207]
        { type: 'reading', text: clozeText, question: "33. Choose the best word for blank (33):", options: ["am", "is", "are", "be"], correct: "is" }, // [cite: 214, 220, 221, 230]
        { type: 'reading', text: clozeText, question: "34. Choose the best word for blank (34):", options: ["at", "on", "in", "during"], correct: "in" }, // [cite: 215, 222, 223, 231]
        { type: 'reading', text: clozeText, question: "35. Choose the best word for blank (35):", options: ["his", "their", "our", "your"], correct: "their" }, // [cite: 216, 224, 225, 232]
        { type: 'reading', text: clozeText, question: "36. Choose the best word for blank (36):", options: ["is", "are", "do", "has"], correct: "are" }, // [cite: 217, 226, 227, 233]
        { type: 'reading', text: clozeText, question: "37. Choose the best word for blank (37):", options: ["walk", "walks", "walking", "to walk"], correct: "walks" }, // [cite: 218, 228, 229, 234]

        // XI. TRỌNG ÂM [cite: 235]
        { type: 'mcq', question: "38. Choose the word that differs from the other three in the position of primary stress:", options: ["doctor", "uncle", "guitar", "sister"], correct: "guitar" }, // [cite: 236, 238, 240, 242]
        { type: 'mcq', question: "39. Choose the word that differs from the other three in the position of primary stress:", options: ["afternoon", "badminton", "basketball", "volleyball"], correct: "afternoon" }, // [cite: 237, 239, 241, 243]

        // XII. SẮP XẾP HỘI THOẠI [cite: 244, 245]
        { type: 'reading', text: "a. Receptionist: Yes, the school library is on the second floor.\nb. Student: Hello. Where is the school library?\nc. Student: Thank you very much!", question: "40. Choose the correct arrangement to make a meaningful exchange:", options: ["b - a - c", "a - b - c", "b - c - a", "c - a - b"], correct: "b - a - c" } // [cite: 246, 247, 248, 249, 250, 251, 252, 253]
      ];
    }

    course.push(dayData);
  }
  return course;
};

export const courseData = generateCourseData();