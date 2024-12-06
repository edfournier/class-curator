import { useRef } from "react";

function Field({ label, inputRef, type, placeholder }) {
    return (
        <div className="flex items-center space-x-4">
            <label 
                htmlFor={label} 
                className="text-sm font-medium text-center w-12">
                    {label}
            </label>
            <input 
                type={type}
                name={label} 
                id={label} 
                ref={inputRef} 
                className="w-full"
                placeholder={placeholder}
            />
        </div>
    );
}

function UserForm() {
    const majorRef = useRef();
    const minorRef = useRef();
    const yearRef = useRef();

    function handleSubmit(e) {
        e.preventDefault();
        const major = majorRef.current.value;
        const minor = minorRef.current.value;
        const year = yearRef.current.value;
        console.log({ major, minor, year }); 
    }

    return (
        <form className="max-w-lg mx-auto space-y-4" onSubmit={handleSubmit}>
            <Field label="Major" inputRef={majorRef} type={"text"} placeholder={"E.g. Computer Science"}/>
            <Field label="Minor" inputRef={minorRef} type={"text"} placeholder={"E.g. Linguistics"}/>
            <Field label="Year" inputRef={yearRef} type={"number"} placeholder={"E.g. 2025"}/>
            <button type="submit" className="w-full">
                Save Changes
            </button>
        </form>
    );
}

export default UserForm;
