import classes from './layout.module.css';

const layout = (props) => {
    return (
        <div className={classes.Layout__body}>
            {props.children}
        </div>
    );
}

export default layout;