import Styles from './Subtitle.module.css';

export default function Subtitle({ text }) {
    return(
        <div className={Styles["title-container"]}>
            <h2>{text}</h2>
            <hr />
        </div>
    );
}