// FormField is a reusable form input component.
// It renders a labeled input field with customizable attributes for value, type, placeholder, and change handler.

function FormField({ value, label, type="text", placeholder, onChange }) {
    return (
        <div className="flex items-center space-x-4">
            <label htmlFor={label} className="text-sm font-medium text-center w-20">
                {label.charAt(0).toUpperCase() + label.slice(1)}
            </label>
            <input 
                value={value}
                spellCheck={true}
                onChange={onChange}
                type={type}
                name={label} 
                id={label} 
                className="w-full"
                placeholder={placeholder}
            />
        </div>
    );
}

export default FormField;