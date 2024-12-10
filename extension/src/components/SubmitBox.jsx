// SubmitBox is a reusable input and button component for submitting text input.
// It accepts props for value, onChange handler, onClick handler, a hint for the input, an icon for the button, and a label for accessibility.

function SubmitBox({ value, onChange, onClick, hint, icon, label }) {
    return (
        <>
            <div className="flex justify-center mb-4">
            <input 
                type="text"
                value={value}
                onChange={onChange}
                className="w-full"
                placeholder={hint}
            />
            <button aria-label={label} type="button" onClick={onClick} className="ml-1">{icon}</button>
            </div>
        </>
    )
}

export default SubmitBox;