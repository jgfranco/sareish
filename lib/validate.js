export default function loginValidate(values){
    const errors = {};

    if (!values.email) {
        errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }

    // validation for password
    if(!values.password){
        errors.password = "Required";
    } else if(values.password.length < 8 || values.password.length > 20){
        errors.password = "Must be greater then 8 and less then 20 characters long";
    } else if(values.password.includes(" ")){
        errors.password = "Invalid Password";
    }

    return errors;

}

export function linkValidate(values){
    const errors = {};

    if (!values.title) {
        errors.title = 'Required';
    } 
    if (!values.url) {
        errors.url = 'Required';
    }
    if (values.startAt && values.endAt && new Date(values.endAt) <= new Date(values.startAt)) {
        errors.endAt = 'Must be after the start';
    }

    return errors;
}
