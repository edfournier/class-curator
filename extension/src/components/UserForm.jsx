import { useRef } from 'react';

function Field({ label, inputRef, type }) {
    return (
        <div className="flex items-center space-x-4">
            <label htmlFor={label} className="text-sm font-medium text-white text-center w-12">{label}</label>
            <div className="h-10 border-l-2 border-gray-600 mx-4"></div> 
            <input 
                type={type}
                name={label} 
                id={label} 
                ref={inputRef} 
                className="w-full"
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
        <form className="max-w-lg mx-auto px-6 space-y-4" onSubmit={handleSubmit}>
            <Field label="Major" inputRef={majorRef} type={"text"}/>
            <Field label="Minor" inputRef={minorRef} type={"text"}/>
            <Field label="Year" inputRef={yearRef} type={"number"}/>
            <button type="submit" className="w-full">
                Save
            </button>
        </form>
    );
}

export default UserForm;
