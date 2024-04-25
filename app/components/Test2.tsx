import styles from "./Test2.module.scss";

export default function Test2() {
    return (
        <div>
            <div className="hoge">Test2hoge</div>
            <div className="hoge1">Test2hoge1</div>
            <div className="hogeA">Test2hogeA</div>
            <div className="hoge2">Test2hoge2</div>
            <div className="hogeB">Test2hogeB</div>
            <div className={styles.hoge}>Test2hogeMod</div>
            <div className={styles.hoge2}>Test2hoge2Mod</div>
            <div className={styles.hogeB}>Test2hogeBMod</div>
            <div className={styles.hogeAutoprefixer}>
                <div>test</div>
            </div>
        </div>
    );
}
