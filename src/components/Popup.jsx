export default function Popup({ isOpen, onClose, children }) {
    if (!isOpen) return null; //don't return if null

    return(
        <div className="fixed inset-0 flex bg-background/50 items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-6 w-80">
                {children}
                <button onClick={onClose} className="cosmic-button">
                    Close
                </button>
            </div>
        </div>
    );
}
