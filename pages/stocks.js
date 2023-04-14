import styles from "./index.module.css";
import { useState, useEffect } from "react";
import Header from '../components/header';

export default function Home() {
    const [stockData, setStockData] = useState(null);
    const [ticker, setTicker] = useState('null');
    const [tickers, setTickers] = useState('');
    const [startDate, setStartDate] = useState('01/01/2001');
    const [endDate, setEndDate] = useState('01/01/2010');
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const response = await fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${startDate}/${endDate}?apiKey=ll3wcEUjO8bKgDXDUFQuSzGwXH_YkEVO`);
        const data = await response.json();
        setLoading(false);
        console.log(data);
        setStockData(data.results[0]);
    };

    const fetchTickers = async () => {
        setLoading(true);
        const response = await fetch(`https://api.polygon.io/v3/reference/tickers?market=stocks&active=true&order=desc&apiKey=ll3wcEUjO8bKgDXDUFQuSzGwXH_YkEVO`);
        const data = await response.json();
        setLoading(false);
        console.log(data);
        setTickers(data.results);
    }

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

                <button onClick={fetchTickers}>Fetch Tickers</button>

                {tickers ? (
                    <div>hello</div>
                ) : (
                    loading ? <p>Loading...</p> : ""
                )}

                {stockData !== null ? (
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
                    loading ? <p>Loading...</p> : ""
                )}
            </main>
        </div>
    );
}
