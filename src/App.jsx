import { useState } from "react";
import StudentList from "./components/StudentList.jsx";

const App = () => {
  // Dữ liệu mẫu 
  const [students, setStudents] = useState([
    { id: 1, name: "Phúc", score: 9, class: "IT01" },
    { id: 2, name: "Hà", score: 4.5, class: "IT02" },
    { id: 3, name: "Trung", score: 7, class: "IT01" },
  ]);
  const [filter, setFilter] = useState("all"); // all | gioi | truot

  // State của form
  const [name, setName] = useState("");
  const [score, setScore] = useState("");
  const [className, setClassName] = useState("");
  const [error, setError] = useState("");

  // Thêm sinh viên mới
  const handleAdd = (e) => {
    e.preventDefault();
    const scoreNumber = Number(score);

    // Kiểm tra dữ liệu nhập
    if (name.trim() === "" || score === "" || className.trim() === "") {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (isNaN(scoreNumber) || scoreNumber < 0 || scoreNumber > 10) {
      setError("Điểm phải từ 0 đến 10");
      return;
    }

      const maxId = students.reduce((max, s) => (s.id > max ? s.id : max), 0);

      const newStudent = {
        id: maxId + 1,
        name: name.trim(),
        score: scoreNumber,
        class: className.trim().toUpperCase(),
      };

    // Giữ lại dữ liệu cũ 
    setStudents([...students, newStudent]);
    setName("");
    setScore("");
    setClassName("");
    setError("");
  };

  // Xóa sinh viên theo id
  const handleDelete = (id) => {
    const newList = students.filter((student) => student.id !== id);
    setStudents(newList);
  };

  // Lọc danh sách hiển thị
  let displayStudents = students;
  if (filter === "gioi") {
    displayStudents = students.filter((s) => s.score >= 8);
  } else if (filter === "truot") {
    displayStudents = students.filter((s) => s.score < 5);
  }

  // Thống kê: tổng số và điểm trung bình toàn lớp
  const total = students.length;
  const sum = students.reduce((acc, s) => acc + s.score, 0);
  const average = total > 0 ? (sum / total).toFixed(2) : 0;

  return (
    <div className="container">
      <h1>Quản lý Điểm Sinh viên</h1>

      <form onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Họ tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          step="0.1"
          placeholder="Điểm số"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />
        <input
          type="text"
          placeholder="Lớp (VD: IT01)"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Thêm
        </button>
        {error && <div className="error">{error}</div>}
      </form>

      <div className="filters">
        <button
          className={`btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          Tất cả
        </button>
        <button
          className={`btn ${filter === "gioi" ? "active" : ""}`}
          onClick={() => setFilter("gioi")}
        >
          Giỏi (≥ 8)
        </button>
        <button
          className={`btn ${filter === "truot" ? "active" : ""}`}
          onClick={() => setFilter("truot")}
        >
          Trượt (&lt; 5)
        </button>
      </div>

      <div className="stats">
        <p>{`Tổng số sinh viên: ${total}`}</p>
        <p>{`Điểm trung bình toàn lớp: ${average}`}</p>
      </div>

      <StudentList students={displayStudents} onDelete={handleDelete} />
    </div>
  );
};

export default App;
