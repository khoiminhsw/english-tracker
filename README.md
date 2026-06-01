# 🚀 English Tracker: Nền tảng học Tiếng Anh hiệu quả
<img width="2142" height="1479" alt="image" src="https://github.com/user-attachments/assets/ffde4c2b-3caf-4c44-baf1-ce692ad07b32" />

## 🎯 Mục tiêu dự án
Cá nhân hóa lộ trình học tiếng Anh trong 48 ngày với liên kết video YouTube và bài tập kèm theo. Dự án hướng tới việc xây dựng thói quen học tập kỷ luật thông qua các cơ chế kiểm tra từ vựng ngắt quãng, quản lý thời gian học khắt khe và hệ thống điểm thưởng/phạt rõ ràng.

## ✨ Các tính năng chính
* **Lộ trình học tập tích hợp:** Mỗi ngày học bao gồm một video bài giảng (nhúng từ YouTube) và bộ bài tập tương ứng (Trắc nghiệm, Đọc hiểu, Viết câu).
* **Kỷ luật thời gian (Time-gating):** Học sinh thiết lập lịch học hàng tuần. Bài học mới chỉ được mở khóa vào đúng ngày có lịch trình đã đăng ký.
* **Lặp lại ngắt quãng (Spaced Repetition):** Bắt buộc gõ đúng danh sách từ vựng của bài ngày hôm trước trước khi mở khóa nội dung bài mới.
* **Hệ thống Điểm số & Chuỗi ngày (Gamification):** Người học bắt đầu với 100 điểm. Hệ thống tự động trừ điểm nếu vắng mặt vào ngày có lịch, gõ sai từ vựng quá 3 lần, hoặc làm sai bài tập quá 3 lần. Tính năng Streak ghi nhận chuỗi ngày học liên tục.
* **Đăng nhập & Phân quyền (Whitelist):** Xác thực an toàn qua Google Account. Chỉ những tài khoản (Email) được Admin cấp phép mới có quyền truy cập vào nội dung học.
* **Lưu trữ Đám mây (Cloud Sync):** Toàn bộ tiến độ, điểm số và lịch trình được đồng bộ theo thời gian thực trên Đám mây, chống mất mát dữ liệu.

## 💻 Công nghệ sử dụng
* **Frontend:** React.js, Vite, Tailwind CSS (Styling), Lucide React (Icons).
* **Backend (BaaS):** Firebase Authentication (Google Sign-in), Cloud Firestore (NoSQL Database).
* **Deployment & CI/CD:** Vercel (Tự động build và deploy từ GitHub).

## ⚙️ Quy trình vận hành (Workflow)
1.  **Xác thực:** Người dùng đăng nhập bằng Google. Hệ thống đối chiếu email với danh sách Whitelist. Nếu không hợp lệ, truy cập lập tức bị từ chối.
2.  **Tải dữ liệu:** Hệ thống kiểm tra tiến độ trên Firestore. Nếu là người dùng mới, yêu cầu chọn lịch học trong tuần và khởi tạo 100 điểm.
3.  **Trạm kiểm tra (Vocab Check):** Nếu bài học trước có từ vựng, người dùng phải vượt qua bài kiểm tra gợi nhớ trước khi vào bài giảng mới.
4.  **Học kiến thức mới:** Người dùng xem video (phải bấm xác nhận đã xem xong) và hoàn thành bộ bài tập với yêu cầu đúng tuyệt đối (100%).
5.  **Cập nhật tiến độ:** Điểm số, Streak và trạng thái khóa bài được hệ thống tính toán lại (áp dụng các mức phạt nếu vi phạm kỷ luật) và đồng bộ ngược lên cơ sở dữ liệu Firestore.

## 📁 Kiến trúc thư mục (Folder Architecture)

```text
english-tracker/
├── src/
│   ├── App.jsx         # Component cốt lõi: Xử lý Auth, Lịch học, Gamification, Time-gating
│   ├── Lesson.jsx      # Component bài học: Hiển thị Video, Bài tập, Chấm điểm, Quản lý luồng học
│   ├── data.js         # Cơ sở dữ liệu tĩnh: Câu hỏi, Từ vựng, Link YouTube cho 48 ngày
│   ├── firebase.js     # Cấu hình kết nối Backend Firebase (Auth & Firestore)
│   ├── index.css       # Cấu hình Tailwind CSS
│   └── main.jsx        # Điểm neo (Entry point) của React app
├── .gitignore          # Cấu hình loại bỏ file rác khi đẩy code lên Git
├── package.json        # Quản lý metadata và các thư viện (dependencies)
├── tailwind.config.js  # Tùy chỉnh giao diện UI
└── vite.config.js      # Cấu hình biên dịch dự án
