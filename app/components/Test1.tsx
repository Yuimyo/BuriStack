import styles from "./Test1.module.scss";

export default function Test1() {
    return (
        <div>
            <div className="hoge">Test1hoge</div>
            <div className="hoge1">Test1hoge1</div>
            <div className="hogeA">Test1hogeA</div>
            <div className="hoge2">Test1hoge2</div>
            <div className="hogeB">Test1hogeB</div>
            <div className={styles.hoge}>Test1hogeMod</div>
            <div className={styles.hoge1}>Test1hoge1Mod</div>
            <div className={styles.hogeA}>Test1hogeAMod</div>
        </div>
    );
}
