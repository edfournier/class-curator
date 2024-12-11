/**
 * Renders a labeled input field with customizable attributes for value, type, placeholder, and change handler.
 */
function FormField({ value, label, type = "text", placeholder, onChange }) {
    return (
        <div className="flex items-center space-x-4">
            <label htmlFor={label} className="w-20 text-center text-sm font-medium">
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
