import Head from "next/head";
import styles from "./header.module.css";
import Link from "next/link";

export default function Header({title}) {
    return (
        <div className={styles.container}>
            <Head>
                <title>JimboGPT</title>
            </Head>
            {/* <Link className={styles.link} href="/">Home</Link>
            <Link className={styles.link} href="/stocks">Stocks</Link> */}
            <h2 className={styles.pageHeader}>{title}</h2>
        </div>
    );
}
