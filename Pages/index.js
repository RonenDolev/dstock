import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Stock Analysis Generator</title>
      </Head>

      {/* Full 10%–40%–40%–10% Grid */}
      <main
        style={{
          display: 'grid',
          gridTemplateColumns: '10% 40% 40% 10%',
          backgroundColor: '#f0f0f0',
          fontFamily: 'Bahnschrift, sans-serif',
          minHeight: '100vh',
          padding: 0,
          margin: 0
        }}
      >
        {/* Left Margin */}
        <div></div>

        {/* Left Content */}
        <div style={{ padding: '20px' }}>
          <h1 style={{ fontSize: '60px', color: '#231F20' }}>
            Stock Analysis Generator
          </h1>
          <p>← This is your left panel content: selector, input field, real-time stock table, etc.</p>
        </div>

        {/* Right Content */}
        <div style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '24px', color: '#231F20' }}>Live Chart & Investment Strategy</h2>
          <p>This panel is where you'll display candlestick chart, trend, strategy, and performance.</p>
        </div>

        {/* Right Margin */}
        <div></div>
      </main>
    </>
  );
}
