// components/Header.tsx
import Image from 'next/image';
import styles from '../styles/Header.module.css';
import { useEffect, useState } from 'react';

export default function Header() {
  const [indicators, setIndicators] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/marketData');
        const data = await res.json();
        setIndicators(data);
      } catch (err) {
        console.error('Failed to fetch indicators:', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // update every 60 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.headerWrapper}>
      <div className={styles.headerMain}>
        <Image
          src="/logo.png"
          alt="Logo"
          width={130}
          height={60}
          className={styles.logo}
        />
        <h1 className={styles.title}>Stock Analysis Generator</h1>
      </div>

      <div className={styles.marketBar}>
        {indicators.map((item, index) => (
          <span
            key={index}
            style={{
              color:
                item.isUp === true
                  ? 'lightgreen'
                  : item.isUp === false
                  ? 'salmon'
                  : 'gray',
              marginRight: 10,
            }}
          >
            {item.name}: {item.value}
          </span>
        ))}
      </div>
    </div>
  );
}
