function SubmitBox({ value, onChange, onClick, hint, icon }) {
    return (
        <>
            <div className="flex justify-center mb-4">
            <input 
                type="text"
                value={value}
                onChange={onChange}
                className="w-60"
                placeholder={hint}
            />
            <button type="button" onClick={onClick} className="ml-1">{icon}</button>
            </div>
        </>
    )
}

export default SubmitBox;