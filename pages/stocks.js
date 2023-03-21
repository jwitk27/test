import styles from "./index.module.css";
import { useState, useEffect } from "react";
import Header from '../components/header';

export default function Home() {
    const [stockData, setStockData] = useState(null);
    const [ticker, setTicker] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchData = async () => {
        const response = await fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${startDate}/${endDate}?apiKey=ll3wcEUjO8bKgDXDUFQuSzGwXH_YkEVO`);
        const data = await response.json();
        setStockData(data.results[0]);
    };

    return (
        <div>
            <Header title={"Stocks"} />

            <main className={styles.main}>
                <div>
                    <label htmlFor="ticker">Ticker:</label>
                    <input id="ticker" type="text" value={ticker} onChange={(e) => setTicker(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="start-date">Start Date:</label>
                    <input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="end-date">End Date:</label>
                    <input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <button onClick={fetchData}>Fetch Stock Data</button>

                {stockData ? (
                    <div>
                        <h2>Stock Data for {ticker.toUpperCase()}</h2>
                        <p><strong>Open:</strong> {stockData.o}</p>
                        <p><strong>Close:</strong> {stockData.c}</p>
                        <p><strong>High:</strong> {stockData.h}</p>
                        <p><strong>Low:</strong> {stockData.l}</p>
                        <p><strong>Volume:</strong> {stockData.v}</p>
                        <p><strong>Volume Weighted Average Price:</strong> {stockData.vw}</p>
                        <p><strong>Number of Transactions:</strong> {stockData.n}</p>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </main>
        </div>
    );
}
