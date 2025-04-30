import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>DStock - Stock Analysis Generator</title>
      </Head>
      <main style={{
        display: 'grid',
        gridTemplateColumns: '10% 40% 40% 10%',
        minHeight: '100vh',
        background: '#f5f5f5',
        fontFamily: 'Bahnschrift'
      }}>
        <div></div>
        <div style={{ padding: '20px' }}>
          <h1 style={{ fontSize: '60px' }}>Stock Analysis Generator</h1>
          <p>Left content goes here</p>
        </div>
        <div style={{ padding: '20px' }}>
          <p>Right content goes here</p>
        </div>
        <div></div>
      </main>
    </>
  );
}
