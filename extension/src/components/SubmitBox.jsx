/**
 * Renders an input field and a button to submit the value in the field
 */
function SubmitBox({ value, onChange, onClick, hint, icon, label }) {
    return (
        <>
            <div className="mb-4 flex justify-center">
                <input type="text" value={value} onChange={onChange} className="w-full" placeholder={hint} />
                <button aria-label={label} type="button" onClick={onClick} className="ml-1">
                    {icon}
                </button>
            </div>
        </>
    );
}

export default SubmitBox;
