import { Link } from 'react-router-dom';

const NotFound = () => (
  <div>
    <h1>404 - Không tìm thấy trang</h1>
    <Link to="/" className="btn">
      Về trang chủ
    </Link>
  </div>
);

export default NotFound;
