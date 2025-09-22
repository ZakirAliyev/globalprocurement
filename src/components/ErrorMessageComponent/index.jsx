import './index.scss'
import {useField} from 'formik';
import {LuInfo} from 'react-icons/lu';

function ErrorMessageComponent({name}) {
    const [, meta] = useField(name);

    return (
        meta.touched && meta.error ? (
            <section id="errorMessageComponent" className="error-message">
                <LuInfo className={"icon"}/>
                <div className="error">{meta.error}</div>
            </section>
        ) : null
    );
}

export default ErrorMessageComponent;
