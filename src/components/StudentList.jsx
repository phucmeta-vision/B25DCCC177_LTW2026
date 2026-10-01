import StudentItem from "./StudentItem.jsx";

// Component con
const StudentList = ({ students, onDelete }) => {
  if (students.length === 0) {
    return <p className="empty">Không có sinh viên nào.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Họ tên</th>
          <th>Điểm</th>
          <th>Lớp</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <StudentItem key={student.id} student={student} onDelete={onDelete} />
        ))}
      </tbody>
    </table>
  );
};

export default StudentList;
