export default function LoadingSpinner() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '5px solid #ccc',
        borderTop: '5px solid #008A40',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto'
      }} />
      <p style={{ marginTop: '10px', color: '#555' }}>Loading...</p>

      <style jsx>{`
        @keyframes spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
