import Spinner from 'react-bootstrap/Spinner';

export default function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "var(--background-color)",
    }}>
      <Spinner animation="border" role="status" style={{ color: "var(--primary-color)" }}>
        <span className="visually-hidden">{text}</span>
      </Spinner>
      <div style={{ marginTop: 12, color: "var(--primary-color)", fontWeight: 600 }}>{text}</div>
    </div>
  );
}